"use client"
import { Search, Bell, Menu, User, Zap, Settings, LogOut, ShieldAlert, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showQuickAccess, setShowQuickAccess] = useState(false)
  const router = useRouter()
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
        setShowProfile(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <header ref={headerRef} className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-muted-foreground hover:text-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents, tags, categories..."
            className="h-10 w-80 bg-muted/50 rounded-full pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent focus:border-primary/30"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 relative">
        <button 
          onClick={() => setShowQuickAccess(true)}
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-0.5"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Quick Access</span>
        </button>
        
        {/* NOTIFICATIONS */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border border-card animate-pulse"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-2 z-50">
              <div className="p-3 border-b border-border font-semibold flex justify-between items-center bg-muted/30">
                Notifications <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer flex gap-3">
                  <div className="mt-0.5 bg-emerald-500/20 text-emerald-500 p-1.5 rounded-full h-fit"><Zap className="w-3.5 h-3.5" /></div>
                  <div>
                    <p className="text-sm font-medium">Backup Successful</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Your vault was securely backed up to local storage 2 hours ago.</p>
                  </div>
                </div>
                <div className="p-3 hover:bg-muted/30 transition-colors cursor-pointer flex gap-3">
                  <div className="mt-0.5 bg-destructive/20 text-destructive p-1.5 rounded-full h-fit"><ShieldAlert className="w-3.5 h-3.5" /></div>
                  <div>
                    <p className="text-sm font-medium">New Device Login</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Windows PC logged in from your IP address today.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* PROFILE */}
        <div className="relative">
          <div 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="h-9 w-9 bg-gradient-to-br from-primary/40 to-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/30 cursor-pointer hover:scale-105 transition-transform shadow-sm"
          >
            <User className="w-5 h-5" />
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-2 z-50">
              <div className="p-4 border-b border-border bg-muted/30">
                <p className="font-semibold text-sm">Sriram</p>
                <p className="text-xs text-muted-foreground mt-0.5">sriram@vault.local</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={() => { setShowProfile(false); router.push('/profile'); }} 
                  className="flex items-center gap-3 w-full p-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" /> My Profile
                </button>
                <button 
                  onClick={() => { setShowProfile(false); router.push('/settings'); }} 
                  className="flex items-center gap-3 w-full p-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" /> Settings & Security
                </button>
              </div>
              <div className="p-2 border-t border-border">
                <button onClick={() => alert("Securely signed out. (Mock)")} className="flex items-center gap-3 w-full p-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* QUICK ACCESS MODAL */}
    {showQuickAccess && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowQuickAccess(false)}>
        <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-2xl p-6 relative" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setShowQuickAccess(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Emergency Quick Access</h2>
          <p className="text-sm text-muted-foreground mb-6">Instantly retrieve your most critical documents without navigating.</p>
          
          <div className="space-y-3">
            <button onClick={() => { setShowQuickAccess(false); router.push('/category/identity'); }} className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted transition-colors flex justify-between items-center">
              <span className="font-medium">Identity Documents (Aadhaar, PAN)</span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Secure</span>
            </button>
            <button onClick={() => { setShowQuickAccess(false); router.push('/category/education'); }} className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted transition-colors flex justify-between items-center">
              <span className="font-medium">Education Records (Marksheets)</span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Secure</span>
            </button>
            <button onClick={() => { setShowQuickAccess(false); router.push('/category/finance'); }} className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted transition-colors flex justify-between items-center">
              <span className="font-medium">Finance (Income Certificates)</span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Secure</span>
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
