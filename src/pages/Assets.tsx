
import React, { useState, useEffect } from "react";
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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ArrowDownUp, 
  Search,
  Download,
  Upload,
  Server,
  Cpu,
  HardDrive,
  Monitor,
  Keyboard,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Asset, OPERATING_SYSTEMS, DIVISIONS, COMPONENT_TYPES } from "@/features/assemblies/types";
import { generateInventoryNumber } from "@/features/assets/utils/inventoryGenerator";

// Mock data for assets - updated with new fields
const MOCK_ASSETS: Asset[] = [
  {
    id: "A1001",
    inventoryNumber: "IT-FA/KPTM/LAPTOP/IV/2022/001",
    name: "Dell XPS 15",
    type: "Laptop",
    status: "Active",
    location: "IT Department",
    assignedTo: "John Smith",
    purchaseDate: "2022-05-15",
    warranty: "2025-05-15",
    operatingSystem: "Windows 11 Pro",
    user: "jsmith",
    processor: "CMP001", // Reference to component ID
    motherboard: "CMP002",
    ram: "CMP003",
    storage: "CMP004",
    monitor: "N/A", // Built-in
    peripherals: ["CMP005", "CMP006"],
    expansionCards: [],
    accessories: ["CMP007"],
    division: "IT Department",
    windowsLicense: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    hostname: "LAPTOP-XPS15-JS"
  },
  {
    id: "A1002",
    inventoryNumber: "IT-FA/KPTM/NETWORKING/I/2023/001",
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
    inventoryNumber: "IT-FA/KPTM/PRINTER/XI/2021/001",
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
    inventoryNumber: "IT-FA/KPTM/SERVER/IX/2022/001",
    name: "Dell PowerEdge R740",
    type: "Server",
    status: "Active",
    location: "Server Room",
    assignedTo: "Infrastructure Team",
    purchaseDate: "2022-09-05",
    warranty: "2025-09-05",
    operatingSystem: "Windows Server 2022",
    hostname: "SRV-POWEREDGE-01"
  },
  {
    id: "A1005",
    inventoryNumber: "IT-FA/KPTM/TABLET/III/2023/001",
    name: "Microsoft Surface Pro",
    type: "Tablet",
    status: "Active",
    location: "Sales Department",
    assignedTo: "Emma Johnson",
    purchaseDate: "2023-03-22",
    warranty: "2025-03-22",
    operatingSystem: "Windows 11 Pro",
    user: "ejohnson",
    windowsLicense: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    hostname: "SURFACE-EJ01"
  },
  {
    id: "A1006",
    inventoryNumber: "IT-FA/KPTM/AUDIOVIDEO/VI/2019/001",
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
    inventoryNumber: "IT-FA/KPTM/LAPTOP/XI/2022/002",
    name: "Lenovo ThinkPad X1",
    type: "Laptop",
    status: "Active",
    location: "Marketing Department",
    assignedTo: "Alex Williams",
    purchaseDate: "2022-11-01",
    warranty: "2025-11-01",
    operatingSystem: "Windows 10 Pro",
    user: "awilliams",
    windowsLicense: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    hostname: "THINKPAD-AW01"
  },
  {
    id: "A1008",
    inventoryNumber: "IT-FA/KPTM/NETWORKING/II/2023/001",
    name: "Fortinet Firewall",
    type: "Networking",
    status: "Active",
    location: "Server Room",
    assignedTo: "Network Infrastructure",
    purchaseDate: "2023-02-15",
    warranty: "2026-02-15"
  }
];

