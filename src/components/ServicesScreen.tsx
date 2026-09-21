import React, { useState } from 'react';
import {
  Search,
  Settings,
  Bell,
  Fingerprint,
  Baby,
  FileCheck2,
  MapPin,
  Car,
  Image,
  Globe,
  MessageSquare,
  Sparkles,
  Lock,
} from 'lucide-react';
import { ScreenType } from '../types';

interface ServicesScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  const services = [
    {
      id: 'travel',
      title: 'Absher Travel',
      action: () => setActiveNotice('Absher Travel service offline synchronized'),
      icon: (
        <svg className="w-10 h-10 text-[#7BE4C2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
          <circle cx="12" cy="10" r="2" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      id: 'newborn',
      title: 'Register Newborn',
      action: () => setActiveNotice('Civil Affairs newborn registration active'),
      icon: <Baby className="w-10 h-10 text-[#7BE4C2] stroke-[1.6]" />,
    },
    {
      id: 'driving_license',
      title: 'Renew Driving License',
      action: () => onNavigate('license'),
      icon: (
        <svg className="w-10 h-10 text-[#7BE4C2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <rect x="5" y="8" width="5" height="5" rx="1" />
          <line x1="13" y1="9" x2="19" y2="9" />
          <line x1="13" y1="13" x2="17" y2="13" />
        </svg>
      ),
    },
    {
      id: 'resident_id',
      title: 'Renew Resident ID',
      action: () => onNavigate('resident_id'),
      icon: (
        <svg className="w-10 h-10 text-[#7BE4C2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <rect x="5" y="7" width="5" height="5" rx="1" />
          <line x1="13" y1="8" x2="19" y2="8" />
          <line x1="13" y1="12" x2="18" y2="12" />
          <line x1="5" y1="16" x2="19" y2="16" />
        </svg>
      ),
    },
    {
      id: 'authentication',
      title: 'Authentication Services',
      action: () => setActiveNotice('Biometric Authentication token active'),
      icon: <Fingerprint className="w-10 h-10 text-[#7BE4C2] stroke-[1.6]" />,
    },
    {
      id: 'resident_photo',
      title: 'Update Resident Photo',
      action: () => onNavigate('personal_details'),
      icon: (
        <svg className="w-10 h-10 text-[#7BE4C2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="13" height="13" rx="2" />
          <circle cx="8" cy="8" r="2" />
          <path d="M14 12l-2-2-4 4" />
          <path d="M7 17h10a2 2 0 002-2V7" />
        </svg>
      ),
    },
    {
      id: 'minor_accident',
      title: 'Report Minor Accident',
      action: () => onNavigate('license'),
      icon: (
        <svg className="w-10 h-10 text-[#7BE4C2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11 2 11.2 2 11.5V16c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
          <path d="M5 11l7-1" />
        </svg>
      ),
    },
    {
      id: 'passport_info',
      title: 'Update Passport Information',
      action: () => onNavigate('passport'),
      icon: (
        <svg className="w-10 h-10 text-[#7BE4C2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <line x1="3.6" y1="9" x2="20.4" y2="9" />
          <line x1="3.6" y1="15" x2="20.4" y2="15" />
          <path d="M12 3a14 14 0 0 1 0 18" />
          <path d="M12 3a14 14 0 0 0 0 18" />
        </svg>
      ),
    },
  ];

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="screen-services" className="flex-1 flex flex-col overflow-y-auto bg-[#211F1F] text-white select-none">
      {/* Top Header bar with Absher mark, Ministry seal, Settings & Bell */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between shrink-0">
        {/* Left: Absher 5 vertical rounded bars & MOI Seal */}
        <div className="flex items-center gap-2.5">
          {/* Absher 5 bars brandmark */}
          <div className="flex items-center gap-[3.5px] h-7">
            <span className="w-1.5 h-6.5 bg-white rounded-full inline-block" />
            <span className="w-1.5 h-5 bg-white rounded-full inline-block" />
            <span className="w-1.5 h-7.5 bg-white rounded-full inline-block" />
            <span className="w-1.5 h-5 bg-white rounded-full inline-block" />
            <span className="w-1.5 h-6 bg-white rounded-full inline-block" />
          </div>

          {/* Ministry of Interior emblem roundel */}
          <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-white/10 text-emerald-200">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white/90">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <path d="M12 4v4m-3-2l6 4M9 10l6-4m-6 8h6" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="12" cy="15" r="2" />
            </svg>
          </div>
        </div>

        {/* Right: Settings & Notifications */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('control_panel')}
            className="p-1.5 rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer relative"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-500 text-black rounded-full flex items-center justify-center text-[7px] font-black shadow">
              <Lock className="w-1.5 h-1.5 stroke-[3]" />
            </span>
          </button>
          <button
            onClick={() => setActiveNotice('All government digital service connections verified offline.')}
            className="p-1.5 rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="px-5 pt-3 pb-3">
        <h1 className="text-white text-2xl font-bold tracking-tight font-sans">
          My Services
        </h1>
      </div>

      {/* Search Input (Pill Shaped) */}
      <div className="px-5 pb-4">
        <div className="relative flex items-center w-full bg-[#2C3033] rounded-full px-4 py-3 border border-transparent focus-within:border-emerald-500/50 shadow-inner transition-colors">
          <Search className="w-4.5 h-4.5 text-neutral-400 shrink-0 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Service..."
            className="w-full bg-transparent text-sm text-white placeholder:text-neutral-400 outline-none"
          />
        </div>
      </div>

      {/* Notice Banner if triggered */}
      {activeNotice && (
        <div className="mx-5 mb-3 p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-200 animate-in fade-in">
          <span>{activeNotice}</span>
          <button onClick={() => setActiveNotice(null)} className="ml-2 font-bold hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* 2-Column Grid of Service Cards with Bigger Mint Icons */}
      <div className="px-5 pb-24 grid grid-cols-2 gap-3.5 flex-1">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            id={`service-card-${service.id}`}
            onClick={service.action}
            className="bg-[#2C3033] hover:bg-[#34393D] border border-neutral-700/30 rounded-2xl p-4.5 min-h-[142px] flex flex-col justify-between cursor-pointer transition-all active:scale-[0.97] shadow-md"
          >
            {/* Top: Bigger Mint Green Icon */}
            <div className="pt-0.5">
              {service.icon}
            </div>

            {/* Bottom: Service Title */}
            <div className="mt-4">
              <span className="text-white text-[13.5px] sm:text-[14px] font-medium leading-snug block">
                {service.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button (Mint Chat bubble with sparkles) */}
      <div className="fixed bottom-20 right-5 z-20">
        <button
          onClick={() => setActiveNotice('Absher Smart Assistant is ready to assist you offline.')}
          className="w-13 h-13 rounded-full bg-[#7BE4C2] hover:bg-[#68dcb7] text-[#12382c] shadow-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title="Absher Smart Assistant"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 fill-current stroke-[2]" />
            <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1.5 text-[#0a261d]" />
          </div>
        </button>
      </div>
    </div>
  );
};
