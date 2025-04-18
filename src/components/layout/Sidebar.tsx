
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Monitor,
  Server,
  CalendarClock,
  Users,
  Settings,
  BarChart,
  Menu,
  X,
  Component,
  Building2
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { path: "/assets", label: "Assets", icon: <Monitor size={20} /> },
  { path: "/components", label: "Components", icon: <Component size={20} /> },
  { path: "/assemblies", label: "Assemblies", icon: <Server size={20} /> },
  { path: "/maintenance", label: "Maintenance", icon: <CalendarClock size={20} /> },
  { path: "/users", label: "Users", icon: <Users size={20} /> },
  { path: "/departments", label: "Departments", icon: <Building2 size={20} /> },
  { path: "/reports", label: "Reports", icon: <BarChart size={20} /> },
  { path: "/settings", label: "Settings", icon: <Settings size={20} /> },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:static z-30 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
          collapsed ? "w-0 md:w-16 -translate-x-full md:translate-x-0" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h1 className={cn("text-lg font-bold whitespace-nowrap", collapsed && "md:hidden")}>
            IT Inventory
          </h1>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center p-2 rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                      collapsed && "md:justify-center"
                    )
                  }
                >
                  <span className="inline-flex">{item.icon}</span>
                  <span className={cn("ml-3 whitespace-nowrap", collapsed && "md:hidden")}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/70">
          <div className={cn("whitespace-nowrap", collapsed && "md:hidden")}>
            IT Inventory v1.0
          </div>
        </div>
      </div>
      
      {/* Mobile toggle button */}
      <button
        onClick={() => setCollapsed(false)}
        className={cn(
          "fixed left-4 bottom-4 z-10 p-2 bg-primary text-white rounded-full shadow-lg md:hidden",
          !collapsed && "hidden"
        )}
      >
        <Menu size={24} />
      </button>
    </>
  );
};
