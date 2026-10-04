import Image from "next/image"
import Link from "next/link"
import { LayoutDashboard, FolderOpen, Search, Bell, ShieldAlert, Plus, LogOut, FileText, UploadCloud, CheckSquare } from "lucide-react"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col hidden md:flex">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-md overflow-hidden bg-primary/10">
            <Image src="/logo.jpg" alt="SriramVault Logo" fill sizes="32px" className="object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Sriram<span className="text-primary">Vault</span></span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Main</p>
          <nav className="flex flex-col gap-1">
            <NavItem href="/" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active />
            <NavItem href="/documents" icon={<FolderOpen className="w-5 h-5" />} label="All Documents" />
            <NavItem href="/upload" icon={<UploadCloud className="w-5 h-5" />} label="Upload" />
            <NavItem href="/checklists" icon={<CheckSquare className="w-5 h-5" />} label="Checklists" />
          </nav>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Categories</p>
          <nav className="flex flex-col gap-1">
            <NavItem href="/category/identity" icon={<FileText className="w-5 h-5" />} label="Identity" />
            <NavItem href="/category/education" icon={<FileText className="w-5 h-5" />} label="Education" />
            <NavItem href="/category/finance" icon={<FileText className="w-5 h-5" />} label="Finance" />
            <NavItem href="/category/college" icon={<FileText className="w-5 h-5" />} label="College" />
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="bg-muted rounded-lg p-4 flex flex-col items-center text-center">
          <p className="text-sm font-medium mb-1">Storage Usage</p>
          <div className="w-full bg-secondary rounded-full h-2 mb-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
          </div>
          <p className="text-xs text-muted-foreground">4.5 GB of 10 GB used</p>
        </div>
        <button className="flex items-center gap-3 text-muted-foreground hover:text-foreground w-full p-2 mt-4 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign out</span>
        </button>
      </div>
    </aside>
  )
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  )
}
