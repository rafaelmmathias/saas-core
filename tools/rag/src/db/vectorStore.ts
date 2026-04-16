import fs from 'fs/promises';
import path from 'path';
import { CONFIG } from '../config.js';
import type { EmbeddedChunk } from '../ingestion/embedder.js';

export interface StoredChunk {
  id: string;
  vector: number[];
  content: string;
  filePath: string;
  startLine: number;
  endLine: number;
  chunkIndex: number;
}

interface VectorStore {
  createdAt: string;
  model: string;
  chunks: StoredChunk[];
}

// ─── Persistence ────────────────────────────────────────────────────────────

export async function saveIndex(chunks: EmbeddedChunk[]): Promise<void> {
  await fs.mkdir(path.dirname(CONFIG.DB_PATH), { recursive: true });

  const store: VectorStore = {
    createdAt: new Date().toISOString(),
    model: CONFIG.EMBEDDINGS_MODEL,
    chunks: chunks.map((c) => ({
      id: c.id,
      vector: c.vector,
      content: c.content,
      filePath: c.metadata.filePath,
      startLine: c.metadata.startLine,
      endLine: c.metadata.endLine,
      chunkIndex: c.metadata.chunkIndex,
    })),
  };

  await fs.writeFile(CONFIG.DB_PATH, JSON.stringify(store));
}

async function loadIndex(): Promise<VectorStore> {
  let raw: string;
  try {
    raw = await fs.readFile(CONFIG.DB_PATH, 'utf-8');
  } catch {
    throw new Error(
      `Index not found at ${CONFIG.DB_PATH}.\nRun: pnpm --filter @saas-core/rag rag:index`,
    );
  }
  return JSON.parse(raw) as VectorStore;
}

// ─── Retrieval ───────────────────────────────────────────────────────────────

/**
 * Pure in-memory cosine similarity search.
 * For this repo size (hundreds of chunks), this is instant — no vector DB needed.
 */
export async function searchChunks(
  queryVector: number[],
  topK: number = CONFIG.TOP_K,
): Promise<StoredChunk[]> {
  const store = await loadIndex();

  return store.chunks
    .map((chunk) => ({ chunk, score: cosineSimilarity(queryVector, chunk.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((r) => r.chunk);
}

export async function getIndexStats(): Promise<{
  chunks: number;
  createdAt: string;
  model: string;
}> {
  const store = await loadIndex();
  return { chunks: store.chunks.length, createdAt: store.createdAt, model: store.model };
}

// ─── Math ────────────────────────────────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
