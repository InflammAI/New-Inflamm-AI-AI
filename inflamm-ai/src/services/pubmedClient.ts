// src/services/pubmedClient.ts

import axios from "axios";

const PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

// Rate limiting to avoid NCBI API limits (3 requests per second without API key)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 350; // 350ms between requests

async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`Rate limiting: waiting ${waitTime}ms`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

export async function searchPubMed(query: string) {
  try {
    console.log('Searching PubMed for:', query);
    
    // Rate limiting
    await rateLimit();
    
    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_NCBI_API_KEY || process.env.NCBI_API_KEY;
    console.log('Using API key:', apiKey ? 'Yes' : 'No');
    
    // Build search parameters
    const searchParams: any = {
      db: "pubmed",
      term: query,
      retmax: 5,
      sort: "relevance",
      retmode: "json",
    };
    
    // Add API key if available (increases rate limits to 10 requests per second)
    if (apiKey) {
      searchParams.api_key = apiKey;
    }
    
    console.log('Making search request to:', `${PUBMED_BASE}/esearch.fcgi`);
    const search = await axios.get(`${PUBMED_BASE}/esearch.fcgi`, {
      params: searchParams,
      timeout: 10000, // 10 second timeout
    });

    const ids: string[] = search.data.esearchresult.idlist;
    console.log('Found PubMed IDs:', ids);
    
    if (!ids.length) {
      console.log('No PubMed articles found for:', query);
      return [];
    }

    // Rate limiting before second request
    await rateLimit();

    // Build summary parameters
    const summaryParams: any = {
      db: "pubmed",
      id: ids.join(","),
      retmode: "json",
    };
    
    // Add API key if available
    if (apiKey) {
      summaryParams.api_key = apiKey;
    }

    console.log('Making summary request for IDs:', ids.join(','));
    const summary = await axios.get(`${PUBMED_BASE}/esummary.fcgi`, {
      params: summaryParams,
      timeout: 10000, // 10 second timeout
    });

    const results = Object.values(summary.data.result)
      .filter((item: any) => item.uid)
      .map((item: any) => ({
        title: item.title,
        journal: item.fulljournalname || 'Unknown Journal',
        year: item.pubdate?.split(" ")[0] || 'Unknown Year',
        authors: item.authors?.map((a: any) => a.name).join(", ") || 'Unknown Authors',
        pubmedId: item.uid,
        link: `https://pubmed.ncbi.nlm.nih.gov/${item.uid}/`,
      }));
    
    console.log('Processed PubMed results:', results.length);
    return results;
  } catch (error) {
    console.error('Error searching PubMed:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
      });
    }
    return [];
  }
}

/**
 * PubMed Client Service
 * A comprehensive client for interacting with NCBI PubMed/E-utilities API
 */

export interface PubMedArticle {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  publicationDate: string;
  doi?: string;
  meshTerms: string[];
  url: string;
  volume?: string;
  issue?: string;
  pages?: string;
  issn?: string;
  language?: string;
  publicationTypes: string[];
  keywords?: string[];
}

export interface PubMedSearchResult {
  id: string;
  title: string;
  snippet: string;
  publicationDate: string;
  authors: string[];
  journal: string;
  abstract?: string;
  doi?: string;
  pmcid?: string;
}

export interface PubMedSearchParams {
  query: string;
  maxResults?: number;
  daysBack?: number;
  sortBy?: 'relevance' | 'date' | 'journal' | 'author';
  filter?: {
    articleTypes?: string[];
    languages?: string[];
    journals?: string[];
    dateRange?: {
      start?: string;
      end?: string;
    };
  };
}