// Mock data for components
const MOCK_COMPONENTS = [
  {
    id: "CMP001",
    name: "Intel Core i7-12700K",
    type: "Processor",
    subtype: "Intel",
    serialNumber: "INTL7890123456",
    manufacturer: "Intel",
    model: "Core i7-12700K",
    specifications: {
      cores: "12",
      threads: "20",
      baseFrequency: "3.6 GHz",
      turboFrequency: "5.0 GHz"
    }
  },
  {
    id: "CMP002",
    name: "ASUS ROG Strix Z690-E",
    type: "Motherboard",
    subtype: "ATX",
    serialNumber: "ASB789012345",
    manufacturer: "Asus",
    model: "ROG Strix Z690-E",
    specifications: {
      chipset: "Z690",
      socket: "LGA1700",
      memorySlots: "4"
    }
  },
  {
    id: "CMP003",
    name: "G.Skill Trident Z5 RGB 32GB",
    type: "RAM",
    subtype: "DDR5",
    serialNumber: "GSK4567890123",
    manufacturer: "G.Skill",
    model: "Trident Z5 RGB",
    specifications: {
      capacity: "32GB (2x16GB)",
      speed: "6000MHz",
      timing: "CL36"
    }
  },
  {
    id: "CMP004",
    name: "Samsung 980 Pro 2TB",
    type: "Storage",
    subtype: "NVMe",
    serialNumber: "SAM1234567890",
    manufacturer: "Samsung",
    model: "980 Pro",
    specifications: {
      capacity: "2TB",
      interface: "PCIe 4.0",
      readSpeed: "7000 MB/s",
      writeSpeed: "5100 MB/s"
    }
  },
  {
    id: "CMP005",
    name: "Logitech MX Keys",
    type: "Peripherals",
    subtype: "Keyboard",
    serialNumber: "LOG7890123456",
    manufacturer: "Logitech",
    model: "MX Keys",
    specifications: {
      type: "Wireless",
      backlighting: "Yes",
      connectionType: "Bluetooth/USB Receiver"
    }
  },
  {
    id: "CMP006",
    name: "Logitech MX Master 3",
    type: "Peripherals",
    subtype: "Mouse",
    serialNumber: "LOG6789012345",
    manufacturer: "Logitech",
    model: "MX Master 3",
    specifications: {
      type: "Wireless",
      dpi: "4000",
      connectionType: "Bluetooth/USB Receiver"
    }
  },
  {
    id: "CMP007",
    name: "Noctua NF-A12x25",
    type: "Accessories",
    subtype: "Case Fan",
    serialNumber: "NOC5678901234",
    manufacturer: "Noctua",
    model: "NF-A12x25",
    specifications: {
      size: "120mm",
      rpm: "2000",
      airflow: "60.1 CFM"
    }
  }
];

