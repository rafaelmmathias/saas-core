import { embedQuery } from '../ingestion/embedder.js';
import { searchChunks, type StoredChunk } from '../db/vectorStore.js';
import { CONFIG } from '../config.js';

export interface RetrievedContext {
  chunks: StoredChunk[];
  query: string;
}

export async function retrieve(query: string, topK?: number): Promise<RetrievedContext> {
  const queryVector = await embedQuery(query);
  const chunks = await searchChunks(queryVector, topK ?? CONFIG.TOP_K);
  return { chunks, query };
}
