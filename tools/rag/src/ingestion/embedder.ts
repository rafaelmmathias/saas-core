import { FlagEmbedding, EmbeddingModel } from 'fastembed';
import type { Chunk } from './chunker.js';

// BAAI/bge-small-en-v1.5 — 384 dims, ~66MB download (cached), great for code search
const MODEL = EmbeddingModel.BGESmallENV15;
const BATCH_SIZE = 32;
const MAX_CHARS = 512; // ~128 tokens — safe limit for this model

let _model: FlagEmbedding | null = null;

async function getModel(): Promise<FlagEmbedding> {
  if (!_model) {
    _model = await FlagEmbedding.init({
      model: MODEL,
      cacheDir: process.env['HF_CACHE'],
    });
  }
  return _model;
}

export interface EmbeddedChunk extends Chunk {
  vector: number[];
}

export async function embedChunks(chunks: Chunk[]): Promise<EmbeddedChunk[]> {
  const model = await getModel();
  const texts = chunks.map(c => c.content.slice(0, MAX_CHARS));
  const results: EmbeddedChunk[] = [];
  let i = 0;

  // embed() yields batches of Float32Array (one per input text)
  for await (const batch of model.embed(texts, BATCH_SIZE)) {
    for (const vec of batch) {
      const chunk = chunks[i];
      if (chunk) results.push({ ...chunk, vector: Array.from(vec) });
      i++;
    }
    process.stdout.write(`\r  Embedded ${i}/${chunks.length} chunks...`);
  }

  process.stdout.write('\n');
  return results;
}

export async function embedQuery(query: string): Promise<number[]> {
  const model = await getModel();
  // queryEmbed returns Promise<Float32Array> for a single query
  const vec = await model.queryEmbed(query.slice(0, MAX_CHARS));
  return Array.from(vec);
}
