import { ChevronDown, Menu, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export interface NavItem {
  id: string;
  label: string;
  /** Optional — the component ignores it; consumer uses it inside renderLink. */
  href?: string;
  /** Consumer computes this from their router's current location. */
  isActive?: boolean;
}

export type RenderLink = (
  item: NavItem,
  props: { className: string; onClick?: () => void },
) => React.ReactNode;

export interface NavBarProps {
  /** Logo / wordmark area — any ReactNode. */
  brand?: React.ReactNode;
  /** Full ordered list of nav items. */
  items: NavItem[];
  /**
   * Max number of items to show inline on desktop.
   * Items beyond this index appear in an overflow "More ▾" Popover.
   * Omit to show all items inline.
   */
  maxItems?: number;
  /** Consumer-supplied link renderer. Required. */
  renderLink: RenderLink;
  className?: string;
}

function desktopLinkClass(item: NavItem): string {
  return cn(
    'px-3 pb-px text-sm transition-colors',
    item.isActive
      ? 'text-foreground border-primary border-b-2 font-medium'
      : 'text-muted-foreground hover:text-foreground',
  );
}

function overflowLinkClass(item: NavItem): string {
  return cn(
    'block w-full rounded-sm px-3 py-2 text-sm transition-colors',
    item.isActive
      ? 'text-primary bg-primary/5 font-medium'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
  );
}

function mobileLinkClass(item: NavItem): string {
  return cn(
    'block px-4 py-3 text-sm transition-colors',
    item.isActive
      ? 'text-primary bg-primary/5 font-medium'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
  );
}

export function NavBar({ brand, items, maxItems, renderLink, className }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [overflowOpen, setOverflowOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLElement>(null);

  const clampedMax = maxItems === undefined ? Infinity : Math.max(0, maxItems);
  const inlineItems = items.slice(0, clampedMax);
  const overflowItems = items.slice(clampedMax);
  const overflowHasActive = overflowItems.some((i) => i.isActive);

  // Close mobile dropdown on outside click
  React.useEffect(() => {
    if (!mobileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileOpen]);

  return (
    <nav ref={menuRef} className={cn('border-primary/20 bg-card relative border-b', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {brand && <div className="flex items-center gap-1">{brand}</div>}

          {/* Desktop links */}
          <div className="hidden items-center gap-1 sm:flex">
            {inlineItems.map((item) => renderLink(item, { className: desktopLinkClass(item) }))}

            {overflowItems.length > 0 && (
              <Popover open={overflowOpen} onOpenChange={setOverflowOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'gap-1 px-3 text-sm font-normal',
                      overflowHasActive
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    More
                    <ChevronDown
                      className={cn(
                        'size-3.5 transition-transform duration-200',
                        overflowOpen && 'rotate-180',
                      )}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-44 p-1">
                  {overflowItems.map((item) =>
                    renderLink(item, {
                      className: overflowLinkClass(item),
                      onClick: () => setOverflowOpen(false),
                    }),
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Mobile hamburger */}
          {items.length > 0 && (
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="text-muted-foreground hover:text-foreground flex items-center justify-center rounded-md p-2 transition-colors sm:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown — all items */}
      {mobileOpen && (
        <div className="border-border bg-card absolute inset-x-0 top-full z-50 border-b shadow-lg sm:hidden">
          {items.map((item) =>
            renderLink(item, {
              className: mobileLinkClass(item),
              onClick: () => setMobileOpen(false),
            }),
          )}
        </div>
      )}
    </nav>
  );
}
