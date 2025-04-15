
import React from 'react';
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Power,
  Monitor,
  Box,
  Keyboard,
  Router
} from "lucide-react";

/**
 * Returns the appropriate icon based on component type
 */
export const getComponentIcon = (type: string) => {
  switch (type) {
    case "Processor":
      return <Cpu className="h-5 w-5" />;
    case "Motherboard":
      return <HardDrive className="h-5 w-5" />;
    case "RAM":
      return <MemoryStick className="h-5 w-5" />;
    case "Storage":
      return <HardDrive className="h-5 w-5" />;
    case "PSU":
      return <Power className="h-5 w-5" />;
    case "Monitor":
      return <Monitor className="h-5 w-5" />;
    case "Case":
      return <Box className="h-5 w-5" />;
    case "Peripherals":
      return <Keyboard className="h-5 w-5" />;
    case "Networking":
      return <Router className="h-5 w-5" />;
    default:
      return <HardDrive className="h-5 w-5" />;
  }
};
