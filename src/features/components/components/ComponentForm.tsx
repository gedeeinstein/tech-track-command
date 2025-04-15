
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Component, COMPONENT_TYPES, COMPONENT_SUBTYPES, MANUFACTURERS } from "@/features/assemblies/types";

interface ComponentFormProps {
  onSubmit: (data: Component) => void;
  currentComponent: Component | null;
}

const ComponentForm: React.FC<ComponentFormProps> = ({ 
  onSubmit, 
  currentComponent 
}) => {
  const [selectedType, setSelectedType] = useState<string>(
    currentComponent?.type || COMPONENT_TYPES[0]
  );

  const form = useForm<Component>({
    defaultValues: currentComponent || {
      id: "",
      name: "",
      type: COMPONENT_TYPES[0],
      subtype: COMPONENT_SUBTYPES[COMPONENT_TYPES[0]][0],
      serialNumber: "",
      manufacturer: "",
      model: "",
      specifications: {}
    }
  });

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    // Reset subtype when type changes
    form.setValue("type", type);
    form.setValue("subtype", COMPONENT_SUBTYPES[type][0]);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{currentComponent ? "Edit Component" : "Create New Component"}</DialogTitle>
        <DialogDescription>
          {currentComponent 
            ? "Update the details of the selected component." 
            : "Enter the details of the new component."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Component ID</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly disabled={!currentComponent} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Component Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter component name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleTypeChange(value);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COMPONENT_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subtype"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtype</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subtype" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedType && COMPONENT_SUBTYPES[selectedType]?.map((subtype) => (
                              <SelectItem key={subtype} value={subtype}>{subtype}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturer</FormLabel>
                        <Select value={field.value || ""} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select manufacturer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MANUFACTURERS.map((manufacturer) => (
                              <SelectItem key={manufacturer} value={manufacturer}>{manufacturer}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Component model" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Serial number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="space-y-4 pt-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-3">Add Specifications</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Add key specifications for this component. These will vary based on the component type.
                </p>
                
                {selectedType === "Processor" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cores">Cores</Label>
                      <Input 
                        id="cores" 
                        placeholder="Number of cores"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, cores: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.cores || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="threads">Threads</Label>
                      <Input 
                        id="threads" 
                        placeholder="Number of threads"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, threads: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.threads || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="baseFrequency">Base Frequency</Label>
                      <Input 
                        id="baseFrequency" 
                        placeholder="e.g. 3.6 GHz"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, baseFrequency: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.baseFrequency || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="turboFrequency">Turbo Frequency</Label>
                      <Input 
                        id="turboFrequency" 
                        placeholder="e.g. 5.0 GHz"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, turboFrequency: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.turboFrequency || ""}
                      />
                    </div>
                  </div>
                )}
                
                {selectedType === "Motherboard" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="chipset">Chipset</Label>
                      <Input 
                        id="chipset" 
                        placeholder="e.g. AMD B550"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, chipset: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.chipset || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="socket">Socket</Label>
                      <Input 
                        id="socket" 
                        placeholder="e.g. AM4"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, socket: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.socket || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="memorySlots">Memory Slots</Label>
                      <Input 
                        id="memorySlots" 
                        placeholder="Number of slots"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, memorySlots: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.memorySlots || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maxMemory">Max Memory</Label>
                      <Input 
                        id="maxMemory" 
                        placeholder="e.g. 128GB"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, maxMemory: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.maxMemory || ""}
                      />
                    </div>
                  </div>
                )}
                
                {selectedType === "RAM" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input 
                        id="capacity" 
                        placeholder="e.g. 16GB"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, capacity: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.capacity || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="speed">Speed</Label>
                      <Input 
                        id="speed" 
                        placeholder="e.g. 3200MHz"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, speed: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.speed || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="latency">Latency</Label>
                      <Input 
                        id="latency" 
                        placeholder="e.g. CL16"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, latency: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.latency || ""}
                      />
                    </div>
                  </div>
                )}
                
                {selectedType === "Storage" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input 
                        id="capacity" 
                        placeholder="e.g. 1TB"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, capacity: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.capacity || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="interface">Interface</Label>
                      <Input 
                        id="interface" 
                        placeholder="e.g. SATA III, PCIe 3.0"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, interface: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.interface || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="readSpeed">Read Speed</Label>
                      <Input 
                        id="readSpeed" 
                        placeholder="e.g. 3500 MB/s"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, readSpeed: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.readSpeed || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="writeSpeed">Write Speed</Label>
                      <Input 
                        id="writeSpeed" 
                        placeholder="e.g. 3300 MB/s"
                        onChange={(e) => {
                          const specs = form.getValues().specifications || {};
                          form.setValue("specifications", { ...specs, writeSpeed: e.target.value });
                        }}
                        defaultValue={form.getValues().specifications?.writeSpeed || ""}
                      />
                    </div>
                  </div>
                )}
                
                {!["Processor", "Motherboard", "RAM", "Storage"].includes(selectedType) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2 col-span-2">
                      <Label htmlFor="customSpec">Add Custom Specifications</Label>
                      <Textarea 
                        id="customSpec" 
                        placeholder="Enter specifications in key:value format, one per line (e.g. Size: 27 inches)"
                        onChange={(e) => {
                          const specs: Record<string, string> = {};
                          e.target.value.split('\n').forEach(line => {
                            const [key, value] = line.split(':');
                            if (key && value) {
                              specs[key.trim()] = value.trim();
                            }
                          });
                          form.setValue("specifications", specs);
                        }}
                        defaultValue={Object.entries(form.getValues().specifications || {})
                          .map(([key, value]) => `${key}: ${value}`)
                          .join('\n')}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button type="submit">
              {currentComponent ? "Update Component" : "Create Component"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default ComponentForm;
