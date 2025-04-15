
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Component } from "@/features/assemblies/types";
import { getComponentIcon } from "../utils/componentIcons";

interface ComponentGridProps {
  components: Component[];
  onEdit: (component: Component) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const ComponentGrid: React.FC<ComponentGridProps> = ({ 
  components, 
  onEdit, 
  onDelete,
  isLoading 
}) => {
  if (components.length === 0 && !isLoading) {
    return (
      <div className="col-span-full text-center py-10">
        <p className="text-muted-foreground">No components found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {components.map((component) => (
        <Card key={component.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="mr-2">{component.name}</CardTitle>
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
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {component.type}
              </span>
              {component.subtype && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 ml-2">
                  {component.subtype}
                </span>
              )}
            </div>
            {component.manufacturer && (
              <CardDescription className="pt-1">{component.manufacturer} {component.model}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-sm">
              <div className="flex items-center mb-2">
                {getComponentIcon(component.type)}
                <span className="font-medium ml-2 truncate">{component.serialNumber ? `SN: ${component.serialNumber}` : "No Serial Number"}</span>
              </div>
              {component.specifications && Object.keys(component.specifications).length > 0 && (
                <div className="space-y-1 mt-3 bg-muted p-2 rounded-md">
                  {Object.entries(component.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="text-xs font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground border-t pt-3">
            <div className="w-full flex justify-between">
              <span>ID: {component.id}</span>
              {component.manufacturer && <span>Mfr: {component.manufacturer}</span>}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ComponentGrid;
