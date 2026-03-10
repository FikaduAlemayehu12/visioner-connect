import { useState } from "react";
import { Button } from "@/components/ui/button";

const filters = [
  { label: "All", value: "all" },
  { label: "Buy", value: "buy" },
  { label: "Sell", value: "sell" },
  { label: "Services", value: "services" },
  { label: "Near You", value: "near" },
];

export function FilterBar() {
  const [active, setActive] = useState("all");

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={active === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => setActive(filter.value)}
          className="shrink-0"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
