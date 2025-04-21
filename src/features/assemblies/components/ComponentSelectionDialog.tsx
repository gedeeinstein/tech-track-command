
import React, { useState } from "react";
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
import { getComponentIcon } from "../utils/componentIcons";
import { Asset } from "../types";

interface ComponentSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedComponents: string[];
  onComponentSelect: (componentId: string) => void;
  assets: Asset[];
}

export const ComponentSelectionDialog: React.FC<ComponentSelectionDialogProps> = ({
  open,
  onOpenChange,
  selectedComponents,
  onComponentSelect,
  assets
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Input 
            placeholder="Search components..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <div key={asset.id} className="p-3 flex items-center">
                <Checkbox
                  id={`component-${asset.id}`}
                  checked={selectedComponents.includes(asset.id)}
                  onCheckedChange={() => onComponentSelect(asset.id)}
                  className="mr-3"
                />
                <div className="flex items-center gap-2">
                  {getComponentIcon(asset.type)}
                  <label
                    htmlFor={`component-${asset.id}`}
                    className="cursor-pointer flex-1"
                  >
                    <div className="font-medium text-sm">{asset.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {asset.type} • {asset.id}
                    </div>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No assets found matching your search criteria.
            </div>
          )}
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
