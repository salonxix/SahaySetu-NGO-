import { NextResponse } from 'next/server';
import { NgoDataStore } from '@/lib/db/ngo-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    const search = searchParams.get('search');
    const state = searchParams.get('state');

    let schemes = await NgoDataStore.getAllSchemes();

    if (sector && sector !== 'All') {
      schemes = schemes.filter(
        (s) => s.sector.toLowerCase().includes(sector.toLowerCase())
      );
    }

    if (state && state !== 'All India') {
      schemes = schemes.filter(
        (s) =>
          s.applicableStates.includes('All India') ||
          s.applicableStates.includes(state)
      );
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      schemes = schemes.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      data: schemes,
      count: schemes.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch schemes catalog',
      },
      { status: 500 }
    );
  }
}
