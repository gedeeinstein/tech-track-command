
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  LayoutList, 
  LayoutGrid, 
  Search,
  ServerStack,
  Monitor,
  Printer,
  Network,
  HardDrive
} from "lucide-react";

// Mock assemblies data
const MOCK_ASSEMBLIES = [
  {
    id: "ASM001",
    name: "Server Rack #1",
    description: "Primary server rack for production environment",
    status: "Active",
    location: "Server Room A",
    components: [
      { id: "A1004", name: "Dell PowerEdge R740", type: "Server" },
      { id: "A1002", name: "Cisco Switch 24-Port", type: "Networking" },
      { id: "A1008", name: "Fortinet Firewall", type: "Networking" }
    ],
    lastMaintenance: "2023-12-10",
    nextMaintenance: "2024-06-10"
  },
  {
    id: "ASM002",
    name: "Finance Workstations",
    description: "Complete workstation setup for finance department",
    status: "Active",
    location: "Finance Department",
    components: [
      { id: "A1005", name: "Microsoft Surface Pro", type: "Tablet" },
      { id: "A1003", name: "HP LaserJet Pro", type: "Printer" }
    ],
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-07-15"
  },
  {
    id: "ASM003",
    name: "Conference Room A System",
    description: "Audio/video system for main conference room",
    status: "Maintenance",
    location: "Main Conference Room",
    components: [
      { id: "A1006", name: "Polycom Conference System", type: "Audio/Video" },
      { id: "A2010", name: "Projector", type: "Audio/Video" }
    ],
    lastMaintenance: "2023-11-20",
    nextMaintenance: "2024-05-20"
  },
  {
    id: "ASM004",
    name: "Developer Workstation Pack",
    description: "Standard development environment",
    status: "Active",
    location: "IT Department",
    components: [
      { id: "A1001", name: "Dell XPS 15", type: "Laptop" },
      { id: "A1007", name: "Lenovo ThinkPad X1", type: "Laptop" }
    ],
    lastMaintenance: "2024-02-05",
    nextMaintenance: "2024-08-05"
  }
];

// Additional mock assets for component selection
const AVAILABLE_COMPONENTS = [
  { id: "A1001", name: "Dell XPS 15", type: "Laptop" },
  { id: "A1002", name: "Cisco Switch 24-Port", type: "Networking" },
  { id: "A1003", name: "HP LaserJet Pro", type: "Printer" },
  { id: "A1004", name: "Dell PowerEdge R740", type: "Server" },
  { id: "A1005", name: "Microsoft Surface Pro", type: "Tablet" },
  { id: "A1006", name: "Polycom Conference System", type: "Audio/Video" },
  { id: "A1007", name: "Lenovo ThinkPad X1", type: "Laptop" },
  { id: "A1008", name: "Fortinet Firewall", type: "Networking" },
  { id: "A2010", name: "Projector", type: "Audio/Video" },
  { id: "A2011", name: "UPS System", type: "Power" },
  { id: "A2012", name: "Netgear Router", type: "Networking" },
  { id: "A2013", name: "IP Camera", type: "Security" }
];

// Component icons based on type
const getComponentIcon = (type: string) => {
  switch (type) {
    case "Server":
      return <ServerStack className="h-5 w-5" />;
    case "Laptop":
    case "Tablet":
    case "Desktop":
      return <Monitor className="h-5 w-5" />;
    case "Printer":
      return <Printer className="h-5 w-5" />;
    case "Networking":
      return <Network className="h-5 w-5" />;
    default:
      return <HardDrive className="h-5 w-5" />;
  }
};

