"use client"
import { User, Mail, Phone, ShieldCheck, Key, History, Activity } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/40 to-primary/10 rounded-full flex items-center justify-center text-primary mb-4 border-2 border-primary/20 shadow-inner">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold">Sriram</h2>
            <p className="text-sm text-muted-foreground mt-1">Free Tier Account</p>
            <div className="mt-6 flex justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
              </span>
            </div>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Personal Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center pb-4 border-b border-border/50">
                <span className="text-sm text-muted-foreground font-medium">Full Name</span>
                <span className="col-span-2 text-sm font-medium">Sriram</span>
              </div>
              <div className="grid grid-cols-3 items-center pb-4 border-b border-border/50">
                <span className="text-sm text-muted-foreground font-medium flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                <span className="col-span-2 text-sm font-medium">sriram@vault.local</span>
              </div>
              <div className="grid grid-cols-3 items-center pb-4 border-b border-border/50">
                <span className="text-sm text-muted-foreground font-medium flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</span>
                <span className="col-span-2 text-sm font-medium">+91 98765 43210</span>
              </div>
              <div className="grid grid-cols-3 items-center">
                <span className="text-sm text-muted-foreground font-medium flex items-center gap-2"><Key className="w-4 h-4" /> Account ID</span>
                <span className="col-span-2 text-sm font-mono text-muted-foreground">VLT-8X92-K2M1-99B3</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Recent Activity
            </h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-primary bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow" />
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.25rem)] bg-muted/30 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">Logged In</span>
                    <span className="text-xs text-muted-foreground text-emerald-500 font-medium">Just now</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Windows PC via Local Network</p>
                </div>
              </div>
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-muted-foreground/30 bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.25rem)] bg-muted/30 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">Vault Backup</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Automated local sync completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
