import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Download,
  FileDown,
  FileText,
  Calendar,
  Filter,
  RefreshCw,
  Loader2,
  FileType
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReportData } from "@/features/reports/hooks/useReportData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  exportToPDF,
  exportToCSV,
  prepareAssetStatusData,
  prepareAssetTypeData,
  prepareMaintenanceData,
  prepareAssemblyComponentData,
  prepareWarrantyData,
  prepareInventoryData
} from "@/utils/exportUtils";
import { toast } from "sonner";

// Colors for charts
const STATUS_COLORS = ["#10B981", "#F59E0B", "#EF4444"];
const TYPE_COLORS = ["#3B82F6", "#10B981", "#6366F1", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6"];

// Reports list
const REPORT_TYPES = [
  { id: "asset-status", name: "Asset Status Distribution", icon: <PieChartIcon className="h-5 w-5" /> },
  { id: "asset-type", name: "Assets by Type", icon: <PieChartIcon className="h-5 w-5" /> },
  { id: "maintenance", name: "Maintenance Completion", icon: <BarChartIcon className="h-5 w-5" /> },
  { id: "assemblies", name: "Assembly Components", icon: <BarChartIcon className="h-5 w-5" /> },
  { id: "warranty", name: "Warranty Expiration", icon: <Calendar className="h-5 w-5" /> },
  { id: "inventory", name: "Full Inventory List", icon: <FileText className="h-5 w-5" /> }
];

// Time ranges
const TIME_RANGES = ["Last 30 Days", "Last Quarter", "Last 6 Months", "Year to Date", "All Time"];

const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = useState("asset-status");
  const [timeRange, setTimeRange] = useState("Last 6 Months");
  
  const { 
    isLoading, 
    error, 
    assetStatusData, 
    assetTypeData, 
    maintenanceData, 
    assemblyData,
    warrantyData,
    inventoryData,
    refreshData 
  } = useReportData(activeReport, timeRange);

  const handleRefreshData = () => {
    refreshData();
  };

  const handleExportPDF = () => {
    try {
      let title = "";
      let headers: string[] = [];
      let rows: any[] = [];
      let filename = "";

      switch (activeReport) {
        case "asset-status":
          title = "Asset Status Distribution";
          const statusData = prepareAssetStatusData(assetStatusData);
          headers = statusData.headers;
          rows = statusData.rows;
          filename = "asset-status-report";
          break;
        
        case "asset-type":
          title = "Assets by Type";
          const typeData = prepareAssetTypeData(assetTypeData);
          headers = typeData.headers;
          rows = typeData.rows;
          filename = "asset-type-report";
          break;
          
        case "maintenance":
          title = "Maintenance Completion";
          const maintData = prepareMaintenanceData(maintenanceData);
          headers = maintData.headers;
          rows = maintData.rows;
          filename = "maintenance-report";
          break;
          
        case "assemblies":
          title = "Assembly Component Count";
          const assemblyDataForExport = prepareAssemblyComponentData(assemblyData);
          headers = assemblyDataForExport.headers;
          rows = assemblyDataForExport.rows;
          filename = "assembly-report";
          break;
          
        case "warranty":
          title = "Warranty Expiration Report";
          const warrantyDataForExport = prepareWarrantyData(warrantyData);
          headers = warrantyDataForExport.headers;
          rows = warrantyDataForExport.rows;
          filename = "warranty-report";
          break;
          
        case "inventory":
          title = "Full Inventory List";
          const inventoryDataForExport = prepareInventoryData(inventoryData);
          headers = inventoryDataForExport.headers;
          rows = inventoryDataForExport.rows;
          filename = "inventory-report";
          break;
      }

      exportToPDF(title, headers, rows, filename);
      toast.success(`PDF report exported successfully`);
    } catch (err) {
      console.error("Error exporting PDF:", err);
      toast.error("Failed to export PDF report");
    }
  };

  const handleExportCSV = () => {
    try {
      let headers: string[] = [];
      let rows: any[] = [];
      let filename = "";

      switch (activeReport) {
        case "asset-status":
          const statusData = prepareAssetStatusData(assetStatusData);
          headers = statusData.headers;
          rows = statusData.rows;
          filename = "asset-status-report";
          break;
        
        case "asset-type":
          const typeData = prepareAssetTypeData(assetTypeData);
          headers = typeData.headers;
          rows = typeData.rows;
          filename = "asset-type-report";
          break;
          
        case "maintenance":
          const maintData = prepareMaintenanceData(maintenanceData);
          headers = maintData.headers;
          rows = maintData.rows;
          filename = "maintenance-report";
          break;
          
        case "assemblies":
          const assemblyDataForExport = prepareAssemblyComponentData(assemblyData);
          headers = assemblyDataForExport.headers;
          rows = assemblyDataForExport.rows;
          filename = "assembly-report";
          break;
          
        case "warranty":
          const warrantyDataForExport = prepareWarrantyData(warrantyData);
          headers = warrantyDataForExport.headers;
          rows = warrantyDataForExport.rows;
          filename = "warranty-report";
          break;
          
        case "inventory":
          const inventoryDataForExport = prepareInventoryData(inventoryData);
          headers = inventoryDataForExport.headers;
          rows = inventoryDataForExport.rows;
          filename = "inventory-report";
          break;
      }

      exportToCSV(headers, rows, filename);
      toast.success(`CSV report exported successfully`);
    } catch (err) {
      console.error("Error exporting CSV:", err);
      toast.error("Failed to export CSV report");
    }
  };
  
  const renderActiveReport = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState message={error} onRetry={refreshData} />;
    }
    
    switch (activeReport) {
      case "asset-status":
        return (
          <Card className="col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Asset Status Distribution</CardTitle>
                  <CardDescription>Overview of assets by their current status</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleExportPDF}
                  >
                    <FileType className="h-4 w-4" />
                    <span>PDF</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleExportCSV}
                  >
                    <FileDown className="h-4 w-4" />
                    <span>CSV</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {assetStatusData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {assetStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} units`, "Count"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState message="No asset status data available" />
              )}
            </CardContent>
          </Card>
        );
      
      case "asset-type":
        return (
          <Card className="col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Assets by Type</CardTitle>
                  <CardDescription>Distribution of assets across different categories</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleExportPDF}
                  >
                    <FileType className="h-4 w-4" />
                    <span>PDF</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleExportCSV}
                  >
                    <FileDown className="h-4 w-4" />
                    <span>CSV</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {assetTypeData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {assetTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} units`, "Count"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState message="No asset type data available" />
              )}
            </CardContent>
          </Card>
        );
      
      case "maintenance":
        return (
          <Card className="col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Maintenance Completion Rate</CardTitle>
                  <CardDescription>Scheduled vs completed maintenance tasks</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleExportPDF}
                  >
                    <FileType className="h-4 w-4" />
                    <span>PDF</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleExportCSV}
                  >
                    <FileDown className="h-4 w-4" />
                    <span>CSV</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {maintenanceData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={maintenanceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="scheduled" name="Scheduled Tasks" fill="#94A3B8" />
                      <Bar dataKey="completed" name="Completed Tasks" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState message="No maintenance data available" />
              )}
            </CardContent>
          </Card>
        );
      
      case "assemblies":
        return (
          <Card className="col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Assembly Component Count</CardTitle>
                  <CardDescription>Number of components in each assembly</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleExportPDF}
                  >
                    <FileType className="h-4 w-4" />
                    <span>PDF</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleExportCSV}
                  >
                    <FileDown className="h-4 w-4" />
                    <span>CSV</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {assemblyData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={assemblyData}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 120,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="components" name="Component Count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState message="No assembly data available" />
              )}
            </CardContent>
          </Card>
        );
      
      case "warranty":
      case "inventory":
        const isWarranty = activeReport === "warranty";
        const listData = isWarranty ? warrantyData : inventoryData;
        
        return (
          <Card className="col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {isWarranty ? "Warranty Expiration Report" : "Full Inventory List"}
                  </CardTitle>
                  <CardDescription>
                    {isWarranty 
                      ? "Assets with upcoming warranty expirations" 
                      : "Complete list of all assets in inventory"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleExportPDF}
                  >
                    <FileType className="h-4 w-4" />
                    <span>PDF</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleExportCSV}
                  >
                    <FileDown className="h-4 w-4" />
                    <span>CSV</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {listData.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">ID</th>
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Type</th>
                        {isWarranty ? (
                          <>
                            <th className="text-left p-3 font-medium">Purchase Date</th>
                            <th className="text-left p-3 font-medium">Warranty Until</th>
                            <th className="text-left p-3 font-medium">Status</th>
                          </>
                        ) : (
                          <>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th className="text-left p-3 font-medium">Location</th>
                            <th className="text-left p-3 font-medium">Assigned To</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {isWarranty ? (
                        warrantyData.slice(0, 3).map(item => (
                          <tr key={item.id} className="border-b">
                            <td className="p-3">{item.id}</td>
                            <td className="p-3">{item.name}</td>
                            <td className="p-3">{item.type}</td>
                            <td className="p-3">{item.purchaseDate}</td>
                            <td className="p-3">{item.warrantyUntil}</td>
                            <td className="p-3">
                              <span className={`status-badge status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        inventoryData.slice(0, 3).map(item => (
                          <tr key={item.id} className="border-b">
                            <td className="p-3">{item.id}</td>
                            <td className="p-3">{item.name}</td>
                            <td className="p-3">{item.type}</td>
                            <td className="p-3">
                              <span className={`status-badge status-${item.status.toLowerCase()}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="p-3">{item.location}</td>
                            <td className="p-3">{item.assignedTo}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                    Showing {listData.length > 3 ? '3' : listData.length} of {listData.length} items. Export the full report for complete data.
                  </div>
                </div>
              ) : (
                <EmptyState message={`No ${isWarranty ? "warranty" : "inventory"} data available`} />
              )}
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and export reports about your IT inventory
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Report Selection Sidebar */}
        <div className="w-full lg:w-64 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Report Types</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 px-1">
                {REPORT_TYPES.map((report) => (
                  <button
                    key={report.id}
                    className={cn(
                      "flex items-center gap-2 w-full p-2 text-sm rounded-md hover:bg-secondary transition-colors text-left",
                      activeReport === report.id && "bg-secondary"
                    )}
                    onClick={() => setActiveReport(report.id)}
                  >
                    <span className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-md",
                      activeReport === report.id ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      {report.icon}
                    </span>
                    <span>{report.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Report Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="time-range">Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger id="time-range" className="w-full">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select time range" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_RANGES.map((range) => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="additional-filters">Additional Filters</Label>
                <Button id="additional-filters" variant="outline" className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span>Configure Filters</span>
                  </div>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    0
                  </span>
                </Button>
              </div>
              
              <Button 
                variant="default" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleRefreshData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span>Generate Report</span>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Report Display Area */}
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4">
            {renderActiveReport()}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <Card className="col-span-3">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60 mt-1" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-80 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading report data...</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <Card className="col-span-3">
    <CardContent className="h-80 flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">Failed to load report</p>
        <p className="text-muted-foreground mb-4">{message}</p>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="h-80 flex items-center justify-center">
    <div className="flex flex-col items-center text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-lg font-medium mb-2">No data available</p>
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
);

export default Reports;
