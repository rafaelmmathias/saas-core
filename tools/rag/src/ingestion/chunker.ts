import { CONFIG } from '../config.js';
import type { SourceFile } from './reader.js';

export interface Chunk {
  id: string;
  content: string;
  metadata: {
    filePath: string;
    startLine: number;
    endLine: number;
    chunkIndex: number;
  };
}

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mts']);

export function chunkFile(file: SourceFile): Chunk[] {
  const chunks = CODE_EXTENSIONS.has(file.extension) ? chunkCode(file) : chunkText(file);

  // Prefix every chunk with its file path so the LLM always knows the source
  return chunks.map((c) => ({
    ...c,
    content: `// File: ${file.relativePath}\n${c.content}`,
  }));
}

/**
 * Code chunker: prefers breaking at function/class/export boundaries.
 * Falls back to size-based splitting with line overlap.
 */
function chunkCode(file: SourceFile): Chunk[] {
  const lines = file.content.split('\n');
  const chunks: Chunk[] = [];
  let buffer: string[] = [];
  let startLine = 1;
  let chunkIndex = 0;
  let charCount = 0;

  const isBoundary = (line: string): boolean =>
    /^(export\s+)?(default\s+)?(async\s+)?function[\s(]/.test(line) ||
    /^(export\s+)?(abstract\s+)?class\s/.test(line) ||
    /^(export\s+)?(const|let)\s+\w+\s*=\s*(async\s*)?\(/.test(line) || // arrow fns
    /^(export\s+)?(interface|type|enum)\s+\w+/.test(line) ||
    /^\/\/\s*[-=]{4,}/.test(line); // section dividers

  const flush = (endLine: number) => {
    if (buffer.length === 0) return;
    chunks.push({
      id: `${file.relativePath}::${chunkIndex}`,
      content: buffer.join('\n'),
      metadata: { filePath: file.relativePath, startLine, endLine, chunkIndex },
    });
    chunkIndex++;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const atBoundary = isBoundary(line) && buffer.length > 0;
    const wouldExceed = charCount + line.length + 1 > CONFIG.CHUNK_SIZE;

    if (wouldExceed || (atBoundary && charCount > CONFIG.CHUNK_SIZE / 3)) {
      flush(i);
      // carry overlap lines into next chunk
      const overlap = buffer.slice(-CONFIG.CHUNK_OVERLAP);
      buffer = [...overlap];
      startLine = Math.max(1, i - CONFIG.CHUNK_OVERLAP + 1);
      charCount = overlap.join('\n').length;
    }

    buffer.push(line);
    charCount += line.length + 1;
  }

  flush(lines.length);
  return chunks;
}

/**
 * Text/Markdown chunker: breaks at headings or size limit.
 */
function chunkText(file: SourceFile): Chunk[] {
  const lines = file.content.split('\n');
  const chunks: Chunk[] = [];
  let buffer: string[] = [];
  let startLine = 1;
  let chunkIndex = 0;
  let charCount = 0;

  const isHeading = (line: string): boolean => /^#{1,3}\s/.test(line);

  const flush = (endLine: number) => {
    if (buffer.length === 0) return;
    chunks.push({
      id: `${file.relativePath}::${chunkIndex}`,
      content: buffer.join('\n'),
      metadata: { filePath: file.relativePath, startLine, endLine, chunkIndex },
    });
    chunkIndex++;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const atHeading = isHeading(line) && buffer.length > 0;
    const wouldExceed = charCount + line.length + 1 > CONFIG.CHUNK_SIZE;

    if (wouldExceed || atHeading) {
      flush(i);
      buffer = [];
      startLine = i + 1;
      charCount = 0;
    }

    buffer.push(line);
    charCount += line.length + 1;
  }

  flush(lines.length);
  return chunks;
}
