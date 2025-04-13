
import React from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Asset } from "@/features/assemblies/types";
import AssetQRCode from "@/features/assets/components/AssetQRCode";

interface AssetTableProps {
  assets: Asset[];
  handleAddEdit: (asset: Asset | null) => void;
  handleDeleteAsset: (id: string) => void;
}

const AssetTable: React.FC<AssetTableProps> = ({ 
  assets, 
  handleAddEdit, 
  handleDeleteAsset 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Inventory No.</TableHead>
            <TableHead>Asset Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden md:table-cell">Assigned To</TableHead>
            <TableHead className="hidden lg:table-cell">Purchase Date</TableHead>
            <TableHead className="hidden lg:table-cell">Warranty</TableHead>
            <TableHead className="w-[90px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.length > 0 ? (
            assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-mono text-xs">{asset.inventoryNumber}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    asset.status === "Active" && "bg-green-100 text-green-800",
                    asset.status === "Maintenance" && "bg-yellow-100 text-yellow-800",
                    asset.status === "Decommissioned" && "bg-gray-100 text-gray-800"
                  )}>
                    {asset.status}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">{asset.location}</TableCell>
                <TableCell className="hidden md:table-cell">{asset.assignedTo}</TableCell>
                <TableCell className="hidden lg:table-cell">{asset.purchaseDate}</TableCell>
                <TableCell className="hidden lg:table-cell">{asset.warranty}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <AssetQRCode 
                      inventoryNumber={asset.inventoryNumber || ""}
                      assetId={asset.id}
                      assetName={asset.name}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddEdit(asset)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAsset(asset.id)}>
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
              <TableCell colSpan={9} className="h-24 text-center">
                No assets found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssetTable;
