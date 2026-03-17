import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  options: string[] | null;
  required: boolean;
  sort_order: number;
  placeholder: string | null;
  unit: string | null;
  show_condition: { field: string; value: string } | null;
  subcategory_id: string | null;
}

interface Subcategory {
  id: string;
  name: string;
  icon: string | null;
  category_id: string;
}

interface DynamicCategoryFieldsProps {
  categoryId: string;
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onSubcategoryChange?: (subcategoryId: string | null) => void;
  errors?: Record<string, string>;
}

export function DynamicCategoryFields({
  categoryId,
  values,
  onChange,
  onSubcategoryChange,
  errors = {},
}: DynamicCategoryFieldsProps) {
  const [fields, setFields] = useState<CategoryField[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setFields([]);
      setSubcategories([]);
      setSelectedSubcategory("");
      return;
    }
    loadSubcategories();
    loadFields(null);
  }, [categoryId]);

  useEffect(() => {
    if (selectedSubcategory) {
      loadFields(selectedSubcategory);
    }
  }, [selectedSubcategory]);

  const loadSubcategories = async () => {
    const { data } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", categoryId)
      .order("name");
    if (data && data.length > 0) {
      setSubcategories(data as Subcategory[]);
    } else {
      setSubcategories([]);
    }
  };

  const loadFields = async (subcatId: string | null) => {
    setLoading(true);
    let query = supabase
      .from("category_fields")
      .select("*")
      .eq("category_id", categoryId)
      .order("sort_order");

    if (subcatId) {
      query = query.or(`subcategory_id.eq.${subcatId},subcategory_id.is.null`);
    } else {
      query = query.is("subcategory_id", null);
    }

    const { data } = await query;
    if (data) {
      setFields(data.map(f => ({
        ...f,
        options: f.options ? (f.options as any) : null,
        show_condition: f.show_condition ? (f.show_condition as any) : null,
      })));
    }
    setLoading(false);
  };

  const handleSubcategorySelect = (val: string) => {
    setSelectedSubcategory(val);
    onSubcategoryChange?.(val || null);
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    onChange({ ...values, [fieldName]: value });
  };

  const handleMultiselectToggle = (fieldName: string, option: string) => {
    const current: string[] = values[fieldName] || [];
    const next = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    handleFieldChange(fieldName, next);
  };

  const isFieldVisible = (field: CategoryField): boolean => {
    if (!field.show_condition) return true;
    const { field: depField, value: depValue } = field.show_condition;
    return values[depField] === depValue;
  };

  const visibleFields = fields.filter(isFieldVisible);

  if (!categoryId) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={categoryId + selectedSubcategory}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Category Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subcategory selector */}
            {subcategories.length > 0 && (
              <div className="space-y-2">
                <Label>Subcategory</Label>
                <Select value={selectedSubcategory} onValueChange={handleSubcategorySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.icon} {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Loading fields...</span>
              </div>
            ) : visibleFields.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {subcategories.length > 0 && !selectedSubcategory
                  ? "Select a subcategory to see specific fields"
                  : "No additional fields for this category"}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visibleFields.map((field) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`space-y-2 ${field.field_type === 'multiselect' ? 'sm:col-span-2' : ''}`}
                  >
                    <Label className="flex items-center gap-1">
                      {field.field_label}
                      {field.unit && (
                        <span className="text-xs text-muted-foreground">({field.unit})</span>
                      )}
                      {field.required && <span className="text-destructive">*</span>}
                    </Label>

                    {field.field_type === "text" && (
                      <Input
                        value={values[field.field_name] || ""}
                        onChange={e => handleFieldChange(field.field_name, e.target.value)}
                        placeholder={field.placeholder || ""}
                      />
                    )}

                    {field.field_type === "number" && (
                      <Input
                        type="number"
                        value={values[field.field_name] || ""}
                        onChange={e => handleFieldChange(field.field_name, e.target.value)}
                        placeholder={field.placeholder || ""}
                        inputMode="numeric"
                      />
                    )}

                    {field.field_type === "select" && field.options && (
                      <Select
                        value={values[field.field_name] || ""}
                        onValueChange={val => handleFieldChange(field.field_name, val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.field_label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {field.field_type === "multiselect" && field.options && (
                      <div className="flex flex-wrap gap-2">
                        {field.options.map(opt => {
                          const selected = (values[field.field_name] || []).includes(opt);
                          return (
                            <Badge
                              key={opt}
                              variant={selected ? "default" : "outline"}
                              className={`cursor-pointer transition-all ${
                                selected ? "bg-primary text-primary-foreground" : "hover:border-primary/50"
                              }`}
                              onClick={() => handleMultiselectToggle(field.field_name, opt)}
                            >
                              {opt}
                            </Badge>
                          );
                        })}
                      </div>
                    )}

                    {field.field_type === "checkbox" && (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={!!values[field.field_name]}
                          onCheckedChange={val => handleFieldChange(field.field_name, val)}
                        />
                        <span className="text-sm">{field.field_label}</span>
                      </div>
                    )}

                    {errors[field.field_name] && (
                      <p className="text-sm text-destructive">{errors[field.field_name]}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
