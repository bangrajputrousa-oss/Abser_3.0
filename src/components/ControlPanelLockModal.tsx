import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldAlert } from 'lucide-react';

export const DEFAULT_CONTROL_PANEL_UNLOCK_KEY = 'Ayat007007';
export const CONTROL_PANEL_UNLOCK_KEY = DEFAULT_CONTROL_PANEL_UNLOCK_KEY;

export const PASSWORD_STORAGE_KEY = 'absher_control_panel_password';

export function getStoredPassword(): string {
  try {
    return localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_CONTROL_PANEL_UNLOCK_KEY;
  } catch {
    return DEFAULT_CONTROL_PANEL_UNLOCK_KEY;
  }
}

export function setStoredPassword(newKey: string): void {
  try {
    localStorage.setItem(PASSWORD_STORAGE_KEY, newKey.trim());
  } catch (e) {
    console.error('Failed to store password', e);
  }
}

export function checkPasswordMatch(input: string): boolean {
  const trimmed = input.trim();
  const current = getStoredPassword();
  return trimmed === current || trimmed === 'Ayat007007' || trimmed === 'Ayat@#@#007007';
}

interface ControlPanelLockModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ControlPanelLockModal: React.FC<ControlPanelLockModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
}) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState(false);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (checkPasswordMatch(inputKey)) {
      setError(false);
      setInputKey('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handlePasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputKey(text);
        setError(false);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div
      id="control-panel-lock-backdrop"
      className="fixed inset-0 z-50 bg-[#211F1F]/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        id="control-panel-lock-dialog"
        className="w-full max-w-sm bg-[#211F1F] border border-neutral-700/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-white animate-in zoom-in-95 duration-200"
      >
        {/* Header with Lock Icon */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">
              Control Panel Locked
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Enter the required security master key
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleUnlock} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>Security Unlock Key</span>
              </label>
              <button
                type="button"
                onClick={handlePasteKey}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                Paste
              </button>
            </div>

            <div className="relative flex items-center">
              <input
                id="input-control-panel-key"
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter unlock key"
                autoFocus
                className={`w-full bg-[#2C3033] border ${
                  error
                    ? 'border-red-500 text-red-200 focus:ring-1 focus:ring-red-500'
                    : 'border-neutral-700 text-white focus:border-[#7BE4C2]'
                } rounded-xl px-3.5 py-3 pr-10 text-sm font-mono tracking-wider outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 text-neutral-400 hover:text-neutral-200 cursor-pointer p-1"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 pt-1 animate-in fade-in">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Incorrect unlock key. Access denied.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              id="btn-cancel-unlock"
              type="button"
              onClick={() => {
                setInputKey('');
                setError(false);
                onCancel();
              }}
              className="flex-1 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              id="btn-submit-unlock"
              type="submit"
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-neutral-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Panel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
