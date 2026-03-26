# @saas-core/core-ui

React component library built on shadcn/ui.

## Adding Components

Always use the shadcn CLI from this package's root:

```bash
cd packages/core-ui
npx shadcn@latest add <component-name> --yes
```

Components are generated in `src/components/ui/`.

## shadcn Config

- Style: new-york
- RSC: false
- CSS Variables: true
- Base color: neutral
- Aliases: `@/components`, `@/lib/utils`, `@/hooks`

## Form Integration

Form wrappers in `src/form/` connect shadcn components to react-hook-form:

- `FormInput` — Input with label, description, error
- `FormCheckbox` — Checkbox with label/description
- `FormCombobox` — Combobox with form control
- `FormDatePicker` — DatePicker with form control
- `FormSlider` — Slider with form control
- `FormFieldWrapper` — Generic wrapper for any component

All form components accept `control`, `name`, `label`, `description` props.

## Custom Composition Components

- `combobox.tsx` — Popover + Command composition
- `date-picker.tsx` — Calendar + Popover composition

## Providers (re-exported from core)

- ThemeProvider, CurrencyProvider
