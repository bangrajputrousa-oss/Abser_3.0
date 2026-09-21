import React, { useState } from 'react';
import { ArrowLeft, FileText, Copy, Check } from 'lucide-react';
import { AppState } from '../types';

interface VisaScreenProps {
  appState: AppState;
  onBack: () => void;
}

export const VisaScreen: React.FC<VisaScreenProps> = ({
  appState,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const visaDoc = appState.documents.find((d) => d.type === 'visa') || {
    id: 'doc-4',
    title: 'My Visa',
    number: 'VISA-44521',
    issuing: '-',
    expiry: '22/01/2027',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(visaDoc.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="screen-my-visa" className="flex-1 flex flex-col overflow-y-auto bg-[#211F1F] text-white">
      <div className="bg-[#006837] px-4 py-3.5 flex items-center gap-3 shadow-md shrink-0">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-bold tracking-tight">
          My Visa
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-4 flex-1">
        <div className="w-full bg-[#2C3033] rounded-2xl overflow-hidden shadow-lg border border-neutral-700/60 p-5 flex flex-col gap-5 text-sm">
          <div className="flex items-center gap-3 pb-2 border-b border-neutral-700/50">
            <div className="w-9 h-9 rounded-xl bg-neutral-800/90 flex items-center justify-center text-[#7BE4C2] border border-neutral-700/60">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-white font-bold text-base">
              Visa Information
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-neutral-400 text-xs">Visa Number</span>
              <span className="text-white font-bold text-base font-mono tracking-wider">
                {visaDoc.number}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="p-1.5 text-[#7BE4C2] hover:text-emerald-300 cursor-pointer"
            >
              {copied ? <Check className="w-5 h-5 text-[#7BE4C2]" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-neutral-400 text-xs">Visa Type</span>
            <span className="text-white font-semibold text-sm">Work / Residence Visa</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-neutral-400 text-xs">Issuing Date</span>
            <span className="text-white font-semibold text-sm font-mono">{visaDoc.issuing}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-neutral-400 text-xs">Expiry Date</span>
            <span className="text-white font-semibold text-sm font-mono">{visaDoc.expiry}</span>
          </div>

          {visaDoc.image && (
            <div className="mt-2 border-t border-neutral-700/60 pt-3">
              <span className="text-neutral-400 text-xs block mb-2">Attached Scan</span>
              <img
                src={visaDoc.image}
                alt="Visa scan"
                className="w-full rounded-xl border border-neutral-700 max-h-56 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
