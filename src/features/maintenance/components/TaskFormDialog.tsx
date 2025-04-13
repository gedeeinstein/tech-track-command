
import React, { useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Asset {
  id: string;
  name: string;
}

interface Assembly {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

interface ScannedAsset {
  assetId: string;
  inventoryNumber: string;
}

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (e: React.FormEvent) => void;
  currentTask: any;
  scannedAsset: ScannedAsset | null;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  users: User[];
  assets: Asset[];
  assemblies: Assembly[];
}

const RECURRING_OPTIONS = ["None", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  currentTask,
  scannedAsset,
  date,
  setDate,
  users,
  assets,
  assemblies
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{currentTask ? (currentTask.id ? "Edit Maintenance Task" : "Create Maintenance Task") : "Create New Maintenance Task"}</DialogTitle>
          <DialogDescription>
            {scannedAsset 
              ? `Creating maintenance task for asset with ID: ${scannedAsset.inventoryNumber}`
              : currentTask?.id 
                ? "Update the details of the selected maintenance task." 
                : "Schedule a new maintenance task for an asset or assembly."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSave}>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input 
                    id="title" 
                    defaultValue={currentTask?.title || ""} 
                    placeholder="Enter task title" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    defaultValue={currentTask?.description || ""} 
                    placeholder="Describe the maintenance task" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select 
                      id="status" 
                      defaultValue={currentTask?.status || "Scheduled"} 
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select 
                      id="priority" 
                      defaultValue={currentTask?.priority || "Medium"} 
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <select 
                    id="assignedTo" 
                    defaultValue={currentTask?.assignedTo || ""} 
                    className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="" disabled>Select a user</option>
                    {users.map(user => (
                      <option key={user.id} value={user.name}>{user.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="asset">Asset (Optional)</Label>
                    <select 
                      id="asset" 
                      defaultValue={currentTask?.asset?.id || scannedAsset?.assetId || ""} 
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                      disabled={!!scannedAsset}
                    >
                      <option value="">None</option>
                      {assets.map(asset => (
                        <option key={asset.id} value={asset.id}>{asset.name}</option>
                      ))}
                    </select>
                    {scannedAsset && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Asset selected from QR code scan
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assembly">Assembly (Optional)</Label>
                    <select 
                      id="assembly" 
                      defaultValue={currentTask?.assembly?.id || ""} 
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="">None</option>
                      {assemblies.map(assembly => (
                        <option key={assembly.id} value={assembly.id}>{assembly.name}</option>
                      ))}
                    </select>
                  </div>
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
                {currentTask?.status === "Completed" && (
                  <div className="grid gap-2">
                    <Label htmlFor="completedDate">Completion Date</Label>
                    <Input 
                      id="completedDate" 
                      type="date" 
                      defaultValue={currentTask?.completedDate || ""} 
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="recurring">Recurring</Label>
                    <select 
                      id="recurring" 
                      defaultValue={currentTask?.recurring || "None"} 
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    >
                      {RECURRING_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  {currentTask?.recurring !== "None" && (
                    <div className="grid gap-2">
                      <Label htmlFor="nextOccurrence">Next Occurrence</Label>
                      <Input 
                        id="nextOccurrence" 
                        type="date" 
                        defaultValue={currentTask?.nextOccurrence || ""} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6">
            <Button type="submit">
              {currentTask?.id ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
