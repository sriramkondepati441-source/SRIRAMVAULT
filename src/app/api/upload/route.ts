import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import crypto from "crypto"

// Magic bytes for PDF, JPG, PNG
const MAGIC_BYTES = {
  pdf: [0x25, 0x50, 0x44, 0x46],
  jpg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
}

function verifyMagicBytes(buffer: Buffer, type: 'pdf' | 'jpg' | 'png'): boolean {
  const magic = MAGIC_BYTES[type]
  for (let i = 0; i < magic.length; i++) {
    if (buffer[i] !== magic[i]) return false
  }
  return true
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const categoryName = formData.get("category") as string || "Other"

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Verify file type using magic bytes
    let fileType: 'pdf' | 'jpg' | 'png' | null = null
    if (verifyMagicBytes(buffer, 'pdf')) fileType = 'pdf'
    else if (verifyMagicBytes(buffer, 'jpg')) fileType = 'jpg'
    else if (verifyMagicBytes(buffer, 'png')) fileType = 'png'

    if (!fileType) {
      return NextResponse.json({ error: "Invalid file type. Only PDF, JPG, and PNG are allowed." }, { status: 400 })
    }

    // Compute SHA-256
    const hashSum = crypto.createHash('sha256')
    hashSum.update(buffer)
    const sha256 = hashSum.digest('hex')

    // Find or create category
    let categoryId = null
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .eq('owner_id', user.id)
      .single()

    if (catData) {
      categoryId = catData.id
    } else {
      const { data: newCat } = await supabase
        .from('categories')
        .insert({ name: categoryName })
        .select('id')
        .single()
      if (newCat) categoryId = newCat.id
    }

    const fileId = crypto.randomUUID()
    const storagePath = `${user.id}/${fileId}.${fileType}`

    // 1. Upload to Supabase Storage
    const { error: storageError } = await supabase
      .storage
      .from('vault-documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (storageError) {
      console.error("Storage upload failed:", storageError)
      return NextResponse.json({ error: "Storage error" }, { status: 500 })
    }

    // 2. Insert into Documents table
    const { data: docData, error: dbError } = await supabase
      .from('documents')
      .insert({
        id: fileId,
        category_id: categoryId,
        display_name: file.name,
        storage_path: storagePath,
        mime_type: file.type,
        size_bytes: file.size,
        sha256: sha256,
        tags: [categoryName]
      })
      .select()
      .single()

    if (dbError) {
      console.error("DB insert failed:", dbError)
      // Rollback storage
      await supabase.storage.from('vault-documents').remove([storagePath])
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // 3. Log Audit Event
    await supabase.from('audit_events').insert({
      event_type: 'DOCUMENT_UPLOADED',
      metadata: { document_id: fileId, size: file.size }
    })

    return NextResponse.json({ success: true, document: docData })
  } catch (error) {
    console.error("Upload route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
