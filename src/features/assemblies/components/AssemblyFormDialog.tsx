
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Assembly } from "../types";
import { getComponentIcon } from "../utils/componentIcons";
import { AVAILABLE_COMPONENTS } from "../data/mock-data";
import { Trash2 } from "lucide-react";

interface AssemblyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAssembly: Assembly | null;
  selectedComponents: string[];
  onComponentSelect: (componentId: string) => void;
  onOpenComponentDialog: () => void;
  onSave: (e: React.FormEvent) => void;
}

export const AssemblyFormDialog: React.FC<AssemblyFormDialogProps> = ({
  open,
  onOpenChange,
  currentAssembly,
  selectedComponents,
  onComponentSelect,
  onOpenComponentDialog,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {currentAssembly ? "Edit Assembly" : "Create New Assembly"}
          </DialogTitle>
          <DialogDescription>
            {currentAssembly
              ? "Update the details of the selected assembly."
              : "Enter the details of the new assembly."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSave}>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Assembly Name</Label>
                  <Input
                    id="name"
                    defaultValue={currentAssembly?.name || ""}
                    placeholder="Enter assembly name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue={currentAssembly?.description || ""}
                    placeholder="Describe the assembly and its purpose"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      defaultValue={currentAssembly?.status || "Active"}
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Decommissioned">Decommissioned</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      defaultValue={currentAssembly?.location || ""}
                      placeholder="Location"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="lastMaintenance">Last Maintenance</Label>
                    <Input
                      id="lastMaintenance"
                      type="date"
                      defaultValue={currentAssembly?.lastMaintenance || ""}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nextMaintenance">Next Maintenance</Label>
                    <Input
                      id="nextMaintenance"
                      type="date"
                      defaultValue={currentAssembly?.nextMaintenance || ""}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="components" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">Assembly Components</h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedComponents.length} components selected
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onOpenComponentDialog}
                >
                  Add Components
                </Button>
              </div>
              <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
                {selectedComponents.length > 0 ? (
                  selectedComponents.map((compId) => {
                    const component = AVAILABLE_COMPONENTS.find(
                      (c) => c.id === compId
                    );
                    return component ? (
                      <div
                        key={component.id}
                        className="p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {getComponentIcon(component.type)}
                          <div>
                            <div className="font-medium text-sm">
                              {component.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {component.type} • {component.id}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onComponentSelect(component.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ) : null;
                  })
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    No components added yet. Click "Add Components" to select
                    from available assets.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6">
            <Button type="submit">
              {currentAssembly ? "Update Assembly" : "Create Assembly"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