const Assemblies: React.FC = () => {
  const [assemblies, setAssemblies] = useState(MOCK_ASSEMBLIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [currentAssembly, setCurrentAssembly] = useState<any | null>(null);
  const [componentDialogOpen, setComponentDialogOpen] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  // Filter assemblies based on search
  const filteredAssemblies = assemblies.filter(assembly => 
    assembly.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assembly.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEdit = (assembly: any = null) => {
    setCurrentAssembly(assembly);
    if (assembly) {
      setSelectedComponents(assembly.components.map((c: any) => c.id));
    } else {
      setSelectedComponents([]);
    }
    setFormOpen(true);
  };

  const handleOpenComponentDialog = () => {
    setComponentDialogOpen(true);
  };

  const handleSaveAssembly = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the assembly to your backend
    // For now, just close the dialog
    setFormOpen(false);
    setCurrentAssembly(null);
  };

  const handleDeleteAssembly = (id: string) => {
    // In a real app, you would delete from your backend
    setAssemblies(assemblies.filter(assembly => assembly.id !== id));
  };

  const toggleComponentSelection = (componentId: string) => {
    if (selectedComponents.includes(componentId)) {
      setSelectedComponents(selectedComponents.filter(id => id !== componentId));
    } else {
      setSelectedComponents([...selectedComponents, componentId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assemblies</h1>
          <p className="text-muted-foreground">
            Manage groups of components organized into functional units
          </p>
        </div>
        <Button size="sm" className="flex items-center gap-1" onClick={() => handleAddEdit()}>
          <Plus size={16} />
          <span>Create Assembly</span>
        </Button>
      </div>

      {/* Search and View Toggles */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assemblies..."
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

      {/* Assemblies Grid/List View */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssemblies.map((assembly) => (
            <Card key={assembly.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle>{assembly.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAddEdit(assembly)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAssembly(assembly.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center mt-1">
                  <span className={cn(
                    "status-badge",
                    assembly.status === "Active" && "status-active",
                    assembly.status === "Maintenance" && "status-maintenance",
                    assembly.status === "Decommissioned" && "status-decommissioned"
                  )}>
                    {assembly.status}
                  </span>
                </div>
                <CardDescription className="pt-1">{assembly.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm">
                  <div className="font-medium mb-2">Components ({assembly.components.length})</div>
                  <ul className="space-y-2">
                    {assembly.components.slice(0, 3).map((component, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        {getComponentIcon(component.type)}
                        <span className="truncate">{component.name}</span>
                      </li>
                    ))}
                    {assembly.components.length > 3 && (
                      <li className="text-muted-foreground text-xs">
                        + {assembly.components.length - 3} more components
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                <div className="w-full flex justify-between">
                  <span>Location: {assembly.location}</span>
                  <span>Next Maintenance: {assembly.nextMaintenance}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
          {filteredAssemblies.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No assemblies found.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Status</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Location</th>
                <th className="text-left p-3 font-medium hidden lg:table-cell">Components</th>
                <th className="text-left p-3 font-medium hidden lg:table-cell">Next Maintenance</th>
                <th className="p-3 w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAssemblies.map((assembly) => (
                <tr key={assembly.id} className="border-b">
                  <td className="p-3">
                    <div className="font-medium">{assembly.name}</div>
                    <div className="text-xs text-muted-foreground">{assembly.description}</div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className={cn(
                      "status-badge",
                      assembly.status === "Active" && "status-active",
                      assembly.status === "Maintenance" && "status-maintenance",
                      assembly.status === "Decommissioned" && "status-decommissioned"
                    )}>
                      {assembly.status}
                    </span>
                  </td>
                  <td className="p-3 hidden md:table-cell">{assembly.location}</td>
                  <td className="p-3 hidden lg:table-cell">{assembly.components.length}</td>
                  <td className="p-3 hidden lg:table-cell">{assembly.nextMaintenance}</td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddEdit(assembly)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAssembly(assembly.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredAssemblies.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-6">
                    No assemblies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Assembly Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentAssembly ? "Edit Assembly" : "Create New Assembly"}</DialogTitle>
            <DialogDescription>
              {currentAssembly 
                ? "Update the details of the selected assembly." 
                : "Enter the details of the new assembly."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveAssembly}>
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
                  <Button type="button" size="sm" variant="outline" onClick={handleOpenComponentDialog}>
                    Add Components
                  </Button>
                </div>
                <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
                  {selectedComponents.length > 0 ? (
                    selectedComponents.map(compId => {
                      const component = AVAILABLE_COMPONENTS.find(c => c.id === compId);
                      return component ? (
                        <div key={component.id} className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getComponentIcon(component.type)}
                            <div>
                              <div className="font-medium text-sm">{component.name}</div>
                              <div className="text-xs text-muted-foreground">{component.type} • {component.id}</div>
                            </div>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toggleComponentSelection(component.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      No components added yet. Click "Add Components" to select from available assets.
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

      {/* Component Selection Dialog */}
      <Dialog open={componentDialogOpen} onOpenChange={setComponentDialogOpen}>
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
            />
          </div>
          <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
            {AVAILABLE_COMPONENTS.map(component => (
              <div key={component.id} className="p-3 flex items-center">
                <Checkbox 
                  id={`component-${component.id}`} 
                  checked={selectedComponents.includes(component.id)}
                  onCheckedChange={() => toggleComponentSelection(component.id)}
                  className="mr-3"
                />
                <div className="flex items-center gap-2">
                  {getComponentIcon(component.type)}
                  <label htmlFor={`component-${component.id}`} className="cursor-pointer flex-1">
                    <div className="font-medium text-sm">{component.name}</div>
                    <div className="text-xs text-muted-foreground">{component.type} • {component.id}</div>
                  </label>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setComponentDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assemblies;
