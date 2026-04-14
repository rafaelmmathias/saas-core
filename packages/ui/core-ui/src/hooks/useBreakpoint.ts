import { useEffect, useState } from 'react';

import { breakpoints } from '../lib/breakpoints';
import type { Breakpoint } from '../lib/breakpoints';

function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'sm';
  const width = window.innerWidth;
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  return 'sm';
}

// Created once at module load — only fires when a breakpoint boundary is crossed,
// not on every pixel change. Safe to call in SSR (window guard inside).
const BREAKPOINT_QUERIES =
  typeof window !== 'undefined'
    ? (Object.entries(breakpoints) as [Breakpoint, number][]).map(([key, px]) => ({
        key,
        mql: window.matchMedia(`(min-width: ${px}px)`),
      }))
    : [];

export function useBreakpoint() {
  const [current, setCurrent] = useState<Breakpoint>(getCurrentBreakpoint);

  useEffect(() => {
    const handlers = BREAKPOINT_QUERIES.map(({ mql }) => {
      const handler = () => setCurrent(getCurrentBreakpoint());
      mql.addEventListener('change', handler);
      return { mql, handler };
    });
    return () => {
      handlers.forEach(({ mql, handler }) => mql.removeEventListener('change', handler));
    };
  }, []);

  return {
    current,
    up: (bp: Breakpoint) => breakpoints[current] >= breakpoints[bp],
    down: (bp: Breakpoint) => breakpoints[current] < breakpoints[bp],
    isMobile: breakpoints[current] < breakpoints.md,
    isDesktop: breakpoints[current] >= breakpoints.md,
  };
}
