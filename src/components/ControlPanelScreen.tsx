import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Trash2, Plus, Check, KeyRound, Download, FolderOpen, RotateCcw, Lock, LogOut, ShieldCheck } from 'lucide-react';
import { AppState, DocumentItem, LoginConfig } from '../types';
import { setStoredPassword, getStoredPassword } from './ControlPanelLockModal';
import { AbsherDualEmblem } from './AbsherBrandIcons';

interface ControlPanelScreenProps {
  appState: AppState;
  onSave: (newState: AppState) => void;
  onBack: () => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onResetDefaults: () => void;
  onLogout?: () => void;
}

export const ControlPanelScreen: React.FC<ControlPanelScreenProps> = ({
  appState,
  onSave,
  onBack,
  onExportBackup,
  onImportBackup,
  onResetDefaults,
  onLogout,
}) => {
  const [formData, setFormData] = useState<AppState>(() => {
    const cloned = JSON.parse(JSON.stringify(appState));
    if (!cloned.loginConfig) {
      cloned.loginConfig = {
        username: cloned.personalDetails?.idNumber || '2502740083',
        password: 'Aa123456',
        logoImage: cloned.visuals?.loginScreenImage || '',
        otpMobile: '*****5773',
      };
    }
    return cloned;
  });
  const [newDocTitle, setNewDocTitle] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Hidden file input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const loginLogoInputRef = useRef<HTMLInputElement>(null);
  const homeDigitalIdInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const loginInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const docInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handlePersonalChange = (field: keyof typeof formData.personalDetails, value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value,
      },
    }));
  };

  const handleLoginConfigChange = (field: keyof LoginConfig, value: string) => {
    setFormData((prev) => ({
      ...prev,
      loginConfig: {
        username: prev.loginConfig?.username || prev.personalDetails.idNumber || '2502740083',
        password: prev.loginConfig?.password || 'Aa123456',
        logoImage: prev.loginConfig?.logoImage || '',
        otpMobile: prev.loginConfig?.otpMobile || '*****5773',
        ...prev.loginConfig,
        [field]: value,
      },
    }));
  };

  const handleDocumentChange = (id: string, field: keyof DocumentItem, value: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc) =>
        doc.id === id ? { ...doc, [field]: value } : doc
      ),
    }));
  };

  const handleDeleteDocument = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }));
  };

  const handleAddDocument = () => {
    if (!newDocTitle.trim()) return;
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.trim(),
      number: 'DOC-' + Math.floor(100000 + Math.random() * 900000),
      issuing: '-',
      expiry: '-',
      type: 'custom',
    };
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, newDoc],
    }));
    setNewDocTitle('');
  };

  // Generic image upload helper
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = () => {
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div id="screen-control-panel" className="flex-1 flex flex-col overflow-y-auto bg-[#211F1F] text-white">
      {/* Top Bar matching screenshot */}
      <div className="bg-[#211F1F] border-b border-neutral-800 px-4 py-3.5 flex items-center gap-3 shadow-md shrink-0 sticky top-0 z-20">
        <button
          id="control-panel-btn-back"
          onClick={onBack}
          className="p-1 -ml-1 text-white hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-bold tracking-tight flex items-center gap-2">
          <span>Control Panel</span>
          <span className="text-[10px] bg-emerald-950 text-[#7BE4C2] border border-[#7BE4C2]/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
            <Lock className="w-2.5 h-2.5" /> Unlocked
          </span>
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs bg-emerald-950 text-[#7BE4C2] border border-emerald-600 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
          <button
            id="btn-lock-panel-now"
            onClick={onBack}
            className="px-2.5 py-1 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-600/50 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            title="Lock Control Panel & return to app"
          >
            <Lock className="w-3 h-3" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="p-4 flex flex-col gap-4 flex-1 pb-28">
        {/* Card: Header Logo (400x120px) - 1x Bigger Display */}
        <div className="w-full bg-[#1e2024] rounded-2xl p-4 border border-neutral-800/80 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-200">
              Header Logo (400×120 px)
            </span>
            <span className="text-[11px] text-[#7BE4C2] bg-emerald-950/80 border border-[#7BE4C2]/40 px-2 py-0.5 rounded-full font-mono font-medium">
              Home Top Bar
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Upload custom 400×120px logo to replace "Absher Individual" header branding anytime.
          </p>

          {/* 1x Bigger Header Logo Preview Container */}
          <div className="w-full flex flex-col gap-2.5">
            <div className="w-full max-w-sm h-24 sm:h-28 rounded-2xl bg-gradient-to-r from-[#006837] to-[#00522c] border border-white/20 flex items-center justify-center overflow-hidden px-4 shadow-inner relative">
              {formData.visuals.headerLogo ? (
                <img
                  src={formData.visuals.headerLogo}
                  alt="Header logo preview"
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${formData.visuals.headerLogoScale || 1.5})`,
                  }}
                />
              ) : (
                <div
                  className="flex items-center gap-3 transition-transform duration-200"
                  style={{
                    transform: `scale(${formData.visuals.headerLogoScale || 1.5})`,
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
              <span className="absolute bottom-1.5 right-2 text-[10px] text-white/70 font-mono bg-black/40 px-1.5 py-0.5 rounded">
                Header Live Preview ({formData.visuals.headerLogoScale ? `${formData.visuals.headerLogoScale}x` : '1.5x (1x Bigger)'})
              </span>
            </div>

            {/* Header Logo Size Selector */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-neutral-300 font-medium">Header Logo Size:</span>
              <div className="flex items-center gap-1.5 bg-[#141517] p-1 rounded-xl border border-neutral-700/60">
                {[
                  { label: 'Standard (1.0x)', val: 1.0 },
                  { label: '1x Bigger (1.5x)', val: 1.5 },
                  { label: '2x Bigger (2.0x)', val: 2.0 },
                ].map((scaleOpt) => {
                  const currentScale = formData.visuals.headerLogoScale ?? 1.5;
                  const isSelected = Math.abs(currentScale - scaleOpt.val) < 0.05;
                  return (
                    <button
                      key={scaleOpt.val}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          visuals: { ...prev.visuals, headerLogoScale: scaleOpt.val },
                        }))
                      }
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#006837] text-white shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {scaleOpt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e, (base64) =>
                  setFormData((prev) => ({
                    ...prev,
                    visuals: { ...prev.visuals, headerLogo: base64 },
                  }))
                )
              }
            />

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => logoInputRef.current?.click()}
                className="px-3.5 py-2.5 bg-[#25282c] hover:bg-[#2e3238] text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-neutral-700/60 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <Upload className="w-4 h-4 text-[#7BE4C2]" />
                <span>Upload Logo</span>
              </button>
              {formData.visuals.headerLogo && (
                <button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      visuals: { ...prev.visuals, headerLogo: '' },
                    }))
                  }
                  className="px-2.5 py-2.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 text-xs font-semibold rounded-xl border border-red-800/50 cursor-pointer transition-all"
                  title="Reset to default logo"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card: Home Page Digital ID Card (Separate from Profile Documents) */}
        <div className="w-full bg-[#1e2024] rounded-2xl p-4 border border-emerald-500/40 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-emerald-300 flex items-center gap-1.5">
              <span>Home Page Digital ID Card</span>
            </span>
            <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full font-mono">
              Home Screen Only
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Upload your dedicated Home Page Digital ID card directly here. This card is completely separate and never merges with your My Profile page digital documents.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 pt-1">
            <div className="w-full sm:w-44 h-28 rounded-xl bg-[#141517] border border-neutral-700/70 flex items-center justify-center overflow-hidden shrink-0">
              {formData.visuals.homeDigitalIdImage ? (
                <img
                  src={formData.visuals.homeDigitalIdImage}
                  alt="Home Page Digital ID Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <span className="text-[11px] text-emerald-400 font-semibold">Absher Digital ID</span>
                  <span className="text-[9px] text-neutral-500 mt-0.5">Custom layout / Default card</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={homeDigitalIdInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e, (base64) => {
                  const updated = {
                    ...formData,
                    visuals: { ...formData.visuals, homeDigitalIdImage: base64 },
                  };
                  setFormData(updated);
                  onSave(updated);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2000);
                })
              }
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-upload-home-digital-id"
                onClick={() => homeDigitalIdInputRef.current?.click()}
                className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Home Digital ID</span>
              </button>
              {formData.visuals.homeDigitalIdImage && (
                <button
                  id="btn-reset-home-digital-id"
                  onClick={() => {
                    const updated = {
                      ...formData,
                      visuals: { ...formData.visuals, homeDigitalIdImage: '' },
                    };
                    setFormData(updated);
                    onSave(updated);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                  className="px-3 py-2.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 text-xs font-semibold rounded-xl border border-red-800/50 cursor-pointer transition-all"
                  title="Remove uploaded image and show standard digital card"
                >
                  Clear Image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card: Background Image */}
        <div className="w-full bg-[#1e2024] rounded-2xl p-4 border border-neutral-800/80 flex flex-col gap-3">
          <span className="text-sm font-semibold text-neutral-200">
            Background Image
          </span>
          <div className="flex items-center gap-3.5">
            <div className="w-18 h-18 rounded-xl bg-[#141517] border border-neutral-700/60 flex items-center justify-center overflow-hidden shrink-0">
              {formData.visuals.backgroundImage ? (
                <img
                  src={formData.visuals.backgroundImage}
                  alt="Background preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-neutral-500">No img</span>
              )}
            </div>
            <input
              type="file"
              ref={bgInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e, (base64) =>
                  setFormData((prev) => ({
                    ...prev,
                    visuals: { ...prev.visuals, backgroundImage: base64 },
                  }))
                )
              }
            />
            <button
              onClick={() => bgInputRef.current?.click()}
              className="px-4 py-2.5 bg-[#25282c] hover:bg-[#2e3238] text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-neutral-700/60 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Background</span>
            </button>
          </div>
        </div>

        {/* Card: Login Screen & Access Credentials (Requested Sequence & Settings) */}
        <div className="w-full bg-[#1e2024] rounded-2xl p-4 border border-[#7BE4C2]/30 flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#7BE4C2]" />
              <span className="text-sm font-bold text-white tracking-wide">
                App Login Screen & Credentials
              </span>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  handleSaveChanges();
                  onLogout();
                }}
                className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900/70 border border-red-800/60 text-red-200 text-[11px] font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                title="Lock app and test the login sequence"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Test Login Screen</span>
              </button>
            )}
          </div>

          {/* 1. Login Logo (White Marked Area in Screenshot) */}
          <div className="flex flex-col gap-2 bg-[#141517] p-3 rounded-xl border border-neutral-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-300 font-semibold">
                Login Logo (Marked White Area):
              </span>
              <span className="text-[10px] text-neutral-400">
                Shown at top of Login Screen
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-20 h-16 rounded-xl bg-[#211F1F] border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0 p-1">
                {formData.loginConfig?.logoImage || formData.visuals.loginScreenImage ? (
                  <img
                    src={formData.loginConfig?.logoImage || formData.visuals.loginScreenImage}
                    alt="Login logo preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="scale-75 flex items-center justify-center">
                    <AbsherDualEmblem className="h-10" />
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={loginLogoInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleImageUpload(e, (base64) => {
                    handleLoginConfigChange('logoImage', base64);
                    setFormData((prev) => ({
                      ...prev,
                      visuals: { ...prev.visuals, loginScreenImage: base64 },
                      loginConfig: {
                        username: prev.loginConfig?.username || prev.personalDetails.idNumber || '2602801801',
                        password: prev.loginConfig?.password || 'Ayat007007',
                        otpMobile: prev.loginConfig?.otpMobile || '*****5773',
                        ...prev.loginConfig,
                        logoImage: base64,
                      },
                    }));
                  })
                }
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => loginLogoInputRef.current?.click()}
                  className="px-3 py-2 bg-[#25282c] hover:bg-[#2e3238] text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-neutral-700/60 cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-[#7BE4C2]" />
                  <span>Upload Logo</span>
                </button>
                {(formData.loginConfig?.logoImage || formData.visuals.loginScreenImage) && (
                  <button
                    type="button"
                    onClick={() => {
                      handleLoginConfigChange('logoImage', '');
                      setFormData((prev) => ({
                        ...prev,
                        visuals: { ...prev.visuals, loginScreenImage: '' },
                        loginConfig: {
                          username: prev.loginConfig?.username || prev.personalDetails.idNumber || '2502740083',
                          password: prev.loginConfig?.password || 'Aa123456',
                          otpMobile: prev.loginConfig?.otpMobile || '*****5773',
                          ...prev.loginConfig,
                          logoImage: '',
                        },
                      }));
                    }}
                    className="px-2.5 py-2 bg-red-950/40 hover:bg-red-900/50 text-red-300 text-xs font-semibold rounded-xl border border-red-800/50 cursor-pointer transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2. Credentials: Username / ID & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Username or ID Number */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-300 font-medium">
                Username or ID Number:
              </label>
              <input
                id="cp-input-login-username"
                type="text"
                value={formData.loginConfig?.username ?? formData.personalDetails.idNumber ?? '2502740083'}
                onChange={(e) => handleLoginConfigChange('username', e.target.value)}
                placeholder="e.g. 2502740083"
                className="w-full bg-[#141517] border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-[#7BE4C2]/60 font-mono tracking-wide"
              />
              <span className="text-[10px] text-neutral-400">
                User must type this ID Number to pass login.
              </span>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-300 font-medium">
                Login Password:
              </label>
              <input
                id="cp-input-login-password"
                type="text"
                value={formData.loginConfig?.password ?? 'Aa123456'}
                onChange={(e) => handleLoginConfigChange('password', e.target.value)}
                placeholder="e.g. Aa123456"
                className="w-full bg-[#141517] border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-[#7BE4C2]/60 font-mono tracking-wide"
              />
              <span className="text-[10px] text-neutral-400">
                User must type this password to pass login.
              </span>
            </div>
          </div>

          {/* 3. OTP Mobile Display */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-300 font-medium">
              OTP Screen SMS Mobile Number:
            </label>
            <input
              id="cp-input-login-otp-mobile"
              type="text"
              value={formData.loginConfig?.otpMobile ?? '*****5773'}
              onChange={(e) => handleLoginConfigChange('otpMobile', e.target.value)}
              placeholder="e.g. *****5773"
              className="w-full bg-[#141517] border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-[#7BE4C2]/60 font-mono tracking-wide"
            />
            <span className="text-[10px] text-neutral-400">
              Shown in "Please enter the code received on your mobile via SMS".
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
            <span className="text-[#7BE4C2] font-semibold">Login Sequence: </span>
            Credentials check → Loading screen (0.15s) → OTP screen (0.3s) → Loading screen (0.1s) → Main App.
          </div>
        </div>

        {/* Card: Profile Photo */}
        <div className="w-full bg-[#1e2024] rounded-2xl p-4 border border-neutral-800/80 flex flex-col gap-3">
          <span className="text-sm font-semibold text-neutral-200">
            Profile Photo
          </span>
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-[#2a2d33] border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0">
              {formData.visuals.profilePhoto ? (
                <img
                  src={formData.visuals.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-base font-bold text-neutral-300">
                  {formData.personalDetails.name ? formData.personalDetails.name[0] : 'M'}
                </span>
              )}
            </div>
            <input
              type="file"
              ref={profileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e, (base64) =>
                  setFormData((prev) => ({
                    ...prev,
                    visuals: { ...prev.visuals, profilePhoto: base64 },
                  }))
                )
              }
            />
            <button
              onClick={() => profileInputRef.current?.click()}
              className="px-4 py-2.5 bg-[#25282c] hover:bg-[#2e3238] text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-neutral-700/60 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>
          </div>
        </div>

        {/* Card: Personal Details Form */}
        <div className="w-full bg-[#1e2024] rounded-2xl p-4 border border-neutral-800/80 flex flex-col gap-4">
          <span className="text-sm font-semibold text-neutral-200">
            Personal Details
          </span>

          <div className="flex flex-col gap-3">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">Name</label>
              <input
                type="text"
                id="input-personal-name"
                value={formData.personalDetails.name}
                onChange={(e) => handlePersonalChange('name', e.target.value)}
                className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="Full Name"
              />
            </div>

            {/* ID Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">ID Number</label>
              <input
                type="text"
                id="input-personal-id-number"
                value={formData.personalDetails.idNumber}
                onChange={(e) => handlePersonalChange('idNumber', e.target.value)}
                className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="2602801801"
              />
            </div>

            {/* Birth City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">Birth City</label>
              <input
                type="text"
                id="input-personal-birth-city"
                value={formData.personalDetails.birthCity}
                onChange={(e) => handlePersonalChange('birthCity', e.target.value)}
                className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="-"
              />
            </div>

            {/* Birth Country/Region */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">Birth Country/Region</label>
              <input
                type="text"
                id="input-personal-birth-country"
                value={formData.personalDetails.birthCountry}
                onChange={(e) => handlePersonalChange('birthCountry', e.target.value)}
                className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="Bangladesh"
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">Date of Birth</label>
              <input
                type="text"
                id="input-personal-dob"
                value={formData.personalDetails.dateOfBirth}
                onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)}
                className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="01/01/1983"
              />
            </div>

            {/* Marital Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">Marital Status</label>
              <input
                type="text"
                id="input-personal-marital-status"
                value={formData.personalDetails.maritalStatus}
                onChange={(e) => handlePersonalChange('maritalStatus', e.target.value)}
                className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="SINGLE"
              />
            </div>

            {/* Extra details for full accuracy */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Religion</label>
                <input
                  type="text"
                  value={formData.personalDetails.religion}
                  onChange={(e) => handlePersonalChange('religion', e.target.value)}
                  className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Islam"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Transfers</label>
                <input
                  type="text"
                  value={formData.personalDetails.sponsorshipTransfers}
                  onChange={(e) => handlePersonalChange('sponsorshipTransfers', e.target.value)}
                  className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: My Profile Digital Documents (Passport, Resident ID, Visa, License, etc.) */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-200">
              My Profile Page Digital Documents
            </h2>
            <span className="text-[11px] text-neutral-400">
              Profile Page Only
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            These documents belong exclusively to your <strong>My Profile</strong> page (My Resident ID, My Passport, My Visa, My Driving License) and are kept separate from the Home Page Digital ID.
          </p>

          <div className="flex flex-col gap-3.5">
            {formData.documents.map((doc) => (
              <div
                key={doc.id}
                className="w-full bg-[#1e2024] rounded-2xl p-4 border border-neutral-800/80 flex flex-col gap-3"
              >
                {/* Document Title & Red Delete Button */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    {doc.title}
                  </span>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="flex items-center gap-1 text-[#ea5b5b] hover:text-red-400 text-xs font-semibold cursor-pointer py-1 px-2 rounded-lg hover:bg-red-950/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                {/* Inputs for document */}
                {doc.type === 'resident_id' ? (
                  <div className="flex flex-col gap-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">Resident ID Number</label>
                        <input
                          type="text"
                          value={doc.number}
                          onChange={(e) => handleDocumentChange(doc.id, 'number', e.target.value)}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                          placeholder="2602801801"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">ID Version</label>
                        <input
                          type="text"
                          value={doc.extra?.version || '1'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              documents: prev.documents.map((d) =>
                                d.id === doc.id
                                  ? { ...d, extra: { ...d.extra, version: val } }
                                  : d
                              ),
                            }));
                          }}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                          placeholder="1"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">Issuing Date</label>
                        <input
                          type="text"
                          value={doc.issuing}
                          onChange={(e) => handleDocumentChange(doc.id, 'issuing', e.target.value)}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                          placeholder="24/04/2025"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">Expiry Date</label>
                        <input
                          type="text"
                          value={doc.expiry}
                          onChange={(e) => handleDocumentChange(doc.id, 'expiry', e.target.value)}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                          placeholder="05/10/2026"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-neutral-400 bg-[#141517] p-2.5 rounded-xl border border-neutral-800">
                      ℹ️ On your <strong>My Profile</strong> page, My Resident ID shows strictly these 4 details (Resident ID Number, ID Version, Issuing Date, Expiry Date).
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">Number</label>
                        <input
                          type="text"
                          value={doc.number}
                          onChange={(e) => handleDocumentChange(doc.id, 'number', e.target.value)}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">Issuing</label>
                        <input
                          type="text"
                          value={doc.issuing}
                          onChange={(e) => handleDocumentChange(doc.id, 'issuing', e.target.value)}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">Expiry</label>
                        <input
                          type="text"
                          value={doc.expiry}
                          onChange={(e) => handleDocumentChange(doc.id, 'expiry', e.target.value)}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Image upload row: "No img" + "Upload" */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-16 h-12 rounded-lg bg-[#151618] border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0">
                        {doc.image ? (
                          <img src={doc.image} alt={doc.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-neutral-500">No img</span>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={(el) => {
                          docInputRefs.current[doc.id] = el;
                        }}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e, (base64) =>
                            setFormData((prev) => ({
                              ...prev,
                              documents: prev.documents.map((d) =>
                                d.id === doc.id ? { ...d, image: base64 } : d
                              ),
                            }))
                          )
                        }
                      />
                      <button
                        onClick={() => docInputRefs.current[doc.id]?.click()}
                        className="px-3.5 py-2 bg-[#25282c] hover:bg-[#2e3238] text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-neutral-700/60 cursor-pointer active:scale-95 transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add New Document Row */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              id="input-new-document-title"
              placeholder="New document title"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddDocument()}
              className="flex-1 bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none"
            />
            <button
              id="btn-add-document"
              onClick={handleAddDocument}
              className="px-4 py-2.5 bg-[#008744] hover:bg-[#007038] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Offline Device Storage Management Box */}
        <div className="mt-4 p-4 rounded-2xl bg-[#1a1c1f] border border-emerald-900/50 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <FolderOpen className="w-4 h-4" />
            <span className="text-xs font-bold">Device File Manager Sync</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Export all current documents and profile data directly into your Android device storage as a JSON file, or restore anytime.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onExportBackup}
              className="py-2 px-2.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup to Device</span>
            </button>
            <button
              onClick={onImportBackup}
              className="py-2 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Load from Storage</span>
            </button>
          </div>
          <button
            onClick={onResetDefaults}
            className="text-[11px] text-neutral-400 hover:text-neutral-200 flex items-center justify-center gap-1 mt-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Initial Screenshot Data</span>
          </button>
        </div>
      </div>

      {/* Sticky Bottom Actions Bar (matches Screenshot 6 exactly) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#211F1F]/95 backdrop-blur-md border-t border-neutral-800 p-4 flex items-center gap-3 z-30">
        {/* Save Changes button */}
        <button
          id="btn-save-changes"
          onClick={handleSaveChanges}
          className="flex-1 py-3 px-4 bg-[#006837] hover:bg-[#00522c] active:bg-[#008744] text-white font-semibold text-sm rounded-xl shadow-lg cursor-pointer transition-colors flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-white" /> : null}
          <span>Save Changes</span>
        </button>

        {/* Reset Password button */}
        <button
          id="btn-reset-password"
          onClick={() => setShowPasswordModal(true)}
          className="py-3 px-4 bg-[#28292d] hover:bg-[#323439] active:bg-[#3b3d44] text-neutral-200 font-semibold text-sm rounded-xl border border-neutral-700 cursor-pointer transition-colors shrink-0"
        >
          Reset Password
        </button>
      </div>

      {/* Reset Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-[#211F1F]/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-[#211F1F] border border-neutral-700 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-neutral-700/60 pb-3">
              <KeyRound className="w-5 h-5 text-[#7BE4C2]" />
              <h3 className="text-white font-bold text-base">Set Control Panel Password</h3>
            </div>
            <p className="text-xs text-neutral-300">
              Enter your new password to secure the Control Panel.
            </p>
            <input
              type="text"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#2C3033] border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#7BE4C2] focus:outline-none font-mono"
            />
            {passwordSuccess && (
              <span className="text-xs text-[#7BE4C2] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Password updated and saved!
              </span>
            )}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordSuccess(false);
                  setNewPassword('');
                }}
                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newPassword.trim()) {
                    setStoredPassword(newPassword.trim());
                    setPasswordSuccess(true);
                    setTimeout(() => {
                      setShowPasswordModal(false);
                      setPasswordSuccess(false);
                      setNewPassword('');
                    }, 1200);
                  }
                }}
                className="flex-1 py-2.5 bg-[#006837] hover:bg-[#00522c] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Save Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
