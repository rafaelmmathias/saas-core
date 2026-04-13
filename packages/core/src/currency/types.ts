export interface CurrencyConfig {
  code: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface CurrencyContextValue {
  currency: CurrencyConfig;
  setCurrency: (currency: CurrencyConfig) => void;
  format: (amount: number, overrideCurrency?: Partial<CurrencyConfig>) => string;
  formatCompact: (amount: number, overrideCurrency?: Partial<CurrencyConfig>) => string;
  formatPercent: (value: number, decimals?: number) => string;
}
