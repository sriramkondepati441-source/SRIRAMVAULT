import { NextRequest, NextResponse } from "next/server"
import { saveToDb } from "@/lib/db"
import fs from "fs"
import path from "path"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Create a secure storage directory
    const storageDir = path.join(process.cwd(), "private_storage")
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true })
    }

    // Generate secure unique filename
    const fileId = crypto.randomUUID()
    const extension = path.extname(file.name) || ""
    const secureFileName = `${fileId}${extension}`
    const filePath = path.join(storageDir, secureFileName)

    // Save the file securely to disk
    fs.writeFileSync(filePath, buffer)

    // Save metadata to database
    const docMeta = {
      id: fileId,
      name: file.name,
      category: category || "Other",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      size: file.size,
      path: secureFileName
    }

    saveToDb(docMeta)

    return NextResponse.json({ success: true, document: docMeta })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
