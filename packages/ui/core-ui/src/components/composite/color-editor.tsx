'use client';

import throttle from 'lodash/throttle';
import { PipetteIcon } from 'lucide-react';
import * as React from 'react';

import { hexToHsl, hslStr, hslToHex, parseHsl } from '../../lib/color';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface ColorEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface SliderRowProps {
  label: string;
  ariaLabel: string;
  value: number;
  min: number;
  max: number;
  trackStyle: React.CSSProperties;
  thumbColor: string;
  onChange: (value: number) => void;
}

function SliderRow({
  label,
  ariaLabel,
  value,
  min,
  max,
  trackStyle,
  thumbColor,
  onChange,
}: SliderRowProps) {
  const offset = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground w-4 text-right font-mono text-[11px] font-semibold">
        {label}
      </span>
      <div className="relative flex-1">
        <div className="h-3 w-full overflow-hidden rounded-full" style={trackStyle} />
        <input
          aria-label={ariaLabel}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          max={max}
          min={min}
          onChange={(event) => onChange(Number.parseFloat(event.target.value))}
          style={{ margin: 0 }}
          type="range"
          value={Math.round(value)}
        />
        <div
          className="border-background pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 shadow-md transition-transform"
          style={{
            left: `calc(${offset}% - 8px)`,
            backgroundColor: thumbColor,
          }}
        />
      </div>
      <span className="text-muted-foreground w-7 font-mono text-[11px]">{Math.round(value)}</span>
    </div>
  );
}
const THROTTLE_WAIT = 20;
function ColorEditor({ label, value, onChange, className }: ColorEditorProps) {
  const pickerRef = React.useRef<HTMLInputElement>(null);
  const { h, s, l } = parseHsl(value);
  const previewColor = `hsl(${h} ${s}% ${l}%)`;
  const resolvedLabel = label ?? 'Color';
  const hueGradient = `linear-gradient(to right, hsl(0 ${s}% ${l}%), hsl(30 ${s}% ${l}%), hsl(60 ${s}% ${l}%), hsl(90 ${s}% ${l}%), hsl(120 ${s}% ${l}%), hsl(150 ${s}% ${l}%), hsl(180 ${s}% ${l}%), hsl(210 ${s}% ${l}%), hsl(240 ${s}% ${l}%), hsl(270 ${s}% ${l}%), hsl(300 ${s}% ${l}%), hsl(330 ${s}% ${l}%), hsl(360 ${s}% ${l}%))`;
  const saturationGradient = `linear-gradient(to right, hsl(${h} 0% ${l}%), hsl(${h} 100% ${l}%))`;
  const lightnessGradient = `linear-gradient(to right, hsl(${h} ${s}% 0%), hsl(${h} ${s}% 50%), hsl(${h} ${s}% 100%))`;

  const handlePickerChange = React.useMemo(
    () =>
      throttle(
        (nextHexValue: string) => {
          onChange(hexToHsl(nextHexValue));
        },
        THROTTLE_WAIT,
        { leading: true, trailing: true },
      ),
    [onChange],
  );

  React.useEffect(() => {
    return () => {
      handlePickerChange.cancel();
    };
  }, [handlePickerChange]);

  return (
    <div
      className={cn(
        'bg-card border-border animate-in fade-in slide-in-from-top-1 flex max-w-sm flex-col gap-4 rounded-xl border p-4 shadow-lg duration-150',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="size-8 rounded-lg border shadow-sm"
            style={{ backgroundColor: previewColor }}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold">{resolvedLabel}</p>
          </div>
        </div>
        <Button onClick={() => pickerRef.current?.click()} size="sm" type="button" variant="ghost">
          <PipetteIcon data-icon="inline-start" />
          Pick
        </Button>
        <input
          aria-label={`Pick color: ${resolvedLabel}`}
          className="sr-only"
          onChange={(event) => handlePickerChange(event.target.value)}
          ref={pickerRef}
          type="color"
          value={hslToHex(value)}
        />
      </div>

      <div
        className="border-border h-20 w-full rounded-lg border shadow-inner"
        style={{ backgroundColor: previewColor }}
      />

      <div className="flex flex-col gap-3">
        <SliderRow
          ariaLabel="Hue"
          label="H"
          max={360}
          min={0}
          onChange={(nextHue) => onChange(hslStr(nextHue, s, l))}
          thumbColor={previewColor}
          trackStyle={{ background: hueGradient }}
          value={h}
        />
        <SliderRow
          ariaLabel="Saturation"
          label="S"
          max={100}
          min={0}
          onChange={(nextSaturation) => onChange(hslStr(h, nextSaturation, l))}
          thumbColor={previewColor}
          trackStyle={{ background: saturationGradient }}
          value={s}
        />
        <SliderRow
          ariaLabel="Lightness"
          label="L"
          max={100}
          min={0}
          onChange={(nextLightness) => onChange(hslStr(h, s, nextLightness))}
          thumbColor={previewColor}
          trackStyle={{ background: lightnessGradient }}
          value={l}
        />
      </div>

      <div className="bg-muted flex items-center justify-between rounded-lg px-3 py-2">
        <span className="text-muted-foreground text-xs font-medium">HSL</span>
        <code className="text-foreground text-xs">{value}</code>
      </div>
    </div>
  );
}

export { ColorEditor };
