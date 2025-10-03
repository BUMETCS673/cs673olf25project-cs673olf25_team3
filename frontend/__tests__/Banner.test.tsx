/*
AI-generated: 0%
Human-written: 100% (used tutorial and Ashley's work to help)
*/

import App from '../src/App'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/auth/AuthContext';

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
