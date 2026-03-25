import { useCurrency } from '@saas-core/core/currency';
import { useTranslation } from 'react-i18next';

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
        <div className="bg-primary mb-3 mt-4 h-0.5 w-12" />
        <p className="text-muted-foreground text-lg">{t('home.subtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.number}
            className="bg-card border-border/60 hover:border-primary/30 group rounded-md border p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),_0_4px_16px_rgba(160,70,20,0.06)] transition-all duration-200 hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),_0_6px_20px_rgba(160,70,20,0.10)]"
          >
            <p className="font-display text-muted-foreground/60 mb-2 text-xs font-medium tracking-widest">
              {card.number}
            </p>
            <h3 className="text-foreground font-semibold">{card.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {card.currency ? `${t('currency.example')}: ${format(1299.99)}` : card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
