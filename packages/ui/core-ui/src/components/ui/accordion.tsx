import { ChevronRight } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../lib/utils';

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-border border-b last:border-b-0', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'focus-visible:ring-primary text-foreground hover:bg-muted/50 flex flex-1 items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold outline-none transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-90',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronRight className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-150" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('border-border border-t px-5 py-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
