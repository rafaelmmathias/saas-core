import { createContext, useContext } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import type { Breakpoint } from '../../theme/breakpoints';

type BreakpointState = ReturnType<typeof useBreakpoint>;

const ResponsiveContext = createContext<BreakpointState | null>(null);

function useResponsiveContext(): BreakpointState {
  const ctx = useContext(ResponsiveContext);
  if (!ctx) {
    throw new Error('Responsive subcomponents must be used inside <Responsive>');
  }
  return ctx;
}

function ResponsiveRoot({ children }: { children: React.ReactNode }) {
  const value = useBreakpoint();
  return <ResponsiveContext.Provider value={value}>{children}</ResponsiveContext.Provider>;
}

function Mobile({ children }: { children: React.ReactNode }) {
  const { isMobile } = useResponsiveContext();
  return isMobile ? <>{children}</> : null;
}

function Desktop({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useResponsiveContext();
  return isDesktop ? <>{children}</> : null;
}

function Tablet({ children }: { children: React.ReactNode }) {
  const { up, down } = useResponsiveContext();
  return up('md') && down('lg') ? <>{children}</> : null;
}

function Up({ from, children }: { from: Breakpoint; children: React.ReactNode }) {
  const { up } = useResponsiveContext();
  return up(from) ? <>{children}</> : null;
}

function Down({ to, children }: { to: Breakpoint; children: React.ReactNode }) {
  const { down } = useResponsiveContext();
  return down(to) ? <>{children}</> : null;
}

export const Responsive = Object.assign(ResponsiveRoot, { Mobile, Desktop, Tablet, Up, Down });
