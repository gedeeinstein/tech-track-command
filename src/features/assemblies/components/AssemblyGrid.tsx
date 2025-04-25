
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Assembly } from "../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AssemblyGridProps {
  assemblies: Assembly[];
  onEdit: (assembly: Assembly) => void;
  onDelete: (id: string) => void;
  onViewDetails: (assembly: Assembly) => void;
}

export const AssemblyGrid: React.FC<AssemblyGridProps> = ({
  assemblies,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assemblies.length > 0 ? (
        assemblies.map((assembly) => (
          <Card key={assembly.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{assembly.name}</CardTitle>
                <Badge
                  variant={
                    assembly.status === "Active"
                      ? "default"
                      : assembly.status === "Maintenance"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {assembly.status}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {assembly.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="font-medium">Location</div>
                  <div>{assembly.location}</div>
                </div>
                <div>
                  <div className="font-medium">Components</div>
                  <div>{assembly.components.length} items</div>
                </div>
                <div>
                  <div className="font-medium">Last Maintenance</div>
                  <div>{assembly.lastMaintenance}</div>
                </div>
                <div>
                  <div className="font-medium">Next Maintenance</div>
                  <div>{assembly.nextMaintenance}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center"
                      onClick={() => onViewDetails(assembly)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Details</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center"
                      onClick={() => onEdit(assembly)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-center" onClick={() => onDelete(assembly.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center p-8 bg-muted rounded-lg text-muted-foreground">
          No assemblies found.
        </div>
      )}
    </div>
  );
};
