
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle, Edit, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { Task } from "../types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMarkCompleted: (id: string) => void;
  onViewDetails: (task: Task) => void;
  isLoading: boolean;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onMarkCompleted,
  onViewDetails,
  isLoading
}) => {
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
        <h3 className="text-lg font-semibold">No maintenance tasks found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first maintenance task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Priority</TableHead>
            <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
            <TableHead className="hidden lg:table-cell">Target</TableHead>
            <TableHead className="hidden md:table-cell">Scheduled</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell className="hidden md:table-cell">
                <StatusBadge status={task.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <PriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {task.assignedToName || "Unassigned"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {task.asset?.name || task.assembly?.name || "None"}
              </TableCell>
              <TableCell className="hidden md:table-cell">{task.scheduledDate}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onViewDetails(task)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    {task.status !== "Completed" && (
                      <DropdownMenuItem onClick={() => onMarkCompleted(task.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Completed
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(task.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-opacity-10 border-opacity-30",
        status === "Completed" && "bg-green-500 text-green-700 border-green-700",
        status === "In Progress" && "bg-blue-500 text-blue-700 border-blue-700",
        status === "Scheduled" && "bg-amber-500 text-amber-700 border-amber-700",
        status === "Overdue" && "bg-red-500 text-red-700 border-red-700"
      )}
    >
      {status}
    </Badge>
  );
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-opacity-10 border-opacity-30",
        priority === "High" && "bg-red-500 text-red-700 border-red-700",
        priority === "Medium" && "bg-amber-500 text-amber-700 border-amber-700",
        priority === "Low" && "bg-blue-500 text-blue-700 border-blue-700"
      )}
    >
      {priority}
    </Badge>
  );
};

const LoadingState: React.FC = () => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Priority</TableHead>
            <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
            <TableHead className="hidden lg:table-cell">Target</TableHead>
            <TableHead className="hidden md:table-cell">Scheduled</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[60px]" /></TableCell>
              <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTable;
