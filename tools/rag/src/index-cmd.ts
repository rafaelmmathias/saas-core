/**
 * Indexing pipeline — run with: pnpm rag:index
 *
 * Steps:
 *   1. Read all indexable files from REPO_ROOT
 *   2. Diff against manifest to find changed/new/deleted files
 *   3. Chunk + embed only the changed files
 *   4. Merge with existing store, pruning stale chunks
 *   5. Persist updated store and manifest
 */

import crypto from 'crypto';
import { CONFIG } from './config.js';
import { readRepoFiles } from './ingestion/reader.js';
import { chunkFile } from './ingestion/chunker.js';
import { embedChunks } from './ingestion/embedder.js';
import {
  loadRawChunks,
  saveRawChunks,
  loadManifest,
  saveManifest,
  type Manifest,
} from './db/vectorStore.js';
import type { StoredChunk } from './db/vectorStore.js';
import type { EmbeddedChunk } from './ingestion/embedder.js';

function hashContent(content: string): string {
  return crypto.createHash('sha1').update(content).digest('hex').slice(0, 16);
}

async function main() {
  const start = Date.now();
  console.log(`\nIndexing repo: ${CONFIG.REPO_ROOT}\n`);

  // 1. Read files
  process.stdout.write('Reading files...');
  const files = await readRepoFiles(CONFIG.REPO_ROOT);
  console.log(` ${files.length} files found.`);

  // 2. Diff against manifest
  const manifest = await loadManifest();
  const currentHashes: Record<string, string> = {};
  for (const f of files) currentHashes[f.relativePath] = hashContent(f.content);

  const currentPaths = new Set(files.map((f) => f.relativePath));
  const deletedPaths = Object.keys(manifest.files).filter((p) => !currentPaths.has(p));
  const changedFiles = files.filter(
    (f) => currentHashes[f.relativePath] !== manifest.files[f.relativePath],
  );

  if (changedFiles.length === 0 && deletedPaths.length === 0) {
    console.log('Nothing changed — index is up to date.');
    return;
  }

  console.log(
    `Changed: ${changedFiles.length} file(s), deleted: ${deletedPaths.length} file(s).\n`,
  );

  // 3. Chunk only changed files
  const newChunks = changedFiles.flatMap((f) => chunkFile(f));
  console.log(`Chunked into ${newChunks.length} new pieces.`);

  // 4. Load existing store, prune stale chunks
  const stale = new Set([...changedFiles.map((f) => f.relativePath), ...deletedPaths]);
  const existingChunks = await loadRawChunks();
  const keptChunks = existingChunks.filter((c) => !stale.has(c.filePath));

  // 5. Embed new chunks
  let embeddedNew: EmbeddedChunk[] = [];
  if (newChunks.length > 0) {
    embeddedNew = await embedChunks(newChunks);
  }

  const newRaw: StoredChunk[] = embeddedNew.map((c) => ({
    id: c.id,
    vector: c.vector,
    content: c.content,
    filePath: c.metadata.filePath,
    startLine: c.metadata.startLine,
    endLine: c.metadata.endLine,
    chunkIndex: c.metadata.chunkIndex,
  }));

  // 6. Merge and save
  const allChunks = [...keptChunks, ...newRaw];
  await saveRawChunks(allChunks);

  // 7. Update manifest — remove deleted, add/update changed
  const updatedFiles: Manifest['files'] = {};
  for (const [p, hash] of Object.entries(manifest.files)) {
    if (!deletedPaths.includes(p)) updatedFiles[p] = hash;
  }
  for (const [p, hash] of Object.entries(currentHashes)) {
    updatedFiles[p] = hash;
  }
  await saveManifest({ version: 1, files: updatedFiles });

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s — ${allChunks.length} chunks total.`);
  console.log(`  +${newRaw.length} new, =${keptChunks.length} kept, -${stale.size} pruned`);
  console.log(`Store: ${CONFIG.DB_PATH}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
