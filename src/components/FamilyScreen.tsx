import React from 'react';
import { Users2, UserPlus, FileText, ChevronRight } from 'lucide-react';

export const FamilyScreen: React.FC = () => {
  return (
    <div id="screen-family" className="flex-1 flex flex-col overflow-y-auto bg-[#211F1F] text-white">
      <div className="bg-[#006837] px-4 py-3.5 shadow-md shrink-0">
        <h1 className="text-white text-lg font-bold tracking-tight">
          Family Members
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-4 flex-1">
        <div className="bg-[#2C3033] rounded-2xl p-5 border border-neutral-700/60 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-neutral-800/90 flex items-center justify-center text-[#7BE4C2] border border-neutral-700">
            <Users2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base">
              Family & Dependents
            </h2>
            <p className="text-neutral-300 text-xs mt-1 max-w-xs leading-relaxed">
              No registered dependents found under this resident ID. You can issue dependent entry visas or manage family status.
            </p>
          </div>
          <button className="mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-md">
            <UserPlus className="w-4 h-4" />
            <span>Add Family Dependent</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-400">Available Family Services</span>
          <div className="bg-[#2C3033] hover:bg-[#34393D] border border-neutral-700/60 rounded-xl p-3.5 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#7BE4C2]" />
              <span className="text-xs font-medium text-white">Family Visa Issuance</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="bg-[#2C3033] hover:bg-[#34393D] border border-neutral-700/60 rounded-xl p-3.5 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#7BE4C2]" />
              <span className="text-xs font-medium text-white">Family Travel Permit</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
