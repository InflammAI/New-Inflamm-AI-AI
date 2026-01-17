import { NextRequest, NextResponse } from 'next/server';
import { searchPubMed } from '../../../../src/services/pubmedClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const maxResults = parseInt(searchParams.get('maxResults') || '10');
    const daysBack = parseInt(searchParams.get('daysBack') || '365');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const results = await searchPubMed(query);

    return NextResponse.json({
      success: true,
      results,
      total: results.length,
      query,
    });

  } catch (error) {
    console.error('Error searching NCBI articles:', error);
    return NextResponse.json(
      { error: 'Failed to search articles' },
      { status: 500 }
    );
  }
}
