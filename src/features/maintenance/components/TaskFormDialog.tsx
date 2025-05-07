
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Task, ScannedAsset } from "@/features/maintenance/types";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  currentTask: Task | null;
  scannedAsset: ScannedAsset | null;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const RECURRING_OPTIONS = ["None", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];
const STATUS_OPTIONS = ["Scheduled", "In Progress", "Completed", "Overdue"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  currentTask,
  scannedAsset,
  date,
  setDate,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [assets, setAssets] = useState<{ id: string; name: string }[]>([]);
  const [assemblies, setAssemblies] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set up the form
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "Scheduled",
      priority: "Medium",
      assignedTo: "",
      assetId: "",
      assemblyId: "",
      recurring: "None",
      nextOccurrence: ""
    }
  });

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, name')
          .order('name');

        if (usersError) throw usersError;
        setUsers(usersData || []);

        // Fetch assets
        const { data: assetsData, error: assetsError } = await supabase
          .from('assets')
          .select('id, name')
          .order('name');

        if (assetsError) throw assetsError;
        setAssets(assetsData || []);

        // Fetch assemblies
        const { data: assembliesData, error: assembliesError } = await supabase
          .from('assemblies')
          .select('id, name')
          .order('name');

        if (assembliesError) throw assembliesError;
        setAssemblies(assembliesData || []);

      } catch (error) {
        console.error('Error fetching form data:', error);
        toast({
          title: 'Error loading data',
          description: 'Could not load form options from the database.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, toast]);

  // Reset and populate form when currentTask changes
  useEffect(() => {
    if (currentTask) {
      form.reset({
        title: currentTask.title || "",
        description: currentTask.description || "",
        status: currentTask.status || "Scheduled",
        priority: currentTask.priority || "Medium",
        assignedTo: currentTask.assignedTo || "",
        assetId: currentTask.asset?.id || "",
        assemblyId: currentTask.assembly?.id || "",
        recurring: currentTask.recurring || "None",
        nextOccurrence: currentTask.nextOccurrence || ""
      });
    } else {
      form.reset({
        title: "",
        description: "",
        status: "Scheduled",
        priority: "Medium",
        assignedTo: "",
        assetId: scannedAsset?.assetId || "",
        assemblyId: "",
        recurring: "None",
        nextOccurrence: ""
      });
    }
  }, [currentTask, form, scannedAsset]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Format dates and prepare data for submission
      const formattedData = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigned_to: data.assignedTo,
        asset_id: data.assetId || null,
        assembly_id: data.assemblyId || null,
        scheduled_date: date ? format(date, "yyyy-MM-dd") : null,
        recurring: data.recurring,
        next_occurrence: data.nextOccurrence || null,
        completed_date: data.status === "Completed" ? new Date().toISOString().split('T')[0] : null
      };

      onSave(formattedData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Submission failed',
        description: 'There was an error saving the task.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading form data...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{currentTask?.id ? "Edit Maintenance Task" : "Create Maintenance Task"}</DialogTitle>
          <DialogDescription>
            {scannedAsset 
              ? `Creating maintenance task for asset with ID: ${scannedAsset.inventoryNumber}`
              : currentTask?.id 
                ? "Update the details of the selected maintenance task." 
                : "Schedule a new maintenance task for an asset or assembly."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter task title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the maintenance task" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {STATUS_OPTIONS.map(status => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PRIORITY_OPTIONS.map(priority => (
                                <SelectItem key={priority} value={priority}>
                                  {priority}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users.map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="assetId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset (Optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!!scannedAsset}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select asset" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {/* Fix here: Use "none" instead of empty string */}
                              <SelectItem value="none">None</SelectItem>
                              {assets.map(asset => (
                                <SelectItem key={asset.id} value={asset.id}>
                                  {asset.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {scannedAsset && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Asset selected from QR code scan
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="assemblyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assembly (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select assembly" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {/* Fix here: Use "none" instead of empty string */}
                              <SelectItem value="none">None</SelectItem>
                              {assemblies.map(assembly => (
                                <SelectItem key={assembly.id} value={assembly.id}>
                                  {assembly.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="scheduling" className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Scheduled Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recurring"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recurring</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {RECURRING_OPTIONS.map(option => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("recurring") !== "None" && (
                      <FormField
                        control={form.control}
                        name="nextOccurrence"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Next Occurrence</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentTask?.id ? "Update Task" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
