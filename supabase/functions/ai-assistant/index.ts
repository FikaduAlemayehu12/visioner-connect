const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, searchMarketplaces } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are Visioner AI Assistant — a smart, friendly shopping assistant for an Ethiopian marketplace called Visioner AI.

Your job:
1. Help users find the right products by asking clarifying questions (budget, brand preference, new/used, location)
2. Suggest specific products and what to search for
3. Give price estimates in ETB (Ethiopian Birr)
4. Recommend whether to buy locally or from international marketplaces
5. If a user describes what they want, suggest search terms and offer to search across marketplaces

Keep responses concise, warm, and helpful. Use emoji occasionally. Always mention prices in ETB.
When you have enough info to recommend a product, use the search_marketplaces tool to find real listings.`;

    const tools = searchMarketplaces ? [
      {
        type: "function",
        function: {
          name: "search_marketplaces",
          description: "Search across multiple marketplaces (Jiji, AliExpress, HuluMarket, Facebook Marketplace) for products matching the user's needs",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search query for the product" },
              save_alert: { type: "boolean", description: "Whether the user wants to be notified when matching items are posted" },
            },
            required: ["query"],
            additionalProperties: false,
          },
        },
      },
    ] : undefined;

    const body: any = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
    };

    if (tools) {
      body.tools = tools;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "I'm a bit busy right now. Please try again in a moment! 😊" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Something went wrong. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
