
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getComponentIcon } from "../utils/componentIcons";
import { Assembly } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assembly: Assembly | null;
  onEdit: (assembly: Assembly) => void;
}

export const AssemblyDetailsDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  assembly,
  onEdit
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{assembly?.name || "Assembly Details"}</DialogTitle>
        <DialogDescription>
          Detailed information about this assembly
        </DialogDescription>
      </DialogHeader>
      {assembly && (
        <ScrollArea className="max-h-[500px] pr-3">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-1">ID</h3>
              <p className="text-sm">{assembly.id}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Status</h3>
              <p className="text-sm">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                  assembly.status === "Active" ? "bg-green-100 text-green-800" :
                  assembly.status === "Maintenance" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {assembly.status}
                </span>
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Description</h3>
              <p className="text-sm">{assembly.description}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Location</h3>
              <p className="text-sm">{assembly.location}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm mb-1">Last Maintenance</h3>
                <p className="text-sm">{assembly.lastMaintenance}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">Next Maintenance</h3>
                <p className="text-sm">{assembly.nextMaintenance}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Components ({assembly.components.length})</h3>
              {assembly.components.length > 0 ? (
                <div className="border rounded-md divide-y">
                  {assembly.components.map(component => (
                    <div key={component.id} className="p-3 flex items-center">
                      <div className="flex items-center gap-2">
                        {getComponentIcon(component.type)}
                        <div>
                          <div className="font-medium text-sm">{component.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {component.type} • {component.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No components in this assembly</p>
              )}
            </div>
          </div>
        </ScrollArea>
      )}
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            if (assembly) onEdit(assembly);
            onOpenChange(false);
          }}>
          Edit
        </Button>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
