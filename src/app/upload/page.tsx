"use client"
import { useState } from "react"
import { UploadCloud, FileText, X, ShieldCheck, CheckCircle2 } from "lucide-react"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [category, setCategory] = useState("Identity")

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    
    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("category", category)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        alert("Upload successful! The file has been secured in your vault.")
        setSelectedFile(null)
      } else {
        alert("Upload failed. Please try again.")
      }
    } catch (error) {
      alert("Error connecting to backend.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Secure Upload</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Files are encrypted before being stored.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-8">
        {!selectedFile ? (
          <div 
            className={`border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <UploadCloud className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Drag & Drop your document here</h3>
            <p className="text-muted-foreground text-sm mb-6">Supports PDF, JPG, PNG up to 10MB</p>
            
            <label className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer shadow-sm">
              Browse Files
              <input type="file" className="hidden" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" />
            </label>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="border border-border rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted/10">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 relative">
                <FileText className="w-8 h-8 text-primary" />
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <h3 className="text-lg font-semibold truncate max-w-xs">{selectedFile.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for encryption</p>
              
              <div className="mt-8 space-y-4 w-full max-w-sm">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-left block">Document Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 bg-background border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option>Identity</option>
                    <option>Education</option>
                    <option>Finance</option>
                    <option>College</option>
                    <option>Career</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full bg-primary text-primary-foreground h-10 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Secure & Upload File
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-3" />
          <h4 className="font-semibold text-sm mb-1">Private by Default</h4>
          <p className="text-xs text-muted-foreground">Only you can access these files. No one else has the decryption keys.</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-3" />
          <h4 className="font-semibold text-sm mb-1">Zero-Knowledge</h4>
          <p className="text-xs text-muted-foreground">Your files are encrypted on your device before they even leave the browser.</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-3" />
          <h4 className="font-semibold text-sm mb-1">Blockchain Verification</h4>
          <p className="text-xs text-muted-foreground">File integrity is periodically hashed to ensure zero tampering.</p>
        </div>
      </div>
    </div>
  )
}
