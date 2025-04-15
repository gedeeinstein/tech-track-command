
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Component } from "@/features/assemblies/types";

interface ComponentListProps {
  components: Component[];
  onEdit: (component: Component) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const ComponentList: React.FC<ComponentListProps> = ({ 
  components, 
  onEdit, 
  onDelete,
  isLoading
}) => {
  if (components.length === 0 && !isLoading) {
    return (
      <tr>
        <td colSpan={6} className="text-center p-6">
          No components found.
        </td>
      </tr>
    );
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium">Name</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Type</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Subtype</th>
            <th className="text-left p-3 font-medium hidden lg:table-cell">Manufacturer</th>
            <th className="text-left p-3 font-medium hidden lg:table-cell">Serial Number</th>
            <th className="p-3 w-[60px]"></th>
          </tr>
        </thead>
        <tbody>
          {components.map((component) => (
            <tr key={component.id} className="border-b">
              <td className="p-3">
                <div className="font-medium">{component.name}</div>
                <div className="text-xs text-muted-foreground">{component.model}</div>
              </td>
              <td className="p-3 hidden md:table-cell">{component.type}</td>
              <td className="p-3 hidden md:table-cell">{component.subtype || "-"}</td>
              <td className="p-3 hidden lg:table-cell">{component.manufacturer || "-"}</td>
              <td className="p-3 hidden lg:table-cell">{component.serialNumber || "-"}</td>
              <td className="p-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(component)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => onDelete(component.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComponentList;
