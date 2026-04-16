/**
 * Query CLI — run with: pnpm rag:query "your question here"
 *
 * Steps:
 *   1. Embed the query locally (no API key needed)
 *   2. Retrieve top-K similar chunks from the vector store
 *   3. Write context to data/context.md
 *   4. Tell you how to reference it in Claude Code
 */

import path from 'path';
import { retrieve } from './query/retriever.js';
import { writeContext } from './query/generator.js';
import { CONFIG } from './config.js';

async function main() {
  const query = process.argv.slice(2).join(' ').trim();

  if (!query) {
    console.error('Usage: pnpm rag:query "your question"\n');
    console.error('Examples:');
    console.error('  pnpm rag:query "How does theming work?"');
    console.error('  pnpm rag:query "Where are form wrappers defined?"');
    process.exit(1);
  }

  console.log(`\nQuery: "${query}"`);
  process.stdout.write('Embedding query...');

  const ctx = await retrieve(query);
  console.log(` done`);

  const sources = [...new Set(ctx.chunks.map(c => c.filePath))];
  console.log(`\nTop ${ctx.chunks.length} chunks from:`);
  sources.forEach(s => console.log(`  · ${s}`));

  const contextFile = await writeContext(ctx);

  // Make the path relative to repo root for the @ reference
  const repoRelative = path
    .relative(CONFIG.REPO_ROOT, contextFile)
    .replace(/\\/g, '/');

  console.log(`\nContext saved to: ${repoRelative}`);
  const sep = '-'.repeat(60);
  console.log(`\n${sep}`);
  console.log(`\nIn Claude Code, paste this:\n`);
  console.log(`  @${repoRelative} ${query}`);
  console.log(`\n${sep}`);
}

main().catch(err => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
