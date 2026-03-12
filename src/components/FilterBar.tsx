import { Button } from "@/components/ui/button";

const filters = [
  { label: "All", value: "all" },
  { label: "Buy", value: "buy" },
  { label: "Sell", value: "sell" },
  { label: "Services", value: "services" },
];

interface FilterBarProps {
  active: string;
  onChange: (value: string) => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={active === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(filter.value)}
          className="shrink-0"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
