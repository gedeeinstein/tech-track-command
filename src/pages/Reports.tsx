
import React, { useState } from "react";
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
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for charts
const MOCK_ASSET_STATUS_DATA = [
  { name: "Active", value: 90 },
  { name: "Maintenance", value: 15 },
  { name: "Decommissioned", value: 20 }
];

const MOCK_ASSET_TYPE_DATA = [
  { name: "Laptops", value: 42 },
  { name: "Desktops", value: 28 },
  { name: "Servers", value: 15 },
  { name: "Networking", value: 22 },
  { name: "Printers", value: 13 },
  { name: "Mobile", value: 8 },
  { name: "Other", value: 7 }
];

const MOCK_MAINTENANCE_COMPLETION_DATA = [
  { month: "Jan", completed: 12, scheduled: 15 },
  { month: "Feb", completed: 19, scheduled: 20 },
  { month: "Mar", completed: 15, scheduled: 18 },
  { month: "Apr", completed: 10, scheduled: 16 }
];

const MOCK_ASSEMBLY_COMPONENT_DATA = [
  { name: "Server Rack #1", components: 8 },
  { name: "Finance Workstations", components: 5 },
  { name: "Conference Room A", components: 4 },
  { name: "Developer Workstations", components: 6 },
  { name: "Network Core", components: 7 }
];

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
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  const renderActiveReport = () => {
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
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_ASSET_STATUS_DATA}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {MOCK_ASSET_STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} units`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
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
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_ASSET_TYPE_DATA}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {MOCK_ASSET_TYPE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} units`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
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
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MOCK_MAINTENANCE_COMPLETION_DATA}
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
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MOCK_ASSEMBLY_COMPONENT_DATA}
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
            </CardContent>
          </Card>
        );
      
      case "warranty":
      case "inventory":
        return (
          <Card className="col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {activeReport === "warranty" ? "Warranty Expiration Report" : "Full Inventory List"}
                  </CardTitle>
                  <CardDescription>
                    {activeReport === "warranty" 
                      ? "Assets with upcoming warranty expirations" 
                      : "Complete list of all assets in inventory"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <FileDown className="h-4 w-4" />
                    <span>CSV</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>PDF</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">ID</th>
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      {activeReport === "warranty" ? (
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
                    {activeReport === "warranty" ? (
                      <>
                        <tr className="border-b">
                          <td className="p-3">A1004</td>
                          <td className="p-3">Dell PowerEdge R740</td>
                          <td className="p-3">Server</td>
                          <td className="p-3">2022-09-05</td>
                          <td className="p-3">2025-09-05</td>
                          <td className="p-3">
                            <span className="status-badge status-active">Valid</span>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">A1003</td>
                          <td className="p-3">HP LaserJet Pro</td>
                          <td className="p-3">Printer</td>
                          <td className="p-3">2021-11-20</td>
                          <td className="p-3">2024-11-20</td>
                          <td className="p-3">
                            <span className="status-badge status-maintenance">Expiring Soon</span>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">A1006</td>
                          <td className="p-3">Polycom Conference System</td>
                          <td className="p-3">Audio/Video</td>
                          <td className="p-3">2019-06-18</td>
                          <td className="p-3">2022-06-18</td>
                          <td className="p-3">
                            <span className="status-badge status-decommissioned">Expired</span>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr className="border-b">
                          <td className="p-3">A1001</td>
                          <td className="p-3">Dell XPS 15</td>
                          <td className="p-3">Laptop</td>
                          <td className="p-3">
                            <span className="status-badge status-active">Active</span>
                          </td>
                          <td className="p-3">IT Department</td>
                          <td className="p-3">John Smith</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">A1002</td>
                          <td className="p-3">Cisco Switch 24-Port</td>
                          <td className="p-3">Networking</td>
                          <td className="p-3">
                            <span className="status-badge status-active">Active</span>
                          </td>
                          <td className="p-3">Server Room</td>
                          <td className="p-3">Network Infrastructure</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">A1003</td>
                          <td className="p-3">HP LaserJet Pro</td>
                          <td className="p-3">Printer</td>
                          <td className="p-3">
                            <span className="status-badge status-maintenance">Maintenance</span>
                          </td>
                          <td className="p-3">Finance Department</td>
                          <td className="p-3">Finance Team</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  Showing 3 of 120+ items. Export the full report for complete data.
                </div>
              </div>
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
                <Select defaultValue={timeRange} onValueChange={setTimeRange}>
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
              
              <Button variant="default" className="w-full flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4" />
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

export default Reports;
