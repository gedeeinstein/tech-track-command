
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Check, 
  Search,
  Calendar as CalendarIcon,
  ChevronDown,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw
} from "lucide-react";

// Mock maintenance tasks
const MOCK_TASKS = [
  {
    id: "MT001",
    title: "Server Backup Verification",
    description: "Verify backup integrity and recoverability of production database server",
    status: "Completed",
    priority: "High",
    assignedTo: "John Smith",
    asset: { id: "A1004", name: "Dell PowerEdge R740" },
    assembly: { id: "ASM001", name: "Server Rack #1" },
    scheduledDate: "2024-04-10",
    completedDate: "2024-04-10",
    recurring: "Weekly",
    nextOccurrence: "2024-04-17"
  },
  {
    id: "MT002",
    title: "Network Switch Firmware Update",
    description: "Apply latest firmware updates to core switches",
    status: "In Progress",
    priority: "Medium",
    assignedTo: "Emma Wilson",
    asset: { id: "A1002", name: "Cisco Switch 24-Port" },
    assembly: { id: "ASM001", name: "Server Rack #1" },
    scheduledDate: "2024-04-11",
    completedDate: null,
    recurring: "None",
    nextOccurrence: null
  },
  {
    id: "MT003",
    title: "Workstation Security Scan",
    description: "Run comprehensive security scan on finance department devices",
    status: "Scheduled",
    priority: "Medium",
    assignedTo: "Michael Brown",
    asset: null,
    assembly: { id: "ASM002", name: "Finance Workstations" },
    scheduledDate: "2024-04-12",
    completedDate: null,
    recurring: "Monthly",
    nextOccurrence: "2024-05-12"
  },
  {
    id: "MT004",
    title: "UPS Battery Replacement",
    description: "Replace backup batteries in server room UPS",
    status: "Overdue",
    priority: "High",
    assignedTo: "John Smith",
    asset: { id: "A2011", name: "UPS System" },
    assembly: null,
    scheduledDate: "2024-04-05",
    completedDate: null,
    recurring: "None",
    nextOccurrence: null
  },
  {
    id: "MT005",
    title: "Printer Maintenance",
    description: "Clean and calibrate printer, replace consumables as needed",
    status: "Scheduled",
    priority: "Low",
    assignedTo: "Emma Wilson",
    asset: { id: "A1003", name: "HP LaserJet Pro" },
    assembly: null,
    scheduledDate: "2024-04-14",
    completedDate: null,
    recurring: "Quarterly",
    nextOccurrence: "2024-07-14"
  },
  {
    id: "MT006",
    title: "Software License Audit",
    description: "Review all software licenses and compliance status",
    status: "Scheduled",
    priority: "Medium",
    assignedTo: "Michael Brown",
    asset: null,
    assembly: null,
    scheduledDate: "2024-04-20",
    completedDate: null,
    recurring: "Yearly",
    nextOccurrence: "2025-04-20"
  }
];

// Users for assignee dropdown
const USERS = [
  { id: "U001", name: "John Smith" },
  { id: "U002", name: "Emma Wilson" },
  { id: "U003", name: "Michael Brown" },
  { id: "U004", name: "Sarah Davis" }
];

// Assets for selection dropdown
const ASSETS = [
  { id: "A1001", name: "Dell XPS 15" },
  { id: "A1002", name: "Cisco Switch 24-Port" },
  { id: "A1003", name: "HP LaserJet Pro" },
  { id: "A1004", name: "Dell PowerEdge R740" },
  { id: "A1005", name: "Microsoft Surface Pro" },
  { id: "A2011", name: "UPS System" }
];

// Assemblies for selection dropdown
const ASSEMBLIES = [
  { id: "ASM001", name: "Server Rack #1" },
  { id: "ASM002", name: "Finance Workstations" },
  { id: "ASM003", name: "Conference Room A System" },
  { id: "ASM004", name: "Developer Workstation Pack" }
];

// Task status options
const STATUS_OPTIONS = ["All", "Scheduled", "In Progress", "Completed", "Overdue"];

// Task priority options
const PRIORITY_OPTIONS = ["All", "Low", "Medium", "High"];

