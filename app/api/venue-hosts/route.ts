import { NextResponse } from 'next/server'
import { getDbForRequest, getTenantFromRequest } from '@/db/tenanted'
import { venueHosts, parties, partyRoles } from '@/db/schema'
import { z } from 'zod'

const venueHostSchema = z.object({
  contactName: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().nullish(),
  venueName: z.string().min(1, 'Venue name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().nullish(),
  neighborhood: z.string().nullish(),
  capacity: z.number().nullish(),
  spaceType: z.string().nullish(),
  availability: z.string().nullish(),
  amenities: z.array(z.string()).default([]),
  website: z.string().nullish(),
  instagramHandle: z.string().nullish(),
  notes: z.string().nullish(),
})

export async function POST(request: Request) {
  try {
    const db = getDbForRequest(request)
    const tenant = getTenantFromRequest(request)
    const body = await request.json()
    const data = venueHostSchema.parse(body)

    // Create party for the venue (organization)
    const [venueParty] = await db.insert(parties).values({
      partyType: 'organization',
      displayName: data.venueName,
      email: data.email,
      phone: data.phone || null,
      website: data.website || null,
      socialLinks: data.instagramHandle ? { instagram: `https://instagram.com/${data.instagramHandle.replace('@', '')}` } : null,
      metadata: {
        address: data.address,
        city: data.city || 'Oakland',
        neighborhood: data.neighborhood,
        capacity: data.capacity,
        spaceType: data.spaceType,
        availability: data.availability,
        amenities: data.amenities,
        notes: data.notes,
      },
    }).returning()

    // Create party role for "venue" + "host"
    await db.insert(partyRoles).values([
      {
        partyId: venueParty.id,
        orgContextSlug: tenant.orgSlug,
        roleType: 'venue',
        roleTitle: 'Event Venue',
        metadata: {
          capacity: data.capacity,
          spaceType: data.spaceType,
          amenities: data.amenities,
        },
      },
      {
        partyId: venueParty.id,
        orgContextSlug: tenant.orgSlug,
        roleType: 'host',
        roleTitle: 'Event Host',
        metadata: {
          contactName: data.contactName,
          availability: data.availability,
        },
      },
    ])

    // Also keep the legacy venueHosts table for backward compatibility
    const cleanedData = {
      orgSlug: tenant.orgSlug,
      contactName: data.contactName,
      email: data.email,
      venueName: data.venueName,
      address: data.address,
      city: data.city || 'Oakland',
      phone: data.phone || null,
      neighborhood: data.neighborhood || null,
      capacity: data.capacity || null,
      spaceType: data.spaceType || null,
      availability: data.availability || null,
      website: data.website || null,
      instagramHandle: data.instagramHandle || null,
      notes: data.notes || null,
      amenities: data.amenities,
    }

    const [inserted] = await db.insert(venueHosts).values(cleanedData).returning({ id: venueHosts.id })

    return NextResponse.json({ 
      success: true, 
      id: inserted.id,
      partyId: venueParty.id,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      )
    }
    console.error('Venue host submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

