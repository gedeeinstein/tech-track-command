
import React from "react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { getComponentIcon } from "../utils/componentIcons";

interface AssemblyGridProps {
  assemblies: Assembly[];
  onEdit: (assembly: Assembly) => void;
  onDelete: (id: string) => void;
}

export const AssemblyGrid: React.FC<AssemblyGridProps> = ({ 
  assemblies, 
  onEdit, 
  onDelete 
}) => {
  if (assemblies.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <p className="text-muted-foreground">No assemblies found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assemblies.map((assembly) => (
        <Card key={assembly.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle>{assembly.name}</CardTitle>
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
            </div>
            <div className="flex items-center mt-1">
              <span className={cn(
                "status-badge",
                assembly.status === "Active" && "status-active",
                assembly.status === "Maintenance" && "status-maintenance",
                assembly.status === "Decommissioned" && "status-decommissioned"
              )}>
                {assembly.status}
              </span>
            </div>
            <CardDescription className="pt-1">{assembly.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-sm">
              <div className="font-medium mb-2">Components ({assembly.components.length})</div>
              <ul className="space-y-2">
                {assembly.components.slice(0, 3).map((component, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {getComponentIcon(component.type)}
                    <span className="truncate">{component.name}</span>
                  </li>
                ))}
                {assembly.components.length > 3 && (
                  <li className="text-muted-foreground text-xs">
                    + {assembly.components.length - 3} more components
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground border-t pt-3">
            <div className="w-full flex justify-between">
              <span>Location: {assembly.location}</span>
              <span>Next Maintenance: {assembly.nextMaintenance}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
