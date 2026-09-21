import React, { useState } from 'react';
import { Search, Settings, Bell, CarFront, Fingerprint, MapPinned, FileText, User, Sparkles, MessageSquareMore, ChevronRight, X, AlertCircle, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { AppState, ScreenType } from '../types';
import { UserAvatar } from './UserAvatar';
import { DigitalIdCard } from './DigitalIdCard';

interface HomeScreenProps {
  appState: AppState;
  onNavigate: (screen: ScreenType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  appState,
  onNavigate,
}) => {
  const { personalDetails, visuals } = appState;
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [activeModal, setActiveModal] = useState<'vehicles' | 'auth' | 'travel' | 'accident' | 'photo' | 'weapons' | null>(null);

  const handleOpenCardPreview = () => {
    setShowCardPreview(true);
  };

  // Dedicated Home Page Digital ID card image (uploaded directly from Control Panel or resident ID doc)
  const residentDoc = appState.documents.find((d) => d.type === 'resident_id');
  const homeDigitalIdImage = visuals.homeDigitalIdImage || residentDoc?.image;

  return (
    <div id="screen-home" className="flex-1 flex flex-col overflow-y-auto bg-[#211F1F] text-white select-none">
      {/* Green Header Section (20% bigger with generous spacing & larger brand crest) */}
      <div className="bg-gradient-to-b from-[#006837] to-[#00522c] px-5 pt-5 pb-7 flex flex-col gap-5 shadow-lg">
        {/* Top bar with Logo & Action Icons (+20% larger) */}
        <div className="flex items-center justify-between">
          {/* Logo / Crest (1x Bigger / Configurable via Control Panel) */}
          <div
            onClick={() => onNavigate('control_panel')}
            className="cursor-pointer group flex items-center"
            title="Header Logo (tap to change in Control Panel)"
          >
            {visuals.headerLogo ? (
              <img
                src={visuals.headerLogo}
                alt="Header Logo"
                className="max-w-[260px] w-auto object-contain transition-transform group-hover:scale-105"
                style={{
                  height: visuals.headerLogoScale && visuals.headerLogoScale >= 2 ? '4.25rem' : visuals.headerLogoScale && visuals.headerLogoScale <= 1 ? '2.75rem' : '3.5rem',
                  aspectRatio: '400/120',
                }}
              />
            ) : (
              <div
                className="flex items-center gap-3 origin-left transition-transform duration-200"
                style={{
                  transform: `scale(${visuals.headerLogoScale ? (visuals.headerLogoScale >= 2 ? 1.25 : visuals.headerLogoScale <= 1 ? 1.0 : 1.15) : 1.15})`,
                }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-xs shadow-inner">
                  <span className="text-white text-xl font-bold font-arabic">أبشر</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-base font-bold tracking-wide leading-tight font-sans">
                    Absher Individual
                  </span>
                  <span className="text-emerald-100/90 text-xs font-arabic font-medium -mt-0.5">
                    أفراد
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons (+20% spacing and sizing) */}
          <div className="flex items-center gap-3.5">
            <button
              id="header-btn-search"
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-5.5 h-5.5" />
            </button>
            <button
              id="header-btn-settings"
              onClick={() => onNavigate('control_panel')}
              className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer relative"
              title="Control Panel (Locked)"
            >
              <Settings className="w-5.5 h-5.5" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 text-black rounded-full flex items-center justify-center text-[8px] font-black shadow ring-1 ring-[#006837]">
                <Lock className="w-2 h-2 stroke-[3]" />
              </span>
            </button>
            <button
              id="header-btn-notifications"
              onClick={() => setShowNotifications(true)}
              className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-5.5 h-5.5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#7BE4C2] rounded-full ring-2 ring-[#006837]" />
            </button>
          </div>
        </div>

        {/* Quick Search Overlay */}
        {showSearch && (
          <div className="w-full bg-[#2C3033] rounded-xl p-3 flex items-center gap-2.5 border border-emerald-400/40 animate-in fade-in shadow-lg">
            <Search className="w-4.5 h-4.5 text-neutral-300" />
            <input
              type="text"
              placeholder="Search services, vehicles, documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-400 font-sans"
              autoFocus
            />
            <button
              onClick={() => setShowSearch(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        )}

        {/* User Card Header (20% bigger padding, larger avatar and fonts) */}
        <div
          id="user-summary-card"
          onClick={() => onNavigate('profile')}
          className="w-full bg-[#26282B] hover:bg-[#2E3135] border border-neutral-700/60 rounded-2xl p-4.5 sm:py-5 flex items-center gap-4.5 cursor-pointer shadow-xl transition-all active:scale-[0.99]"
        >
          <UserAvatar
            src={visuals.profilePhoto}
            name={personalDetails.name}
            size="md"
            className="w-14 h-14 sm:w-15 sm:h-15 rounded-xl shrink-0 border border-white/10"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-base sm:text-lg leading-tight truncate">
              {personalDetails.name}
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm font-mono mt-1">
              ID No.: {personalDetails.idNumber}
            </p>
          </div>
          <ChevronRight className="w-5.5 h-5.5 text-neutral-400 shrink-0" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4.5 py-5 flex flex-col gap-6 flex-1">
        {/* Section: My Digital Documents (Shows strictly only the Digital ID) */}
        <section id="section-digital-documents" className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg tracking-tight font-sans">
              My Digital Documents
            </h3>
            <span className="text-xs text-[#7BE4C2] font-medium">Tap to view full screen</span>
          </div>

          {/* Digital Muqeem Resident ID Card */}
          <div className="cursor-pointer" onClick={handleOpenCardPreview}>
            <DigitalIdCard
              personalDetails={personalDetails}
              customCardImage={homeDigitalIdImage}
              avatarUrl={visuals.profilePhoto}
              onCardClick={handleOpenCardPreview}
            />
          </div>
        </section>

        {/* Section: Quick Access matching uploaded screenshot */}
        <section id="section-quick-access" className="bg-[#006837] -mx-4.5 px-4.5 pt-5 pb-10 flex flex-col gap-3.5 shadow-md">
          <div className="w-full">
            <h3 className="text-white font-bold text-lg tracking-tight font-sans">
              Quick Access
            </h3>
          </div>

          {/* Card 1: My Vehicles */}
          <div
            id="card-my-vehicles"
            onClick={() => setActiveModal('vehicles')}
            className="w-full bg-[#2A2D30] hover:bg-[#32363A] border border-white/5 rounded-2xl p-4.5 min-h-[92px] flex items-center gap-4 cursor-pointer shadow-md transition-all active:scale-[0.99]"
          >
            <CarFront className="w-9 h-9 text-[#7BE4C2] stroke-[1.8] shrink-0" />
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm leading-snug">
                My Vehicles
              </h4>
              <p className="text-[#A6ABB0] text-xs leading-relaxed mt-0.5">
                View details, renew documents, report accidents, and much more.
              </p>
            </div>
          </div>

          {/* Grid Row 1: Authentication Services & Absher Travel */}
          <div className="w-full grid grid-cols-2 gap-3.5">
            {/* Authentication Services */}
            <div
              id="card-authentication"
              onClick={() => setActiveModal('auth')}
              className="bg-[#2A2D30] hover:bg-[#32363A] border border-white/5 rounded-2xl p-4.5 min-h-[135px] flex flex-col justify-between cursor-pointer shadow-md transition-all active:scale-[0.98]"
            >
              <Fingerprint className="w-10 h-10 text-[#7BE4C2] stroke-[1.8]" />
              <div>
                <h4 className="text-white font-medium text-sm leading-snug">
                  Authentication Services
                </h4>
              </div>
            </div>

            {/* Absher Travel */}
            <div
              id="card-absher-travel"
              onClick={() => setActiveModal('travel')}
              className="bg-[#2A2D30] hover:bg-[#32363A] border border-white/5 rounded-2xl p-4.5 min-h-[135px] flex flex-col justify-between cursor-pointer shadow-md transition-all active:scale-[0.98]"
            >
              <MapPinned className="w-10 h-10 text-[#7BE4C2] stroke-[1.8]" />
              <div>
                <h4 className="text-white font-medium text-sm leading-snug">
                  Absher Travel
                </h4>
              </div>
            </div>
          </div>

          {/* Grid Row 2: Report Minor Accident & Update Resident Photo */}
          <div className="w-full grid grid-cols-2 gap-3.5">
            {/* Report Minor Accident */}
            <div
              id="card-report-accident"
              onClick={() => setActiveModal('accident')}
              className="bg-[#2A2D30] hover:bg-[#32363A] border border-white/5 rounded-2xl p-4.5 min-h-[135px] flex flex-col justify-between cursor-pointer shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-1.5">
                <CarFront className="w-8 h-8 text-[#7BE4C2] stroke-[1.8]" />
                <FileText className="w-6 h-6 text-[#7BE4C2] stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm leading-snug">
                  Report Minor Accident
                </h4>
              </div>
            </div>

            {/* Update Resident Photo */}
            <div
              id="card-update-photo"
              onClick={() => setActiveModal('photo')}
              className="bg-[#2A2D30] hover:bg-[#32363A] border border-white/5 rounded-2xl p-4.5 min-h-[135px] flex flex-col justify-between cursor-pointer shadow-md transition-all active:scale-[0.98]"
            >
              <div className="relative w-9 h-9">
                <div className="absolute -top-1 -left-1 w-7.5 h-7.5 rounded-md border-[2px] border-[#7BE4C2] opacity-40 -rotate-3" />
                <div className="relative w-7.5 h-7.5 rounded-md border-[2px] border-[#7BE4C2] bg-[#2A2D30] flex items-center justify-center">
                  <User className="w-4.5 h-4.5 text-[#7BE4C2] stroke-[2]" />
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium text-sm leading-snug">
                  Update Resident Photo
                </h4>
              </div>
            </div>
          </div>

          {/* Card 6: My Weapons */}
          <div
            id="card-my-weapons"
            onClick={() => setActiveModal('weapons')}
            className="w-full bg-[#2A2D30] hover:bg-[#32363A] border border-white/5 rounded-2xl p-4.5 min-h-[92px] flex items-center gap-4 cursor-pointer shadow-md transition-all active:scale-[0.99]"
          >
            {/* Clean stylized pistol outline matching screenshot */}
            <svg viewBox="0 0 32 20" className="w-10 h-7 text-[#7BE4C2] stroke-[1.8] fill-none shrink-0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 28 5 L 8 5 C 7 5 6 6 6 7 L 6 10 L 15 10 L 15 12 C 15 13 14 14 13 14 L 10 14" />
              <path d="M 15 10 L 19 10 L 23 18 C 23.5 19 25 19 26 18 L 29 13 C 29.5 12 29.5 10 29 8 L 28 5 Z" />
              <path d="M 16 11 C 17 12 17 13 16 14" />
            </svg>
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm leading-snug">
                My Weapons
              </h4>
              <p className="text-[#A6ABB0] text-xs leading-relaxed mt-0.5">
                View weapons details, issue and view carry permits
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button (Mint Chat & Assistant matching screenshot) */}
      <button
        id="fab-assistant"
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-[#98E2C6] hover:bg-[#85dab8] text-[#042d17] shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 z-30"
        title="Absher Smart Assistant"
      >
        <div className="relative">
          <MessageSquareMore className="w-7 h-7 stroke-[2.2]" />
          <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-[#042d17]" />
        </div>
      </button>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-[#211F1F]/90 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-[#2C3033] border border-neutral-700 rounded-2xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#7BE4C2]" />
                <h3 className="text-white font-bold text-base">Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#7BE4C2] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="text-white font-semibold">Resident ID Valid</p>
                  <p className="text-neutral-300 mt-0.5">
                    Your digital identity is active and synchronized offline.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Smart Assistant Dialog */}
      {showChatbot && (
        <div className="fixed bottom-36 right-5 w-80 bg-[#2C3033] border border-neutral-700 rounded-2xl shadow-2xl p-4 z-40 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-neutral-700/80 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#7BE4C2] text-[#064e3b] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white">Absher Assistant</span>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-neutral-300 leading-relaxed bg-[#211F1F] p-3 rounded-xl">
            Hello {personalDetails.name}! Your documents are valid. You can view your Passport, Resident ID, Driving License, or edit everything via the <strong>Control Panel</strong>.
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowChatbot(false);
                onNavigate('resident_id');
              }}
              className="flex-1 py-1.5 bg-emerald-900/60 hover:bg-emerald-800/60 text-emerald-200 text-[11px] rounded-lg border border-emerald-700/40"
            >
              Resident ID
            </button>
            <button
              onClick={() => {
                setShowChatbot(false);
                onNavigate('control_panel');
              }}
              className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] rounded-lg"
            >
              Control Panel
            </button>
          </div>
        </div>
      )}

      {/* Quick Access Item Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-[#211F1F]/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm bg-[#2C3033] border border-neutral-700 rounded-3xl p-5 shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-700/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-[#7BE4C2]">
                  {activeModal === 'vehicles' && <CarFront className="w-5 h-5" />}
                  {activeModal === 'auth' && <Fingerprint className="w-5 h-5" />}
                  {activeModal === 'travel' && <MapPinned className="w-5 h-5" />}
                  {activeModal === 'accident' && <CarFront className="w-5 h-5" />}
                  {activeModal === 'photo' && <User className="w-5 h-5" />}
                  {activeModal === 'weapons' && <ShieldCheck className="w-5 h-5" />}
                </div>
                <h3 className="text-white font-bold text-base">
                  {activeModal === 'vehicles' && 'My Vehicles'}
                  {activeModal === 'auth' && 'Authentication Services'}
                  {activeModal === 'travel' && 'Absher Travel'}
                  {activeModal === 'accident' && 'Report Minor Accident'}
                  {activeModal === 'photo' && 'Update Resident Photo'}
                  {activeModal === 'weapons' && 'My Weapons & Permits'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {activeModal === 'vehicles' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 bg-[#212426] rounded-2xl border border-neutral-700/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Registered Vehicles</span>
                    <span className="text-[#7BE4C2] font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">1 Active</span>
                  </div>
                  <div className="text-white font-bold text-sm">Toyota Camry (Sedan)</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300 pt-1 border-t border-neutral-700/40">
                    <div>Plate: <strong className="text-white font-mono">4821 KSA</strong></div>
                    <div>Status: <span className="text-emerald-400">Valid (Istimara)</span></div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    onNavigate('license');
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors"
                >
                  View Driving License
                </button>
              </div>
            )}

            {activeModal === 'auth' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 bg-[#212426] rounded-2xl border border-neutral-700/60 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold">Biometric Authentication Active</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed text-[11px]">
                    Your fingerprint and face identification are securely enrolled with Absher and Nafath for fast, password-free authorization.
                  </p>
                  <div className="text-neutral-400 text-[10px] pt-1 border-t border-neutral-700/40">
                    Nafath Device Token: <span className="font-mono text-neutral-300">ACTIVE-ENCRYPTED-256</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl"
                >
                  Done
                </button>
              </div>
            )}

            {activeModal === 'travel' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 bg-[#212426] rounded-2xl border border-neutral-700/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Travel Status</span>
                    <span className="bg-[#7BE4C2]/20 text-[#7BE4C2] border border-[#7BE4C2]/30 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      Inside Kingdom
                    </span>
                  </div>
                  <div className="text-white font-bold text-sm">Valid Travel Records</div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    Exit & re-entry visas, international driving authorization, and travel records are verified with Border Guard and Jawazat.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    onNavigate('profile');
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors"
                >
                  View Travel History
                </button>
              </div>
            )}

            {activeModal === 'accident' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 bg-[#212426] rounded-2xl border border-neutral-700/60 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold">Najm Quick Accident Reporting</span>
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    Report minor, non-injury traffic accidents directly without waiting for a patrol car. Automatic GPS location and digital claim creation.
                  </p>
                  <div className="p-2 bg-emerald-950/40 border border-emerald-700/30 rounded-lg text-[11px] text-emerald-300">
                    Insurance policy active with comprehensive vehicle coverage.
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {activeModal === 'photo' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 bg-[#212426] rounded-2xl border border-neutral-700/60 flex flex-col gap-2">
                  <div className="text-white font-bold text-sm">Jawazat & Civil Affairs Photo Standards</div>
                  <ul className="text-neutral-300 text-[11px] list-disc list-inside space-y-1">
                    <li>Recent photo taken within last 6 months</li>
                    <li>Pure white background with even lighting</li>
                    <li>No dark glasses, colored contact lenses, or head covering altering facial features</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    onNavigate('control_panel');
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors"
                >
                  Upload New Photo in Control Panel
                </button>
              </div>
            )}

            {activeModal === 'weapons' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 bg-[#212426] rounded-2xl border border-neutral-700/60 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Weapons Registry</span>
                    <span className="text-neutral-400 font-medium">MOI Registry</span>
                  </div>
                  <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl text-center text-neutral-300 text-[11px]">
                    No civilian weapons or carry permits are registered under ID <strong className="text-white font-mono">{personalDetails.idNumber}</strong>.
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-relaxed">
                    Firearms licensing, renewal, and transfer of ownership are subject to Ministry of Interior regulations and permits.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full-Screen Landscape Digital ID Inspection Modal */}
      {showCardPreview && (
        <div
          id="modal-digital-id-preview"
          className="fixed inset-0 z-50 bg-[#211F1F] flex flex-col items-center justify-between p-3 sm:p-6 overflow-hidden select-none animate-in fade-in duration-200"
          onClick={() => setShowCardPreview(false)}
        >
          {/* Top Bar with Clean White 'X' Close Button (Zoom and Rotate icons hidden as requested) */}
          <div className="w-full flex items-center justify-between px-2 pt-1 z-20 shrink-0">
            <button
              id="btn-close-fullscreen-doc"
              onClick={() => setShowCardPreview(false)}
              className="p-2.5 rounded-full hover:bg-white/10 text-white cursor-pointer transition-colors"
              title="Close"
            >
              <X className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>

          {/* Center Stage: Document in Horizontal Mode at 1X */}
          <div
            className="flex-1 w-full flex items-center justify-center p-2 overflow-hidden select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="transition-all duration-300 origin-center flex items-center justify-center rotate-90 sm:rotate-0 w-[78vh] sm:w-[94%] max-w-[620px] aspect-[1.586/1] scale-100 shadow-2xl">
              {homeDigitalIdImage ? (
                <img
                  src={homeDigitalIdImage}
                  alt="Digital Document"
                  draggable={false}
                  className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10 pointer-events-none select-none"
                />
              ) : (
                <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 pointer-events-none select-none">
                  <DigitalIdCard
                    personalDetails={personalDetails}
                    avatarUrl={visuals.profilePhoto}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom helper text */}
          <div className="py-2 text-center text-xs text-neutral-400 z-10 shrink-0">
            <span>Tap ✕ or tap background to exit</span>
          </div>
        </div>
      )}
    </div>
  );
};
