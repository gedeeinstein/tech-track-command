
import { useState, useEffect } from 'react';
import {
  companyInfoService,
  systemPreferencesService,
  notificationPreferencesService,
  securitySettingsService,
  backupSettingsService,
  integrationService,
  backupService
} from '@/services/settingsService';

// Company information interface
interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
}

// System preferences interface
interface SystemPreferences {
  maintenanceReminders: boolean;
  warrantyAlerts: boolean;
  autoLogout: boolean;
  dateFormat: string;
  timezone: string;
}

// Notification preferences interface
interface NotificationPreferences {
  emailNotifications: boolean;
  browserNotifications: boolean;
  notifyMaintenance: boolean;
  notifyWarranty: boolean;
  notifyInventory: boolean;
  notifyUserAccount: boolean;
  notificationEmail: string;
}

// Security settings interface
interface SecuritySettings {
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

// Backup settings interface
interface BackupSettings {
  automatedBackups: boolean;
  backupFrequency: string;
  retentionPeriod: string;
}

export const useSettings = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    email: "",
    phone: "",
    website: ""
  });

  const [systemPreferences, setSystemPreferences] = useState<SystemPreferences>({
    maintenanceReminders: true,
    warrantyAlerts: true,
    autoLogout: false,
    dateFormat: "MM/DD/YYYY",
    timezone: "UTC-8"
  });

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    emailNotifications: true,
    browserNotifications: true,
    notifyMaintenance: true,
    notifyWarranty: true,
    notifyInventory: false,
    notifyUserAccount: false,
    notificationEmail: ""
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    minPasswordLength: "10",
    requireSpecialChars: true,
    requireNumbers: true,
    passwordExpiry: "90",
    requireTwoFactor: true,
    requireTwoFactorAdmin: true,
    maxFailedAttempts: "5",
    lockoutTime: "30",
    sessionTimeout: true
  });

  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    automatedBackups: true,
    backupFrequency: "weekly",
    retentionPeriod: "30"
  });

  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••••");

  // Load all settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [company, system, notifications, security, backup] = await Promise.all([
          companyInfoService.get(),
          systemPreferencesService.get(),
          notificationPreferencesService.get(),
          securitySettingsService.get(),
          backupSettingsService.get()
        ]);

        setCompanyInfo(company);
        setSystemPreferences(system);
        setNotificationPrefs(notifications);
        setSecuritySettings(security);
        setBackupSettings(backup);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save functions
  const saveCompanyInfo = async () => {
    try {
      await companyInfoService.save(companyInfo);
      return true;
    } catch (error) {
      console.error('Error saving company info:', error);
      return false;
    }
  };

  const saveSystemPreferences = async () => {
    try {
      await systemPreferencesService.save(systemPreferences);
      return true;
    } catch (error) {
      console.error('Error saving system preferences:', error);
      return false;
    }
  };

  const saveNotificationSettings = async () => {
    try {
      await notificationPreferencesService.save(notificationPrefs);
      return true;
    } catch (error) {
      console.error('Error saving notification settings:', error);
      return false;
    }
  };

  const saveSecuritySettings = async () => {
    try {
      await securitySettingsService.save(securitySettings);
      return true;
    } catch (error) {
      console.error('Error saving security settings:', error);
      return false;
    }
  };

  const saveBackupSettings = async () => {
    try {
      await backupSettingsService.save(backupSettings);
      return true;
    } catch (error) {
      console.error('Error saving backup settings:', error);
      return false;
    }
  };

  // Integration functions
  const connectService = async (serviceName: string) => {
    try {
      await integrationService.connectService(serviceName);
      return true;
    } catch (error) {
      console.error(`Error connecting to ${serviceName}:`, error);
      return false;
    }
  };

  const regenerateApiKey = async () => {
    try {
      const newKey = await integrationService.regenerateApiKey();
      setApiKey(newKey.substring(0, 10) + "••••••••••••••••••••");
      return true;
    } catch (error) {
      console.error('Error regenerating API key:', error);
      return false;
    }
  };

  // Backup functions
  const exportBackup = async () => {
    try {
      await backupService.exportBackup();
      return true;
    } catch (error) {
      console.error('Error exporting backup:', error);
      return false;
    }
  };

  const importAssets = async () => {
    try {
      await backupService.importAssets();
      return true;
    } catch (error) {
      console.error('Error importing assets:', error);
      return false;
    }
  };

  const restoreBackup = async () => {
    try {
      await backupService.restoreFromBackup();
      return true;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  };

  return {
    // State
    companyInfo,
    systemPreferences,
    notificationPrefs,
    securitySettings,
    backupSettings,
    isLoading,
    apiKey,
    
    // Setters
    setCompanyInfo,
    setSystemPreferences,
    setNotificationPrefs,
    setSecuritySettings,
    setBackupSettings,
    
    // Save functions
    saveCompanyInfo,
    saveSystemPreferences,
    saveNotificationSettings,
    saveSecuritySettings,
    saveBackupSettings,
    
    // Integration functions
    connectService,
    regenerateApiKey,
    
    // Backup functions
    exportBackup,
    importAssets,
    restoreBackup
  };
};
