import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { chunkFile } from '../ingestion/chunker.js';
import type { SourceFile } from '../ingestion/reader.js';

function makeFile(relativePath: string, content: string, extension = '.ts'): SourceFile {
  return { filePath: `/repo/${relativePath}`, relativePath, content, extension };
}

describe('chunkFile', () => {
  it('prefixes every chunk with the file path comment', () => {
    const file = makeFile('src/utils.ts', 'export const x = 1;\n');
    const chunks = chunkFile(file);
    assert.ok(chunks.length > 0);
    chunks.forEach((c) => {
      assert.ok(
        c.content.startsWith('// File: src/utils.ts'),
        `chunk missing file prefix: ${c.content.slice(0, 60)}`,
      );
    });
  });

  it('produces a single chunk for a short file', () => {
    const file = makeFile('src/tiny.ts', 'export const a = 1;\nexport const b = 2;\n');
    assert.equal(chunkFile(file).length, 1);
  });

  it('splits code at export/function boundaries', () => {
    const content = [
      'export function foo() {',
      '  return 1;',
      '}',
      '',
      'export function bar() {',
      '  return 2;',
      '}',
    ].join('\n');
    const chunks = chunkFile(makeFile('src/fns.ts', content));
    // Both functions should be present across chunks
    const allContent = chunks.map((c) => c.content).join('\n');
    assert.ok(allContent.includes('foo'));
    assert.ok(allContent.includes('bar'));
  });

  it('assigns sequential chunkIndex values', () => {
    const longContent = Array.from({ length: 200 }, (_, i) => `export const v${i} = ${i};`).join(
      '\n',
    );
    const chunks = chunkFile(makeFile('src/big.ts', longContent));
    chunks.forEach((c, i) => {
      assert.equal(c.metadata.chunkIndex, i);
    });
  });

  it('sets correct startLine and endLine metadata', () => {
    const lines = Array.from({ length: 10 }, (_, i) => `const x${i} = ${i};`);
    const file = makeFile('src/lines.ts', lines.join('\n'));
    const chunks = chunkFile(file);
    assert.ok(chunks[0]!.metadata.startLine >= 1);
    assert.ok(chunks[chunks.length - 1]!.metadata.endLine <= lines.length);
  });

  it('uses text chunker for markdown files', () => {
    const md = '# Section One\n\nSome content here.\n\n## Section Two\n\nMore content.\n';
    const file = makeFile('docs/readme.md', md, '.md');
    const chunks = chunkFile(file);
    assert.ok(chunks.length > 0);
    assert.ok(chunks[0]!.content.startsWith('// File: docs/readme.md'));
  });
});
