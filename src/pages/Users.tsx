
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
  DialogTitle
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
import { cn } from "@/lib/utils";
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  Mail,
  Key,
  Lock
} from "lucide-react";

// Mock users data
const MOCK_USERS = [
  {
    id: "U001",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-04-11 09:25 AM"
  },
  {
    id: "U002",
    name: "Emma Wilson",
    email: "emma.wilson@company.com",
    role: "Technician",
    status: "Active",
    lastLogin: "2024-04-10 03:45 PM"
  },
  {
    id: "U003",
    name: "Michael Brown",
    email: "michael.brown@company.com",
    role: "Technician",
    status: "Active",
    lastLogin: "2024-04-09 11:15 AM"
  },
  {
    id: "U004",
    name: "Sarah Davis",
    email: "sarah.davis@company.com",
    role: "Viewer",
    status: "Inactive",
    lastLogin: "2024-03-28 02:10 PM"
  },
  {
    id: "U005",
    name: "Robert Johnson",
    email: "robert.johnson@company.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-04-11 08:50 AM"
  }
];

// User roles and their permissions
const USER_ROLES = [
  { 
    name: "Admin", 
    description: "Full system access, user management, reporting",
    icon: <ShieldAlert className="h-5 w-5" />
  },
  { 
    name: "Technician", 
    description: "Manage assets, assemblies, and maintenance tasks",
    icon: <ShieldCheck className="h-5 w-5" />
  },
  { 
    name: "Viewer", 
    description: "View-only access to system data",
    icon: <Shield className="h-5 w-5" />
  }
];

const Users: React.FC = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEdit = (user: any = null) => {
    setCurrentUser(user);
    setShowPassword(false);
    setFormOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the user to your backend
    // For now, just close the dialog
    setFormOpen(false);
    setCurrentUser(null);
  };

  const handleDeleteUser = (id: string) => {
    // In a real app, you would delete from your backend
    setUsers(users.filter(user => user.id !== id));
  };

  const getRoleIcon = (role: string) => {
    const roleData = USER_ROLES.find(r => r.name === role);
    return roleData?.icon || <Shield className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage users and their permissions
          </p>
        </div>
        <Button size="sm" className="flex items-center gap-1" onClick={() => handleAddEdit()}>
          <Plus size={16} />
          <span>Add User</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Last Login</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full",
                        user.role === "Admin" ? "bg-red-100 text-red-700" : 
                        user.role === "Technician" ? "bg-blue-100 text-blue-700" : 
                        "bg-gray-100 text-gray-700"
                      )}>
                        {getRoleIcon(user.role)}
                      </span>
                      <span className="hidden sm:inline">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={cn(
                      "status-badge",
                      user.status === "Active" ? "status-active" : "status-decommissioned"
                    )}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{user.lastLogin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddEdit(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit User Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {currentUser 
                ? "Update user details and permissions." 
                : "Enter the details of the new user to add them to the system."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveUser} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                defaultValue={currentUser?.name || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="relative col-span-3">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  defaultValue={currentUser?.email || ""}
                  className="pl-8"
                />
              </div>
            </div>
            {!currentUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <div className="relative col-span-3">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-8"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <select
                id="role"
                defaultValue={currentUser?.role || "Viewer"}
                className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm col-span-3"
              >
                {USER_ROLES.map(role => (
                  <option key={role.name} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <select
                id="status"
                defaultValue={currentUser?.status || "Active"}
                className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm col-span-3"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="mt-4 rounded-md bg-muted p-4">
              <div className="font-medium mb-2">Role Permissions</div>
              {USER_ROLES.map(role => (
                <div key={role.name} className={cn(
                  "p-2 rounded-md my-1",
                  currentUser?.role === role.name ? "bg-primary/10" : ""
                )}>
                  <div className="flex items-center gap-2">
                    {role.icon}
                    <span className="font-medium">{role.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{role.description}</p>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit">{currentUser ? "Update User" : "Add User"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
