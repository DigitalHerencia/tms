"use server";

import { NextRequest, NextResponse } from 'next/server';
import { validateSessionClaims, createTestSessionClaims } from '@/lib/auth/session-claims-utils';
import type { SystemRole } from '@/types/abac';

export async function POST(req: NextRequest) {
  try {
    const { user, session } = await req.json();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Missing user data' }, { status: 400 });
    }

    const role = (user.public_metadata?.role as SystemRole) || 'member';
    const organizationId =
      user.private_metadata?.organizationId ||
      user.public_metadata?.organizationId ||
      '';

    const claims = createTestSessionClaims({
      userId: user.id,
      organizationId,
      role,
      onboardingComplete: user.public_metadata?.onboardingComplete ?? false,
    });

    // Enrich with real user info
    claims.firstName = user.first_name ?? claims.firstName;
    claims.lastName = user.last_name ?? claims.lastName;
    claims.primaryEmail = user.email_addresses?.[0]?.email_address ?? claims.primaryEmail;
    claims.fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || claims.fullName;
    if (session?.last_active_at) {
      claims.metadata = {
        ...claims.metadata,
        lastLogin: new Date(session.last_active_at).toISOString(),
      };
    }

    const validation = validateSessionClaims(claims);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid claims', details: validation.errors },
        { status: 500 }
      );
    }

    return NextResponse.json(claims);
  } catch (error) {
    console.error('[session-claims]', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
