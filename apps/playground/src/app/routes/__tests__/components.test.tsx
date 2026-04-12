// jest.mock is hoisted before imports by ts-jest
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn(), language: 'en' },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

import { render, screen } from '@testing-library/react';

import { ComponentsPage } from '../components';

describe('ComponentsPage', () => {
  it('renders without crashing', () => {
    render(<ComponentsPage />);
    expect(screen.getByText('components.title')).toBeInTheDocument();
  });

  it('renders the Buttons & Badges tab trigger', () => {
    render(<ComponentsPage />);
    expect(screen.getByRole('tab', { name: 'Buttons & Badges' })).toBeInTheDocument();
  });

  it('renders the Default button in the active tab', () => {
    render(<ComponentsPage />);
    expect(screen.getByRole('button', { name: 'Default' })).toBeInTheDocument();
  });

  it('renders all four tab triggers', () => {
    render(<ComponentsPage />);
    expect(screen.getByRole('tab', { name: 'Inputs' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Feedback' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overlay' })).toBeInTheDocument();
  });
});
