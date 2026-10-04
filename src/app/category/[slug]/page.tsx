"use client"
import { use, useEffect, useState } from "react"
import { FileText, Download, ShieldCheck, FileWarning } from "lucide-react"

type DocumentMeta = {
  id: string
  name: string
  category: string
  date: string
  size: number
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const categorySlug = decodeURIComponent(resolvedParams.slug)
  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
  
  const [documents, setDocuments] = useState<DocumentMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/documents")
      .then(res => res.json())
      .then((data: DocumentMeta[]) => {
        if (Array.isArray(data)) {
          // Filter documents by this specific category
          const filtered = data.filter(doc => doc.category.toLowerCase() === categoryName.toLowerCase())
          setDocuments(filtered)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [categoryName])

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1024 / 1024).toFixed(2) + " MB"
  }
  
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{categoryName} Documents</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> End-to-end encrypted storage
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      ) : documents.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <FileWarning className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No documents found</h2>
          <p className="text-muted-foreground mb-6">You haven't uploaded any {categoryName} documents yet.</p>
          <a href="/upload" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Upload Document
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden relative">
                <FileText className="w-10 h-10 text-muted-foreground/30" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => alert(`Downloading ${doc.name}...`)}
                    className="bg-primary text-primary-foreground p-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-medium text-sm truncate" title={doc.name}>{doc.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{doc.date} • {formatSize(doc.size)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
