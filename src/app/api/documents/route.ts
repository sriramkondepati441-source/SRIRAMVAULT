import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Fetch docs error:", error)
      return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
    }

    // Map to the format the UI expects
    const formattedDocs = documents.map(doc => ({
      id: doc.id,
      name: doc.display_name,
      category: doc.categories?.name || 'Other',
      date: new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      size: doc.size_bytes,
      path: doc.storage_path
    }))

    return NextResponse.json(formattedDocs)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
