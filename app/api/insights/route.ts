import { NextRequest, NextResponse } from 'next/server';
import { generateInsights } from '@/lib/ai/analyzer';

/* ------------------------------------------------------------------ */
/*  Simple in-memory cache (1 hour TTL)                                */
/* ------------------------------------------------------------------ */

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCacheKey(body: unknown): string {
  return 'insights_' + JSON.stringify(body);
}

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown): void {
  // Evict old entries if cache grows too large
  if (cache.size > 100) {
    const now = Date.now();
    for (const [k, v] of cache) {
      if (now > v.expiresAt) cache.delete(k);
    }
  }
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

/* ------------------------------------------------------------------ */
/*  POST /api/insights                                                 */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stats, recentConversations } = body;

    if (!stats) {
      return NextResponse.json(
        { error: 'Se requiere el objeto stats' },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = getCacheKey({ stats });
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Compute common objections and avg score from recent conversations
    const commonObjections: string[] = [];
    let totalScore = 0;
    let scoreCount = 0;

    if (Array.isArray(recentConversations)) {
      for (const conv of recentConversations) {
        if (conv.status === 'closed_lost') {
          commonObjections.push('Prospecto no convencido');
        }
        // Use message count as a rough proxy for engagement score
        const msgCount = Array.isArray(conv.messages) ? conv.messages.length : 0;
        totalScore += Math.min(100, msgCount * 10);
        scoreCount++;
      }
    }

    const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 50;

    // Call the existing generateInsights function
    const insights = await generateInsights({
      totalConversations: stats.totalConversations ?? 0,
      closedWon: stats.closedWon ?? 0,
      closedLost: stats.closedLost ?? 0,
      avgResponseTime: 5, // Default since we don't track this yet
      commonObjections: commonObjections.slice(0, 5),
      avgScore,
    });

    // Map the response to the format the frontend expects
    const response = {
      overallAssessment: categorizeAssessment(
        stats.closedWon ?? 0,
        stats.totalConversations ?? 0
      ),
      overallSummary: insights.overallAssessment,
      strengths: insights.strengths,
      opportunities: insights.weaknesses,
      recommendations: insights.recommendations,
      projectedCloseRate: insights.projectedCloseRate,
      generatedAt: new Date().toISOString(),
    };

    // Cache the result
    setCache(cacheKey, response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /insights] Error:', error);
    return NextResponse.json(
      { error: 'Error interno al generar insights' },
      { status: 500 }
    );
  }
}

function categorizeAssessment(
  closedWon: number,
  total: number
): 'excelente' | 'bueno' | 'mejorable' | 'critico' {
  if (total === 0) return 'mejorable';
  const rate = (closedWon / total) * 100;
  if (rate >= 60) return 'excelente';
  if (rate >= 40) return 'bueno';
  if (rate >= 20) return 'mejorable';
  return 'critico';
}
