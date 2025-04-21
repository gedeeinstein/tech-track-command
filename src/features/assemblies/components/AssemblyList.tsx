
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Assembly } from "../types";

interface AssemblyListProps {
  assemblies: Assembly[];
  onEdit: (assembly: Assembly) => void;
  onDelete: (id: string) => void;
  onViewDetails: (assembly: Assembly) => void;
}

export const AssemblyList: React.FC<AssemblyListProps> = ({ 
  assemblies, 
  onEdit, 
  onDelete,
  onViewDetails
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
            <th className="p-3 w-[120px]"></th>
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
                    "inline-flex px-2 py-1 rounded-full text-xs",
                    assembly.status === "Active" && "bg-green-100 text-green-800",
                    assembly.status === "Maintenance" && "bg-yellow-100 text-yellow-800",
                    assembly.status === "Decommissioned" && "bg-red-100 text-red-800"
                  )}>
                    {assembly.status}
                  </span>
                </td>
                <td className="p-3 hidden md:table-cell">{assembly.location}</td>
                <td className="p-3 hidden lg:table-cell">{assembly.components.length}</td>
                <td className="p-3 hidden lg:table-cell">{assembly.nextMaintenance}</td>
                <td className="p-3">
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onViewDetails(assembly)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(assembly)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(assembly.id)}
                      title="Delete"
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
