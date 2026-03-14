
-- Saved searches table for smart notifications
CREATE TABLE public.saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  query text NOT NULL,
  category text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_notified_at timestamp with time zone NULL
);

ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved searches" ON public.saved_searches
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their saved searches" ON public.saved_searches
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved searches" ON public.saved_searches
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their saved searches" ON public.saved_searches
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Unique constraint to avoid duplicate saved searches per user
CREATE UNIQUE INDEX saved_searches_user_query ON public.saved_searches (user_id, lower(query));

-- Function to notify users when a new post matches their saved searches
CREATE OR REPLACE FUNCTION public.notify_matching_searches()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  search_record RECORD;
  post_title_lower text;
  post_desc_lower text;
BEGIN
  post_title_lower := lower(NEW.title);
  post_desc_lower := lower(COALESCE(NEW.description, ''));

  FOR search_record IN
    SELECT ss.id, ss.user_id, ss.query
    FROM saved_searches ss
    WHERE ss.user_id != NEW.user_id
      AND (
        post_title_lower LIKE '%' || lower(ss.query) || '%'
        OR post_desc_lower LIKE '%' || lower(ss.query) || '%'
      )
      AND (ss.last_notified_at IS NULL OR ss.last_notified_at < now() - interval '1 hour')
  LOOP
    INSERT INTO notifications (user_id, type, title, body, data)
    VALUES (
      search_record.user_id,
      'search_match',
      'New listing matches "' || search_record.query || '"',
      LEFT(NEW.title, 100),
      jsonb_build_object('post_id', NEW.id, 'search_id', search_record.id)
    );

    UPDATE saved_searches SET last_notified_at = now() WHERE id = search_record.id;
  END LOOP;

  RETURN NEW;
END;
$$;

-- Trigger on new active posts
CREATE TRIGGER trigger_notify_matching_searches
  AFTER INSERT ON public.posts
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION public.notify_matching_searches();

-- Enable realtime for saved_searches
ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_searches;