export class PubMedClient {
  private baseUrl: string = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
  private apiKey: string;
  private rateLimitMs: number = 100; // 100ms between requests

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_NCBI_API_KEY || '';
  }

  /**
   * Search PubMed for articles with advanced filtering
   */
  async searchArticles(params: PubMedSearchParams): Promise<PubMedSearchResult[]> {
    try {
      await this.rateLimitDelay();

      const searchUrl = `${this.baseUrl}/esearch.fcgi`;
      const searchParams = new URLSearchParams({
        db: 'pubmed',
        term: this.buildSearchQuery(params),
        retmode: 'json',
        retmax: (params.maxResults || 20).toString(),
        sort: params.sortBy || 'relevance',
      });

      // Add date filtering
      if (params.daysBack) {
        searchParams.set('datetype', 'pdat');
        searchParams.set('reldate', params.daysBack.toString());
      } else if (params.filter?.dateRange?.start) {
        searchParams.set('datetype', 'pdat');
        searchParams.set('mindate', params.filter.dateRange.start);
        searchParams.set('maxdate', params.filter.dateRange.end || '3000/12/31');
      }

      if (this.apiKey) {
        searchParams.append('api_key', this.apiKey);
      }

      const searchResponse = await fetch(`${searchUrl}?${searchParams}`);
      const searchData = await searchResponse.json();

      if (!searchData.esearchresult?.idlist?.length) {
        return [];
      }

      // Fetch summaries for the found articles
      const summaryUrl = `${this.baseUrl}/esummary.fcgi`;
      const summaryParams = new URLSearchParams({
        db: 'pubmed',
        id: searchData.esearchresult.idlist.join(','),
        retmode: 'json',
      });

      if (this.apiKey) {
        summaryParams.append('api_key', this.apiKey);
      }

      await this.rateLimitDelay();
      const summaryResponse = await fetch(`${summaryUrl}?${summaryParams}`);
      const summaryData = await summaryResponse.json();

      const results: PubMedSearchResult[] = [];
      const articles = summaryData.result;

      for (const pmid of searchData.esearchresult.idlist) {
        const article = articles[pmid];
        if (article) {
          results.push({
            id: pmid,
            title: article.title || 'No title available',
            snippet: this.extractSnippet(article),
            publicationDate: article.pubdate || 'Unknown',
            authors: this.extractAuthors(article),
            journal: article.source || 'Unknown journal',
            abstract: article.abstract,
            doi: article.doi,
            pmcid: article.pmcid,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error searching PubMed articles:', error);
      return [];
    }
  }

  /**
   * Get detailed article information including abstract
   */
  async getArticleDetails(pmid: string): Promise<PubMedArticle | null> {
    try {
      await this.rateLimitDelay();

      const fetchUrl = `${this.baseUrl}/efetch.fcgi`;
      const params = new URLSearchParams({
        db: 'pubmed',
        id: pmid,
        retmode: 'xml',
        rettype: 'full',
      });

      if (this.apiKey) {
        params.append('api_key', this.apiKey);
      }

      const response = await fetch(`${fetchUrl}?${params}`);
      const xmlText = await response.text();

      return this.parseArticleXML(xmlText, pmid);
    } catch (error) {
      console.error('Error fetching article details:', error);
      return null;
    }
  }

  /**
   * Get articles by specific journal
   */
  async getArticlesByJournal(
    journal: string,
    maxResults: number = 20,
    daysBack: number = 365
  ): Promise<PubMedSearchResult[]> {
    return this.searchArticles({
      query: `${journal}[journal]`,
      maxResults,
      daysBack,
    });
  }

  /**
   * Get recent articles in inflammation research
   */
  async getInflammationArticles(maxResults: number = 15): Promise<PubMedSearchResult[]> {
    const inflammationQuery = '(inflammation[MeSH Terms] OR inflammatory[Title/Abstract]) AND ("2023"[Date - Publication] : "3000"[Date - Publication])';
    return this.searchArticles({
      query: inflammationQuery,
      maxResults,
      daysBack: 730,
    });
  }

  /**
   * Search for clinical trials
   */
  async searchClinicalTrials(query: string, maxResults: number = 10): Promise<PubMedSearchResult[]> {
    const clinicalTrialQuery = `${query} AND (clinical trial[Publication Type] OR randomized[Title/Abstract])`;
    return this.searchArticles({
      query: clinicalTrialQuery,
      maxResults,
    });
  }

  /**
   * Get articles by specific author
   */
  async getArticlesByAuthor(author: string, maxResults: number = 10): Promise<PubMedSearchResult[]> {
    return this.searchArticles({
      query: `${author}[Author]`,
      maxResults,
    });
  }

  /**
   * Get related articles based on PMIDs
   */
  async getRelatedArticles(pmids: string[], maxResults: number = 10): Promise<PubMedSearchResult[]> {
    try {
      await this.rateLimitDelay();

      const linkUrl = `${this.baseUrl}/elink.fcgi`;
      const params = new URLSearchParams({
        dbfrom: 'pubmed',
        db: 'pubmed',
        id: pmids.join(','),
        retmode: 'json',
        cmd: 'neighbor_score',
      });

      if (this.apiKey) {
        params.append('api_key', this.apiKey);
      }

      const response = await fetch(`${linkUrl}?${params}`);
      const data = await response.json();

      if (!data.linksets?.[0]?.links?.length) {
        return [];
      }

      const relatedIds = data.linksets[0].links.slice(0, maxResults);
      const details = await Promise.all(
        relatedIds.map((id: string) => this.getArticleDetails(id))
      );

      return details
        .filter((article): article is PubMedArticle => article !== null)
        .map(article => ({
          id: article.pmid,
          title: article.title,
          snippet: article.abstract.substring(0, 300) + '...',
          publicationDate: article.publicationDate,
          authors: article.authors,
          journal: article.journal,
          abstract: article.abstract,
          doi: article.doi,
        }));
    } catch (error) {
      console.error('Error fetching related articles:', error);
      return [];
    }
  }

  /**
   * Get articles by MeSH terms
   */
  async getArticlesByMeSH(meshTerms: string[], maxResults: number = 10): Promise<PubMedSearchResult[]> {
    const meshQuery = meshTerms.map(term => `${term}[MeSH Terms]`).join(' OR ');
    return this.searchArticles({
      query: meshQuery,
      maxResults,
    });
  }

  /**
   * Build advanced search query
   */
  private buildSearchQuery(params: PubMedSearchParams): string {
    let query = params.query;

    // Add filters
    if (params.filter) {
      const filters: string[] = [];

      if (params.filter.articleTypes?.length) {
        filters.push(`(${params.filter.articleTypes.map(type => `${type}[Publication Type]`).join(' OR ')})`);
      }

      if (params.filter.languages?.length) {
        filters.push(`(${params.filter.languages.map(lang => `${lang}[Language]`).join(' OR ')})`);
      }

      if (params.filter.journals?.length) {
        filters.push(`(${params.filter.journals.map(journal => `${journal}[Journal]`).join(' OR ')})`);
      }

      if (filters.length > 0) {
        query += ` AND ${filters.join(' AND ')}`;
      }
    }

    return query;
  }

  /**
   * Parse XML response from efetch
   */
  private parseArticleXML(xmlText: string, pmid: string): PubMedArticle | null {
    try {
      // Extract basic article information
      const titleMatch = xmlText.match(/<ArticleTitle>(.*?)<\/ArticleTitle>/);
      const abstractMatch = xmlText.match(/<AbstractText[^>]*>(.*?)<\/AbstractText>/);
      const journalMatch = xmlText.match(/<ISOAbbreviation>(.*?)<\/ISOAbbreviation>/);
      const dateMatch = xmlText.match(/<PubDate>.*?<Year>(\d{4})<\/Year>.*?<Month>(\w+)<\/Month>.*?<Day>(\d+)<\/Day>.*?<\/PubDate>/);
      const doiMatch = xmlText.match(/<ELocationID[^>]*EIdType="doi"[^>]*>(.*?)<\/ELocationID>/);
      const volumeMatch = xmlText.match(/<Volume>(.*?)<\/Volume>/);
      const issueMatch = xmlText.match(/<Issue>(.*?)<\/Issue>/);
      const pagesMatch = xmlText.match(/<MedlinePgn>(.*?)<\/MedlinePgn>/);
      const issnMatch = xmlText.match(/<ISSNLinking>(.*?)<\/ISSNLinking>/);
      const languageMatch = xmlText.match(/<Language>(.*?)<\/Language>/);
      const authorMatches = xmlText.matchAll(/<Author[^>]*>.*?<LastName>(.*?)<\/LastName>.*?<ForeName>(.*?)<\/ForeName>.*?<\/Author>/g);
      const meshMatches = xmlText.matchAll(/<DescriptorName[^>]*>(.*?)<\/DescriptorName>/g);
      const pubTypeMatches = xmlText.matchAll(/<PublicationType[^>]*>(.*?)<\/PublicationType>/g);
      const keywordMatches = xmlText.matchAll(/<Keyword[^>]*>(.*?)<\/Keyword>/g);

      const title = titleMatch?.[1] || 'No title available';
      const abstract = abstractMatch?.[1] || 'No abstract available';
      const journal = journalMatch?.[1] || 'Unknown journal';
      const publicationDate = dateMatch ? `${dateMatch[2]} ${dateMatch[3]}, ${dateMatch[1]}` : 'Unknown date';
      const doi = doiMatch?.[1];
      const volume = volumeMatch?.[1];
      const issue = issueMatch?.[1];
      const pages = pagesMatch?.[1];
      const issn = issnMatch?.[1];
      const language = languageMatch?.[1];
      const authors = Array.from(authorMatches).map(match => `${match[2]} ${match[1]}`);
      const meshTerms = Array.from(meshMatches).map(match => match[1]);
      const publicationTypes = Array.from(pubTypeMatches).map(match => match[1]);
      const keywords = Array.from(keywordMatches).map(match => match[1]);

      return {
        pmid,
        title,
        abstract,
        authors,
        journal,
        publicationDate,
        doi,
        meshTerms,
        url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        volume,
        issue,
        pages,
        issn,
        language,
        publicationTypes,
        keywords,
      };
    } catch (error) {
      console.error('Error parsing article XML:', error);
      return null;
    }
  }

  /**
   * Extract snippet from article summary
   */
  private extractSnippet(article: any): string {
    if (article.abstract) {
      return article.abstract.substring(0, 300) + '...';
    }
    if (article.title) {
      return article.title;
    }
    return 'No preview available';
  }

  /**
   * Extract authors from article summary
   */
  private extractAuthors(article: any): string[] {
    if (article.authors && Array.isArray(article.authors)) {
      return article.authors.map((author: any) => 
        author.name || `${author.forename} ${author.lastname}` || 'Unknown author'
      ).slice(0, 10); // Limit to first 10 authors
    }
    return [];
  }

  /**
   * Rate limiting helper
   */
  private async rateLimitDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.rateLimitMs));
  }
}

// Export singleton instance
export const pubmedClient = new PubMedClient();
