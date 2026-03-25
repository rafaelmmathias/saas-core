import { useTheme } from '@saas-core/core/theme';
import { Button, Input } from '@saas-core/core-ui';
import { useTranslation } from 'react-i18next';

export function ThemingPage() {
  const { t } = useTranslation();
  const { config, mode, setMode, setCustomTokens, setPreset, presets } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('theming.title')}</h1>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('theming.mode')}</h2>
        <div className="flex gap-3">
          <Button
            variant={config.mode === 'light' ? 'default' : 'outline'}
            onClick={() => setMode('light')}
          >
            {t('theming.light')}
          </Button>
          <Button
            variant={config.mode === 'dark' ? 'default' : 'outline'}
            onClick={() => setMode('dark')}
          >
            {t('theming.dark')}
          </Button>
          <Button
            variant={config.mode === 'system' ? 'default' : 'outline'}
            onClick={() => setMode('system')}
          >
            {t('theming.system')}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Resolved mode: <span className="font-medium">{mode}</span>
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('theming.preset')}</h2>
        <div className="flex gap-3">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant={config.activePreset === preset.name ? 'default' : 'outline'}
              onClick={() => setPreset(preset.name)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('theming.customColors')}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('theming.primary')}</label>
            <Input
              placeholder="e.g. 240 5.9% 10%"
              onChange={(e) => setCustomTokens({ primary: e.target.value })}
            />
            <div
              className="h-10 rounded-md border"
              style={{ backgroundColor: `hsl(var(--primary))` }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('theming.background')}</label>
            <Input
              placeholder="e.g. 0 0% 100%"
              onChange={(e) => setCustomTokens({ background: e.target.value })}
            />
            <div
              className="h-10 rounded-md border"
              style={{ backgroundColor: `hsl(var(--background))` }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('theming.foreground')}</label>
            <Input
              placeholder="e.g. 240 10% 3.9%"
              onChange={(e) => setCustomTokens({ foreground: e.target.value })}
            />
            <div
              className="h-10 rounded-md border"
              style={{ backgroundColor: `hsl(var(--foreground))` }}
            />
          </div>
        </div>
      </div>

      <Button variant="outline" onClick={() => setPreset('default')}>
        {t('theming.reset')}
      </Button>
    </div>
  );
}
