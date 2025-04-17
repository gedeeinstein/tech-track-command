import React, { useEffect } from "react";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { 
  Form, FormField, FormItem, FormLabel, FormControl
} from "@/components/ui/form";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Cpu, HardDrive, Keyboard, Monitor, Server, Users
} from "lucide-react";
import { Asset } from "@/features/assemblies/types";
import { useForm } from "react-hook-form";
import { OPERATING_SYSTEMS, DIVISIONS } from "@/features/assemblies/types";
import { generateInventoryNumber } from "@/features/assets/utils/inventoryGenerator";

interface ComponentType {
  id: string;
  name: string;
  type: string;
}

interface AssetFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentAsset: Asset | null;
  assets: Asset[];
  onSubmit: (data: any) => void;
  components: ComponentType[];
}

const ASSET_TYPES = [
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

const ASSET_STATUSES = [
  "Active",
  "Maintenance",
  "Decommissioned"
];

const AssetForm: React.FC<AssetFormProps> = ({
  open,
  setOpen,
  currentAsset,
  assets,
  onSubmit,
  components
}) => {
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

  const getComponentsByType = (type: string) => {
    return components.filter(component => 
      component.type.toLowerCase() === type.toLowerCase()
    );
  };

  const getComponentNameById = (id: string) => {
    const component = components.find(c => c.id === id);
    return component ? component.name : "Not Specified";
  };

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  console.log("Available components:", components);
  console.log("Processors:", getComponentsByType("Processor"));
  console.log("RAM:", getComponentsByType("RAM"));
  console.log("Storage:", getComponentsByType("Storage"));
  console.log("Motherboards:", getComponentsByType("Motherboard"));
  console.log("Monitors:", getComponentsByType("Monitor"));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
                        {ASSET_TYPES.map((type) => (
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
                        {ASSET_STATUSES.map((status) => (
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
                        {getComponentsByType("Processor").length > 0 ? (
                          getComponentsByType("Processor").map((component) => (
                            <SelectItem key={component.id} value={component.id}>
                              {component.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No processors available</SelectItem>
                        )}
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
                        {getComponentsByType("Motherboard").length > 0 ? (
                          getComponentsByType("Motherboard").map((component) => (
                            <SelectItem key={component.id} value={component.id}>
                              {component.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No motherboards available</SelectItem>
                        )}
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
                        {getComponentsByType("RAM").length > 0 ? (
                          getComponentsByType("RAM").map((component) => (
                            <SelectItem key={component.id} value={component.id}>
                              {component.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No RAM modules available</SelectItem>
                        )}
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
                        {getComponentsByType("Storage").length > 0 ? (
                          getComponentsByType("Storage").map((component) => (
                            <SelectItem key={component.id} value={component.id}>
                              {component.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No storage devices available</SelectItem>
                        )}
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
                        {getComponentsByType("Monitor").length > 0 ? (
                          getComponentsByType("Monitor").map((component) => (
                            <SelectItem key={component.id} value={component.id}>
                              {component.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No monitors available</SelectItem>
                        )}
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
            
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
              >
                {currentAsset ? "Update Asset" : "Add Asset"}
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AssetForm;
