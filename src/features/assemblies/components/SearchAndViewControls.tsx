
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutGrid, LayoutList, Search } from "lucide-react";
import { ViewMode } from "../types";

interface SearchAndViewControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const SearchAndViewControls: React.FC<SearchAndViewControlsProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assemblies..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center border rounded-md">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          className="rounded-r-none"
          onClick={() => onViewModeChange("grid")}
        >
          <LayoutGrid size={16} />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          className="rounded-l-none"
          onClick={() => onViewModeChange("list")}
        >
          <LayoutList size={16} />
        </Button>
      </div>
    </div>
  );
};
