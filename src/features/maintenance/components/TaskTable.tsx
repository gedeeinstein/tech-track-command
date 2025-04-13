
import React from "react";
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
  Trash2 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  asset: { id: string; name: string } | null;
  assembly: { id: string; name: string } | null;
  scheduledDate: string;
  completedDate: string | null;
  recurring: string;
  nextOccurrence: string | null;
}

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
  return (
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
              <TableRow key={task.id}>
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
                <TableCell>
                  <div className="flex justify-end">
                    {task.status !== "Completed" && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onMarkCompleted(task.id)} 
                        title="Mark as completed"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {task.recurring !== "None" && task.status === "Completed" && (
                          <DropdownMenuItem>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset for Next
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(task.id)}>
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
  );
};

export default TaskTable;
