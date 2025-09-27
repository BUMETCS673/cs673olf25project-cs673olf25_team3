import App from '../src/App'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/auth/AuthContext';

vi.mock("../src/auth/endpoints/auth", () => ({
  registerUser: vi.fn(),
}));

const renderSignUp = () =>
  render(
    <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
    </BrowserRouter>
  );


describe('Simple working test', () => {    
  it('Banner text is visible', () => {
    renderSignUp();
    expect(screen.getByText(/PlanningJam/)).toBeInTheDocument()
  })

  it('SVG logo is present', () => {
    renderSignUp();
    expect(screen.getByTestId('planningjam-logo')).toBeInTheDocument()
  })
})
