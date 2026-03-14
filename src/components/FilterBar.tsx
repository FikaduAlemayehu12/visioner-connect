import { Button } from "@/components/ui/button";
import { ShoppingBag, ShoppingCart, Briefcase, LayoutGrid } from "lucide-react";

const filters = [
  { label: "All", value: "all", icon: LayoutGrid },
  { label: "Buy", value: "buy", icon: ShoppingCart },
  { label: "Sell", value: "sell", icon: ShoppingBag },
  { label: "Services", value: "services", icon: Briefcase },
];

interface FilterBarProps {
  active: string;
  onChange: (value: string) => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = active === filter.value;
        return (
          <Button
            key={filter.value}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(filter.value)}
            className={`shrink-0 gap-1.5 rounded-xl transition-all ${
              isActive ? "gradient-bg border-0 shadow-md" : "hover:border-primary/30"
            }`}
          >
            <filter.icon className="h-3.5 w-3.5" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
