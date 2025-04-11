
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ArrowDownUp, 
  Search,
  Download,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for assets
const MOCK_ASSETS = [
  {
    id: "A1001",
    name: "Dell XPS 15",
    type: "Laptop",
    status: "Active",
    location: "IT Department",
    assignedTo: "John Smith",
    purchaseDate: "2022-05-15",
    warranty: "2025-05-15"
  },
  {
    id: "A1002",
    name: "Cisco Switch 24-Port",
    type: "Networking",
    status: "Active",
    location: "Server Room",
    assignedTo: "Network Infrastructure",
    purchaseDate: "2023-01-10",
    warranty: "2026-01-10"
  },
  {
    id: "A1003",
    name: "HP LaserJet Pro",
    type: "Printer",
    status: "Maintenance",
    location: "Finance Department",
    assignedTo: "Finance Team",
    purchaseDate: "2021-11-20",
    warranty: "2024-11-20"
  },
  {
    id: "A1004",
    name: "Dell PowerEdge R740",
    type: "Server",
    status: "Active",
    location: "Server Room",
    assignedTo: "Infrastructure Team",
    purchaseDate: "2022-09-05",
    warranty: "2025-09-05"
  },
  {
    id: "A1005",
    name: "Microsoft Surface Pro",
    type: "Tablet",
    status: "Active",
    location: "Sales Department",
    assignedTo: "Emma Johnson",
    purchaseDate: "2023-03-22",
    warranty: "2025-03-22"
  },
  {
    id: "A1006",
    name: "Polycom Conference System",
    type: "Audio/Video",
    status: "Decommissioned",
    location: "Storage",
    assignedTo: "Unassigned",
    purchaseDate: "2019-06-18",
    warranty: "2022-06-18"
  },
  {
    id: "A1007",
    name: "Lenovo ThinkPad X1",
    type: "Laptop",
    status: "Active",
    location: "Marketing Department",
    assignedTo: "Alex Williams",
    purchaseDate: "2022-11-01",
    warranty: "2025-11-01"
  },
  {
    id: "A1008",
    name: "Fortinet Firewall",
    type: "Networking",
    status: "Active",
    location: "Server Room",
    assignedTo: "Network Infrastructure",
    purchaseDate: "2023-02-15",
    warranty: "2026-02-15"
  }
];

// Asset types for dropdown
const ASSET_TYPES = [
  "All Types",
  "Laptop",
  "Desktop",
  "Server",
  "Networking",
  "Printer",
  "Audio/Video",
  "Tablet",
  "Mobile",
  "Other"
];

// Asset statuses for dropdown
const ASSET_STATUSES = [
  "All Statuses",
  "Active",
  "Maintenance",
  "Decommissioned"
];

// Form fields for the asset form
const FORM_FIELDS = [
  { id: "name", label: "Asset Name", type: "text" },
  { id: "type", label: "Asset Type", type: "select", options: ASSET_TYPES.filter(type => type !== "All Types") },
  { id: "status", label: "Status", type: "select", options: ASSET_STATUSES.filter(status => status !== "All Statuses") },
  { id: "location", label: "Location", type: "text" },
  { id: "assignedTo", label: "Assigned To", type: "text" },
  { id: "purchaseDate", label: "Purchase Date", type: "date" },
  { id: "warranty", label: "Warranty Until", type: "date" },
];

const Assets: React.FC = () => {
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [formOpen, setFormOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<any | null>(null);

  // Filter assets based on search, type, and status
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All Types" || asset.type === selectedType;
    const matchesStatus = selectedStatus === "All Statuses" || asset.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddEdit = (asset: any = null) => {
    setCurrentAsset(asset);
    setFormOpen(true);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the asset to your backend
    // For now, we'll just update our local state
    setFormOpen(false);
    // Reset current asset
    setCurrentAsset(null);
  };

  const handleDeleteAsset = (id: string) => {
    // In a real app, you would delete the asset from your backend
    // For now, we'll just update our local state
    setAssets(assets.filter(asset => asset.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">
            Manage your hardware and software assets
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Download size={16} />
            <span>Export</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Upload size={16} />
            <span>Import</span>
          </Button>
          <Button size="sm" className="flex items-center gap-1" onClick={() => handleAddEdit()}>
            <Plus size={16} />
            <span>Add Asset</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[160px]">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <span>{selectedType}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {ASSET_TYPES.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[160px]">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <span>{selectedStatus}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {ASSET_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Assets Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Assigned To</TableHead>
              <TableHead className="hidden lg:table-cell">Purchase Date</TableHead>
              <TableHead className="hidden lg:table-cell">Warranty</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.id}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "status-badge",
                      asset.status === "Active" && "status-active",
                      asset.status === "Maintenance" && "status-maintenance",
                      asset.status === "Decommissioned" && "status-decommissioned"
                    )}>
                      {asset.status}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{asset.location}</TableCell>
                  <TableCell className="hidden md:table-cell">{asset.assignedTo}</TableCell>
                  <TableCell className="hidden lg:table-cell">{asset.purchaseDate}</TableCell>
                  <TableCell className="hidden lg:table-cell">{asset.warranty}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddEdit(asset)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAsset(asset.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No assets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Asset Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentAsset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
            <DialogDescription>
              {currentAsset 
                ? "Update the details of the selected asset." 
                : "Enter the details of the new asset to add it to inventory."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveAsset} className="space-y-4">
            {FORM_FIELDS.map((field) => (
              <div key={field.id} className="grid grid-cols-4 items-center gap-4">
                <label htmlFor={field.id} className="text-right text-sm font-medium">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <Select defaultValue={currentAsset?.[field.id] || ""}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    className="col-span-3"
                    defaultValue={currentAsset?.[field.id] || ""}
                  />
                )}
              </div>
            ))}
            <DialogFooter>
              <Button type="submit">Save Asset</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assets;
