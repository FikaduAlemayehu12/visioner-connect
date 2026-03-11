import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Camera, User, Phone, Mail, MapPin, Building2, FileText,
  Shield, Loader2, Save, Eye, EyeOff, MessageSquare
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [taxId, setTaxId] = useState("");

  // Privacy settings
  const [showPhoneToVerified, setShowPhoneToVerified] = useState(true);
  const [showEmailToPartners, setShowEmailToPartners] = useState(true);
  const [showAddressAfterBooking, setShowAddressAfterBooking] = useState(true);
  const [allowChatMessages, setAllowChatMessages] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
      return;
    }
    if (user) fetchProfile();
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setLocation(data.location || "");
        setAddress(data.address || "");
        setBusinessName(data.business_name || "");
        setBusinessType(data.business_type || "");
        setLicenseNumber(data.license_number || "");
        setTaxId(data.tax_id || "");
        setShowPhoneToVerified(data.show_phone_to_verified);
        setShowEmailToPartners(data.show_email_to_partners);
        setShowAddressAfterBooking(data.show_address_after_booking);
        setAllowChatMessages(data.allow_chat_messages);
      }
    } catch (err: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const avatarUrl = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("user_id", user.id);
      if (updateError) throw updateError;

      setProfile((prev) => prev ? { ...prev, avatar_url: avatarUrl } : prev);
      toast.success("Avatar updated!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          email: email.trim() || null,
          location: location.trim() || null,
          address: address.trim() || null,
          business_name: businessName.trim() || null,
          business_type: businessType.trim() || null,
          license_number: licenseNumber.trim() || null,
          tax_id: taxId.trim() || null,
          show_phone_to_verified: showPhoneToVerified,
          show_email_to_partners: showEmailToPartners,
          show_address_after_booking: showAddressAfterBooking,
          allow_chat_messages: allowChatMessages,
        })
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Profile saved!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container max-w-3xl py-6 md:py-10 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your personal info and privacy settings</p>
        </div>

        {/* Avatar Section */}
        <Card>
          <CardContent className="flex flex-col sm:flex-row items-center gap-5 pt-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-border">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={fullName} />
                ) : null}
                <AvatarFallback className="text-xl font-heading bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-lg font-heading font-semibold text-foreground">{fullName || "Your Name"}</h2>
              <p className="text-sm text-muted-foreground">{email || user?.email}</p>
              <div className="flex items-center gap-3 justify-center sm:justify-start mt-2">
                {profile?.phone_verified && (
                  <span className="flex items-center gap-1 text-xs text-success font-medium">
                    <Shield className="h-3.5 w-3.5" /> Phone Verified
                  </span>
                )}
                {profile?.business_verified && (
                  <span className="flex items-center gap-1 text-xs text-success font-medium">
                    <Shield className="h-3.5 w-3.5" /> Business Verified
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Personal Information
            </CardTitle>
            <CardDescription>Your basic contact and location details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+251 9XX XXX XXXX" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">City / Area</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Bole, Addis Ababa" className="pl-10" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address, building, etc." />
            </div>
          </CardContent>
        </Card>

        {/* Business Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Business Information
            </CardTitle>
            <CardDescription>Optional — fill if you're a business seller</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your business name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Input id="businessType" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="e.g. Retailer, Wholesaler" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="licenseNumber" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="Business license #" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID (TIN)</Label>
                <Input id="taxId" value={taxId} onChange={(e) => setTaxId(e.target.value)} placeholder="Tax identification number" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" /> Privacy & Visibility
            </CardTitle>
            <CardDescription>Control who can see your contact info</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Show phone to verified users</Label>
                <p className="text-xs text-muted-foreground">Only verified users can see your number</p>
              </div>
              <Switch checked={showPhoneToVerified} onCheckedChange={setShowPhoneToVerified} />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Show email to trade partners</Label>
                <p className="text-xs text-muted-foreground">People you've traded with can see your email</p>
              </div>
              <Switch checked={showEmailToPartners} onCheckedChange={setShowEmailToPartners} />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Show address after booking</Label>
                <p className="text-xs text-muted-foreground">Address visible only after a deal is confirmed</p>
              </div>
              <Switch checked={showAddressAfterBooking} onCheckedChange={setShowAddressAfterBooking} />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" /> Allow chat messages
                </Label>
                <p className="text-xs text-muted-foreground">Let other users send you direct messages</p>
              </div>
              <Switch checked={allowChatMessages} onCheckedChange={setAllowChatMessages} />
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
