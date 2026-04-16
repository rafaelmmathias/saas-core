/**
 * Indexing pipeline — run with: pnpm --filter @saas-core/rag rag:index
 *
 * Steps:
 *   1. Read all indexable files from REPO_ROOT
 *   2. Chunk each file (code-aware)
 *   3. Embed all chunks via OpenAI
 *   4. Persist to JSON vector store
 */

import { CONFIG } from './config.js';
import { readRepoFiles } from './ingestion/reader.js';
import { chunkFile } from './ingestion/chunker.js';
import { embedChunks } from './ingestion/embedder.js';
import { saveIndex } from './db/vectorStore.js';

async function main() {
  const start = Date.now();
  console.log(`\nIndexing repo: ${CONFIG.REPO_ROOT}\n`);

  // 1. Read files
  process.stdout.write('Reading files...');
  const files = await readRepoFiles(CONFIG.REPO_ROOT);
  console.log(` ${files.length} files found.`);

  // 2. Chunk
  const chunks = files.flatMap((f) => chunkFile(f));
  console.log(`Chunked into ${chunks.length} pieces.\n`);

  if (chunks.length === 0) {
    console.error('No chunks produced. Check INCLUDE_EXTENSIONS and REPO_ROOT.');
    process.exit(1);
  }

  // 3. Embed
  const embedded = await embedChunks(chunks);

  // 4. Save
  await saveIndex(embedded);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s — ${embedded.length} chunks indexed.`);
  console.log(`Store: ${CONFIG.DB_PATH}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
