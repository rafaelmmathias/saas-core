import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cosineSimilarity } from '../db/vectorStore.js';

describe('cosineSimilarity', () => {
  it('returns ~1 for identical vectors', () => {
    const v = [1, 0, 0, 1];
    const score = cosineSimilarity(v, v);
    assert.ok(Math.abs(score - 1) < 1e-9, `expected ~1, got ${score}`);
  });

  it('returns 0 for orthogonal vectors', () => {
    assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
  });

  it('returns -1 for opposite vectors', () => {
    assert.equal(cosineSimilarity([1, 0], [-1, 0]), -1);
  });

  it('returns 0 for zero vector', () => {
    assert.equal(cosineSimilarity([0, 0], [1, 1]), 0);
  });

  it('is symmetric', () => {
    const a = [0.5, 0.8, 0.1];
    const b = [0.3, 0.6, 0.9];
    assert.equal(cosineSimilarity(a, b), cosineSimilarity(b, a));
  });

  it('returns value between -1 and 1 for arbitrary vectors', () => {
    const a = [0.2, 0.5, 0.3, 0.8];
    const b = [0.9, 0.1, 0.6, 0.4];
    const score = cosineSimilarity(a, b);
    assert.ok(score >= -1 && score <= 1, `expected score in [-1,1], got ${score}`);
  });
});
