import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // 1. Fetch document metadata to ensure ownership and get storage path
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('storage_path')
      .eq('id', id)
      .single()

    if (fetchError || !doc) {
      return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 })
    }

    // 2. Generate a 60-second signed URL
    const { data: signedData, error: signError } = await supabase
      .storage
      .from('vault-documents')
      .createSignedUrl(doc.storage_path, 60)

    if (signError) {
      return NextResponse.json({ error: "Failed to generate access URL" }, { status: 500 })
    }

    // Log the download event
    await supabase.from('audit_events').insert({
      event_type: 'DOCUMENT_DOWNLOADED',
      metadata: { document_id: id }
    })

    return NextResponse.json({ signedUrl: signedData.signedUrl })
  } catch (error) {
    console.error("Signed URL error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // 1. Fetch document to ensure ownership and get storage path
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('storage_path')
      .eq('id', id)
      .single()

    if (fetchError || !doc) {
      return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 })
    }

    // 2. Delete from DB (RLS ensures they own it)
    const { error: dbDeleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)

    if (dbDeleteError) {
      return NextResponse.json({ error: "Failed to delete document metadata" }, { status: 500 })
    }

    // 3. Delete from Storage
    const { error: storageDeleteError } = await supabase
      .storage
      .from('vault-documents')
      .remove([doc.storage_path])

    if (storageDeleteError) {
      console.error("Orphan file created in storage:", storageDeleteError)
    }

    // Log the delete event
    await supabase.from('audit_events').insert({
      event_type: 'DOCUMENT_DELETED',
      metadata: { document_id: id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
