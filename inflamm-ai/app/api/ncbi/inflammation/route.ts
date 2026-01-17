import { NextRequest, NextResponse } from 'next/server';
import { searchPubMed } from '../../../../src/services/pubmedClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '15');

    const articles = await searchPubMed('inflammation');

    return NextResponse.json({
      success: true,
      articles,
      total: articles.length,
      category: 'inflammation',
    });

  } catch (error) {
    console.error('Error fetching inflammation articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inflammation articles' },
      { status: 500 }
    );
  }
}
