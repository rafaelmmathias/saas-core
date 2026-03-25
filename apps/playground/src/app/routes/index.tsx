import { useTranslation } from 'react-i18next';
import { useCurrency } from '@saas-core/core/currency';

const cards = [
  {
    number: '01',
    title: '20 Components',
    description: 'Shadcn UI components ready to use',
    currency: false,
  },
  {
    number: '02',
    title: 'Live Theming',
    description: 'Change themes on the fly with persistence',
    currency: false,
  },
  {
    number: '03',
    title: 'i18n Ready',
    description: 'Multi-language support with i18next',
    currency: false,
  },
  {
    number: '04',
    title: 'Multi-Currency',
    description: null,
    currency: true,
  },
] as const;

export function HomePage() {
  const { t } = useTranslation();
  const { format } = useCurrency();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          <span className="italic">{t('home.welcome')}</span>
        </h1>
        <div className="w-12 h-0.5 bg-primary mt-4 mb-3" />
        <p className="text-lg text-muted-foreground">{t('home.subtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.number}
            className="group bg-card p-6 rounded-md border border-border/60
                       shadow-[0_1px_3px_rgba(0,0,0,0.06),_0_4px_16px_rgba(160,70,20,0.06)]
                       hover:border-primary/30 hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),_0_6px_20px_rgba(160,70,20,0.10)]
                       transition-all duration-200"
          >
            <p className="font-display text-xs font-medium text-muted-foreground/60 mb-2 tracking-widest">
              {card.number}
            </p>
            <h3 className="font-semibold text-foreground">{card.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {card.currency
                ? `${t('currency.example')}: ${format(1299.99)}`
                : card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
