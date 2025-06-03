
interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
}

interface SystemPreferences {
  maintenanceReminders: boolean;
  warrantyAlerts: boolean;
  autoLogout: boolean;
  dateFormat: string;
  timezone: string;
}

interface NotificationPreferences {
  emailNotifications: boolean;
  browserNotifications: boolean;
  notifyMaintenance: boolean;
  notifyWarranty: boolean;
  notifyInventory: boolean;
  notifyUserAccount: boolean;
  notificationEmail: string;
}

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

interface BackupSettings {
  automatedBackups: boolean;
  backupFrequency: string;
  retentionPeriod: string;
}

const STORAGE_KEYS = {
  COMPANY_INFO: 'settings_company_info',
  SYSTEM_PREFERENCES: 'settings_system_preferences',
  NOTIFICATION_PREFERENCES: 'settings_notification_preferences',
  SECURITY_SETTINGS: 'settings_security_settings',
  BACKUP_SETTINGS: 'settings_backup_settings',
};

// Company Info Service
export const companyInfoService = {
  async get(): Promise<CompanyInfo> {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_INFO);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      name: "",
      email: "",
      phone: "",
      website: ""
    };
  },

  async save(data: CompanyInfo): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.COMPANY_INFO, JSON.stringify(data));
    console.log("Company info saved:", data);
  }
};

// System Preferences Service
export const systemPreferencesService = {
  async get(): Promise<SystemPreferences> {
    const stored = localStorage.getItem(STORAGE_KEYS.SYSTEM_PREFERENCES);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      maintenanceReminders: true,
      warrantyAlerts: true,
      autoLogout: false,
      dateFormat: "MM/DD/YYYY",
      timezone: "UTC-8"
    };
  },

  async save(data: SystemPreferences): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.SYSTEM_PREFERENCES, JSON.stringify(data));
    console.log("System preferences saved:", data);
  }
};

// Notification Preferences Service
export const notificationPreferencesService = {
  async get(): Promise<NotificationPreferences> {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      emailNotifications: true,
      browserNotifications: true,
      notifyMaintenance: true,
      notifyWarranty: true,
      notifyInventory: false,
      notifyUserAccount: false,
      notificationEmail: ""
    };
  },

  async save(data: NotificationPreferences): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES, JSON.stringify(data));
    console.log("Notification preferences saved:", data);
  }
};

// Security Settings Service
export const securitySettingsService = {
  async get(): Promise<SecuritySettings> {
    const stored = localStorage.getItem(STORAGE_KEYS.SECURITY_SETTINGS);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
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
  },

  async save(data: SecuritySettings): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.SECURITY_SETTINGS, JSON.stringify(data));
    console.log("Security settings saved:", data);
  }
};

// Backup Settings Service
export const backupSettingsService = {
  async get(): Promise<BackupSettings> {
    const stored = localStorage.getItem(STORAGE_KEYS.BACKUP_SETTINGS);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      automatedBackups: true,
      backupFrequency: "weekly",
      retentionPeriod: "30"
    };
  },

  async save(data: BackupSettings): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.BACKUP_SETTINGS, JSON.stringify(data));
    console.log("Backup settings saved:", data);
  }
};

// Integration Services
export const integrationService = {
  async connectService(serviceName: string): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Connected to ${serviceName}`);
    return true;
  },

  async regenerateApiKey(): Promise<string> {
    // Simulate API call to regenerate key
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newKey = 'ak_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log("New API key generated:", newKey);
    return newKey;
  }
};

// Backup/Import Services
export const backupService = {
  async exportBackup(): Promise<void> {
    // Simulate backup export
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a mock backup file
    const backupData = {
      company: await companyInfoService.get(),
      system: await systemPreferencesService.get(),
      notifications: await notificationPreferencesService.get(),
      security: await securitySettingsService.get(),
      backup: await backupSettingsService.get(),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `it-inventory-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log("Backup exported successfully");
  },

  async importAssets(): Promise<void> {
    // Simulate import process
    console.log("Asset import initiated");
    // In a real app, this would open a file picker
  },

  async restoreFromBackup(): Promise<void> {
    // Simulate restore process
    console.log("Backup restore initiated");
    // In a real app, this would open a file picker
  }
};
