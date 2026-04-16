import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const CONFIG = {
  // Root of the repo to index — defaults to two levels up from apps/rag/
  REPO_ROOT: path.resolve(process.env['REPO_ROOT'] ?? path.join(__dirname, '../../..')),

  // Where the vector store JSON is saved
  DB_PATH: path.resolve(__dirname, '../data/store.json'),

  // Where the retrieved context is written for use in Claude Code
  CONTEXT_PATH: path.resolve(__dirname, '../data/context.md'),

  // fastembed downloads BAAI/bge-small-en-v1.5 (~66MB) on first run
  // Cached to ~/.cache/fastembed or HF_CACHE env var
  CHUNK_SIZE: 1500, // characters per chunk
  CHUNK_OVERLAP: 3, // lines to carry over into the next chunk

  TOP_K: 16, // chunks to retrieve per query
  SCORE_THRESHOLD: 0.35, // minimum cosine similarity — chunks below this are discarded
  MAX_CHUNKS_PER_FILE: 2, // max chunks from the same file in a single result set

  IGNORE_DIRS: new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    '.turbo',
    'coverage',
    '.next',
    'out',
    '.cache',
    '__pycache__',
    'data',
    'rag',
    '.claude',
  ]),

  INCLUDE_EXTENSIONS: new Set([
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.mjs',
    '.mts',
    '.json',
    '.md',
    '.mdx',
    '.yaml',
    '.yml',
    '.css',
    '.html',
  ]),

  IGNORE_FILES: new Set(['.env', '.env.local', 'pnpm-lock.yaml', 'package-lock.json']),

  EMBEDDINGS_MODEL: 'BAAI/bge-small-en-v1.5',
} as const;
