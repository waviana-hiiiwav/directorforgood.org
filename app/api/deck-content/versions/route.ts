import { NextResponse } from 'next/server';
import { db } from '@/db';
import { deckVersions } from '@/db/schema';
import { desc } from 'drizzle-orm';

// GET /api/deck-content/versions - List all versions
export async function GET() {
  try {
    const versions = await db
      .select({
        id: deckVersions.id,
        description: deckVersions.description,
        createdBy: deckVersions.createdBy,
        createdAt: deckVersions.createdAt,
      })
      .from(deckVersions)
      .orderBy(desc(deckVersions.createdAt))
      .limit(50);

    return NextResponse.json(versions);
  } catch (error) {
    console.error('Error fetching deck versions:', error);
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
  }
}






