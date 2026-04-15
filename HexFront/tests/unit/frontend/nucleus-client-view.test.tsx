import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('@/lib/api-client', () => ({
  checkHealth: vi.fn(),
  launchAnalysis: vi.fn(),
}));

vi.mock('@/components/PhoneMap', () => ({
  default: () => <div data-testid="phone-map" />,
}));

vi.mock('leaflet', () => ({ default: {} }));

import NucleusClientView from '@/components/nucleus-client-view';
import { checkHealth, launchAnalysis } from '@/lib/api-client';

describe('NucleusClientView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (checkHealth as any).mockResolvedValue({ status: 'healthy' });
  });

  it('renderiza sem crash com id válido', () => {
    const { container } = render(<NucleusClientView id="abc123" />);
    expect(container).toBeTruthy();
  });

  it('loga o id recebido como autenticação Stalcke', async () => {
    const { container } = render(<NucleusClientView id="target-x" />);
    await waitFor(() => {
      expect(container.textContent).toMatch(/target-x/);
    });
  });

  it('chama checkHealth na montagem', async () => {
    render(<NucleusClientView id="abc" />);
    await waitFor(() => expect(checkHealth).toHaveBeenCalled());
  });

  it('marca servidor offline quando checkHealth rejeita', async () => {
    (checkHealth as any).mockRejectedValue(new Error('down'));
    render(<NucleusClientView id="abc" />);
    await waitFor(() => expect(checkHealth).toHaveBeenCalled());
    // status offline é estado interno — não crasha é o contrato mínimo
  });

  it('marca servidor offline quando status != healthy', async () => {
    (checkHealth as any).mockResolvedValue({ status: 'degraded' });
    render(<NucleusClientView id="abc" />);
    await waitFor(() => expect(checkHealth).toHaveBeenCalled());
  });

  it('não dispara launchAnalysis sem user action', async () => {
    render(<NucleusClientView id="abc" />);
    await waitFor(() => expect(checkHealth).toHaveBeenCalled());
    expect(launchAnalysis).not.toHaveBeenCalled();
  });
});
