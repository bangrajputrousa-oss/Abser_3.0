import React from 'react';
import { Users, UserCheck, RefreshCw, Send, ChevronRight } from 'lucide-react';

export const WorkersScreen: React.FC = () => {
  return (
    <div id="screen-workers" className="flex-1 flex flex-col overflow-y-auto bg-[#211F1F] text-white">
      <div className="bg-[#006837] px-4 py-3.5 shadow-md shrink-0">
        <h1 className="text-white text-lg font-bold tracking-tight">
          Workers & Labor
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-4 flex-1">
        <div className="bg-[#2C3033] rounded-2xl p-5 border border-neutral-700/60 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-neutral-800/90 flex items-center justify-center text-[#7BE4C2] border border-neutral-700">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base">
              Sponsored Workers
            </h2>
            <p className="text-neutral-300 text-xs mt-1 max-w-xs leading-relaxed">
              Manage domestic workers, issue exit & re-entry permits, renew Iqama, or transfer sponsorships.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-neutral-400">Worker Management Services</span>
          
          <div className="bg-[#2C3033] hover:bg-[#34393D] border border-neutral-700/60 rounded-xl p-3.5 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-[#7BE4C2]" />
              <span className="text-xs font-medium text-white">Issue / Renew Resident ID (Iqama)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="bg-[#2C3033] hover:bg-[#34393D] border border-neutral-700/60 rounded-xl p-3.5 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <Send className="w-4 h-4 text-[#7BE4C2]" />
              <span className="text-xs font-medium text-white">Issue Exit & Re-entry Visa</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="bg-[#2C3033] hover:bg-[#34393D] border border-neutral-700/60 rounded-xl p-3.5 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-[#7BE4C2]" />
              <span className="text-xs font-medium text-white">Transfer Sponsorship</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
