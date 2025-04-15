import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutList, 
  LayoutGrid, 
  Search, 
  MoreHorizontal, 
  Plus, 
  Edit, 
  Trash2, 
  HardDrive,
  Cpu,
  MemoryStick,
  Power,
  Monitor,
  Box,
  Keyboard,
  Router,
  Loader2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Component, COMPONENT_TYPES, COMPONENT_SUBTYPES, MANUFACTURERS } from "@/features/assemblies/types";
import { useToast } from "@/hooks/use-toast";
import { getComponents, createComponent, updateComponent, deleteComponent } from "@/services/componentService";

// Component icons based on type (keep the same)
const getComponentIcon = (type: string) => {
  switch (type) {
    case "Processor":
      return <Cpu className="h-5 w-5" />;
    case "Motherboard":
      return <HardDrive className="h-5 w-5" />;
    case "RAM":
      return <MemoryStick className="h-5 w-5" />;
    case "Storage":
      return <HardDrive className="h-5 w-5" />;
    case "PSU":
      return <Power className="h-5 w-5" />;
    case "Monitor":
      return <Monitor className="h-5 w-5" />;
    case "Case":
      return <Box className="h-5 w-5" />;
    case "Peripherals":
      return <Keyboard className="h-5 w-5" />;
    case "Networking":
      return <Router className="h-5 w-5" />;
    default:
      return <HardDrive className="h-5 w-5" />;
  }
};

const Components: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<Component | null>(null);
  const [selectedType, setSelectedType] = useState<string>(COMPONENT_TYPES[0]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<Component>({
    defaultValues: {
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

  // Fetch components on component mount
  useEffect(() => {
    const fetchComponents = async () => {
      setIsLoading(true);
      const data = await getComponents();
      setComponents(data);
      setIsLoading(false);
    };

    fetchComponents();
  }, []);

  // Filter components based on search
  const filteredComponents = components.filter(component => 
    component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.model?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEdit = (component: Component | null = null) => {
    if (component) {
      // If we're editing, set form values
      setCurrentComponent(component);
      form.reset({
        id: component.id,
        name: component.name,
        type: component.type,
        subtype: component.subtype || "",
        serialNumber: component.serialNumber || "",
        manufacturer: component.manufacturer || "",
        model: component.model || "",
        specifications: component.specifications || {}
      });
      setSelectedType(component.type);
    } else {
      // If we're adding, reset form values
      setCurrentComponent(null);
      form.reset({
        id: "", // ID will be generated on the server
        name: "",
        type: COMPONENT_TYPES[0],
        subtype: COMPONENT_SUBTYPES[COMPONENT_TYPES[0]][0],
        serialNumber: "",
        manufacturer: "",
        model: "",
        specifications: {}
      });
      setSelectedType(COMPONENT_TYPES[0]);
    }
    setFormOpen(true);
  };

  const handleSaveComponent = async (values: Component) => {
    if (currentComponent) {
      // Update existing component
      const updatedComponent = await updateComponent(values);
      if (updatedComponent) {
        setComponents(prevComponents => 
          prevComponents.map(c => c.id === currentComponent.id ? updatedComponent : c)
        );
      }
    } else {
      // Add new component
      const newComponent = await createComponent(values);
      if (newComponent) {
        setComponents(prevComponents => [...prevComponents, newComponent]);
      }
    }
    setFormOpen(false);
  };

  const handleDeleteComponent = async (id: string) => {
    const success = await deleteComponent(id);
    if (success) {
      setComponents(prevComponents => prevComponents.filter(c => c.id !== id));
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    // Reset subtype when type changes
    form.setValue("type", type);
    form.setValue("subtype", COMPONENT_SUBTYPES[type][0]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Components</h1>
          <p className="text-muted-foreground">
            Manage individual hardware and software components
          </p>
        </div>
        <Button size="sm" className="flex items-center gap-1" onClick={() => handleAddEdit()}>
          <Plus size={16} />
          <span>Create Component</span>
        </Button>
      </div>

      {/* Search and View Toggles */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center border rounded-md">
          <Button 
            variant={viewMode === "grid" ? "default" : "ghost"} 
            size="sm"
            className="rounded-r-none"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid size={16} />
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "ghost"} 
            size="sm"
            className="rounded-l-none"
            onClick={() => setViewMode("list")}
          >
            <LayoutList size={16} />
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading components...</span>
        </div>
      )}

      {/* Components Grid/List View */}
      {!isLoading && (
        viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredComponents.map((component) => (
              <Card key={component.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="mr-2">{component.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddEdit(component)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteComponent(component.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {component.type}
                    </span>
                    {component.subtype && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 ml-2">
                        {component.subtype}
                      </span>
                    )}
                  </div>
                  {component.manufacturer && (
                    <CardDescription className="pt-1">{component.manufacturer} {component.model}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-sm">
                    <div className="flex items-center mb-2">
                      {getComponentIcon(component.type)}
                      <span className="font-medium ml-2 truncate">{component.serialNumber ? `SN: ${component.serialNumber}` : "No Serial Number"}</span>
                    </div>
                    {component.specifications && Object.keys(component.specifications).length > 0 && (
                      <div className="space-y-1 mt-3 bg-muted p-2 rounded-md">
                        {Object.entries(component.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="text-xs font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                  <div className="w-full flex justify-between">
                    <span>ID: {component.id}</span>
                    {component.manufacturer && <span>Mfr: {component.manufacturer}</span>}
                  </div>
                </CardFooter>
              </Card>
            ))}
            {filteredComponents.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No components found.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Type</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Subtype</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Manufacturer</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Serial Number</th>
                  <th className="p-3 w-[60px]"></th>
                </tr>
              </thead>
              <tbody>
                {filteredComponents.map((component) => (
                  <tr key={component.id} className="border-b">
                    <td className="p-3">
                      <div className="font-medium">{component.name}</div>
                      <div className="text-xs text-muted-foreground">{component.model}</div>
                    </td>
                    <td className="p-3 hidden md:table-cell">{component.type}</td>
                    <td className="p-3 hidden md:table-cell">{component.subtype || "-"}</td>
                    <td className="p-3 hidden lg:table-cell">{component.manufacturer || "-"}</td>
                    <td className="p-3 hidden lg:table-cell">{component.serialNumber || "-"}</td>
                    <td className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAddEdit(component)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteComponent(component.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredComponents.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={6} className="text-center p-6">
                      No components found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Add/Edit Component Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentComponent ? "Edit Component" : "Create New Component"}</DialogTitle>
            <DialogDescription>
              {currentComponent 
                ? "Update the details of the selected component." 
                : "Enter the details of the new component."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveComponent)} className="space-y-4">
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
                    
                    {/* Add more type-specific fields as needed */}
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Components;
