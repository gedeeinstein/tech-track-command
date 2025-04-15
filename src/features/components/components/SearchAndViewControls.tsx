
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, LayoutList, Plus } from "lucide-react";

interface SearchAndViewControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onAddComponent: () => void;
}

const SearchAndViewControls: React.FC<SearchAndViewControlsProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onAddComponent
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Components</h1>
        <p className="text-muted-foreground">
          Manage individual hardware and software components
        </p>
      </div>
      <Button size="sm" className="flex items-center gap-1" onClick={onAddComponent}>
        <Plus size={16} />
        <span>Create Component</span>
      </Button>
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
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
    </div>
  );
};

export default SearchAndViewControls;
