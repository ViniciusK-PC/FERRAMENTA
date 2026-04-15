import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('leaflet', () => {
  const layer = { addTo: vi.fn().mockReturnThis() };
  const map = {
    setView: vi.fn().mockReturnThis(),
    eachLayer: vi.fn(),
    removeLayer: vi.fn(),
    addLayer: vi.fn(),
    remove: vi.fn(),
  };
  const L: any = {
    map: vi.fn(() => map),
    tileLayer: vi.fn(() => layer),
    marker: vi.fn(() => {
      const m: any = {};
      m.addTo = vi.fn(() => m);
      m.bindPopup = vi.fn(() => m);
      m.openPopup = vi.fn(() => m);
      return m;
    }),
    circle: vi.fn(() => {
      const c: any = {};
      c.addTo = vi.fn(() => c);
      return c;
    }),
    divIcon: vi.fn(),
    Marker: function () {},
    Circle: function () {},
    Icon: { Default: { prototype: {}, mergeOptions: vi.fn() } },
  };
  return { ...L, default: L };
});

import PhoneMap from '@/components/PhoneMap';

const baseProps = {
  number: '+5511999999999',
  formatted: '+55 11 99999-9999',
  region: 'BR',
  carrier: 'Vivo',
  line_type: 'mobile',
  timezones: ['America/Sao_Paulo'],
  geo: {
    lat: -23.55,
    lon: -46.63,
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    country_code: 'BR',
    display_name: 'São Paulo, SP, Brasil',
  },
};

describe('PhoneMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza sem crash com geo válido', () => {
    const { container } = render(<PhoneMap {...baseProps} />);
    expect(container).toBeTruthy();
  });

  it('exibe número formatado nos metadados', () => {
    render(<PhoneMap {...baseProps} />);
    expect(screen.getByText(/\+55 11 99999-9999/)).toBeTruthy();
  });

  it('exibe carrier e line_type', () => {
    render(<PhoneMap {...baseProps} />);
    expect(screen.getByText(/Vivo/)).toBeTruthy();
    expect(screen.getByText(/mobile/i)).toBeTruthy();
  });

  it('lida com geo inicial (lat=0, lon=0) sem crash', () => {
    const zeroGeo = {
      ...baseProps,
      geo: { ...baseProps.geo, lat: 0, lon: 0 },
    };
    const { container } = render(<PhoneMap {...zeroGeo} />);
    expect(container).toBeTruthy();
  });

  it('não crasha com timezones vazio', () => {
    const { container } = render(<PhoneMap {...baseProps} timezones={[]} />);
    expect(container).toBeTruthy();
  });
});
