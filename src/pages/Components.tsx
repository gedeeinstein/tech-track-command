
import React, { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  LayoutList, 
  LayoutGrid, 
  Search,
  Cpu,
  Memory,
  HardDrive,
  Maximize2,
  Printer,
  Battery,
  Fan,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

// Component types
export type ComponentType = 
  | "CPU" 
  | "RAM" 
  | "Storage" 
  | "GPU" 
  | "Motherboard" 
  | "PSU" 
  | "Cooling" 
  | "Case" 
  | "Peripheral" 
  | "Network" 
  | "Other";

interface ComponentItem {
  id: string;
  name: string;
  type: ComponentType;
  manufacturer: string;
  model: string;
  serialNumber?: string;
  specifications: string;
  purchaseDate?: string;
  warrantyEnd?: string;
  status: "Available" | "In Use" | "Maintenance" | "Decommissioned";
  notes?: string;
}

// Mock component data
const MOCK_COMPONENTS: ComponentItem[] = [
  {
    id: "CPU001",
    name: "Intel Core i7-12700K",
    type: "CPU",
    manufacturer: "Intel",
    model: "i7-12700K",
    serialNumber: "INTL7829374",
    specifications: "12 cores, 20 threads, 3.6GHz base clock, 5.0GHz boost clock",
    purchaseDate: "2023-05-15",
    warrantyEnd: "2026-05-15",
    status: "Available",
    notes: "High-performance CPU for workstations"
  },
  {
    id: "RAM001",
    name: "Corsair Vengeance 32GB DDR4",
    type: "RAM",
    manufacturer: "Corsair",
    model: "Vengeance LPX",
    serialNumber: "CRSV982634",
    specifications: "32GB (2x16GB) DDR4-3600MHz CL18",
    purchaseDate: "2023-06-10",
    warrantyEnd: "2028-06-10",
    status: "In Use",
    notes: "Installed in Design Team workstations"
  },
  {
    id: "STO001",
    name: "Samsung 980 Pro 1TB",
    type: "Storage",
    manufacturer: "Samsung",
    model: "980 Pro",
    serialNumber: "SAM87345623",
    specifications: "1TB NVMe SSD, PCIe 4.0, 7000MB/s read, 5000MB/s write",
    purchaseDate: "2023-04-22",
    warrantyEnd: "2028-04-22",
    status: "Available",
    notes: "High-speed storage for workstations"
  },
  {
    id: "GPU001",
    name: "NVIDIA RTX 4080",
    type: "GPU",
    manufacturer: "NVIDIA",
    model: "RTX 4080",
    serialNumber: "NVD87236498",
    specifications: "16GB GDDR6X, 9728 CUDA cores",
    purchaseDate: "2023-02-15",
    warrantyEnd: "2026-02-15",
    status: "In Use",
    notes: "Used for 3D rendering workstations"
  },
  {
    id: "MB001",
    name: "ASUS ROG Maximus Z790",
    type: "Motherboard",
    manufacturer: "ASUS",
    model: "ROG Maximus Z790 Hero",
    serialNumber: "ASUSMB734982",
    specifications: "Intel Z790 chipset, DDR5, PCIe 5.0, Wi-Fi 6E",
    purchaseDate: "2023-03-10",
    warrantyEnd: "2026-03-10",
    status: "Available",
    notes: "High-end motherboard for workstations"
  }
];

// Get icon for component type
const getComponentIcon = (type: ComponentType) => {
  switch (type) {
    case "CPU":
      return <Cpu className="h-5 w-5" />;
    case "RAM":
      return <Memory className="h-5 w-5" />;
    case "Storage":
      return <HardDrive className="h-5 w-5" />;
    case "GPU":
      return <Maximize2 className="h-5 w-5" />;
    case "Peripheral":
      return <Printer className="h-5 w-5" />;
    case "PSU":
      return <Battery className="h-5 w-5" />;
    case "Cooling":
      return <Fan className="h-5 w-5" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
};

const componentTypes: ComponentType[] = [
  "CPU",
  "RAM",
  "Storage",
  "GPU",
  "Motherboard",
  "PSU",
  "Cooling",
  "Case",
  "Peripheral",
  "Network",
  "Other"
];

const Components: React.FC = () => {
  const [components, setComponents] = useState<ComponentItem[]>(MOCK_COMPONENTS);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<ComponentItem | null>(null);
  const form = useForm<ComponentItem>();

  // Filter components based on search
  const filteredComponents = components.filter(component => 
    component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEdit = (component: ComponentItem | null = null) => {
    setCurrentComponent(component);
    form.reset(component || {
      id: `COMP${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      name: "",
      type: "Other",
      manufacturer: "",
      model: "",
      serialNumber: "",
      specifications: "",
      status: "Available",
      notes: ""
    });
    setFormOpen(true);
  };

  const handleDeleteComponent = (id: string) => {
    setComponents(components.filter(component => component.id !== id));
    toast.success("Component deleted successfully");
  };

  const handleSaveComponent = (data: any) => {
    if (currentComponent) {
      // Update existing component
      setComponents(components.map(component => 
        component.id === currentComponent.id ? { ...data } : component
      ));
      toast.success("Component updated successfully");
    } else {
      // Add new component
      setComponents([...components, data]);
      toast.success("Component added successfully");
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Components</h1>
          <p className="text-muted-foreground">
            Manage individual components that can be used in assemblies
          </p>
        </div>
        <Button size="sm" className="flex items-center gap-1" onClick={() => handleAddEdit()}>
          <Plus size={16} />
          <span>Add Component</span>
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

      {/* Components Grid/List View */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredComponents.map((component) => (
            <Card key={component.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getComponentIcon(component.type)}
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                  </div>
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
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    component.type === "CPU" && "bg-blue-100 text-blue-800",
                    component.type === "RAM" && "bg-purple-100 text-purple-800",
                    component.type === "Storage" && "bg-green-100 text-green-800",
                    component.type === "GPU" && "bg-yellow-100 text-yellow-800",
                    component.type === "Motherboard" && "bg-red-100 text-red-800",
                    component.type === "PSU" && "bg-orange-100 text-orange-800",
                    component.type === "Cooling" && "bg-cyan-100 text-cyan-800",
                    component.type === "Case" && "bg-gray-100 text-gray-800",
                    component.type === "Peripheral" && "bg-pink-100 text-pink-800",
                    component.type === "Network" && "bg-indigo-100 text-indigo-800",
                    component.type === "Other" && "bg-gray-100 text-gray-800"
                  )}>
                    {component.type}
                  </span>
                  <span className={cn(
                    "ml-2 px-2 py-1 rounded-full text-xs font-medium",
                    component.status === "Available" && "bg-green-100 text-green-800",
                    component.status === "In Use" && "bg-blue-100 text-blue-800",
                    component.status === "Maintenance" && "bg-yellow-100 text-yellow-800",
                    component.status === "Decommissioned" && "bg-gray-100 text-gray-800"
                  )}>
                    {component.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Manufacturer:</span> {component.manufacturer}
                  </div>
                  <div>
                    <span className="font-medium">Model:</span> {component.model}
                  </div>
                  <div>
                    <span className="font-medium">Specs:</span>
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                      {component.specifications}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                <div className="w-full flex justify-between">
                  <span>ID: {component.id}</span>
                  {component.serialNumber && <span>S/N: {component.serialNumber}</span>}
                </div>
              </CardFooter>
            </Card>
          ))}
          {filteredComponents.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No components found matching your search.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Manufacturer</TableHead>
                <TableHead className="hidden md:table-cell">Model</TableHead>
                <TableHead className="hidden lg:table-cell">Specifications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComponents.map((component) => (
                <TableRow key={component.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getComponentIcon(component.type)}
                      <span>{component.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{component.name}</div>
                    <div className="text-xs text-muted-foreground">ID: {component.id}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{component.manufacturer}</TableCell>
                  <TableCell className="hidden md:table-cell">{component.model}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="truncate max-w-[300px]">{component.specifications}</div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      component.status === "Available" && "bg-green-100 text-green-800",
                      component.status === "In Use" && "bg-blue-100 text-blue-800",
                      component.status === "Maintenance" && "bg-yellow-100 text-yellow-800",
                      component.status === "Decommissioned" && "bg-gray-100 text-gray-800"
                    )}>
                      {component.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                </TableRow>
              ))}
              {filteredComponents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No components found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Component Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentComponent ? "Edit Component" : "Add New Component"}</DialogTitle>
            <DialogDescription>
              {currentComponent 
                ? "Update the details of the selected component." 
                : "Enter the details of the new component."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSaveComponent)}>
            <Tabs defaultValue="details" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Basic Details</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="type" className="text-sm font-medium">Type</label>
                    <select 
                      id="type" 
                      {...form.register("type")}
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    >
                      {componentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                    <select 
                      id="status" 
                      {...form.register("status")}
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="Available">Available</option>
                      <option value="In Use">In Use</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Decommissioned">Decommissioned</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Component Name</label>
                  <Input id="name" {...form.register("name")} placeholder="Enter component name" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="manufacturer" className="text-sm font-medium">Manufacturer</label>
                    <Input 
                      id="manufacturer" 
                      {...form.register("manufacturer")} 
                      placeholder="Manufacturer" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="model" className="text-sm font-medium">Model</label>
                    <Input 
                      id="model" 
                      {...form.register("model")} 
                      placeholder="Model" 
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="serialNumber" className="text-sm font-medium">Serial Number</label>
                  <Input 
                    id="serialNumber" 
                    {...form.register("serialNumber")} 
                    placeholder="Serial number (optional)" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="purchaseDate" className="text-sm font-medium">Purchase Date</label>
                    <Input 
                      id="purchaseDate" 
                      type="date" 
                      {...form.register("purchaseDate")} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="warrantyEnd" className="text-sm font-medium">Warranty End</label>
                    <Input 
                      id="warrantyEnd" 
                      type="date" 
                      {...form.register("warrantyEnd")} 
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <label htmlFor="specifications" className="text-sm font-medium">Technical Specifications</label>
                  <Textarea 
                    id="specifications" 
                    {...form.register("specifications")} 
                    placeholder="Enter detailed specifications" 
                    rows={4}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="notes" className="text-sm font-medium">Additional Notes</label>
                  <Textarea 
                    id="notes" 
                    {...form.register("notes")} 
                    placeholder="Enter any additional notes" 
                    rows={3}
                  />
                </div>
                
                {/* Hidden fields */}
                <input type="hidden" {...form.register("id")} />
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {currentComponent ? "Update Component" : "Add Component"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Components;
