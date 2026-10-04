"use client"
import { useState } from "react"
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react"

export default function ChecklistsPage() {
  const [items, setItems] = useState([
    { id: 1, label: "Aadhaar Card (Updated with current phone)", completed: true },
    { id: 2, label: "Current Semester Bonafide Certificate", completed: false },
    { id: 3, label: "Vaccination Certificate (2 Doses)", completed: false },
    { id: 4, label: "Income Certificate for Scholarship (Valid for current year)", completed: false },
  ])
  const [newItem, setNewItem] = useState("")

  const toggleItem = (id: number) => {
    setItems(items.map(i => i.id === id ? { ...i, completed: !i.completed } : i))
  }

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { id: Date.now(), label: newItem.trim(), completed: false }])
      setNewItem("")
    }
  }

  const deleteItem = (id: number) => {
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Requirement Checklists</h1>
          <p className="text-muted-foreground mt-1">Keep track of documents you need to gather for applications.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">College Scholarship Application 2026</h2>
        
        <div className="space-y-3 mb-6">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors group">
              <div 
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => toggleItem(item.id)}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                )}
                <span className={`text-sm ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}>
                  {item.label}
                </span>
              </div>
              <button 
                onClick={() => deleteItem(item.id)}
                className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Add a new required document..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            className="flex-1 h-10 bg-background border border-border rounded-md px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button 
            onClick={addItem}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  )
}
