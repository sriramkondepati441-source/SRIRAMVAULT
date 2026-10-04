"use client"
import { useState, useEffect } from "react"
import { FileText, Search, Filter, Download, MoreVertical, Trash2 } from "lucide-react"

type DocumentMeta = {
  id: string
  name: string
  category: string
  date: string
  size: number
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [allDocuments, setAllDocuments] = useState<DocumentMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/documents")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllDocuments(data)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1024 / 1024).toFixed(2) + " MB"
  }

  const filteredDocs = allDocuments.filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">All Documents</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your secure files.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by document name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 bg-background border border-border rounded-md pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4" /> Filter by Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Document Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Date Uploaded</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="border-b border-border hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-foreground">{doc.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{doc.date}</td>
                  <td className="px-6 py-4 text-muted-foreground">{typeof doc.size === 'number' ? formatSize(doc.size) : doc.size}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No documents found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
