
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Assembly } from "../types";

interface AssemblyListProps {
  assemblies: Assembly[];
  onEdit: (assembly: Assembly) => void;
  onDelete: (id: string) => void;
}

export const AssemblyList: React.FC<AssemblyListProps> = ({ 
  assemblies, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium">Name</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Status</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Location</th>
            <th className="text-left p-3 font-medium hidden lg:table-cell">Components</th>
            <th className="text-left p-3 font-medium hidden lg:table-cell">Next Maintenance</th>
            <th className="p-3 w-[60px]"></th>
          </tr>
        </thead>
        <tbody>
          {assemblies.length > 0 ? (
            assemblies.map((assembly) => (
              <tr key={assembly.id} className="border-b">
                <td className="p-3">
                  <div className="font-medium">{assembly.name}</div>
                  <div className="text-xs text-muted-foreground">{assembly.description}</div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <span className={cn(
                    "status-badge",
                    assembly.status === "Active" && "status-active",
                    assembly.status === "Maintenance" && "status-maintenance",
                    assembly.status === "Decommissioned" && "status-decommissioned"
                  )}>
                    {assembly.status}
                  </span>
                </td>
                <td className="p-3 hidden md:table-cell">{assembly.location}</td>
                <td className="p-3 hidden lg:table-cell">{assembly.components.length}</td>
                <td className="p-3 hidden lg:table-cell">{assembly.nextMaintenance}</td>
                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(assembly)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => onDelete(assembly.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-6">
                No assemblies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
