"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, ShieldCheck, Clock, FileWarning, Search, ChevronRight, UploadCloud, Shield, CheckCircle2, X } from "lucide-react"

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [totalDocs, setTotalDocs] = useState(0)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({
    Identity: 0, Education: 0, Finance: 0, College: 0, Career: 0, Other: 0
  })

  useEffect(() => {
    fetch("/api/documents")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTotalDocs(data.length)
          const counts: Record<string, number> = {}
          data.forEach(doc => {
            counts[doc.category] = (counts[doc.category] || 0) + 1
          })
          setCategoryCounts(prev => ({ ...prev, ...counts }))
        }
      })
      .catch(console.error)
  }, [])

  const [checklists, setChecklists] = useState([
    { id: 1, label: "Aadhaar Card (Updated)", completed: true },
    { id: 2, label: "Current Semester Bonafide", completed: false },
    { id: 3, label: "Vaccination Certificate", completed: false },
  ])

  const toggleChecklist = (id: number) => {
    setChecklists(checklists.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-xl shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-1">Upload Document</h2>
            <p className="text-sm text-muted-foreground mb-6">Securely encrypt and store a new file in your vault.</p>
            
            <div className="border-2 border-dashed border-border rounded-lg p-10 flex flex-col items-center justify-center text-center hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer mb-6">
              <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="font-medium text-sm">Click to browse or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 10MB)</p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("Backend not connected yet! Need Supabase keys.")
                  setIsUploadModalOpen(false)
                }}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Secure Upload
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, Sriram</h1>
          <p className="text-muted-foreground mt-1">Your secure document vault is protected and up to date.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Documents" value={totalDocs.toString()} icon={<FileText className="w-5 h-5 text-blue-500" />} trend="Live from local DB" />
        <StatCard title="Identity Verified" value="Yes" icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />} trend="Securely encrypted" />
        <StatCard title="Recently Added" value="New" icon={<Clock className="w-5 h-5 text-amber-500" />} trend="Active Session" />
        <StatCard title="Needs Attention" value="0" icon={<FileWarning className="w-5 h-5 text-destructive" />} trend="All up to date" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Categories</h2>
              <button className="text-primary text-sm font-medium hover:underline flex items-center">
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <CategoryCard name="Identity" count={categoryCounts.Identity || 0} color="bg-blue-500/20 text-blue-400" />
              <CategoryCard name="Education" count={categoryCounts.Education || 0} color="bg-indigo-500/20 text-indigo-400" />
              <CategoryCard name="Finance" count={categoryCounts.Finance || 0} color="bg-emerald-500/20 text-emerald-400" />
              <CategoryCard name="College" count={categoryCounts.College || 0} color="bg-purple-500/20 text-purple-400" />
              <CategoryCard name="Career" count={categoryCounts.Career || 0} color="bg-rose-500/20 text-rose-400" />
              <CategoryCard name="Other" count={categoryCounts.Other || 0} color="bg-slate-500/20 text-slate-400" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Documents</h2>
            </div>
            <div className="space-y-3">
              <DocumentRow name="PAN Card.pdf" category="Identity" date="Today, 10:45 AM" size="1.2 MB" />
              <DocumentRow name="BTech_Sem6_Marksheet.jpg" category="Education" date="Yesterday" size="2.4 MB" />
              <DocumentRow name="Income_Certificate_2026.pdf" category="Finance" date="Oct 01, 2026" size="845 KB" />
              <DocumentRow name="Offer_Letter_TechCorp.pdf" category="Career" date="Sep 28, 2026" size="1.8 MB" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-card to-muted border border-border rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="w-32 h-32" />
            </div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Security Status
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Your vault is heavily protected.</p>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> MFA Enabled</span>
                <span className="text-emerald-500 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> End-to-End Encryption</span>
                <span className="text-muted-foreground">Pending Phase 6</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Last Backup</span>
                <span className="text-foreground">2 hours ago</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Missing Document Checklist</h2>
            <div className="space-y-3">
              {checklists.map(item => (
                <ChecklistItem 
                  key={item.id} 
                  label={item.label} 
                  completed={item.completed} 
                  onClick={() => toggleChecklist(item.id)} 
                />
              ))}
            </div>
            <button className="w-full mt-4 bg-muted text-foreground py-2 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
              Manage Checklists
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, trend, alert }: { title: string; value: string; icon: React.ReactNode; trend: string; alert?: boolean }) {
  return (
    <div className={`bg-card border ${alert ? 'border-destructive/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-border shadow-sm'} rounded-xl p-5 hover:-translate-y-1 transition-transform duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${alert ? 'bg-destructive/10' : 'bg-muted'}`}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className={`text-xs mt-2 ${alert ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>{trend}</p>
      </div>
    </div>
  )
}

function CategoryCard({ name, count, color }: { name: string; count: number; color: string }) {
  return (
    <Link href={`/category/${name.toLowerCase()}`} className="block">
      <div className="p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:bg-muted/80 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 group">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform shadow-inner`}>
          <FileText className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-sm">{name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{count} items</p>
      </div>
    </Link>
  )
}

function DocumentRow({ name, category, date, size }: { name: string; category: string; date: string; size: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium group-hover:text-primary transition-colors">{name}</p>
          <p className="text-xs text-muted-foreground">{category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-foreground">{date}</p>
        <p className="text-xs text-muted-foreground">{size}</p>
      </div>
    </div>
  )
}

function ChecklistItem({ label, completed, onClick }: { label: string; completed: boolean; onClick: () => void }) {
  return (
    <div 
      className="flex items-center gap-3 cursor-pointer group hover:bg-muted/30 p-2 rounded-lg transition-colors -mx-2"
      onClick={onClick}
    >
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground/30 group-hover:border-primary'}`}>
        {completed && <CheckCircle2 className="w-3.5 h-3.5" />}
      </div>
      <span className={`text-sm transition-colors ${completed ? 'text-muted-foreground line-through' : 'text-foreground font-medium group-hover:text-primary'}`}>{label}</span>
    </div>
  )
}
