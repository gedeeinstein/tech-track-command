
import React from "react";
import { Server, Monitor, Printer, Network, HardDrive } from "lucide-react";

export const getComponentIcon = (type: string) => {
  switch (type) {
    case "Server":
      return <Server className="h-5 w-5" />;
    case "Laptop":
    case "Tablet":
    case "Desktop":
      return <Monitor className="h-5 w-5" />;
    case "Printer":
      return <Printer className="h-5 w-5" />;
    case "Networking":
      return <Network className="h-5 w-5" />;
    default:
      return <HardDrive className="h-5 w-5" />;
  }
};