// Recurring options
const RECURRING_OPTIONS = ["None", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Scheduled":
      return <Clock className="h-4 w-4" />;
    case "In Progress":
      return <PlayCircle className="h-4 w-4" />;
    case "Completed":
      return <CheckCircle2 className="h-4 w-4" />;
    case "Overdue":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

const Maintenance: React.FC = () => {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Filter tasks based on search, status, and priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.asset?.name && task.asset.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.assembly?.name && task.assembly.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAddEdit = (task: any = null) => {
    setCurrentTask(task);
    setFormOpen(true);
    if (task?.scheduledDate) {
      setDate(new Date(task.scheduledDate));
    } else {
      setDate(undefined);
    }
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the task to your backend
    // For now, just close the dialog
    setFormOpen(false);
    setCurrentTask(null);
  };

  const handleDeleteTask = (id: string) => {
    // In a real app, you would delete from your backend
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleMarkCompleted = (id: string) => {
    // In a real app, you would update on your backend
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: "Completed", completedDate: format(new Date(), "yyyy-MM-dd") } 
        : task
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground">
            Schedule and track maintenance tasks for your IT assets
          </p>
        </div>
        <Button size="sm" className="flex items-center gap-1" onClick={() => handleAddEdit()}>
          <Plus size={16} />
          <span>New Task</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                {getStatusIcon(statusFilter)}
                <span>{statusFilter} Status</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <div className="divide-y">
                {STATUS_OPTIONS.map((status) => (
                  <div 
                    key={status} 
                    className={cn(
                      "flex items-center gap-2 p-2.5 cursor-pointer hover:bg-secondary", 
                      status === statusFilter && "bg-secondary"
                    )}
                    onClick={() => setStatusFilter(status)}
                  >
                    {getStatusIcon(status)}
                    <span>{status}</span>
                    {status === statusFilter && <Check className="h-4 w-4 ml-auto" />}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1 ml-2">
                <span>{priorityFilter} Priority</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <div className="divide-y">
                {PRIORITY_OPTIONS.map((priority) => (
                  <div 
                    key={priority} 
                    className={cn(
                      "flex items-center gap-2 p-2.5 cursor-pointer hover:bg-secondary", 
                      priority === priorityFilter && "bg-secondary"
                    )}
                    onClick={() => setPriorityFilter(priority)}
                  >
                    <span>{priority}</span>
                    {priority === priorityFilter && <Check className="h-4 w-4 ml-auto" />}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Task</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Assigned To</TableHead>
              <TableHead className="hidden lg:table-cell">Target</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead className="hidden lg:table-cell">Recurring</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{task.description}</div>
                    <div className="md:hidden text-xs mt-1">
                      <span className={cn(
                        "status-badge inline-block mr-2",
                        task.status === "Completed" && "status-active",
                        task.status === "In Progress" && "status-info",
                        task.status === "Scheduled" && "status-maintenance",
                        task.status === "Overdue" && "status-decommissioned"
                      )}>
                        {task.status}
                      </span>
                      <span className={cn(
                        "status-badge inline-block",
                        task.priority === "High" && "status-decommissioned",
                        task.priority === "Medium" && "status-maintenance",
                        task.priority === "Low" && "status-info"
                      )}>
                        {task.priority} Priority
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "status-badge",
                        task.status === "Completed" && "status-active",
                        task.status === "In Progress" && "status-info",
                        task.status === "Scheduled" && "status-maintenance",
                        task.status === "Overdue" && "status-decommissioned"
                      )}>
                        {task.status}
                      </span>
                      <span className={cn(
                        "status-badge",
                        task.priority === "High" && "status-decommissioned",
                        task.priority === "Medium" && "status-maintenance",
                        task.priority === "Low" && "status-info"
                      )}>
                        {task.priority}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {task.assignedTo}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {task.asset && (
                      <div className="text-sm">Asset: {task.asset.name}</div>
                    )}
                    {task.assembly && (
                      <div className="text-sm">Assembly: {task.assembly.name}</div>
                    )}
                    {!task.asset && !task.assembly && (
                      <div className="text-sm text-muted-foreground">None</div>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {task.scheduledDate && (
                      <div className="text-sm">{task.scheduledDate}</div>
                    )}
                    {task.completedDate && (
                      <div className="text-xs text-muted-foreground">
                        Completed: {task.completedDate}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {task.recurring !== "None" ? (
                      <div>
                        <div className="text-sm">{task.recurring}</div>
                        {task.nextOccurrence && (
                          <div className="text-xs text-muted-foreground">
                            Next: {task.nextOccurrence}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">One-time</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      {task.status !== "Completed" && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleMarkCompleted(task.id)} 
                          title="Mark as completed"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAddEdit(task)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {task.recurring !== "None" && task.status === "Completed" && (
                            <DropdownMenuItem>
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Reset for Next
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteTask(task.id)}>
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
                <TableCell colSpan={7} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Task Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentTask ? "Edit Maintenance Task" : "Create New Maintenance Task"}</DialogTitle>
            <DialogDescription>
              {currentTask 
                ? "Update the details of the selected maintenance task." 
                : "Schedule a new maintenance task for an asset or assembly."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveTask}>
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input 
                      id="title" 
                      defaultValue={currentTask?.title || ""} 
                      placeholder="Enter task title" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      defaultValue={currentTask?.description || ""} 
                      placeholder="Describe the maintenance task" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <select 
                        id="status" 
                        defaultValue={currentTask?.status || "Scheduled"} 
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <select 
                        id="priority" 
                        defaultValue={currentTask?.priority || "Medium"} 
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <select 
                      id="assignedTo" 
                      defaultValue={currentTask?.assignedTo || ""} 
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="" disabled>Select a user</option>
                      {USERS.map(user => (
                        <option key={user.id} value={user.name}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="asset">Asset (Optional)</Label>
                      <select 
                        id="asset" 
                        defaultValue={currentTask?.asset?.id || ""} 
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                      >
                        <option value="">None</option>
                        {ASSETS.map(asset => (
                          <option key={asset.id} value={asset.id}>{asset.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="assembly">Assembly (Optional)</Label>
                      <select 
                        id="assembly" 
                        defaultValue={currentTask?.assembly?.id || ""} 
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                      >
                        <option value="">None</option>
                        {ASSEMBLIES.map(assembly => (
                          <option key={assembly.id} value={assembly.id}>{assembly.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="scheduling" className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Scheduled Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {currentTask?.status === "Completed" && (
                    <div className="grid gap-2">
                      <Label htmlFor="completedDate">Completion Date</Label>
                      <Input 
                        id="completedDate" 
                        type="date" 
                        defaultValue={currentTask?.completedDate || ""} 
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="recurring">Recurring</Label>
                      <select 
                        id="recurring" 
                        defaultValue={currentTask?.recurring || "None"} 
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                      >
                        {RECURRING_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    {currentTask?.recurring !== "None" && (
                      <div className="grid gap-2">
                        <Label htmlFor="nextOccurrence">Next Occurrence</Label>
                        <Input 
                          id="nextOccurrence" 
                          type="date" 
                          defaultValue={currentTask?.nextOccurrence || ""} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-6">
              <Button type="submit">
                {currentTask ? "Update Task" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Maintenance;
