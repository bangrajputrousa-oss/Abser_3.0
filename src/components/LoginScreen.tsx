import React, { useState } from 'react';
import { ArrowLeft, Info, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { AppState } from '../types';
import { AbsherDualEmblem, AbsherIcon } from './AbsherBrandIcons';

interface LoginScreenProps {
  appState: AppState;
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ appState, onSuccess }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginConfig = appState.loginConfig || {
    username: '2502740083',
    password: 'Aa123456',
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const enteredUsername = usernameInput.trim();
    const enteredPassword = passwordInput.trim();

    if (!enteredUsername || !enteredPassword) {
      setErrorMessage('Please enter both your Username/ID Number and Password.');
      return;
    }

    const expectedUsername = (loginConfig.username || appState.personalDetails.idNumber || '').trim();
    const expectedPassword = (loginConfig.password || '').trim();

    // Check if both username/ID and password match what's set in Control Panel
    const isUsernameMatch =
      enteredUsername.toLowerCase() === expectedUsername.toLowerCase() ||
      enteredUsername === appState.personalDetails.idNumber;
    const isPasswordMatch = enteredPassword === expectedPassword;

    if (isUsernameMatch && isPasswordMatch) {
      setIsSubmitting(true);
      onSuccess();
    } else {
      setErrorMessage('Incorrect Username or ID Number or Password. Please check your credentials.');
    }
  };

  // Check if logo is uploaded from control panel (the marked white area)
  const customLogo = loginConfig.logoImage || appState.visuals.loginScreenImage;

  return (
    <div className="w-full h-full min-h-0 flex-1 bg-[#181A1C] text-white flex flex-col justify-between p-4 sm:p-5 select-none relative overflow-y-auto overscroll-contain">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between pt-1 pb-2 sm:pb-3 shrink-0">
        <button
          type="button"
          className="text-[#7BE4C2] hover:text-[#9df3d7] transition-colors p-1 -ml-1 cursor-pointer"
          title="Back"
          onClick={() => {
            // optional feedback
          }}
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
        </button>
      </div>

      {/* Main Form Section - Flexes dynamically according to display resolution */}
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center my-auto py-2 sm:py-4">
        {/* Custom Logo Area (Where user marked white area "logo upload") */}
        <div className="w-full flex flex-col items-center justify-center mb-4 sm:mb-7">
          {customLogo ? (
            <div className="max-w-[200px] sm:max-w-[240px] max-h-[85px] sm:max-h-[110px] flex items-center justify-center transition-all">
              <img
                src={customLogo}
                alt="Login Logo"
                className="max-h-[75px] sm:max-h-[100px] w-auto max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <AbsherDualEmblem className="h-13 sm:h-16" />
            </div>
          )}
        </div>

        {/* Input Fields Form */}
        <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-2.5 sm:gap-3">
          {/* Input 1: Username or ID Number */}
          <div className="w-full bg-[#2A2D30] rounded-xl sm:rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 border border-white/5 focus-within:border-[#7BE4C2]/60 focus-within:ring-1 focus-within:ring-[#7BE4C2]/30 transition-all">
            <label className="block text-[10px] sm:text-[11px] font-medium text-neutral-400 mb-0.5">
              Username or ID Number
            </label>
            <input
              id="input-login-username"
              type="text"
              value={usernameInput}
              onChange={(e) => {
                setUsernameInput(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Enter Username or ID Number"
              className="w-full bg-transparent text-white text-xs sm:text-sm outline-none placeholder:text-neutral-500 font-normal tracking-wide"
              autoComplete="username"
            />
          </div>

          {/* Input 2: Password */}
          <div className="w-full bg-[#2A2D30] rounded-xl sm:rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 border border-white/5 focus-within:border-[#7BE4C2]/60 focus-within:ring-1 focus-within:ring-[#7BE4C2]/30 transition-all relative">
            <label className="block text-[10px] sm:text-[11px] font-medium text-neutral-400 mb-0.5">
              Password
            </label>
            <div className="flex items-center justify-between">
              <input
                id="input-login-password"
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter Password"
                className="w-full bg-transparent text-white text-xs sm:text-sm outline-none placeholder:text-neutral-500 font-normal tracking-wide pr-8"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-neutral-400" />
                ) : (
                  <Eye className="w-4 h-4 text-neutral-400" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="w-full bg-red-950/50 border border-red-500/60 rounded-xl px-3 py-2 text-xs text-red-200 flex items-center gap-2 mt-1 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Keep me logged in Checkbox */}
          <div
            onClick={() => setKeepLoggedIn(!keepLoggedIn)}
            className="flex items-center gap-2.5 mt-1 sm:mt-1.5 cursor-pointer select-none group"
          >
            <div
              className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded border flex items-center justify-center transition-all ${
                keepLoggedIn
                  ? 'bg-[#7BE4C2] border-[#7BE4C2] text-neutral-900'
                  : 'border-neutral-600 bg-transparent group-hover:border-neutral-400'
              }`}
            >
              {keepLoggedIn && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />}
            </div>
            <span className="text-xs text-neutral-300">Keep me logged in</span>
          </div>

          {/* Biometrics info banner */}
          <div className="flex items-start gap-2 mt-1 sm:mt-1.5 text-neutral-400 text-[10px] sm:text-[11px] leading-relaxed">
            <Info className="w-3.5 h-3.5 text-[#7BE4C2] shrink-0 mt-0.5" />
            <span>
              Enable biometrics use on your Settings to be able to check the option to stay logged in
            </span>
          </div>
        </form>
      </div>

      {/* Bottom Action Section */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-2 sm:gap-3 pt-2 sm:pt-3 pb-2 shrink-0">
        <button
          id="btn-login-submit"
          type="button"
          onClick={() => handleLoginSubmit()}
          disabled={isSubmitting}
          className={`w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm transition-all shadow-lg active:scale-[0.99] cursor-pointer text-center ${
            usernameInput.trim() && passwordInput.trim()
              ? 'bg-[#486b5c] hover:bg-[#3d5c4e] text-white shadow-emerald-950/40'
              : 'bg-[#37453f] hover:bg-[#3e4f48] text-neutral-300'
          }`}
        >
          {isSubmitting ? 'Checking...' : 'Log In'}
        </button>

        <button
          type="button"
          onClick={() => {
            // Help user notice their credentials in control panel
            setErrorMessage(`Tip: Credentials configured in Control Panel (Default ID: ${loginConfig.username || '2502740083'}, Password: ${loginConfig.password || 'Aa123456'})`);
          }}
          className="text-center text-[11px] sm:text-xs text-[#7BE4C2] font-medium py-1 sm:py-1.5 cursor-pointer hover:underline"
        >
          Forgot Password
        </button>
      </div>
    </div>
  );
};
