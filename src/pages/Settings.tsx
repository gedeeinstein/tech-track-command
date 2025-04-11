
import React from "react";
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
import { 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  User, 
  Users, 
  Bell, 
  Database, 
  Server, 
  Shield, 
  Workflow, 
  Upload, 
  Download,
  Save
} from "lucide-react";

const Settings: React.FC = () => {
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
                    <Input id="company-name" placeholder="Enter company name" className="pl-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="contact-email" type="email" placeholder="contact@company.com" className="pl-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="contact-phone" placeholder="+1 (555) 123-4567" className="pl-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="website" placeholder="https://www.company.com" className="pl-8" />
                  </div>
                </div>
              </div>
              <Button className="mt-4">Save Company Info</Button>
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
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Warranty Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when warranties are about to expire
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-logout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log users out after 30 minutes of inactivity
                  </p>
                </div>
                <Switch />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <select 
                    id="date-format" 
                    className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
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
                  >
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC">UTC</option>
                    <option value="UTC+1">Central European Time (UTC+1)</option>
                  </select>
                </div>
              </div>
              <Button className="mt-4">Save Preferences</Button>
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
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show desktop notifications when in the application
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Notification Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-maintenance" className="flex items-center text-sm gap-2">
                      <Bell className="h-4 w-4" />
                      Maintenance Due Reminders
                    </Label>
                    <Switch id="notify-maintenance" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-warranty" className="flex items-center text-sm gap-2">
                      <Bell className="h-4 w-4" />
                      Warranty Expiration Alerts
                    </Label>
                    <Switch id="notify-warranty" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-inventory" className="flex items-center text-sm gap-2">
                      <Bell className="h-4 w-4" />
                      Inventory Changes
                    </Label>
                    <Switch id="notify-inventory" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-user" className="flex items-center text-sm gap-2">
                      <Bell className="h-4 w-4" />
                      User Account Changes
                    </Label>
                    <Switch id="notify-user" />
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
                  />
                </div>
              </div>
              
              <Button className="mt-4">Save Notification Settings</Button>
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
                <Button variant="outline">Connect</Button>
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
                <Button variant="outline">Connect</Button>
              </div>
              
              <div className="flex items-center justify-between border p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Directory Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect to Active Directory or LDAP
                    </p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="api-key">System API Key</Label>
                <div className="flex space-x-2">
                  <Input id="api-key" value="••••••••••••••••••••••••••••••" readOnly />
                  <Button variant="outline">Regenerate</Button>
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
                <Button className="flex items-center gap-1" variant="outline">
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
                  <Switch defaultChecked />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <select 
                      id="backup-frequency" 
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly" selected>Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-retention">Retention Period</Label>
                    <select 
                      id="backup-retention" 
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="7">7 days</option>
                      <option value="30" selected>30 days</option>
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
                  <Button className="flex items-center gap-1" variant="outline">
                    <Upload className="h-4 w-4" />
                    <span>Import Assets (CSV)</span>
                  </Button>
                  <Button className="flex items-center gap-1" variant="outline">
                    <Upload className="h-4 w-4" />
                    <span>Restore from Backup</span>
                  </Button>
                </div>
              </div>
              
              <Button className="mt-4">Save Backup Settings</Button>
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
                    <Label htmlFor="min-length" className="flex items-center text-sm">
                      Minimum password length
                    </Label>
                    <select 
                      id="min-length" 
                      className="w-20 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="8">8</option>
                      <option value="10" selected>10</option>
                      <option value="12">12</option>
                      <option value="16">16</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-special" className="flex items-center text-sm gap-2">
                      <Shield className="h-4 w-4" />
                      Require special characters
                    </Label>
                    <Switch id="require-special" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-numbers" className="flex items-center text-sm gap-2">
                      <Shield className="h-4 w-4" />
                      Require numbers
                    </Label>
                    <Switch id="require-numbers" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-expiry" className="flex items-center text-sm">
                      Password expiry (days)
                    </Label>
                    <select 
                      id="password-expiry" 
                      className="w-20 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="0">Never</option>
                      <option value="30">30</option>
                      <option value="60">60</option>
                      <option value="90" selected>90</option>
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
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require 2FA for administrative actions</Label>
                    <p className="text-sm text-muted-foreground">
                      Prompt for 2FA when performing sensitive operations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-sm font-medium">Login Settings</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="failed-attempts" className="flex items-center text-sm">
                    Max failed login attempts
                  </Label>
                  <select 
                    id="failed-attempts" 
                    className="w-20 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="3">3</option>
                    <option value="5" selected>5</option>
                    <option value="10">10</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lockout-time" className="flex items-center text-sm">
                    Account lockout time (minutes)
                  </Label>
                  <select 
                    id="lockout-time" 
                    className="w-20 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="15">15</option>
                    <option value="30" selected>30</option>
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
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Button className="flex items-center gap-1">
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
