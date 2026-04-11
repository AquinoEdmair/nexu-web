'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Phone, ChevronDown, Search } from 'lucide-react';

type Country = {
  code: string;
  name: string;
  dial: string;
  flag: string;
};

// Latin America + common international
const COUNTRIES: Country[] = [
  { code: 'MX', name: 'México',          dial: '+52',  flag: '🇲🇽' },
  { code: 'US', name: 'Estados Unidos',  dial: '+1',   flag: '🇺🇸' },
  { code: 'AR', name: 'Argentina',       dial: '+54',  flag: '🇦🇷' },
  { code: 'BO', name: 'Bolivia',         dial: '+591', flag: '🇧🇴' },
  { code: 'BR', name: 'Brasil',          dial: '+55',  flag: '🇧🇷' },
  { code: 'CA', name: 'Canadá',          dial: '+1',   flag: '🇨🇦' },
  { code: 'CL', name: 'Chile',           dial: '+56',  flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia',        dial: '+57',  flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica',      dial: '+506', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba',            dial: '+53',  flag: '🇨🇺' },
  { code: 'DO', name: 'Rep. Dominicana', dial: '+1',   flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador',         dial: '+593', flag: '🇪🇨' },
  { code: 'SV', name: 'El Salvador',     dial: '+503', flag: '🇸🇻' },
  { code: 'ES', name: 'España',          dial: '+34',  flag: '🇪🇸' },
  { code: 'GT', name: 'Guatemala',       dial: '+502', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras',        dial: '+504', flag: '🇭🇳' },
  { code: 'NI', name: 'Nicaragua',       dial: '+505', flag: '🇳🇮' },
  { code: 'PA', name: 'Panamá',          dial: '+507', flag: '🇵🇦' },
  { code: 'PY', name: 'Paraguay',        dial: '+595', flag: '🇵🇾' },
  { code: 'PE', name: 'Perú',            dial: '+51',  flag: '🇵🇪' },
  { code: 'PR', name: 'Puerto Rico',     dial: '+1',   flag: '🇵🇷' },
  { code: 'UY', name: 'Uruguay',         dial: '+598', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela',       dial: '+58',  flag: '🇻🇪' },
  { code: 'GB', name: 'Reino Unido',     dial: '+44',  flag: '🇬🇧' },
  { code: 'FR', name: 'Francia',         dial: '+33',  flag: '🇫🇷' },
  { code: 'DE', name: 'Alemania',        dial: '+49',  flag: '🇩🇪' },
  { code: 'IT', name: 'Italia',          dial: '+39',  flag: '🇮🇹' },
];

interface PhoneInputProps {
  /** Combined value, e.g. "+52 5512345678" */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}

/** Split a combined phone string into dial code + national number. */
function splitPhone(value: string): { dial: string; number: string } {
  if (!value) return { dial: '+52', number: '' };
  const match = COUNTRIES
    .slice()
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((c) => value.startsWith(c.dial));
  if (match) {
    return { dial: match.dial, number: value.slice(match.dial.length).trim() };
  }
  return { dial: '+52', number: value.replace(/^\+/, '') };
}

export function PhoneInput({
  value,
  onChange,
  disabled = false,
  placeholder = '55 1234 5678',
  id = 'phone',
}: PhoneInputProps) {
  const { dial: initialDial, number: initialNumber } = splitPhone(value);
  const [selectedDial, setSelectedDial] = useState(initialDial);
  const [number, setNumber] = useState(initialNumber);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectedCountry =
    COUNTRIES.find((c) => c.dial === selectedDial) ?? COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  const emit = (dial: string, num: string) => {
    const cleaned = num.replace(/[^\d\s-]/g, '').trim();
    onChange(cleaned ? `${dial} ${cleaned}` : '');
  };

  const handleDialSelect = (dial: string) => {
    setSelectedDial(dial);
    setOpen(false);
    setSearch('');
    emit(dial, number);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setNumber(next);
    emit(selectedDial, next);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-stretch gap-2">
        {/* Country selector button */}
        <button
          type="button"
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
          className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-4 text-white hover:border-nexus-blue-light/40 focus:ring-1 focus:ring-nexus-blue-light transition-all outline-none disabled:opacity-50"
        >
          <span className="text-xl leading-none">{selectedCountry.flag}</span>
          <span className="text-sm font-black tracking-tight">{selectedCountry.dial}</span>
          <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Phone number input */}
        <div className="relative flex-1">
          <input
            id={id}
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 pr-12 text-white focus:ring-1 focus:ring-nexus-blue-light placeholder:text-white/20 transition-all outline-none"
            placeholder={placeholder}
            type="tel"
            value={number}
            onChange={handleNumberChange}
            disabled={disabled}
            inputMode="tel"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
            <Phone className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 left-0 w-full max-w-sm bg-[#0a0f16] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-xl">
          {/* Search */}
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar país..."
                className="w-full bg-white/5 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/20 focus:ring-1 focus:ring-nexus-blue-light outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Countries list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-white/30 font-medium uppercase tracking-widest">
                Sin resultados
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={`${country.code}-${country.dial}`}
                  type="button"
                  onClick={() => handleDialSelect(country.dial)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left ${
                    country.dial === selectedDial ? 'bg-nexus-blue/10' : ''
                  }`}
                >
                  <span className="text-2xl leading-none">{country.flag}</span>
                  <span className="flex-1 text-sm font-medium text-white">{country.name}</span>
                  <span className="text-xs font-black text-nexus-blue-light tracking-tight">{country.dial}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
