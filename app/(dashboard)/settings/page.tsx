"use client"

import { useState } from "react"
import { Settings, Bell, Shield, Palette, Save } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    drawResults: true,
    deposits: true,
    withdrawals: true,
    governance: false,
    marketing: false,
  })

  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "en",
    currency: "usd",
    autoCompound: false,
  })

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </header>

      <main className="p-4 md:p-6 max-w-4xl mx-auto">
        <Alert className="mb-6 border-blue-500/20 bg-blue-500/10">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-200">
            Settings are saved locally. Connect your wallet to sync preferences across devices.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {/* Notifications */}
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-purple-400" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="draw-results">Draw Results</Label>
                  <p className="text-sm text-gray-400">Get notified when draw results are announced</p>
                </div>
                <Switch
                  id="draw-results"
                  checked={notifications.drawResults}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, drawResults: checked }))}
                />
              </div>

              <Separator className="bg-purple-900/20" />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="deposits">Deposit Confirmations</Label>
                  <p className="text-sm text-gray-400">Notifications for successful deposits</p>
                </div>
                <Switch
                  id="deposits"
                  checked={notifications.deposits}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, deposits: checked }))}
                />
              </div>

              <Separator className="bg-purple-900/20" />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="withdrawals">Withdrawal Confirmations</Label>
                  <p className="text-sm text-gray-400">Notifications for successful withdrawals</p>
                </div>
                <Switch
                  id="withdrawals"
                  checked={notifications.withdrawals}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, withdrawals: checked }))}
                />
              </div>

              <Separator className="bg-purple-900/20" />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="governance">Governance Updates</Label>
                  <p className="text-sm text-gray-400">New proposals and voting reminders</p>
                </div>
                <Switch
                  id="governance"
                  checked={notifications.governance}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, governance: checked }))}
                />
              </div>

              <Separator className="bg-purple-900/20" />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing">Marketing & Updates</Label>
                  <p className="text-sm text-gray-400">Product updates and promotional content</p>
                </div>
                <Switch
                  id="marketing"
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, marketing: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5 text-cyan-400" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your SaveFi experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger className="bg-white/10 border-purple-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="bg-white/10 border-purple-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currency">Display Currency</Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="bg-white/10 border-purple-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                      <SelectItem value="jpy">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="bg-purple-900/20" />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-compound">Auto-compound Winnings</Label>
                  <p className="text-sm text-gray-400">Automatically re-deposit prize winnings</p>
                </div>
                <Switch
                  id="auto-compound"
                  checked={preferences.autoCompound}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, autoCompound: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-violet-400" />
                Security
              </CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="wallet-address">Connected Wallet</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="wallet-address"
                    value="Not Connected"
                    disabled
                    className="bg-white/10 border-purple-500/20"
                  />
                  <Button variant="outline" className="border-purple-500/20 hover:bg-purple-500/10 bg-transparent">
                    Connect
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-1">Connect your wallet to access security features</p>
              </div>

              <Separator className="bg-purple-900/20" />

              <div>
                <Label>Transaction Signing</Label>
                <p className="text-sm text-gray-400 mb-2">All transactions require wallet signature confirmation</p>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-green-400">✓ Hardware wallet recommended for maximum security</p>
                </div>
              </div>

              <Separator className="bg-purple-900/20" />

              <div>
                <Label>Session Management</Label>
                <p className="text-sm text-gray-400 mb-2">Manage your active sessions</p>
                <Button variant="outline" className="border-red-500/20 hover:bg-red-500/10 bg-transparent text-red-400">
                  Disconnect All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Advanced */}
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-yellow-500" />
                Advanced
              </CardTitle>
              <CardDescription>Advanced protocol settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rpc-endpoint">Custom RPC Endpoint</Label>
                <Input
                  id="rpc-endpoint"
                  placeholder="https://your-rpc-endpoint.com"
                  className="bg-white/10 border-purple-500/20"
                />
                <p className="text-sm text-gray-400 mt-1">Use custom RPC for better performance</p>
              </div>

              <Separator className="bg-purple-900/20" />

              <div>
                <Label htmlFor="gas-settings">Gas Price Settings</Label>
                <Select defaultValue="auto">
                  <SelectTrigger className="bg-white/10 border-purple-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-purple-900/20" />

              <div>
                <Label>Developer Mode</Label>
                <p className="text-sm text-gray-400 mb-2">Enable advanced features for developers</p>
                <Switch disabled />
                <p className="text-xs text-gray-500 mt-1">Available in future updates</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
