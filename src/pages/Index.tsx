
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Monitor, 
  ServerStack, 
  CalendarClock, 
  AlertTriangle,
  CheckCircle,
  PieChart,
  TrendingUp 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

// Mock data for charts
const assetsByTypeData = [
  { name: "Laptops", value: 42 },
  { name: "Desktops", value: 28 },
  { name: "Servers", value: 15 },
  { name: "Networking", value: 22 },
  { name: "Other", value: 13 }
];

const maintenanceByMonthData = [
  { name: "Jan", completed: 12, scheduled: 15 },
  { name: "Feb", completed: 19, scheduled: 20 },
  { name: "Mar", completed: 15, scheduled: 18 },
  { name: "Apr", completed: 20, scheduled: 20 },
  { name: "May", completed: 18, scheduled: 22 },
  { name: "Jun", completed: 14, scheduled: 16 }
];

const assetAcquisitionData = [
  { name: "Jan", value: 5 },
  { name: "Feb", value: 8 },
  { name: "Mar", value: 3 },
  { name: "Apr", value: 12 },
  { name: "May", value: 7 },
  { name: "Jun", value: 10 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Summary metrics for cards
const summaryMetrics = [
  { 
    title: "Total Assets", 
    value: "120", 
    description: "5 added this month", 
    icon: <Monitor className="h-6 w-6" /> 
  },
  { 
    title: "Assemblies", 
    value: "24", 
    description: "2 under maintenance", 
    icon: <ServerStack className="h-6 w-6" /> 
  },
  { 
    title: "Pending Tasks", 
    value: "8", 
    description: "3 overdue", 
    icon: <CalendarClock className="h-6 w-6" /> 
  },
  { 
    title: "Alerts", 
    value: "4", 
    description: "2 high priority", 
    icon: <AlertTriangle className="h-6 w-6" /> 
  }
];

// Recent maintenance tasks
const recentTasks = [
  { 
    name: "Server Backup Verification", 
    asset: "Database Server", 
    status: "Completed", 
    date: "Today" 
  },
  { 
    name: "Network Switch Firmware Update", 
    asset: "Core Switch", 
    status: "In Progress", 
    date: "Today" 
  },
  { 
    name: "Workstation Security Scan", 
    asset: "Finance Dept Laptops", 
    status: "Scheduled", 
    date: "Tomorrow" 
  },
  { 
    name: "UPS Battery Replacement", 
    asset: "Server Room UPS", 
    status: "Overdue", 
    date: "Yesterday" 
  }
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your IT inventory and maintenance tasks
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Assets by Type */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary" />
              Assets by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={assetsByTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {assetsByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Maintenance Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-primary" />
              Maintenance Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={maintenanceByMonthData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scheduled" fill="#8884d8" name="Scheduled" />
                  <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Maintenance Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Recent Maintenance Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`h-2 w-2 mt-2 rounded-full ${
                    task.status === "Completed" ? "bg-green-500" : 
                    task.status === "In Progress" ? "bg-blue-500" : 
                    task.status === "Scheduled" ? "bg-yellow-500" : 
                    "bg-red-500"
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{task.name}</p>
                    <p className="text-xs text-muted-foreground">{task.asset}</p>
                  </div>
                  <div className="text-xs text-right">
                    <p className="font-medium">{task.status}</p>
                    <p className="text-muted-foreground">{task.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Asset Acquisition Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Asset Acquisition Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={assetAcquisitionData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
