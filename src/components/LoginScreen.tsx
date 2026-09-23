import React, { useState } from 'react';
import { ArrowLeft, Info, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { AppState } from '../types';
import { AbsherDualEmblem, AbsherIcon } from './AbsherBrandIcons';

interface LoginScreenProps {
  appState: AppState;
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ appState, onSuccess }) => {
  const loginConfig = appState.loginConfig || {
    username: '2502740083',
    password: 'Aa123456',
  };

  const [usernameInput, setUsernameInput] = useState(
    loginConfig.username || appState.personalDetails.idNumber || '2502740083'
  );
  const [passwordInput, setPasswordInput] = useState(
    loginConfig.password || 'Aa123456'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const enteredUsername = usernameInput.trim();
    const enteredPassword = passwordInput.trim();

    if (!enteredUsername || !enteredPassword) {
      setErrorMessage('Please enter both your Username/ID Number and Password.');
      return;
    }

    const expectedUsername = (loginConfig.username || appState.personalDetails.idNumber || '2502740083').trim();
    const expectedPassword = (loginConfig.password || 'Aa123456').trim();

    // Accept configured credentials, personal details ID, default username/password, or master key
    const isUsernameMatch =
      enteredUsername.toLowerCase() === expectedUsername.toLowerCase() ||
      enteredUsername === appState.personalDetails.idNumber ||
      enteredUsername === '2502740083' ||
      enteredUsername === '2602801801' ||
      enteredUsername.toLowerCase() === 'admin' ||
      enteredUsername.toLowerCase() === 'ayat';

    const isPasswordMatch =
      enteredPassword === expectedPassword ||
      enteredPassword === 'Aa123456' ||
      enteredPassword === '123456' ||
      enteredPassword === 'Ayat007007' ||
      enteredPassword === 'Ayat@#@#007007';

    if (isUsernameMatch && isPasswordMatch) {
      setIsSubmitting(true);
      onSuccess();
    } else {
      setErrorMessage('Incorrect Username or ID Number or Password. Use 2502740083 or 2602801801 and password Aa123456');
    }
  };

  // Check if logo is uploaded from control panel (the marked white area)
  const customLogo = loginConfig.logoImage || appState.visuals.loginScreenImage;

  return (
    <div className="w-full h-full min-h-0 flex-1 bg-[#181A1C] text-white flex flex-col justify-between p-4 sm:p-5 select-none relative overflow-y-auto overscroll-contain">
      {/* Top Header Bar with Back Arrow */}
      <div className="w-full flex items-center justify-between pt-1 sm:pt-2 px-1 pb-1 shrink-0">
        <button
          type="button"
          className="text-[#56C896] hover:text-[#6fe5b1] transition-colors p-1 -ml-1 cursor-pointer"
          title="Back"
          onClick={() => {
            // optional feedback
          }}
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.4]" />
        </button>
      </div>

      {/* Main Form Section matching uploaded screenshot */}
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col pt-1 sm:pt-2">
        {/* Dual Emblems (Absher + Saudi MOI crest) at top */}
        <div className="w-full flex flex-col items-center justify-center mb-3 sm:mb-4">
          {customLogo ? (
            <div className="max-w-[220px] max-h-[90px] flex items-center justify-center">
              <img
                src={customLogo}
                alt="Login Logo"
                className="max-h-[80px] w-auto max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <AbsherDualEmblem className="h-16" />
            </div>
          )}
        </div>

        {/* Title: Log In to Absher */}
        <h1 className="text-white text-2xl font-bold text-center tracking-tight mb-7 sm:mb-8 font-sans">
          Log In to Absher
        </h1>

        {/* Input Fields Form */}
        <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-3.5 sm:gap-4">
          {/* Input 1: Username or ID Number */}
          <div className="w-full bg-[#24272A] rounded-2xl px-4 py-3.5 border border-[#363A3E] focus-within:border-[#56C896]/70 focus-within:ring-1 focus-within:ring-[#56C896]/30 transition-all">
            <label className="block text-xs font-normal text-[#9AA0A6] mb-1">
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
              className="w-full bg-transparent text-white text-sm outline-none placeholder:text-[#6C7178] font-normal tracking-wide"
              autoComplete="username"
            />
          </div>

          {/* Input 2: Password */}
          <div className="w-full bg-[#24272A] rounded-2xl px-4 py-3.5 border border-[#363A3E] focus-within:border-[#56C896]/70 focus-within:ring-1 focus-within:ring-[#56C896]/30 transition-all relative">
            <label className="block text-xs font-normal text-[#9AA0A6] mb-1">
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
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-[#6C7178] font-normal tracking-wide pr-8"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#6C7178] hover:text-white transition-colors cursor-pointer p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="w-full bg-red-950/60 border border-red-500/70 rounded-xl px-3.5 py-2.5 text-xs text-red-200 flex items-center gap-2 mt-1 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Keep me logged in Checkbox */}
          <div
            onClick={() => setKeepLoggedIn(!keepLoggedIn)}
            className="flex items-center gap-2.5 mt-1 cursor-pointer select-none group"
          >
            <div
              className={`w-4.5 h-4.5 rounded-[5px] border flex items-center justify-center transition-all ${
                keepLoggedIn
                  ? 'bg-[#56C896] border-[#56C896] text-neutral-950'
                  : 'border-[#4E535A] bg-transparent group-hover:border-[#6A7079]'
              }`}
            >
              {keepLoggedIn && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="text-xs text-[#9AA0A6]">Keep me logged in</span>
          </div>

          {/* Biometrics info banner */}
          <div className="flex items-start gap-2 mt-1 text-[#8E939B] text-[11px] leading-relaxed">
            <Info className="w-3.5 h-3.5 text-[#5CB8E6] shrink-0 mt-0.5" />
            <span>
              Enable biometrics use on your Settings to be able to check the option to stay logged in
            </span>
          </div>
        </form>

        {/* Generous empty space in center matching uploaded screenshot */}
        <div className="flex-1 min-h-[30px]" />
      </div>

      {/* Bottom Action Section matching uploaded screenshot */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-4 pb-6 sm:pb-8 shrink-0 px-1">
        <button
          id="btn-login-submit"
          type="button"
          onClick={() => handleLoginSubmit()}
          disabled={isSubmitting}
          className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer text-center duration-150 ${
            usernameInput.trim() && passwordInput.trim()
              ? 'bg-[#4D6A5C] hover:bg-[#435e51] text-white'
              : 'bg-[#43594F] hover:bg-[#4a6358] text-[#9FB3A8]'
          }`}
        >
          {isSubmitting ? 'Checking...' : 'Log In'}
        </button>

        <button
          type="button"
          onClick={() => {
            // In native app, clicking does nothing / shows nothing
          }}
          className="text-center text-xs sm:text-sm text-[#56C896] font-medium py-1 cursor-pointer hover:underline active:opacity-75 transition-opacity"
        >
          Forgot Password
        </button>
      </div>
    </div>
  );
};
