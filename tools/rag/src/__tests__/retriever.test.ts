import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractKeywords,
  commonPrefixLen,
  computePathBoost,
  PATH_BOOST,
} from '../query/retriever.js';

describe('extractKeywords', () => {
  it('removes stop words and short words', () => {
    assert.deepEqual(extractKeywords('how does theming work?'), ['theming']);
  });

  it('keeps domain-specific keywords', () => {
    assert.deepEqual(extractKeywords('how to add a new shadcn component?'), [
      'shadcn',
      'component',
    ]);
  });

  it('handles i18n and long words', () => {
    assert.deepEqual(extractKeywords('how does i18n internationalization work?'), [
      'i18n',
      'internationalization',
    ]);
  });

  it('returns empty for all-stopword queries', () => {
    assert.deepEqual(extractKeywords('how does it work?'), []);
  });

  it('lowercases and strips punctuation', () => {
    assert.deepEqual(extractKeywords('Currency Formatting!'), ['currency', 'formatting']);
  });
});

describe('commonPrefixLen', () => {
  it('returns full length for identical strings', () => {
    assert.equal(commonPrefixLen('theme', 'theme'), 5);
  });

  it('returns 4 for "theming" vs "theme" (diverges at position 4)', () => {
    assert.equal(commonPrefixLen('theming', 'theme'), 4);
  });

  it('returns 0 for completely different strings', () => {
    assert.equal(commonPrefixLen('form', 'chart'), 0);
  });

  it('returns length of shorter string when one is a prefix of the other', () => {
    assert.equal(commonPrefixLen('auth', 'authentication'), 4);
  });
});

describe('computePathBoost', () => {
  it('boosts when keyword prefix matches a path token', () => {
    // "theming" shares 4-char prefix "them" with token "theme"
    const boost = computePathBoost('packages/ui/core-ui/src/theme/provider.tsx', ['theming']);
    assert.equal(boost, PATH_BOOST);
  });

  it('boosts for exact path token match', () => {
    const boost = computePathBoost('packages/core/src/i18n/config.ts', ['i18n']);
    assert.equal(boost, PATH_BOOST);
  });

  it('boosts when keyword is a prefix of path token', () => {
    // "component" matches "components" in path
    const boost = computePathBoost('src/components/ui/button.tsx', ['component']);
    assert.equal(boost, PATH_BOOST);
  });

  it('returns 0 when no keyword matches any path token', () => {
    const boost = computePathBoost('apps/planner/src/features/tasks/DailyView.tsx', ['theming']);
    assert.equal(boost, 0);
  });

  it('accumulates boost for multiple matching keywords', () => {
    // "form" matches "form-input.tsx" tokens, "valid" matches nothing
    const boost = computePathBoost('src/form/form-input.tsx', ['form', 'valid']);
    assert.equal(boost, PATH_BOOST); // only "form" matches
  });

  it('returns 0 for short path tokens (< 4 chars)', () => {
    // "ui" token has length 2 — should not match
    const boost = computePathBoost('packages/ui/index.ts', ['form']);
    assert.equal(boost, 0);
  });

  it('handles auth/authentication pairing', () => {
    const boost = computePathBoost('features/auth/LoginPage.tsx', ['authentication']);
    assert.equal(boost, PATH_BOOST);
  });
});
