
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  RotateCcw, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Laptop,
  Layers,
  User,
  Loader2
} from "lucide-react";
import { Task } from "../types";
import { cn } from "@/lib/utils";
import { markTaskCompleted } from "@/services/maintenanceTaskService";

interface TaskDetailsProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMarkCompleted: (id: string) => void;
  refreshTasks?: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onMarkCompleted,
  refreshTasks
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  if (!task) return null;

  const handleEdit = () => {
    onEdit(task);
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
    onOpenChange(false);
  };

  const handleMarkCompleted = async () => {
    setIsLoading(true);
    try {
      await markTaskCompleted(task.id);
      onMarkCompleted(task.id);
      
      // Refresh the tasks if a refresh function is provided
      if (refreshTasks) {
        refreshTasks();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Status and Priority */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              task.status === "Completed" && "bg-green-100 text-green-800",
              task.status === "In Progress" && "bg-blue-100 text-blue-800",
              task.status === "Scheduled" && "bg-amber-100 text-amber-800",
              task.status === "Overdue" && "bg-red-100 text-red-800"
            )}>
              {task.status}
            </span>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              task.priority === "High" && "bg-red-100 text-red-800",
              task.priority === "Medium" && "bg-amber-100 text-amber-800",
              task.priority === "Low" && "bg-blue-100 text-blue-800"
            )}>
              {task.priority} Priority
            </span>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </CardContent>
          </Card>

          {/* Task Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignment */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Assigned To</h3>
                </div>
                <p className="text-sm">{task.assignedToName || task.assignedTo || "Unassigned"}</p>
              </CardContent>
            </Card>

            {/* Target (Asset/Assembly) */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  {task.asset ? (
                    <Laptop className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  )}
                  <h3 className="text-sm font-medium">
                    {task.asset ? "Asset" : task.assembly ? "Assembly" : "No Target"}
                  </h3>
                </div>
                {task.asset && (
                  <p className="text-sm">{task.asset.name}</p>
                )}
                {task.assembly && (
                  <p className="text-sm">{task.assembly.name}</p>
                )}
                {!task.asset && !task.assembly && (
                  <p className="text-sm text-muted-foreground">No asset or assembly assigned</p>
                )}
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Schedule</h3>
                </div>
                <p className="text-sm">Scheduled: {task.scheduledDate}</p>
                {task.completedDate && (
                  <p className="text-sm text-green-600">Completed: {task.completedDate}</p>
                )}
              </CardContent>
            </Card>

            {/* Recurrence */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <RotateCcw className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Recurrence</h3>
                </div>
                {task.recurring !== "None" ? (
                  <>
                    <p className="text-sm">{task.recurring}</p>
                    {task.nextOccurrence && (
                      <p className="text-sm text-muted-foreground">Next: {task.nextOccurrence}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">One-time task</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Status timeline - could be expanded in the future */}
          {task.status === "Overdue" && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-md">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm">This task is overdue and requires attention.</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-wrap gap-2">
          {task.status !== "Completed" && (
            <Button 
              variant="outline" 
              className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
              onClick={handleMarkCompleted}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Mark Completed
            </Button>
          )}
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={handleEdit}
            disabled={isLoading}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetails;
