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
import { 
  LayoutList, 
  LayoutGrid, 
  Search, 
  MoreHorizontal, 
  Plus, 
  Edit, 
  Trash2, 
  Component,
  Server,
  HardDrive
} from "lucide-react";

// Mock components data
const MOCK_COMPONENTS = [
  {
    id: "CMP001",
    name: "Dell XPS 15",
    description: "High-performance laptop for developers",
    type: "Laptop",
    status: "Active",
    location: "IT Department",
    purchaseDate: "2023-08-15",
    warrantyExpiration: "2026-08-15",
    specifications: {
      cpu: "Intel Core i7",
      ram: "16GB",
      storage: "512GB SSD"
    }
  },
  {
    id: "CMP002",
    name: "Cisco Switch 24-Port",
    description: "24-port gigabit ethernet switch",
    type: "Networking",
    status: "Active",
    location: "Server Room A",
    purchaseDate: "2022-11-01",
    warrantyExpiration: "2027-11-01",
    specifications: {
      ports: "24 x 1GbE",
      management: "Web-based GUI"
    }
  },
  {
    id: "CMP003",
    name: "HP LaserJet Pro",
    description: "Monochrome laser printer",
    type: "Printer",
    status: "Maintenance",
    location: "Office Area",
    purchaseDate: "2024-01-20",
    warrantyExpiration: "2025-01-20",
    specifications: {
      printSpeed: "30 ppm",
      resolution: "600 dpi"
    }
  },
  {
    id: "CMP004",
    name: "Dell PowerEdge R740",
    description: "2U rack server for enterprise applications",
    type: "Server",
    status: "Active",
    location: "Server Room A",
    purchaseDate: "2023-05-10",
    warrantyExpiration: "2028-05-10",
    specifications: {
      cpu: "Intel Xeon Gold",
      ram: "64GB",
      storage: "2TB HDD"
    }
  }
];

// Component icons based on type
const getComponentIcon = (type: string) => {
  switch (type) {
    case "Server":
      return <Server className="h-5 w-5" />;
    case "Laptop":
    case "Tablet":
    case "Desktop":
      return <Component className="h-5 w-5" />;
    default:
      return <HardDrive className="h-5 w-5" />;
  }
};

const Components: React.FC = () => {
  const [components, setComponents] = useState(MOCK_COMPONENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [currentcomponent, setCurrentcomponent] = useState<any | null>(null);

  // Filter components based on search
  const filteredcomponents = components.filter(component => 
    component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEdit = (component: any = null) => {
    setCurrentcomponent(component);
    setFormOpen(true);
  };

  const handleSavecomponent = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the component to your backend
    // For now, just close the dialog
    setFormOpen(false);
    setCurrentcomponent(null);
  };

  const handleDeletecomponent = (id: string) => {
    // In a real app, you would delete from your backend
    setComponents(components.filter(component => component.id !== id));
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

      {/* Components Grid/List View */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredcomponents.map((component) => (
            <Card key={component.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle>{component.name}</CardTitle>
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
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeletecomponent(component.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                    {component.status}
                  </span>
                </div>
                <CardDescription className="pt-1">{component.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm">
                  <div className="font-medium mb-2">Type: {component.type}</div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      {getComponentIcon(component.type)}
                      <span className="truncate">{component.name}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                <div className="w-full flex justify-between">
                  <span>Location: {component.location}</span>
                  <span>Warranty Expiration: {component.warrantyExpiration}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
          {filteredcomponents.length === 0 && (
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
                <th className="text-left p-3 font-medium hidden md:table-cell">Status</th>
                <th className="text-left p-3 font-medium hidden lg:table-cell">Location</th>
                <th className="text-left p-3 font-medium hidden lg:table-cell">Warranty Expiration</th>
                <th className="p-3 w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredcomponents.map((component) => (
                <tr key={component.id} className="border-b">
                  <td className="p-3">
                    <div className="font-medium">{component.name}</div>
                    <div className="text-xs text-muted-foreground">{component.description}</div>
                  </td>
                  <td className="p-3 hidden md:table-cell">{component.type}</td>
                  <td className="p-3 hidden md:table-cell">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                      {component.status}
                    </span>
                  </td>
                  <td className="p-3 hidden lg:table-cell">{component.location}</td>
                  <td className="p-3 hidden lg:table-cell">{component.warrantyExpiration}</td>
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
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeletecomponent(component.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredcomponents.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-6">
                    No components found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit component Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentcomponent ? "Edit Component" : "Create New Component"}</DialogTitle>
            <DialogDescription>
              {currentcomponent 
                ? "Update the details of the selected component." 
                : "Enter the details of the new component."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSavecomponent}>
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Component Name</Label>
                    <Input 
                      id="name" 
                      defaultValue={currentcomponent?.name || ""} 
                      placeholder="Enter component name" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      defaultValue={currentcomponent?.description || ""} 
                      placeholder="Describe the component and its purpose" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Type</Label>
                      <select 
                        id="type" 
                        defaultValue={currentcomponent?.type || "Laptop"} 
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                      >
                        <option value="Laptop">Laptop</option>
                        <option value="Server">Server</option>
                        <option value="Networking">Networking</option>
                        <option value="Printer">Printer</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <select 
                        id="status" 
                        defaultValue={currentcomponent?.status || "Active"} 
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Decommissioned">Decommissioned</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        defaultValue={currentcomponent?.location || ""} 
                        placeholder="Location" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="purchaseDate">Purchase Date</Label>
                      <Input 
                        id="purchaseDate" 
                        type="date" 
                        defaultValue={currentcomponent?.purchaseDate || ""} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="warrantyExpiration">Warranty Expiration</Label>
                      <Input 
                        id="warrantyExpiration" 
                        type="date" 
                        defaultValue={currentcomponent?.warrantyExpiration || ""} 
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-6">
              <Button type="submit">
                {currentcomponent ? "Update Component" : "Create Component"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Components;