// Asset types for dropdown - updated with more specific types
const ASSET_TYPES = [
  "All Types",
  "Desktop",
  "Laptop",
  "Server",
  "Tablet",
  "Printer",
  "Networking",
  "Audio/Video",
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

const Assets: React.FC = () => {
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [components, setComponents] = useState(MOCK_COMPONENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [formOpen, setFormOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      type: "Desktop",
      status: "Active",
      location: "",
      assignedTo: "",
      purchaseDate: new Date().toISOString().split('T')[0],
      warranty: "",
      operatingSystem: "",
      user: "",
      processor: "",
      motherboard: "",
      ram: "",
      storage: "",
      monitor: "",
      peripherals: [] as string[],
      expansionCards: [] as string[],
      accessories: [] as string[],
      division: "",
      windowsLicense: "",
      hostname: ""
    }
  });

  // Update form values when currentAsset changes
  useEffect(() => {
    if (currentAsset) {
      form.reset({
        name: currentAsset.name || "",
        type: currentAsset.type || "Desktop",
        status: currentAsset.status || "Active",
        location: currentAsset.location || "",
        assignedTo: currentAsset.assignedTo || "",
        purchaseDate: currentAsset.purchaseDate || new Date().toISOString().split('T')[0],
        warranty: currentAsset.warranty || "",
        operatingSystem: currentAsset.operatingSystem || "",
        user: currentAsset.user || "",
        processor: currentAsset.processor || "",
        motherboard: currentAsset.motherboard || "",
        ram: currentAsset.ram || "",
        storage: currentAsset.storage || "",
        monitor: currentAsset.monitor || "",
        peripherals: currentAsset.peripherals || [],
        expansionCards: currentAsset.expansionCards || [],
        accessories: currentAsset.accessories || [],
        division: currentAsset.division || "",
        windowsLicense: currentAsset.windowsLicense || "",
        hostname: currentAsset.hostname || ""
      });
    } else {
      form.reset({
        name: "",
        type: "Desktop",
        status: "Active",
        location: "",
        assignedTo: "",
        purchaseDate: new Date().toISOString().split('T')[0],
        warranty: "",
        operatingSystem: "",
        user: "",
        processor: "",
        motherboard: "",
        ram: "",
        storage: "",
        monitor: "",
        peripherals: [],
        expansionCards: [],
        accessories: [],
        division: "",
        windowsLicense: "",
        hostname: ""
      });
    }
  }, [currentAsset, form]);

  // Filter assets based on search, type, and status
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (asset.inventoryNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesType = selectedType === "All Types" || asset.type === selectedType;
    const matchesStatus = selectedStatus === "All Statuses" || asset.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddEdit = (asset: Asset | null = null) => {
    setCurrentAsset(asset);
    setFormOpen(true);
  };

  const onSubmit = (data: any) => {
    if (currentAsset) {
      // Update existing asset
      setAssets(assets.map(a => a.id === currentAsset.id ? {
        ...a,
        ...data
      } : a));
    } else {
      // Create new asset
      const newId = `A${Math.floor(1000 + Math.random() * 9000)}`;
      const newAsset: Asset = {
        id: newId,
        inventoryNumber: generateInventoryNumber(data.type, assets.length + 1),
        ...data
      };
      setAssets([...assets, newAsset]);
    }
    setFormOpen(false);
    setCurrentAsset(null);
    form.reset();
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  // Helper function to get component name by id
  const getComponentNameById = (id: string) => {
    const component = components.find(c => c.id === id);
    return component ? component.name : "Not Specified";
  };

  // Filter components by type
  const getComponentsByType = (type: string) => {
    return components.filter(component => component.type === type);
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
              <TableHead className="w-[150px]">Inventory No.</TableHead>
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
                  <TableCell className="font-mono text-xs">{asset.inventoryNumber}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      asset.status === "Active" && "bg-green-100 text-green-800",
                      asset.status === "Maintenance" && "bg-yellow-100 text-yellow-800",
                      asset.status === "Decommissioned" && "bg-gray-100 text-gray-800"
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
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentAsset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
            <DialogDescription>
              {currentAsset 
                ? "Update the details of the selected asset." 
                : "Enter the details of the new asset to add it to inventory."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info Section */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-semibold text-sm border-b pb-1">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter asset name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ASSET_TYPES.filter(type => type !== "All Types").map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ASSET_STATUSES.filter(status => status !== "All Statuses").map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="division"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Division</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select division" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DIVISIONS.map((division) => (
                                <SelectItem key={division} value={division}>{division}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Physical location" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="assignedTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned To</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Person or team" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="purchaseDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="warranty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warranty Until</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* OS and User Section */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-semibold text-sm border-b pb-1">Operating System & User</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="operatingSystem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating System</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select OS" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {OPERATING_SYSTEMS.map((os) => (
                                <SelectItem key={os} value={os}>{os}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="user"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Username" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="windowsLicense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Windows License</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="License key" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hostname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hostname</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Computer name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Hardware Components Section */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-semibold text-sm border-b pb-1">Hardware Components</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="processor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Cpu className="h-4 w-4" />
                              <span>Processor</span>
                            </div>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select processor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getComponentsByType("Processor").map((component) => (
                                <SelectItem key={component.id} value={component.id}>
                                  {component.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="motherboard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Server className="h-4 w-4" />
                              <span>Motherboard</span>
                            </div>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select motherboard" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getComponentsByType("Motherboard").map((component) => (
                                <SelectItem key={component.id} value={component.id}>
                                  {component.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <HardDrive className="h-4 w-4" />
                              <span>RAM</span>
                            </div>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select RAM" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getComponentsByType("RAM").map((component) => (
                                <SelectItem key={component.id} value={component.id}>
                                  {component.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="storage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <HardDrive className="h-4 w-4" />
                              <span>Storage</span>
                            </div>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select storage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getComponentsByType("Storage").map((component) => (
                                <SelectItem key={component.id} value={component.id}>
                                  {component.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="monitor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Monitor className="h-4 w-4" />
                              <span>Monitor</span>
                            </div>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select monitor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getComponentsByType("Monitor").map((component) => (
                                <SelectItem key={component.id} value={component.id}>
                                  {component.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="peripherals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Keyboard className="h-4 w-4" />
                              <span>Peripherals</span>
                            </div>
                          </FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange([...field.value, value])}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Add peripheral" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getComponentsByType("Peripherals").map((component) => (
                                <SelectItem key={component.id} value={component.id}>
                                  {component.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.value && field.value.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {field.value.map((id) => (
                                <div key={id} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                  {getComponentNameById(id)}
                                  <button
                                    type="button"
                                    onClick={() => field.onChange(field.value.filter((v) => v !== id))}
                                    className="ml-1 hover:bg-destructive/10 rounded-full p-1"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">
                  {currentAsset ? "Update Asset" : "Create Asset"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assets;
