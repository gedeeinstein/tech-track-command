
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Interfaces for each settings section
export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
}

export interface SystemPreferences {
  maintenanceReminders: boolean;
  warrantyAlerts: boolean;
  autoLogout: boolean;
  dateFormat: string;
  timezone: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  browserNotifications: boolean;
  notifyMaintenance: boolean;
  notifyWarranty: boolean;
  notifyInventory: boolean;
  notifyUserAccount: boolean;
  notificationEmail: string;
}

export interface SecuritySettings {
  minPasswordLength: string;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  passwordExpiry: string;
  requireTwoFactor: boolean;
  requireTwoFactorAdmin: boolean;
  maxFailedAttempts: string;
  lockoutTime: string;
  sessionTimeout: boolean;
}

export interface BackupSettings {
  automatedBackups: boolean;
  backupFrequency: string;
  retentionPeriod: string;
}

// Default values
const defaultCompanyInfo: CompanyInfo = {
  name: "IT Inventory Inc.",
  email: "contact@itinventory.example",
  phone: "+1 (555) 123-4567",
  website: "https://itinventory.example"
};

const defaultSystemPreferences: SystemPreferences = {
  maintenanceReminders: true,
  warrantyAlerts: true,
  autoLogout: false,
  dateFormat: "MM/DD/YYYY",
  timezone: "UTC-8"
};

const defaultNotificationPreferences: NotificationPreferences = {
  emailNotifications: true,
  browserNotifications: true,
  notifyMaintenance: true,
  notifyWarranty: true,
  notifyInventory: false,
  notifyUserAccount: false,
  notificationEmail: "notifications@example.com"
};

const defaultSecuritySettings: SecuritySettings = {
  minPasswordLength: "10",
  requireSpecialChars: true,
  requireNumbers: true,
  passwordExpiry: "90",
  requireTwoFactor: true,
  requireTwoFactorAdmin: true,
  maxFailedAttempts: "5",
  lockoutTime: "30",
  sessionTimeout: true
};

const defaultBackupSettings: BackupSettings = {
  automatedBackups: true,
  backupFrequency: "weekly",
  retentionPeriod: "30"
};

// Get company information
export const getCompanyInfo = async (): Promise<CompanyInfo> => {
  try {
    // In a real application with Supabase, you'd fetch this from a settings table
    // For now, we'll return default values
    return defaultCompanyInfo;
  } catch (error) {
    console.error('Error fetching company information:', error);
    toast.error("Failed to load company information");
    return defaultCompanyInfo;
  }
};

// Save company information
export const saveCompanyInfo = async (info: CompanyInfo): Promise<boolean> => {
  try {
    // In a real application, you'd save this to Supabase
    console.log("Saving company info:", info);
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Error saving company information:', error);
    return false;
  }
};

// Get system preferences
export const getSystemPreferences = async (): Promise<SystemPreferences> => {
  try {
    // In a real application with Supabase, you'd fetch this from a settings table
    return defaultSystemPreferences;
  } catch (error) {
    console.error('Error fetching system preferences:', error);
    toast.error("Failed to load system preferences");
    return defaultSystemPreferences;
  }
};

// Save system preferences
export const saveSystemPreferences = async (prefs: SystemPreferences): Promise<boolean> => {
  try {
    // In a real application, you'd save this to Supabase
    console.log("Saving system preferences:", prefs);
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Error saving system preferences:', error);
    return false;
  }
};

// Get notification preferences
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  try {
    // In a real application with Supabase, you'd fetch this from a settings table
    return defaultNotificationPreferences;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    toast.error("Failed to load notification preferences");
    return defaultNotificationPreferences;
  }
};

// Save notification preferences
export const saveNotificationPreferences = async (prefs: NotificationPreferences): Promise<boolean> => {
  try {
    // In a real application, you'd save this to Supabase
    console.log("Saving notification preferences:", prefs);
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Error saving notification preferences:', error);
    return false;
  }
};

// Get security settings
export const getSecuritySettings = async (): Promise<SecuritySettings> => {
  try {
    // In a real application with Supabase, you'd fetch this from a settings table
    return defaultSecuritySettings;
  } catch (error) {
    console.error('Error fetching security settings:', error);
    toast.error("Failed to load security settings");
    return defaultSecuritySettings;
  }
};

// Save security settings
export const saveSecuritySettings = async (settings: SecuritySettings): Promise<boolean> => {
  try {
    // In a real application, you'd save this to Supabase
    console.log("Saving security settings:", settings);
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Error saving security settings:', error);
    return false;
  }
};

// Get backup settings
export const getBackupSettings = async (): Promise<BackupSettings> => {
  try {
    // In a real application with Supabase, you'd fetch this from a settings table
    return defaultBackupSettings;
  } catch (error) {
    console.error('Error fetching backup settings:', error);
    toast.error("Failed to load backup settings");
    return defaultBackupSettings;
  }
};

// Save backup settings
export const saveBackupSettings = async (settings: BackupSettings): Promise<boolean> => {
  try {
    // In a real application, you'd save this to Supabase
    console.log("Saving backup settings:", settings);
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Error saving backup settings:', error);
    return false;
  }
};

// Export data backup
export const exportBackup = async (): Promise<boolean> => {
  try {
    // In a real application, this would generate a full system backup
    console.log("Exporting system backup");
    // Simulating backup generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  } catch (error) {
    console.error('Error exporting backup:', error);
    toast.error("Failed to export backup");
    return false;
  }
};

// Regenerate API key
export const regenerateApiKey = async (): Promise<string | null> => {
  try {
    // In a real application, this would generate a new API key
    console.log("Regenerating API key");
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Generate a random "API key"
    const newKey = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
    return newKey;
  } catch (error) {
    console.error('Error regenerating API key:', error);
    toast.error("Failed to regenerate API key");
    return null;
  }
};
