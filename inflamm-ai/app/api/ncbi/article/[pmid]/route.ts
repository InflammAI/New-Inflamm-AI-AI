import { NextRequest, NextResponse } from 'next/server';
import { searchPubMed } from '../../../../../src/services/pubmedClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { pmid: string } }
) {
  try {
    const pmid = params.pmid;

    if (!pmid) {
      return NextResponse.json(
        { error: 'PMID parameter is required' },
        { status: 400 }
      );
    }

    // For now, return basic article info using searchPubMed
    // TODO: Implement detailed article fetching
    const articles = await searchPubMed(pmid);
    const article = articles.find(a => a.pubmedId === pmid);

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      article,
    });

  } catch (error) {
    console.error('Error fetching article details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article details' },
      { status: 500 }
    );
  }
}
