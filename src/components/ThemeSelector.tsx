import React from 'react';
import { ThemeConfig } from '../types';

interface ThemeSelectorProps {
  theme: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
}

const FONTS = [
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Merriweather', value: '"Merriweather", serif' },
  { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
];

const COLORS = [
  { name: 'Slate', value: '#0f172a' },
  { name: 'Indigo', value: '#4338ca' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Sky', value: '#0284c7' },
];

const THEMES = [
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'creative', name: 'Creative Header' },
];

export function ThemeSelector({ theme, onChange }: ThemeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Layout</h3>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ ...theme, id: t.id })}
              className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                theme.id === t.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Typography</h3>
        <div className="grid grid-cols-2 gap-3">
          {FONTS.map((f) => (
            <button
              key={f.name}
              onClick={() => onChange({ ...theme, font: f.value })}
              className={`p-3 text-sm rounded-lg border transition-all ${
                theme.font === f.value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
              style={{ fontFamily: f.value }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Accent Color</h3>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => onChange({ ...theme, primaryColor: c.value })}
              className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                theme.primaryColor === c.value ? 'border-gray-900 scale-110' : 'border-transparent'
              }`}
              style={{ padding: '2px' }}
              title={c.name}
            >
              <div 
                className="w-full h-full rounded-full" 
                style={{ backgroundColor: c.value }} 
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
