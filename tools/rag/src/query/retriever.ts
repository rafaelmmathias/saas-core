import { embedQuery } from '../ingestion/embedder.js';
import { searchChunks, type ScoredChunk } from '../db/vectorStore.js';
import { CONFIG } from '../config.js';

export interface RetrievedContext {
  chunks: ScoredChunk[];
  query: string;
}

// ─── Path boosting ────────────────────────────────────────────────────────────

export const STOP_WORDS = new Set([
  'how',
  'does',
  'the',
  'work',
  'works',
  'a',
  'an',
  'to',
  'add',
  'new',
  'create',
  'use',
  'make',
  'what',
  'is',
  'are',
  'do',
  'did',
  'can',
  'should',
  'would',
  'could',
  'get',
  'set',
  'between',
  'and',
  'or',
  'of',
  'in',
  'for',
  'with',
  'from',
  'that',
  'this',
  'it',
  'at',
  'by',
  'as',
  'using',
  'used',
]);

export const PATH_BOOST = 0.1; // added to score per matching keyword in file path

export function extractKeywords(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
}

/**
 * Returns a boost value if any keyword shares a 4+ char common prefix with a path token.
 * Handles morphological variants like "theming"↔"theme", "auth"↔"authentication", etc.
 */
export function commonPrefixLen(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

export const MIN_PREFIX = 4;

export function computePathBoost(filePath: string, keywords: string[]): number {
  const pathTokens = filePath.toLowerCase().split(/[/.\-_]/);
  const matches = keywords.filter((kw) =>
    pathTokens.some(
      (token) => token.length >= MIN_PREFIX && commonPrefixLen(kw, token) >= MIN_PREFIX,
    ),
  );
  return matches.length * PATH_BOOST;
}

// ─── Retrieval ────────────────────────────────────────────────────────────────

export async function retrieve(query: string, topK?: number): Promise<RetrievedContext> {
  const k = topK ?? CONFIG.TOP_K;
  const queryVector = await embedQuery(query);

  // Fetch all chunks above threshold so path-boosted results aren't pre-sliced out
  const candidates = await searchChunks(queryVector, Number.MAX_SAFE_INTEGER);

  // Re-rank: add path boost so files whose paths mention query keywords rise above
  // generic UI code that happens to score similarly via embedding alone
  const keywords = extractKeywords(query);
  const reranked = candidates
    .map((chunk) => ({ ...chunk, score: chunk.score + computePathBoost(chunk.filePath, keywords) }))
    .sort((a, b) => b.score - a.score);

  // Limit chunks per file to force result diversity, then take top-K
  const countPerFile = new Map<string, number>();
  const chunks = reranked
    .filter((chunk) => {
      const count = countPerFile.get(chunk.filePath) ?? 0;
      if (count >= CONFIG.MAX_CHUNKS_PER_FILE) return false;
      countPerFile.set(chunk.filePath, count + 1);
      return true;
    })
    .slice(0, k);

  return { chunks, query };
}
