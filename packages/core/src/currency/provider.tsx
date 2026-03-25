import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { CurrencyConfig, CurrencyContextValue } from './types';

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const DEFAULT_CURRENCY: CurrencyConfig = {
  code: 'USD',
  locale: 'en-US',
};

interface CurrencyProviderProps {
  children: React.ReactNode;
  defaultCurrency?: CurrencyConfig;
}

export function CurrencyProvider({ children, defaultCurrency }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState<CurrencyConfig>(
    defaultCurrency ?? DEFAULT_CURRENCY,
  );

  const format = useCallback(
    (amount: number, overrideCurrency?: Partial<CurrencyConfig>) => {
      const config = { ...currency, ...overrideCurrency };
      return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.code,
        minimumFractionDigits: config.minimumFractionDigits,
        maximumFractionDigits: config.maximumFractionDigits,
      }).format(amount);
    },
    [currency],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency, format }),
    [currency, format],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
