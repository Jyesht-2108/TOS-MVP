import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Bell, Lock, Globe, Mail, Database } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [schoolName, setSchoolName] = useState('Springfield High School');
  const [email, setEmail] = useState('admin@springfield.edu');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-lg text-muted-foreground mt-2">Manage your school configuration</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <SettingsIcon className="h-6 w-6" />
              <div>
                <CardTitle className="text-xl">General Settings</CardTitle>
                <CardDescription className="text-base">Basic school information and preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="schoolName" className="text-base">School Name</Label>
                <Input
                  id="schoolName"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="h-11 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">Phone Number</Label>
                <Input id="phone" placeholder="+91 9876543210" className="h-11 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-base">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-base">School Address</Label>
              <Input id="address" placeholder="123 Main Street, City, State" className="h-11 text-base" />
            </div>
            <Button className="h-11 text-base">Save General Settings</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6" />
              <div>
                <CardTitle className="text-xl">Notification Settings</CardTitle>
                <CardDescription className="text-base">Configure notification preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-base">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Button variant="outline" className="text-base">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-base">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Send SMS to parents and staff</p>
              </div>
              <Button variant="outline" className="text-base">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-base">WhatsApp Integration</p>
                <p className="text-sm text-muted-foreground">Connect WhatsApp Business API</p>
              </div>
              <Button variant="outline" className="text-base">Setup</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6" />
              <div>
                <CardTitle className="text-xl">Security Settings</CardTitle>
                <CardDescription className="text-base">Manage security and access control</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-base">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" className="text-base">Enable</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-base">Password Policy</p>
                <p className="text-sm text-muted-foreground">Set password requirements</p>
              </div>
              <Button variant="outline" className="text-base">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-base">Session Timeout</p>
                <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
              </div>
              <Button variant="outline" className="text-base">Set Duration</Button>
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6" />
              <div>
                <CardTitle className="text-xl">Integrations</CardTitle>
                <CardDescription className="text-base">Connect third-party services</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-base">Payment Gateway (Razorpay)</p>
                <p className="text-sm text-muted-foreground">Accept online fee payments</p>
              </div>
              <Button variant="outline" className="text-base">Connect</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-base">Google Workspace</p>
                <p className="text-sm text-muted-foreground">Sync with Google Calendar and Drive</p>
              </div>
              <Button variant="outline" className="text-base">Connect</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-base">Zoom Integration</p>
                <p className="text-sm text-muted-foreground">Enable online classes</p>
              </div>
              <Button variant="outline" className="text-base">Connect</Button>
            </div>
          </CardContent>
        </Card>

        {/* Backup Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6" />
              <div>
                <CardTitle className="text-xl">Backup & Data</CardTitle>
                <CardDescription className="text-base">Manage data backup and export</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-base">Automatic Backups</p>
                <p className="text-sm text-muted-foreground">Daily automated backups at 2:00 AM</p>
              </div>
              <Button variant="outline" className="text-base">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-base">Export Data</p>
                <p className="text-sm text-muted-foreground">Download all school data</p>
              </div>
              <Button variant="outline" className="text-base">Export</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-base">Last Backup</p>
                <p className="text-sm text-muted-foreground">Today at 2:00 AM - 2.4 GB</p>
              </div>
              <Button variant="outline" className="text-base">View Details</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
