import React, { useState } from 'react';
import { BirthData } from '../types';

interface Props {
  onSubmit: (data: BirthData) => void;
  isLoading: boolean;
}

export const InputCard: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<BirthData>({
    date: '',
    time: '',
    location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-astro-card border border-astro-border rounded-xl p-8 shadow-sm">
      <div className="mb-6 border-b border-astro-border pb-4">
        <h3 className="font-serif text-2xl text-astro-text mb-2">Formale Astrologische Daten</h3>
        <p className="font-sans text-xs text-astro-subtext tracking-widest uppercase">FusionEngine Protocol v1.2</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 font-sans">
        <div className="space-y-2">
          <label htmlFor="date" className="block text-xs font-medium uppercase tracking-wide text-astro-subtext">Geburtsdatum</label>
          <input
            type="date"
            id="date"
            required
            className="w-full bg-[#FAFAFA] border border-[#EBEBEB] rounded p-3 text-astro-text focus:outline-none focus:border-astro-gold transition-colors"
            onChange={handleChange}
            value={formData.date}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="time" className="block text-xs font-medium uppercase tracking-wide text-astro-subtext">Geburtszeit (24h)</label>
          <input
            type="time"
            id="time"
            required
            className="w-full bg-[#FAFAFA] border border-[#EBEBEB] rounded p-3 text-astro-text focus:outline-none focus:border-astro-gold transition-colors"
            onChange={handleChange}
            value={formData.time}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-xs font-medium uppercase tracking-wide text-astro-subtext">Geburtsort</label>
          <input
            type="text"
            id="location"
            required
            placeholder="Stadt, Land"
            className="w-full bg-[#FAFAFA] border border-[#EBEBEB] rounded p-3 text-astro-text focus:outline-none focus:border-astro-gold transition-colors"
            onChange={handleChange}
            value={formData.location}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 mt-4 rounded-lg bg-gradient-to-r from-astro-gold to-[#B89628] text-white font-serif text-lg tracking-wide shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>Validierung...</span>
            </>
          ) : (
            <span>Validierung starten</span>
          )}
        </button>
      </form>
    </div>
  );
};