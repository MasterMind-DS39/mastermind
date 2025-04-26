import { render, screen } from '@testing-library/react';
import App from './App';

test('renders mastermind application', () => {
  render(<App />);
  // Test for element that actually exists in your app
  const navbarElement = screen.getByRole('navigation');
  expect(navbarElement).toBeInTheDocument();
});

