import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATA_DIR = path.resolve(__dirname, '../data');

export const CONFIG = {
  // Root of the repo to index — defaults to two levels up from apps/rag/
  REPO_ROOT: path.resolve(process.env['REPO_ROOT'] ?? path.join(__dirname, '../../..')),

  // Where the vector store JSON is saved
  DB_PATH: path.join(DATA_DIR, 'store.json'),

  // Manifest tracks file hashes for incremental re-indexing
  MANIFEST_PATH: path.join(DATA_DIR, 'manifest.json'),

  // Where the retrieved context is written for use in Claude Code
  CONTEXT_PATH: path.join(DATA_DIR, 'context.md'),

  // fastembed downloads BAAI/bge-small-en-v1.5 (~66MB) on first run
  // Cached to ~/.cache/fastembed or HF_CACHE env var
  CHUNK_SIZE: 1500, // characters per chunk
  CHUNK_OVERLAP: 3, // lines to carry over into the next chunk
  BATCH_SIZE: 128, // embedding batch size — higher = fewer async round-trips

  // Skip files larger than this to avoid indexing generated/lock/locale blobs
  MAX_FILE_BYTES: 150 * 1024, // 150 KB

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
    '.reports',
    'storybook-static',
    '.vite',
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
