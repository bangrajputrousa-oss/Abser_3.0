import React, { useState } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { AppState } from '../types';
import { UserAvatar } from './UserAvatar';

interface PersonalDetailsScreenProps {
  appState: AppState;
  onBack: () => void;
}

export const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({
  appState,
  onBack,
}) => {
  const { personalDetails, visuals } = appState;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div id="screen-my-personal-details" className="flex-1 flex flex-col overflow-y-auto bg-[#211F1F] text-white">
      {/* Green Header */}
      <div className="bg-[#006837] px-4 py-3.5 flex items-center gap-3 shadow-md shrink-0">
        <button
          id="personal-details-btn-back"
          onClick={onBack}
          className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-bold tracking-tight">
          My Personal Details
        </h1>
      </div>

      {/* Main Container */}
      <div className="p-4 flex flex-col gap-4 flex-1">
        {/* Accordion Card */}
        <div className="w-full bg-[#2C3033] rounded-2xl overflow-hidden shadow-lg border border-neutral-700/60">
          {/* Accordion Header */}
          <div
            id="personal-details-accordion-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-700/40 transition-colors border-b border-neutral-700/50"
          >
            <div className="flex items-center gap-3">
              <UserAvatar
                src={visuals.profilePhoto}
                name={personalDetails.name}
                size="sm"
                className="w-9 h-9 rounded-lg"
              />
              <h2 className="text-white font-bold text-base">
                Personal Details
              </h2>
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </div>

          {/* Accordion Body */}
          {isOpen && (
            <div className="p-4 flex flex-col gap-5 text-sm">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">Name</span>
                <span className="text-white font-bold text-base tracking-wide">
                  {personalDetails.name}
                </span>
              </div>

              {/* Birth City */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">Birth City</span>
                <span className="text-white font-semibold text-sm">
                  {personalDetails.birthCity || '-'}
                </span>
              </div>

              {/* Birth Country/Region */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">Birth Country/Region</span>
                <span className="text-white font-semibold text-sm">
                  {personalDetails.birthCountry}
                </span>
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">Date of Birth</span>
                <span className="text-white font-semibold text-sm font-mono">
                  {personalDetails.dateOfBirth}
                </span>
              </div>

              {/* Marital Status */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">Marital Status</span>
                <span className="text-white font-semibold text-sm tracking-wide">
                  {personalDetails.maritalStatus}
                </span>
              </div>

              {/* No. of sponsorship transfers */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">
                  No. of sponsorship transfers
                </span>
                <span className="text-white font-semibold text-sm font-mono">
                  {personalDetails.sponsorshipTransfers || '0'}
                </span>
              </div>

              {/* Religion */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">Religion</span>
                <span className="text-white font-semibold text-sm">
                  {personalDetails.religion}
                </span>
              </div>

              {/* Work Permit */}
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs">Work Permit</span>
                <span className="text-emerald-400 font-semibold text-sm">
                  {personalDetails.workPermit || 'Valid / Active'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
