
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaintenanceFiltersProps {
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

const STATUS_OPTIONS = ["All", "Scheduled", "In Progress", "Completed", "Overdue"];
const PRIORITY_OPTIONS = ["All", "Low", "Medium", "High"];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Scheduled":
      return <Clock className="h-4 w-4" />;
    case "In Progress":
      return <PlayCircle className="h-4 w-4" />;
    case "Completed":
      return <CheckCircle2 className="h-4 w-4" />;
    case "Overdue":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

import { Clock, PlayCircle, CheckCircle2, AlertCircle } from "lucide-react";

const MaintenanceFilters: React.FC<MaintenanceFiltersProps> = ({
  searchQuery,
  statusFilter,
  priorityFilter,
  onSearchChange,
  onStatusChange,
  onPriorityChange
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              {getStatusIcon(statusFilter)}
              <span>{statusFilter} Status</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <div className="divide-y">
              {STATUS_OPTIONS.map((status) => (
                <div 
                  key={status} 
                  className={cn(
                    "flex items-center gap-2 p-2.5 cursor-pointer hover:bg-secondary", 
                    status === statusFilter && "bg-secondary"
                  )}
                  onClick={() => onStatusChange(status)}
                >
                  {getStatusIcon(status)}
                  <span>{status}</span>
                  {status === statusFilter && <Check className="h-4 w-4 ml-auto" />}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1 ml-2">
              <span>{priorityFilter} Priority</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <div className="divide-y">
              {PRIORITY_OPTIONS.map((priority) => (
                <div 
                  key={priority} 
                  className={cn(
                    "flex items-center gap-2 p-2.5 cursor-pointer hover:bg-secondary", 
                    priority === priorityFilter && "bg-secondary"
                  )}
                  onClick={() => onPriorityChange(priority)}
                >
                  <span>{priority}</span>
                  {priority === priorityFilter && <Check className="h-4 w-4 ml-auto" />}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default MaintenanceFilters;
