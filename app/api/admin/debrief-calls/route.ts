import { NextResponse } from "next/server"
import { db } from "@/db"
import { debriefCalls } from "@/db/schema"
import { desc } from "drizzle-orm"

export async function GET() {
  try {
    const calls = await db
      .select()
      .from(debriefCalls)
      .orderBy(desc(debriefCalls.createdAt))
      .limit(100)

    return NextResponse.json({ calls })
  } catch (error) {
    console.error("[Admin] Error fetching debrief calls:", error)
    return NextResponse.json(
      { error: "Failed to fetch debrief calls" },
      { status: 500 }
    )
  }
}



