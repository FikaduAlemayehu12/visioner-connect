import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ImagePlus, X, Loader2, MapPin, Phone, Tag, DollarSign, AlertTriangle
} from "lucide-react";
import { DynamicCategoryFields } from "@/components/DynamicCategoryFields";
import type { Tables } from "@/integrations/supabase/types";

type Category = Tables<"categories">;

const POST_TYPES = [
  { value: "sell", label: "Sell" },
  { value: "buy", label: "Buy / Wanted" },
  { value: "service_offer", label: "Service Offer" },
  { value: "service_need", label: "Service Needed" },
] as const;

const formatETBInput = (value: string): string => {
  const num = value.replace(/[^\d]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("en-US");
};

const parseETBInput = (formatted: string): number => {
  return Number(formatted.replace(/[^\d]/g, "")) || 0;
};

export default function CreatePost() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState<string>("sell");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
  const [priceDisplay, setPriceDisplay] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [locationVal, setLocationVal] = useState("");
  const [address, setAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Dynamic category-specific metadata
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  // Images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
      return;
    }
    fetchCategories();
  }, [user, authLoading]);

  // Reset metadata when category changes
  useEffect(() => {
    setMetadata({});
    setSubcategoryId(null);
  }, [categoryId]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (data) setCategories(data);
  };

  const handlePriceChange = (value: string) => {
    setPriceDisplay(formatETBInput(value));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = imageFiles.length + files.length;

    if (totalImages > 8) {
      toast.error("Maximum 8 images allowed");
      return;
    }

    const validFiles = files.filter((f) => {
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    setImageFiles((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!title.trim()) errs.title = "Title is required";
    else if (title.trim().length < 5) errs.title = "Title must be at least 5 characters";
    else if (title.trim().length > 150) errs.title = "Title must be under 150 characters";

    if (!categoryId) errs.category = "Select a category";

    if (!description.trim()) errs.description = "Description is required";
    else if (description.trim().length < 20) errs.description = "Description must be at least 20 characters";

    const price = parseETBInput(priceDisplay);
    if ((postType === "sell" || postType === "service_offer") && price <= 0) {
      errs.price = "Price is required for sell/service listings";
    }

    if (!locationVal.trim()) errs.location = "Location is required";

    if (imageFiles.length === 0 && postType === "sell") {
      errs.images = "At least one image is required for sell listings";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const uploadImages = async (postId: string): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const ext = file.name.split(".").pop();
      const path = `${user!.id}/${postId}/${i}.${ext}`;

      const { error } = await supabase.storage
        .from("post-images")
        .upload(path, file, { upsert: true });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("post-images")
        .getPublicUrl(path);

      urls.push(publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    setSubmitting(true);
    try {
      const price = parseETBInput(priceDisplay);

      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          type: postType as any,
          category_id: categoryId,
          subcategory_id: subcategoryId,
          price: price > 0 ? price : null,
          negotiable,
          is_urgent: isUrgent,
          location: locationVal.trim(),
          address: address.trim() || null,
          contact_phone: contactPhone.trim() || null,
          status: "active",
          metadata: Object.keys(metadata).length > 0 ? metadata : null,
        } as any)
        .select("id")
        .single();

      if (postError) throw postError;

      if (imageFiles.length > 0 && post) {
        setUploadingImages(true);
        const imageUrls = await uploadImages(post.id);

        const imageRecords = imageUrls.map((url, i) => ({
          post_id: post.id,
          image_url: url,
          sort_order: i,
        }));

        const { error: imgError } = await supabase
          .from("post_images")
          .insert(imageRecords);
        if (imgError) throw imgError;
      }

      toast.success("Post created successfully!");
      navigate(`/listing/${post.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create post");
    } finally {
      setSubmitting(false);
      setUploadingImages(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container max-w-3xl py-6 md:py-10 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Create a Post</h1>
          <p className="text-muted-foreground text-sm mt-1">Fill in the details to list your item or service</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-primary" /> Photos
              </CardTitle>
              <CardDescription>Add up to 8 images. First image is the cover.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                    <img src={src} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-medium px-1.5 py-0.5 rounded">Cover</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {imageFiles.length < 8 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-xs">Add Photo</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              {errors.images && <p className="text-sm text-destructive mt-2">{errors.images}</p>}
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" /> Listing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Samsung Galaxy S24 Ultra - Like New"
                    maxLength={150}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Post Type *</Label>
                  <Select value={postType} onValueChange={setPostType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {POST_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your item or service in detail — condition, specs, what's included..."
                  rows={5}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Category Fields */}
          {categoryId && (
            <DynamicCategoryFields
              categoryId={categoryId}
              values={metadata}
              onChange={setMetadata}
              onSubcategoryChange={setSubcategoryId}
              errors={errors}
            />
          )}

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" /> Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (ETB) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">ETB</span>
                  <Input
                    id="price"
                    value={priceDisplay}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="0"
                    className="pl-12 text-lg font-heading font-bold"
                    inputMode="numeric"
                  />
                </div>
                {priceDisplay && (
                  <p className="text-xs text-muted-foreground">
                    ETB {priceDisplay}
                  </p>
                )}
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-between gap-3 flex-1">
                  <div>
                    <Label className="text-sm">Negotiable</Label>
                    <p className="text-xs text-muted-foreground">Buyers can make offers</p>
                  </div>
                  <Switch checked={negotiable} onCheckedChange={setNegotiable} />
                </div>
                <div className="flex items-center justify-between gap-3 flex-1">
                  <div>
                    <Label className="text-sm flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-warning" /> Urgent
                    </Label>
                    <p className="text-xs text-muted-foreground">Mark as time-sensitive</p>
                  </div>
                  <Switch checked={isUrgent} onCheckedChange={setIsUrgent} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Location & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">City / Area *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={locationVal}
                      onChange={(e) => setLocationVal(e.target.value)}
                      placeholder="e.g. Bole, Addis Ababa"
                      className="pl-10"
                    />
                  </div>
                  {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactPhone"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+251 9XX XXX XXXX"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postAddress">Address (optional)</Label>
                <Input
                  id="postAddress"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Specific address or landmark"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {uploadingImages ? "Uploading images..." : "Creating..."}
                </>
              ) : (
                "Publish Post"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
