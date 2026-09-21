import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, ChevronRight, Globe, FileText, Users, X, PlaneTakeoff } from 'lucide-react';
import { AppState, ScreenType } from '../types';
import { UserAvatar } from './UserAvatar';

interface ProfileScreenProps {
  appState: AppState;
  onNavigate: (screen: ScreenType) => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  appState,
  onNavigate,
  onBack,
}) => {
  const { personalDetails, visuals } = appState;
  const [copied, setCopied] = useState(false);
  const [showTravelModal, setShowTravelModal] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(personalDetails.idNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="screen-my-profile" className="flex-1 flex flex-col overflow-y-auto bg-[#181A1C] text-white select-none">
      {/* Green Header Bar with extended background */}
      <div className="relative bg-[#006837] px-4 pt-3.5 pb-16 flex flex-col shrink-0 shadow-md">
        <div className="flex items-center gap-4 z-10">
          <button
            id="profile-btn-back"
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-white text-lg font-bold tracking-tight">
            My Profile
          </h1>
        </div>
      </div>

      {/* Main Content Area overlapping green header */}
      <div className="px-4 -mt-12 flex flex-col gap-3.5 z-10 pb-8 flex-1">
        {/* Profile Card matching screenshot */}
        <div
          id="profile-main-card"
          className="w-full bg-[#2B2D31] rounded-3xl pt-0 pb-5 px-5 flex flex-col items-center text-center shadow-xl border border-white/5 relative"
        >
          {/* Centered Profile Avatar: Rounded square overlapping top edge */}
          <div className="-mt-10 mb-3 flex items-center justify-center">
            <div className="w-[78px] h-[78px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/15 bg-[#1F2224] shrink-0">
              <UserAvatar
                src={visuals.profilePhoto}
                name={personalDetails.name}
                size="xl"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

          {/* User Full Name (bold uppercase) */}
          <h2 className="text-white text-lg font-bold tracking-wide font-sans uppercase">
            {personalDetails.name}
          </h2>

          {/* ID Number with Copy icon */}
          <div className="flex items-center justify-center gap-2 mt-1 text-[#A6ABB0] text-xs sm:text-sm font-normal">
            <span>ID No. {personalDetails.idNumber}</span>
            <button
              id="btn-copy-profile-id"
              onClick={handleCopyId}
              className="p-1 text-[#A6ABB0] hover:text-[#7BE4C2] transition-colors cursor-pointer"
              title="Copy ID Number"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#7BE4C2] animate-in zoom-in" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* My Personal Details Link Button (Mint Green Text + Chevron matching screenshot) */}
          <button
            id="btn-goto-personal-details"
            onClick={() => onNavigate('personal_details')}
            className="mt-4 flex items-center justify-center gap-1.5 text-[#7BE4C2] hover:text-emerald-300 text-sm font-semibold tracking-wide cursor-pointer transition-colors"
          >
            <span>My Personal Details</span>
            <ChevronRight className="w-4 h-4 text-[#7BE4C2] stroke-[2.2]" />
          </button>
        </div>

        {/* 2 Grid Cards: My Passport & My Resident ID */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* My Passport Card */}
          <div
            id="btn-my-passport"
            onClick={() => onNavigate('passport')}
            className="bg-[#2B2D31] hover:bg-[#33363A] border border-white/5 rounded-2xl p-4 flex flex-col justify-between min-h-[114px] cursor-pointer shadow-md transition-all active:scale-[0.98]"
          >
            {/* Passport booklet outline with Globe inside matching screenshot */}
            <div className="w-7 h-9 rounded-md border-[2px] border-[#7BE4C2] flex items-center justify-center p-0.5">
              <Globe className="w-4.5 h-4.5 text-[#7BE4C2] stroke-[1.8]" />
            </div>
            <span className="text-white font-medium text-sm">
              My Passport
            </span>
          </div>

          {/* My Resident ID Card */}
          <div
            id="btn-my-resident-id"
            onClick={() => onNavigate('resident_id')}
            className="bg-[#2B2D31] hover:bg-[#33363A] border border-white/5 rounded-2xl p-4 flex flex-col justify-between min-h-[114px] cursor-pointer shadow-md transition-all active:scale-[0.98]"
          >
            {/* Resident ID Card outline with portrait box & details lines matching screenshot */}
            <div className="w-9 h-7 rounded-md border-[2px] border-[#7BE4C2] flex items-center px-1 gap-1">
              <div className="w-2.5 h-3 border border-[#7BE4C2] rounded-[2px]" />
              <div className="flex flex-col gap-1 flex-1">
                <div className="h-[2px] bg-[#7BE4C2] rounded-full w-full" />
                <div className="h-[2px] bg-[#7BE4C2] rounded-full w-2/3" />
              </div>
            </div>
            <span className="text-white font-medium text-sm">
              My Resident ID
            </span>
          </div>
        </div>

        {/* Stacked Card: My Visa & My Driving License */}
        <div className="bg-[#2B2D31] border border-white/5 rounded-2xl overflow-hidden shadow-md flex flex-col">
          {/* My Visa Row */}
          <div
            id="btn-my-visa"
            onClick={() => onNavigate('visa')}
            className="p-4 flex items-center gap-3.5 cursor-pointer hover:bg-[#33363A] transition-colors active:scale-[0.99]"
          >
            <FileText className="w-7 h-7 text-[#7BE4C2] stroke-[1.8] shrink-0" />
            <span className="text-white font-medium text-sm">
              My Visa
            </span>
          </div>

          {/* Subtle Horizontal Divider */}
          <div className="border-t border-[#383B40] mx-4" />

          {/* My Driving License Row */}
          <div
            id="btn-my-driving-license"
            onClick={() => onNavigate('license')}
            className="p-4 flex items-center gap-3.5 cursor-pointer hover:bg-[#33363A] transition-colors active:scale-[0.99]"
          >
            <div className="w-8 h-6 rounded-md border-[2px] border-[#7BE4C2] flex items-center px-1 gap-1 shrink-0">
              <div className="w-2 h-2.5 border border-[#7BE4C2] rounded-[2px]" />
              <div className="flex flex-col gap-0.5 flex-1">
                <div className="h-[1.5px] bg-[#7BE4C2] rounded-full w-full" />
                <div className="h-[1.5px] bg-[#7BE4C2] rounded-full w-3/4" />
              </div>
            </div>
            <span className="text-white font-medium text-sm">
              My Driving License
            </span>
          </div>
        </div>

        {/* Travel Records Banner Card with Turquoise Water Background */}
        <div
          id="card-travel-records"
          onClick={() => setShowTravelModal(true)}
          className="relative w-full rounded-2xl overflow-hidden min-h-[106px] p-4 flex flex-col justify-between cursor-pointer shadow-lg border border-white/10 group transition-all active:scale-[0.99]"
          style={{
            background: 'linear-gradient(135deg, #0e8760 0%, #15b583 35%, #22cf9a 70%, #059669 100%)',
          }}
        >
          {/* Subtle tropical sea water wave effect */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.45) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(0,40,20,0.35) 0%, transparent 55%)',
            }}
          />

          {/* Top Right Pill Badge */}
          <div className="relative z-10 flex items-center justify-end">
            <span className="text-[11px] px-3 py-1 rounded-full bg-[#181a1c]/60 text-white font-medium backdrop-blur-xs shadow-xs">
              Inside Kingdom
            </span>
          </div>

          {/* Bottom Left Title & Subtext */}
          <div className="relative z-10 mt-2">
            <h3 className="text-[#032a17] font-bold text-lg leading-tight tracking-tight">
              My Travel Records
            </h3>
            <p className="text-[#084526] text-xs font-normal mt-0.5">
              Find your last trips details
            </p>
          </div>
        </div>

        {/* Labor Importations Card */}
        <div
          id="card-labor-importations"
          onClick={() => onNavigate('workers')}
          className="bg-[#2B2D31] hover:bg-[#33363A] border border-white/5 rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer shadow-md transition-all active:scale-[0.99]"
        >
          <Users className="w-7 h-7 text-[#7BE4C2] stroke-[1.8] shrink-0" />
          <span className="text-white font-medium text-sm">
            Labor Importations
          </span>
        </div>
      </div>

      {/* Travel Records Details Modal */}
      {showTravelModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#25282B] rounded-t-3xl sm:rounded-3xl border border-white/10 p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between border-b border-neutral-700/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-900/40 text-[#7BE4C2] flex items-center justify-center">
                  <PlaneTakeoff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Travel Records</h3>
                  <p className="text-[#7BE4C2] text-xs font-medium">Inside Kingdom of Saudi Arabia</p>
                </div>
              </div>
              <button
                onClick={() => setShowTravelModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-neutral-800/80 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 py-1">
              <div className="bg-[#1C1E20] rounded-xl p-3.5 border border-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Current Status</span>
                  <span className="text-[#7BE4C2] font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    Inside Kingdom
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Port of Entry</span>
                  <span className="text-white font-medium">King Khalid Int'l Airport (RUH)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Traveler Name</span>
                  <span className="text-white font-medium uppercase">{personalDetails.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">ID Number</span>
                  <span className="text-neutral-200 font-mono">{personalDetails.idNumber}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTravelModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#006837] hover:bg-[#007A3D] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

