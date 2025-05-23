
import React, { useState, useEffect } from "react";
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
import { Trash2 } from "lucide-react";
import { Asset } from "../types";

interface AssemblyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAssembly: Assembly | null;
  selectedComponents: string[];
  onComponentSelect: (componentId: string) => void;
  onOpenComponentDialog: () => void;
  onSave: (e: React.FormEvent) => void;
  assets: Asset[];
}

export const AssemblyFormDialog: React.FC<AssemblyFormDialogProps> = ({
  open,
  onOpenChange,
  currentAssembly,
  selectedComponents,
  onComponentSelect,
  onOpenComponentDialog,
  onSave,
  assets
}) => {
  // State to track form values across tab changes
  const [formValues, setFormValues] = useState({
    name: currentAssembly?.name || "",
    description: currentAssembly?.description || "",
    status: currentAssembly?.status || "Active",
    location: currentAssembly?.location || "",
    lastMaintenance: currentAssembly?.lastMaintenance || "",
    nextMaintenance: currentAssembly?.nextMaintenance || ""
  });

  // Update form values when currentAssembly changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormValues({
        name: currentAssembly?.name || "",
        description: currentAssembly?.description || "",
        status: currentAssembly?.status || "Active",
        location: currentAssembly?.location || "",
        lastMaintenance: currentAssembly?.lastMaintenance || "",
        nextMaintenance: currentAssembly?.nextMaintenance || ""
      });
    }
  }, [currentAssembly, open]);

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Wrap onSave to include formValues
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(e);
  };

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
        <form onSubmit={handleSubmit} id="assembly-form">
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
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    placeholder="Enter assembly name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formValues.description}
                    onChange={handleInputChange}
                    placeholder="Describe the assembly and its purpose"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      name="status"
                      value={formValues.status}
                      onChange={handleInputChange}
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
                      name="location"
                      value={formValues.location}
                      onChange={handleInputChange}
                      placeholder="Location"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="lastMaintenance">Last Maintenance</Label>
                    <Input
                      id="lastMaintenance"
                      name="lastMaintenance"
                      type="date"
                      value={formValues.lastMaintenance}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nextMaintenance">Next Maintenance</Label>
                    <Input
                      id="nextMaintenance"
                      name="nextMaintenance"
                      type="date"
                      value={formValues.nextMaintenance}
                      onChange={handleInputChange}
                      required
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
                    const asset = assets.find(a => a.id === compId);
                    return asset ? (
                      <div
                        key={asset.id}
                        className="p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {getComponentIcon(asset.type)}
                          <div>
                            <div className="font-medium text-sm">
                              {asset.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {asset.type} • {asset.id}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onComponentSelect(asset.id)}
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
              {/* Add hidden input fields with controlled values to ensure form submission works from Components tab */}
              <div className="hidden">
                <input 
                  name="name" 
                  value={formValues.name}
                  onChange={handleInputChange}
                />
                <input 
                  name="description" 
                  value={formValues.description}
                  onChange={handleInputChange}
                />
                <input 
                  name="status" 
                  value={formValues.status}
                  onChange={handleInputChange}
                />
                <input 
                  name="location" 
                  value={formValues.location}
                  onChange={handleInputChange}
                />
                <input 
                  name="lastMaintenance" 
                  value={formValues.lastMaintenance}
                  onChange={handleInputChange}
                />
                <input 
                  name="nextMaintenance" 
                  value={formValues.nextMaintenance}
                  onChange={handleInputChange}
                />
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6">
            <Button type="submit" form="assembly-form">
              {currentAssembly ? "Update Assembly" : "Create Assembly"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
