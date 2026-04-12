import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CurrencyProvider, useCurrency } from '../provider';

function CurrencyDisplay() {
  const { currency, format, setCurrency } = useCurrency();
  return (
    <div>
      <span data-testid="code">{currency.code}</span>
      <span data-testid="formatted">{format(1234.5)}</span>
      <button onClick={() => setCurrency({ code: 'EUR', locale: 'de-DE' })}>
        Switch to EUR
      </button>
    </div>
  );
}

describe('CurrencyProvider', () => {
  it('provides USD by default', () => {
    render(
      <CurrencyProvider>
        <CurrencyDisplay />
      </CurrencyProvider>,
    );
    expect(screen.getByTestId('code')).toHaveTextContent('USD');
  });

  it('formats USD amounts correctly', () => {
    render(
      <CurrencyProvider>
        <CurrencyDisplay />
      </CurrencyProvider>,
    );
    expect(screen.getByTestId('formatted')).toHaveTextContent('$1,234.50');
  });

  it('accepts a custom defaultCurrency prop', () => {
    render(
      <CurrencyProvider defaultCurrency={{ code: 'GBP', locale: 'en-GB' }}>
        <CurrencyDisplay />
      </CurrencyProvider>,
    );
    expect(screen.getByTestId('code')).toHaveTextContent('GBP');
  });

  it('updates currency when setCurrency is called', async () => {
    const user = userEvent.setup();
    render(
      <CurrencyProvider>
        <CurrencyDisplay />
      </CurrencyProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Switch to EUR' }));
    expect(screen.getByTestId('code')).toHaveTextContent('EUR');
  });
});

describe('useCurrency', () => {
  it('throws when used outside CurrencyProvider', () => {
    const originalError = console.error;
    console.error = jest.fn();
    function BareConsumer() {
      useCurrency();
      return null;
    }
    expect(() => render(<BareConsumer />)).toThrow(
      'useCurrency must be used within a CurrencyProvider',
    );
    console.error = originalError;
  });
});
