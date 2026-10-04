"use client"
import { ShieldAlert, Key, Smartphone, HardDrive, EyeOff, CheckCircle2 } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings & Security</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold text-sm">Security Controls</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                  <p className="text-xs text-muted-foreground mt-1">Require an OTP when logging in</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div>
                  <h3 className="text-sm font-medium">Biometric Unlock</h3>
                  <p className="text-xs text-muted-foreground mt-1">Use fingerprint or FaceID</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="pt-4 border-t border-border/50">
                <button className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                  <Key className="w-4 h-4" /> Change Master Password
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-indigo-500" />
              <h2 className="font-semibold text-sm">Privacy Options</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Auto-lock Vault</h3>
                  <p className="text-xs text-muted-foreground mt-1">Lock after 15 mins of inactivity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-emerald-500" />
              <h2 className="font-semibold text-sm">Storage & Blockchain Integrity</h2>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium">Local Storage Used</span>
                <span className="text-sm font-bold">2.4 GB <span className="text-muted-foreground font-normal text-xs">/ 10 GB</span></span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 mb-6">
                <div className="bg-primary h-2.5 rounded-full w-[24%]"></div>
              </div>
              
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h4 className="font-semibold text-sm text-emerald-500">Integrity Check Passed</h4>
                </div>
                <p className="text-xs text-emerald-500/80">All document hashes match. Zero tampering detected across your vault.</p>
              </div>
              
              <button className="w-full bg-background border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                Run Manual Hash Verification
              </button>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-sm">Active Sessions</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Windows PC (Current)</p>
                  <p className="text-xs text-emerald-500">Active now</p>
                </div>
                <button className="text-xs text-muted-foreground border border-border px-3 py-1 rounded hover:bg-muted">Logout</button>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div>
                  <p className="text-sm font-medium">iPhone 15 Pro</p>
                  <p className="text-xs text-muted-foreground">Last active 2 days ago</p>
                </div>
                <button className="text-xs text-destructive border border-destructive/20 bg-destructive/5 px-3 py-1 rounded hover:bg-destructive/10">Revoke</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
