import '@testing-library/jest-dom';

// Radix UI components (Accordion, Dialog, Tooltip, etc.) call ResizeObserver.
// jsdom doesn't implement it — polyfill with a no-op so tests don't crash.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
