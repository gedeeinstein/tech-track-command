
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { AVAILABLE_COMPONENTS } from "../data/mock-data";
import { getComponentIcon } from "../utils/componentIcons";

interface ComponentSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedComponents: string[];
  onComponentSelect: (componentId: string) => void;
}

export const ComponentSelectionDialog: React.FC<ComponentSelectionDialogProps> = ({
  open,
  onOpenChange,
  selectedComponents,
  onComponentSelect
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Components</DialogTitle>
          <DialogDescription>
            Choose assets to include in this assembly
          </DialogDescription>
        </DialogHeader>
        <div className="relative my-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search components..." className="pl-8" />
        </div>
        <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
          {AVAILABLE_COMPONENTS.map((component) => (
            <div key={component.id} className="p-3 flex items-center">
              <Checkbox
                id={`component-${component.id}`}
                checked={selectedComponents.includes(component.id)}
                onCheckedChange={() => onComponentSelect(component.id)}
                className="mr-3"
              />
              <div className="flex items-center gap-2">
                {getComponentIcon(component.type)}
                <label
                  htmlFor={`component-${component.id}`}
                  className="cursor-pointer flex-1"
                >
                  <div className="font-medium text-sm">{component.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {component.type} • {component.id}
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
