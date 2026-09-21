import React, { useState } from 'react';
import { ArrowLeft, Globe, Copy, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { AppState } from '../types';

interface PassportScreenProps {
  appState: AppState;
  onBack: () => void;
}

export const PassportScreen: React.FC<PassportScreenProps> = ({
  appState,
  onBack,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  // Find passport doc
  const passportDoc = appState.documents.find((d) => d.type === 'passport') || {
    id: 'doc-3',
    title: 'My Passport',
    number: 'A07421900',
    issuing: '04/04/2023',
    expiry: '03/04/2033',
    extra: {
      type: 'Normal',
      issuingCity: 'بنجلادش',
      deposit: 'SAR 0.00',
      status: '-',
    },
  };

  const deposit = passportDoc.extra?.deposit || 'SAR 0.00';
  const passportType = passportDoc.extra?.type || 'Normal';
  const issuingCity = passportDoc.extra?.issuingCity || 'بنجلادش';
  const status = passportDoc.extra?.status || '-';

  const handleCopy = () => {
    navigator.clipboard.writeText(passportDoc.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="screen-my-passport" className="flex-1 flex flex-col overflow-y-auto bg-[#211F1F] text-white">
      {/* Green Header */}
      <div className="bg-[#006837] px-4 py-3.5 flex items-center gap-3 shadow-md shrink-0">
        <button
          id="passport-btn-back"
          onClick={onBack}
          className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-bold tracking-tight">
          My Passport
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-4 flex flex-col gap-4 flex-1">
        {/* Deposit Card */}
        <div className="w-full bg-[#2C3033] rounded-2xl p-4 flex flex-col gap-1 shadow-md border border-neutral-700/60">
          <span className="text-neutral-300 text-xs font-medium">
            Amount deposit
          </span>
          <span className="text-white font-bold text-base tracking-wide">
            {deposit}
          </span>
        </div>

        {/* Passport Accordion Card */}
        <div className="w-full bg-[#2C3033] rounded-2xl overflow-hidden shadow-lg border border-neutral-700/60">
          {/* Header */}
          <div
            id="passport-accordion-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-700/40 transition-colors border-b border-neutral-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-800/90 flex items-center justify-center text-[#7BE4C2] border border-neutral-700/60">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-white font-bold text-base">
                {passportType} Passport
              </h2>
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </div>

          {/* Body */}
          {isOpen && (
            <div className="p-4 flex flex-col gap-5 text-sm">
              {/* Passport Number with Copy */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-400 text-xs">Passport Number</span>
                  <span className="text-white font-bold text-base font-mono tracking-wider">
                    {passportDoc.number}
                  </span>
                </div>
                <button
                  id="btn-copy-passport-num"
                  onClick={handleCopy}
                  className="p-1.5 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  title="Copy Passport Number"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Type */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">Type</span>
                <span className="text-white font-semibold text-sm">
                  {passportType}
                </span>
              </div>

              {/* Issuing Date */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">Issuing Date</span>
                <span className="text-white font-semibold text-sm font-mono">
                  {passportDoc.issuing}
                </span>
              </div>

              {/* Expiry Date */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">Expiry Date</span>
                <span className="text-white font-semibold text-sm font-mono">
                  {passportDoc.expiry}
                </span>
              </div>

              {/* Issuing City */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">Issuing City</span>
                <span className="text-white font-semibold text-sm">
                  {issuingCity}
                </span>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">Status</span>
                <span className="text-white font-semibold text-sm">
                  {status}
                </span>
              </div>

              {passportDoc.image && (
                <div className="mt-2 border-t border-neutral-700/60 pt-3">
                  <span className="text-neutral-400 text-xs block mb-2">Attached Document Photo</span>
                  <img
                    src={passportDoc.image}
                    alt="Passport scan"
                    className="w-full rounded-xl border border-neutral-700 max-h-56 object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
