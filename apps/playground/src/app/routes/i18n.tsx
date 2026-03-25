import { useTranslation } from 'react-i18next';
import { useCurrency } from '@saas-core/core/currency';
import { Button, Badge } from '@saas-core/core-ui';

export function I18nPage() {
  const { t, i18n } = useTranslation();
  const { format, setCurrency, currency } = useCurrency();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt-BR' : 'en';
    i18n.changeLanguage(newLang);
  };

  const toggleCurrency = () => {
    if (currency.code === 'USD') {
      setCurrency({ code: 'BRL', locale: 'pt-BR' });
    } else {
      setCurrency({ code: 'USD', locale: 'en-US' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('i18n.title')}</h1>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('i18n.switchLanguage')}</h2>
        <div className="flex items-center gap-4">
          <Button onClick={toggleLanguage}>{t('i18n.switchLanguage')}</Button>
          <Badge variant="outline">
            {t('i18n.currentLanguage')}: {i18n.language}
          </Badge>
        </div>
        <p className="text-muted-foreground">{t('i18n.example')}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('currency.current')}</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={toggleCurrency}>
            Switch to {currency.code === 'USD' ? 'BRL' : 'USD'}
          </Button>
          <Badge variant="outline">{currency.code}</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-3 max-w-md">
          <div className="rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold">{format(29.99)}</p>
            <p className="text-sm text-muted-foreground">Basic</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold">{format(99.99)}</p>
            <p className="text-sm text-muted-foreground">Pro</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold">{format(299.99)}</p>
            <p className="text-sm text-muted-foreground">Enterprise</p>
          </div>
        </div>
      </div>
    </div>
  );
}
