import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../lib/utils';

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  'group/tabs-list inline-flex w-full items-center justify-start text-muted-foreground group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col group-data-[orientation=vertical]/tabs:overflow-y-auto',
  {
    variants: {
      variant: {
        default:
          'overflow-y-auto rounded-lg bg-muted p-[3px] group-data-[orientation=horizontal]/tabs:h-9',
        line: 'overflow-y-auto rounded-none bg-transparent border-b border-border h-10 group-data-[orientation=vertical]/tabs:border-b-0 group-data-[orientation=vertical]/tabs:border-r group-data-[orientation=vertical]/tabs:h-full group-data-[orientation=vertical]/tabs:w-fit',
      },
    },
    defaultVariants: {
      variant: 'line',
    },
  },
);

function TabsList({
  className,
  variant = 'line',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(Math.ceil(el.scrollLeft) + el.clientWidth < el.scrollWidth);
  }, []);

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    listRef.current?.scrollBy({ left: dir === 'left' ? -120 : 120, behavior: 'smooth' });
  };

  return (
    <div className="relative flex w-full items-center overflow-hidden">
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll tabs left"
          onClick={() => scroll('left')}
          className="from-background via-background/90 text-muted-foreground hover:text-foreground absolute left-0 z-10 flex h-full items-center bg-gradient-to-r to-transparent pl-1 pr-3 transition-colors"
        >
          <ChevronLeft className="size-4 shrink-0" />
        </button>
      )}
      <TabsPrimitive.List
        ref={listRef as React.Ref<HTMLDivElement>}
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(
          tabsListVariants({ variant }),
          'overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          canScrollLeft && 'pl-6',
          canScrollRight && 'pr-6',
          className,
        )}
        {...props}
      />
      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll tabs right"
          onClick={() => scroll('right')}
          className="from-background via-background/90 text-muted-foreground hover:text-foreground absolute right-0 z-10 flex h-full items-center bg-gradient-to-l to-transparent pl-3 pr-1 transition-colors"
        >
          <ChevronRight className="size-4 shrink-0" />
        </button>
      )}
    </div>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base
        'relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium transition-all',
        'focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]',
        'disabled:pointer-events-none disabled:opacity-50',
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        // Vertical orientation
        'group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start',
        // --- Default (pill/segment) variant ---
        'group-data-[variant=default]/tabs-list:h-[calc(100%-6px)] group-data-[variant=default]/tabs-list:flex-1 group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:px-2 group-data-[variant=default]/tabs-list:py-1',
        'group-data-[variant=default]/tabs-list:text-foreground/60 group-data-[variant=default]/tabs-list:hover:text-foreground',
        'group-data-[variant=default]/tabs-list:data-[state=active]:bg-background group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm',
        'dark:group-data-[variant=default]/tabs-list:data-[state=active]:border-input dark:group-data-[variant=default]/tabs-list:data-[state=active]:bg-input/30',
        // --- Line variant ---
        'group-data-[variant=line]/tabs-list:h-full group-data-[variant=line]/tabs-list:shrink-0 group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:px-3 group-data-[variant=line]/tabs-list:py-0',
        // indicator: border-b that overlaps the list border-b by 1px
        'group-data-[variant=line]/tabs-list:-mb-px group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent',
        'group-data-[variant=line]/tabs-list:text-muted-foreground group-data-[variant=line]/tabs-list:hover:text-foreground',
        'group-data-[variant=line]/tabs-list:data-[state=active]:text-primary group-data-[variant=line]/tabs-list:data-[state=active]:border-primary',
        // Line variant — vertical orientation indicator
        'group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:mb-0 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:mr-[-1px] group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:border-b-0 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:border-r-2 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:px-3 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:py-2',
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
