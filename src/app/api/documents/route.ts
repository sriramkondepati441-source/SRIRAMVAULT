import { NextResponse } from "next/server"
import { getDocuments } from "@/lib/db"

export async function GET() {
  try {
    const docs = getDocuments()
    return NextResponse.json(docs)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}
