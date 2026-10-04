import fs from "fs"
import path from "path"

const DB_FILE = path.join(process.cwd(), "local_db.json")

export type DocumentMeta = {
  id: string
  name: string
  category: string
  date: string
  size: number
  path: string
}

export function getDb(): { documents: DocumentMeta[] } {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ documents: [] }))
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"))
}

export function saveToDb(doc: DocumentMeta) {
  const db = getDb()
  db.documents.push(doc)
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}

export function getDocuments(): DocumentMeta[] {
  return getDb().documents
}
