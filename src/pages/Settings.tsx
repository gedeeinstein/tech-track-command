
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  Bell, 
  Database, 
  Server, 
  Shield, 
  Save,
  Upload, 
  Download,
} from "lucide-react";

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

const Settings: React.FC = () => {
  // State for company information
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    email: "",
    phone: "",
    website: ""
  });

  // State for system preferences
  const [systemPreferences, setSystemPreferences] = useState<SystemPreferences>({
    maintenanceReminders: true,
    warrantyAlerts: true,
    autoLogout: false,
    dateFormat: "MM/DD/YYYY",
    timezone: "UTC-8"
  });

  // State for notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    emailNotifications: true,
    browserNotifications: true,
    notifyMaintenance: true,
    notifyWarranty: true,
    notifyInventory: false,
    notifyUserAccount: false,
    notificationEmail: ""
  });

  // State for security settings
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

  // State for backup settings
  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    automatedBackups: true,
    backupFrequency: "weekly",
    retentionPeriod: "30"
  });

  // Handle company info changes
  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyInfo({
      ...companyInfo,
      [e.target.id.replace('company-', '')]: e.target.value
    });
  };

  // Handle system preferences toggle changes
  const handleSystemToggleChange = (value: boolean, field: keyof SystemPreferences) => {
    setSystemPreferences({
      ...systemPreferences,
      [field]: value
    });
  };

  // Handle system preferences select changes
  const handleSystemSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSystemPreferences({
      ...systemPreferences,
      [e.target.id]: e.target.value
    });
  };

  // Handle notification preferences toggle changes
  const handleNotificationToggleChange = (value: boolean, field: keyof NotificationPreferences) => {
    setNotificationPrefs({
      ...notificationPrefs,
      [field]: value
    });
  };

  // Handle notification email change
  const handleNotificationEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationPrefs({
      ...notificationPrefs,
      notificationEmail: e.target.value
    });
  };

  // Handle security settings toggle changes
  const handleSecurityToggleChange = (value: boolean, field: keyof SecuritySettings) => {
    setSecuritySettings({
      ...securitySettings,
      [field]: value
    });
  };

  // Handle security settings select changes
  const handleSecuritySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecuritySettings({
      ...securitySettings,
      [e.target.id]: e.target.value
    });
  };

  // Handle backup settings toggle changes
  const handleBackupToggleChange = (value: boolean, field: keyof BackupSettings) => {
    setBackupSettings({
      ...backupSettings,
      [field]: value
    });
  };

  // Handle backup settings select changes
  const handleBackupSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBackupSettings({
      ...backupSettings,
      [e.target.id]: e.target.value
    });
  };

  // Save company information
  const saveCompanyInfo = () => {
    // In a real application, you'd save this to a database or local storage
    console.log("Saving company info:", companyInfo);
    toast.success("Company information saved successfully");
  };

  // Save system preferences
  const saveSystemPreferences = () => {
    console.log("Saving system preferences:", systemPreferences);
    toast.success("System preferences saved successfully");
  };

  // Save notification settings
  const saveNotificationSettings = () => {
    console.log("Saving notification preferences:", notificationPrefs);
    toast.success("Notification settings saved successfully");
  };

  // Save security settings
  const saveSecuritySettings = () => {
    console.log("Saving security settings:", securitySettings);
    toast.success("Security settings saved successfully");
  };

  // Save backup settings
  const saveBackupSettings = () => {
    console.log("Saving backup settings:", backupSettings);
    toast.success("Backup settings saved successfully");
  };

  // Export data as backup
  const exportBackup = () => {
    console.log("Exporting full backup");
    toast.success("Backup export initiated. Your download will start shortly.");
    // In a real app, this would trigger a download
  };

  // Import assets from CSV
  const importAssets = () => {
    // In a real app, this would open a file picker
    console.log("Import assets triggered");
    toast.info("Please select a CSV file to import assets");
  };

  // Restore from backup
  const restoreBackup = () => {
    // In a real app, this would open a file picker
    console.log("Restore from backup triggered");
    toast.info("Please select a backup file to restore");
  };

  // Connect to external service
  const connectService = (service: string) => {
    console.log(`Connecting to ${service}`);
    toast.info(`Connecting to ${service}...`);
    // Simulate connection delay
    setTimeout(() => {
      toast.success(`Connected to ${service} successfully!`);
    }, 1500);
  };

  // Regenerate API key
  const regenerateApiKey = () => {
    console.log("Regenerating API key");
    toast.success("API key regenerated successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your IT Inventory & Maintenance system
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integration">Integrations</TabsTrigger>
          <TabsTrigger value="backup">Backup & Import</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Enter your company details for reports and documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="company-name" 
                      placeholder="Enter company name" 
                      className="pl-8" 
                      value={companyInfo.name}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Contact Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="company-email" 
                      type="email" 
                      placeholder="contact@company.com" 
                      className="pl-8" 
                      value={companyInfo.email}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="company-phone" 
                      placeholder="+1 (555) 123-4567" 
                      className="pl-8" 
                      value={companyInfo.phone}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="company-website" 
                      placeholder="https://www.company.com" 
                      className="pl-8" 
                      value={companyInfo.website}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
              </div>
              <Button className="mt-4" onClick={saveCompanyInfo}>Save Company Info</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>
                Configure general system behavior and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Maintenance Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically remind users of upcoming maintenance tasks
                  </p>
                </div>
                <Switch 
                  checked={systemPreferences.maintenanceReminders} 
                  onCheckedChange={(value) => handleSystemToggleChange(value, 'maintenanceReminders')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Warranty Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when warranties are about to expire
                  </p>
                </div>
                <Switch 
                  checked={systemPreferences.warrantyAlerts}
                  onCheckedChange={(value) => handleSystemToggleChange(value, 'warrantyAlerts')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-logout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log users out after 30 minutes of inactivity
                  </p>
                </div>
                <Switch 
                  checked={systemPreferences.autoLogout}
                  onCheckedChange={(value) => handleSystemToggleChange(value, 'autoLogout')}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <select 
                    id="dateFormat" 
                    className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    value={systemPreferences.dateFormat}
                    onChange={handleSystemSelectChange}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select 
                    id="timezone" 
                    className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    value={systemPreferences.timezone}
                    onChange={handleSystemSelectChange}
                  >
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC">UTC</option>
                    <option value="UTC+1">Central European Time (UTC+1)</option>
                  </select>
                </div>
              </div>
              <Button className="mt-4" onClick={saveSystemPreferences}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive system alerts and reports via email
                  </p>
                </div>
                <Switch 
                  checked={notificationPrefs.emailNotifications}
                  onCheckedChange={(value) => handleNotificationToggleChange(value, 'emailNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show desktop notifications when in the application
                  </p>
                </div>
                <Switch 
                  checked={notificationPrefs.browserNotifications}
                  onCheckedChange={(value) => handleNotificationToggleChange(value, 'browserNotifications')}
                />
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Notification Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-maintenance" className="flex items-center text-sm gap-2">
                      <Bell className="h-4 w-4" />
                      Maintenance Due Reminders
                    </Label>
                    <Switch 
                      id="notify-maintenance" 
                      checked={notificationPrefs.notifyMaintenance}
                      onCheckedChange={(value) => handleNotificationToggleChange(value, 'notifyMaintenance')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-warranty" className="flex items-center text-sm gap-2">
                      <Bell className="h-4 w-4" />
                      Warranty Expiration Alerts
                    </Label>
                    <Switch 
                      id="notify-warranty" 
                      checked={notificationPrefs.notifyWarranty}
                      onCheckedChange={(value) => handleNotificationToggleChange(value, 'notifyWarranty')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-inventory" className="flex items-center text-sm gap-2">
                      <Bell className="h-4 w-4" />
                      Inventory Changes
                    </Label>
                    <Switch 
                      id="notify-inventory" 
                      checked={notificationPrefs.notifyInventory}
                      onCheckedChange={(value) => handleNotificationToggleChange(value, 'notifyInventory')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-user" className="flex items-center text-sm gap-2">
                      <Bell className="h-4 w-4" />
                      User Account Changes
                    </Label>
                    <Switch 
                      id="notify-user" 
                      checked={notificationPrefs.notifyUserAccount}
                      onCheckedChange={(value) => handleNotificationToggleChange(value, 'notifyUserAccount')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="notification-email">Notification Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="notification-email" 
                    type="email" 
                    placeholder="notifications@company.com" 
                    className="pl-8"
                    value={notificationPrefs.notificationEmail}
                    onChange={handleNotificationEmailChange}
                  />
                </div>
              </div>
              
              <Button className="mt-4" onClick={saveNotificationSettings}>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Integrations Settings */}
        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>External Integrations</CardTitle>
              <CardDescription>
                Connect with other systems and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between border p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <Server className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Help Desk System</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect to your ticket management system
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => connectService('Help Desk System')}>Connect</Button>
              </div>
              
              <div className="flex items-center justify-between border p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Procurement System</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect to purchasing and vendor management
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => connectService('Procurement System')}>Connect</Button>
              </div>
              
              <div className="flex items-center justify-between border p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                    <Server className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Directory Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect to Active Directory or LDAP
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => connectService('Directory Service')}>Connect</Button>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="api-key">System API Key</Label>
                <div className="flex space-x-2">
                  <Input id="api-key" value="••••••••••••••••••••••••••••••" readOnly />
                  <Button variant="outline" onClick={regenerateApiKey}>Regenerate</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this API key to authenticate external systems connecting to your inventory
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Backup & Import</CardTitle>
              <CardDescription>
                Create backups and import data from external sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Manual Backup</h3>
                <p className="text-sm text-muted-foreground">
                  Export all system data as a compressed archive file
                </p>
                <Button className="flex items-center gap-1" variant="outline" onClick={exportBackup}>
                  <Download className="h-4 w-4" />
                  <span>Export Full Backup</span>
                </Button>
              </div>
              
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-sm font-medium">Scheduled Backups</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Automated Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Regularly create database backups on schedule
                    </p>
                  </div>
                  <Switch 
                    checked={backupSettings.automatedBackups}
                    onCheckedChange={(value) => handleBackupToggleChange(value, 'automatedBackups')}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <select 
                      id="backupFrequency" 
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                      value={backupSettings.backupFrequency}
                      onChange={handleBackupSelectChange}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retentionPeriod">Retention Period</Label>
                    <select 
                      id="retentionPeriod" 
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                      value={backupSettings.retentionPeriod}
                      onChange={handleBackupSelectChange}
                    >
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-sm font-medium">Data Import</h3>
                <p className="text-sm text-muted-foreground">
                  Import data from CSV files or restore from backup
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="flex items-center gap-1" variant="outline" onClick={importAssets}>
                    <Upload className="h-4 w-4" />
                    <span>Import Assets (CSV)</span>
                  </Button>
                  <Button className="flex items-center gap-1" variant="outline" onClick={restoreBackup}>
                    <Upload className="h-4 w-4" />
                    <span>Restore from Backup</span>
                  </Button>
                </div>
              </div>
              
              <Button className="mt-4" onClick={saveBackupSettings}>Save Backup Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security policies and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Password Policy</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="minPasswordLength" className="flex items-center text-sm">
                      Minimum password length
                    </Label>
                    <select 
                      id="minPasswordLength" 
                      className="w-20 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                      value={securitySettings.minPasswordLength}
                      onChange={handleSecuritySelectChange}
                    >
                      <option value="8">8</option>
                      <option value="10">10</option>
                      <option value="12">12</option>
                      <option value="16">16</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecialChars" className="flex items-center text-sm gap-2">
                      <Shield className="h-4 w-4" />
                      Require special characters
                    </Label>
                    <Switch 
                      id="requireSpecialChars" 
                      checked={securitySettings.requireSpecialChars}
                      onCheckedChange={(value) => handleSecurityToggleChange(value, 'requireSpecialChars')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers" className="flex items-center text-sm gap-2">
                      <Shield className="h-4 w-4" />
                      Require numbers
                    </Label>
                    <Switch 
                      id="requireNumbers" 
                      checked={securitySettings.requireNumbers}
                      onCheckedChange={(value) => handleSecurityToggleChange(value, 'requireNumbers')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="passwordExpiry" className="flex items-center text-sm">
                      Password expiry (days)
                    </Label>
                    <select 
                      id="passwordExpiry" 
                      className="w-20 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                      value={securitySettings.passwordExpiry}
                      onChange={handleSecuritySelectChange}
                    >
                      <option value="0">Never</option>
                      <option value="30">30</option>
                      <option value="60">60</option>
                      <option value="90">90</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require 2FA for all users</Label>
                    <p className="text-sm text-muted-foreground">
                      Force all users to set up two-factor authentication
                    </p>
                  </div>
                  <Switch 
                    checked={securitySettings.requireTwoFactor}
                    onCheckedChange={(value) => handleSecurityToggleChange(value, 'requireTwoFactor')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require 2FA for administrative actions</Label>
                    <p className="text-sm text-muted-foreground">
                      Prompt for 2FA when performing sensitive operations
                    </p>
                  </div>
                  <Switch 
                    checked={securitySettings.requireTwoFactorAdmin}
                    onCheckedChange={(value) => handleSecurityToggleChange(value, 'requireTwoFactorAdmin')}
                  />
                </div>
              </div>
              
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-sm font-medium">Login Settings</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="maxFailedAttempts" className="flex items-center text-sm">
                    Max failed login attempts
                  </Label>
                  <select 
                    id="maxFailedAttempts" 
                    className="w-20 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    value={securitySettings.maxFailedAttempts}
                    onChange={handleSecuritySelectChange}
                  >
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lockoutTime" className="flex items-center text-sm">
                    Account lockout time (minutes)
                  </Label>
                  <select 
                    id="lockoutTime" 
                    className="w-20 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    value={securitySettings.lockoutTime}
                    onChange={handleSecuritySelectChange}
                  >
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Session timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out inactive users after 30 minutes
                    </p>
                  </div>
                  <Switch 
                    checked={securitySettings.sessionTimeout}
                    onCheckedChange={(value) => handleSecurityToggleChange(value, 'sessionTimeout')}
                  />
                </div>
              </div>
              
              <Button className="flex items-center gap-1" onClick={saveSecuritySettings}>
                <Save className="h-4 w-4" />
                <span>Save Security Settings</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
