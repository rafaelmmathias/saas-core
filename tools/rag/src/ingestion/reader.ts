import fs from 'fs/promises';
import path from 'path';
import { CONFIG } from '../config.js';

export interface SourceFile {
  filePath: string;
  relativePath: string;
  content: string;
  extension: string;
}

/**
 * Recursively walks the repo root and returns all indexable files.
 * Skips ignored directories and file types.
 */
export async function readRepoFiles(repoRoot: string): Promise<SourceFile[]> {
  const results: SourceFile[] = [];
  await walk(repoRoot, repoRoot, results);
  return results;
}

async function walk(dir: string, repoRoot: string, results: SourceFile[]): Promise<void> {
  let entries: import('fs').Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  await Promise.all(
    entries.map(async entry => {
      if (entry.isDirectory()) {
        if (!CONFIG.IGNORE_DIRS.has(entry.name)) {
          await walk(path.join(dir, entry.name), repoRoot, results);
        }
        return;
      }

      if (!entry.isFile()) return;

      const ext = path.extname(entry.name).toLowerCase();
      const basename = entry.name;

      if (!CONFIG.INCLUDE_EXTENSIONS.has(ext)) return;
      if (CONFIG.IGNORE_FILES.has(basename)) return;

      const filePath = path.join(dir, entry.name);
      const relativePath = path.relative(repoRoot, filePath).replace(/\\/g, '/');

      try {
        const content = await fs.readFile(filePath, 'utf-8');
        if (content.trim().length < 30) return; // skip near-empty files

        results.push({ filePath, relativePath, content, extension: ext });
      } catch {
        // skip unreadable files silently
      }
    }),
  );
}
