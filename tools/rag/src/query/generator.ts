import fs from 'fs/promises';
import path from 'path';
import { CONFIG } from '../config.js';
import type { RetrievedContext } from './retriever.js';

/**
 * Writes retrieved chunks to a Markdown file so you can reference it
 * in Claude Code with @apps/rag/data/context.md
 *
 * No LLM API call — Claude Code reads the context directly.
 */
export async function writeContext(ctx: RetrievedContext): Promise<string> {
  await fs.mkdir(path.dirname(CONFIG.CONTEXT_PATH), { recursive: true });

  const sources = [...new Set(ctx.chunks.map((c) => c.filePath))];

  const lines: string[] = [
    `# RAG Context`,
    ``,
    `**Query:** ${ctx.query}`,
    `**Retrieved:** ${ctx.chunks.length} chunks from ${sources.length} file(s)`,
    `**Generated:** ${new Date().toISOString()}`,
    ``,
    `## Sources`,
    ...sources.map((s) => `- \`${s}\``),
    ``,
    `## Chunks`,
    ``,
  ];

  for (let i = 0; i < ctx.chunks.length; i++) {
    const chunk = ctx.chunks[i];
    if (!chunk) continue;
    lines.push(
      `### [${i + 1}] \`${chunk.filePath}\` (lines ${chunk.startLine}–${chunk.endLine})`,
      ``,
      '```',
      chunk.content,
      '```',
      ``,
    );
  }

  await fs.writeFile(CONFIG.CONTEXT_PATH, lines.join('\n'), 'utf-8');
  return CONFIG.CONTEXT_PATH;
}
