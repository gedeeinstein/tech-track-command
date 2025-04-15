
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
  Button 
} from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  CheckCircle2, 
  Edit, 
  MoreHorizontal, 
  RotateCcw, 
  Trash2,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import TaskDetails from "./TaskDetails";
import { Task } from "../types";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMarkCompleted: (id: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onMarkCompleted
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailsOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Task</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Assigned To</TableHead>
              <TableHead className="hidden lg:table-cell">Target</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead className="hidden lg:table-cell">Recurring</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TableRow 
                  key={task.id} 
                  className="cursor-pointer hover:bg-muted/60"
                  onClick={() => handleViewDetails(task)}
                >
                  <TableCell>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{task.description}</div>
                    <div className="md:hidden text-xs mt-1">
                      <span className={cn(
                        "status-badge inline-block mr-2",
                        task.status === "Completed" && "status-active",
                        task.status === "In Progress" && "status-info",
                        task.status === "Scheduled" && "status-maintenance",
                        task.status === "Overdue" && "status-decommissioned"
                      )}>
                        {task.status}
                      </span>
                      <span className={cn(
                        "status-badge inline-block",
                        task.priority === "High" && "status-decommissioned",
                        task.priority === "Medium" && "status-maintenance",
                        task.priority === "Low" && "status-info"
                      )}>
                        {task.priority} Priority
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "status-badge",
                        task.status === "Completed" && "status-active",
                        task.status === "In Progress" && "status-info",
                        task.status === "Scheduled" && "status-maintenance",
                        task.status === "Overdue" && "status-decommissioned"
                      )}>
                        {task.status}
                      </span>
                      <span className={cn(
                        "status-badge",
                        task.priority === "High" && "status-decommissioned",
                        task.priority === "Medium" && "status-maintenance",
                        task.priority === "Low" && "status-info"
                      )}>
                        {task.priority}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {task.assignedTo}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {task.asset && (
                      <div className="text-sm">Asset: {task.asset.name}</div>
                    )}
                    {task.assembly && (
                      <div className="text-sm">Assembly: {task.assembly.name}</div>
                    )}
                    {!task.asset && !task.assembly && (
                      <div className="text-sm text-muted-foreground">None</div>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {task.scheduledDate && (
                      <div className="text-sm">{task.scheduledDate}</div>
                    )}
                    {task.completedDate && (
                      <div className="text-xs text-muted-foreground">
                        Completed: {task.completedDate}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {task.recurring !== "None" ? (
                      <div>
                        <div className="text-sm">{task.recurring}</div>
                        {task.nextOccurrence && (
                          <div className="text-xs text-muted-foreground">
                            Next: {task.nextOccurrence}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">One-time</span>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end">
                      {task.status !== "Completed" && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkCompleted(task.id);
                          }} 
                          title="Mark as completed"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(task);
                        }}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(task);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {task.recurring !== "None" && task.status === "Completed" && (
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Reset for Next
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(task.id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TaskDetails
        task={selectedTask}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onEdit={onEdit}
        onDelete={onDelete}
        onMarkCompleted={onMarkCompleted}
      />
    </>
  );
};

export default TaskTable;
