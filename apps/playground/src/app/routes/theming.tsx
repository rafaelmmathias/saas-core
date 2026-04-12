import { useTheme } from '@saas-core/core/theme';
import type { ThemeTokens } from '@saas-core/core/theme';
import { Button } from '@saas-core/core-ui/components/button';
import { ColorEditor } from '@saas-core/core-ui/components/composite/color-editor';
import { ColorSwatch } from '@saas-core/core-ui/components/composite/color-swatch';
import { Label } from '@saas-core/core-ui/components/label';
import { Slider } from '@saas-core/core-ui/components/slider';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// ─── Token groups ─────────────────────────────────────────────────────────────

const RADIUS_PRESETS = [
  { label: 'None', value: '0rem' },
  { label: 'XS', value: '0.25rem' },
  { label: 'SM', value: '0.375rem' },
  { label: 'MD', value: '0.5rem' },
  { label: 'LG', value: '0.75rem' },
  { label: 'XL', value: '1rem' },
] as const;

const TOKEN_GROUPS = [
  {
    group: 'Brand',
    tokens: [
      { key: 'primary', label: 'Primary' },
      { key: 'primary-foreground', label: 'On Primary' },
      { key: 'secondary', label: 'Secondary' },
      { key: 'accent', label: 'Accent' },
    ],
  },
  {
    group: 'Surface',
    tokens: [
      { key: 'background', label: 'Background' },
      { key: 'foreground', label: 'Foreground' },
      { key: 'card', label: 'Card' },
      { key: 'muted', label: 'Muted' },
      { key: 'muted-foreground', label: 'Muted Text' },
    ],
  },
  {
    group: 'Utility',
    tokens: [
      { key: 'border', label: 'Border' },
      { key: 'ring', label: 'Ring' },
      { key: 'destructive', label: 'Danger' },
      { key: 'success', label: 'Success' },
    ],
  },
] as const;

// ─── Main page ────────────────────────────────────────────────────────────────

export function ThemingPage() {
  const { t } = useTranslation();
  const { config, tokens, mode, setMode, setCustomTokens, setPreset, presets } = useTheme();
  const [activeToken, setActiveToken] = useState<keyof ThemeTokens | null>(null);

  const getTokenValue = (key: keyof ThemeTokens) =>
    (config.customTokens as Partial<ThemeTokens> | undefined)?.[key] ?? tokens[key] ?? '0 0% 50%';

  const handleSwatchClick = (key: keyof ThemeTokens) => {
    setActiveToken((prev) => (prev === key ? null : key));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('theming.title')}</h1>
      </div>

      {/* Mode */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('theming.mode')}</h2>
        <div className="flex gap-3">
          {(['light', 'dark', 'system'] as const).map((m) => (
            <Button
              key={m}
              variant={config.mode === m ? 'default' : 'outline'}
              onClick={() => setMode(m)}
            >
              {t(`theming.${m}`)}
            </Button>
          ))}
        </div>
        <p className="text-muted-foreground text-sm">
          Resolved mode: <span className="font-medium">{mode}</span>
        </p>
      </div>

      {/* Presets */}
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

      {/* Radius Override */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Radius</h2>
        <div className="space-y-4">
          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {RADIUS_PRESETS.map(({ label, value }) => {
              const currentRadius =
                (config.customTokens?.radius as string | undefined) ?? getTokenValue('radius');
              const isActive = currentRadius === value;
              return (
                <Button
                  key={value}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCustomTokens({ radius: value })}
                >
                  {label}
                </Button>
              );
            })}
          </div>

          {/* Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Fine-tune</Label>
              <span className="text-sm font-medium">
                {(config.customTokens?.radius as string | undefined) ?? getTokenValue('radius')}
              </span>
            </div>
            <Slider
              value={[
                parseFloat(
                  (config.customTokens?.radius as string | undefined) ?? getTokenValue('radius'),
                ) * 16,
              ]}
              onValueChange={(val) => {
                if (val[0] !== undefined) {
                  const remValue = (val[0] / 16).toFixed(3);
                  setCustomTokens({ radius: `${remValue}rem` });
                }
              }}
              min={0}
              max={32}
              step={0.25}
              className="w-full"
            />
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium">Preview</p>
            <div className="flex gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="border-border border"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius:
                      (config.customTokens?.radius as string | undefined) ??
                      getTokenValue('radius'),
                    backgroundColor: `hsl(${getTokenValue('primary')})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom colors */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('theming.customColors')}</h2>
          {config.customTokens && Object.keys(config.customTokens).length > 0 && (
            <button
              onClick={() => {
                setActiveToken(null);
                setPreset(config.activePreset);
              }}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs font-medium underline-offset-2 hover:underline"
            >
              Reset colors
            </button>
          )}
        </div>

        <div className="bg-card border-border rounded-2xl border p-6 shadow-sm">
          {TOKEN_GROUPS.map((group) => (
            <div key={group.group} className="mb-6 last:mb-0">
              <p className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-widest">
                {group.group}
              </p>
              <div className="flex flex-wrap gap-4">
                {group.tokens.map(({ key, label }) => {
                  const tokenKey = key as keyof ThemeTokens;
                  return (
                    <div key={key}>
                      <ColorSwatch
                        color={getTokenValue(tokenKey)}
                        label={label}
                        isActive={activeToken === tokenKey}
                        onClick={() => handleSwatchClick(tokenKey)}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Inline editor — renders below its group's swatches */}
              {group.tokens.some(({ key }) => key === activeToken) && activeToken && (
                <div className="mt-3 max-w-xs">
                  <ColorEditor
                    key={activeToken}
                    label={
                      group.tokens.find(({ key }) => key === activeToken)?.label ?? activeToken
                    }
                    value={getTokenValue(activeToken)}
                    onChange={(hsl) => setCustomTokens({ [activeToken]: hsl })}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={() => setPreset('default')}>
        {t('theming.reset')}
      </Button>
    </div>
  );
}
