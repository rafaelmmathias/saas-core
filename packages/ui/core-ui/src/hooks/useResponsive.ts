import { useBreakpoint } from './useBreakpoint';

export function useResponsive() {
  const bp = useBreakpoint();

  return {
    ...bp,
    isTablet: bp.up('md') && bp.down('lg'),
    isLargeDesktop: bp.up('xl'),
  };
}
