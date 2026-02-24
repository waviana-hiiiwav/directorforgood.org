import { NextResponse } from 'next/server';
import { db } from '@/db';
import { deckVersions } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/deck-content/versions/[id] - Get a specific version's full content
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const versionId = parseInt(id, 10);

    if (isNaN(versionId)) {
      return NextResponse.json({ error: 'Invalid version ID' }, { status: 400 });
    }

    const [version] = await db
      .select()
      .from(deckVersions)
      .where(eq(deckVersions.id, versionId))
      .limit(1);

    if (!version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }

    return NextResponse.json(version);
  } catch (error) {
    console.error('Error fetching deck version:', error);
    return NextResponse.json({ error: 'Failed to fetch version' }, { status: 500 });
  }
}






