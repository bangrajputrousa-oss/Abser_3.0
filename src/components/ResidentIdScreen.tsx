import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Copy, Check } from 'lucide-react';
import { AppState } from '../types';

interface ResidentIdScreenProps {
  appState: AppState;
  onBack: () => void;
}

export const ResidentIdScreen: React.FC<ResidentIdScreenProps> = ({
  appState,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const { personalDetails } = appState;

  const residentDoc = appState.documents.find((d) => d.type === 'resident_id') || {
    id: 'doc-1',
    title: 'Resident ID',
    number: personalDetails.idNumber,
    issuing: '24/04/2025',
    expiry: '05/10/2026',
    extra: { version: '1' },
  };

  const idVersion = residentDoc.extra?.version || '1';

  const handleCopy = () => {
    navigator.clipboard.writeText(residentDoc.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="screen-my-resident-id" className="flex-1 flex flex-col overflow-y-auto bg-[#211F1F] text-white">
      {/* Green Header */}
      <div className="bg-[#006837] px-4 py-3.5 flex items-center gap-3 shadow-md shrink-0">
        <button
          id="resident-id-btn-back"
          onClick={onBack}
          className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-bold tracking-tight">
          My Resident ID
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-4 flex flex-col gap-4 flex-1">
        {/* Info Card (Exact match to official Absher UI) */}
        <div className="w-full bg-[#2C3033] rounded-2xl overflow-hidden shadow-lg border border-neutral-700/60 p-5 flex flex-col gap-5 text-sm">
          {/* Header */}
          <div className="flex items-center gap-3 pb-2 border-b border-neutral-700/50">
            <div className="w-9 h-9 rounded-xl bg-neutral-800/90 flex items-center justify-center text-[#7BE4C2] border border-neutral-700/60">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-white font-bold text-base">
              My Resident ID
            </h2>
          </div>

          {/* Resident ID Number with Copy */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-neutral-400 text-xs">Resident ID Number</span>
              <span className="text-white font-bold text-base font-mono tracking-wider">
                {residentDoc.number}
              </span>
            </div>
            <button
              id="btn-copy-resident-id"
              onClick={handleCopy}
              className="p-1.5 text-[#7BE4C2] hover:text-emerald-300 cursor-pointer"
              title="Copy Resident ID Number"
            >
              {copied ? (
                <Check className="w-5 h-5 text-[#7BE4C2]" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* ID Version */}
          <div className="flex flex-col gap-1">
            <span className="text-neutral-400 text-xs">ID Version</span>
            <span className="text-white font-semibold text-sm">
              {idVersion}
            </span>
          </div>

          {/* Issuing Date */}
          <div className="flex flex-col gap-1">
            <span className="text-neutral-400 text-xs">Issuing Date</span>
            <span className="text-white font-semibold text-sm font-mono">
              {residentDoc.issuing}
            </span>
          </div>

          {/* Expiry Date */}
          <div className="flex flex-col gap-1">
            <span className="text-neutral-400 text-xs">Expiry Date</span>
            <span className="text-white font-semibold text-sm font-mono">
              {residentDoc.expiry}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
