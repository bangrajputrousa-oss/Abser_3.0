import React from 'react';
import { Settings, Shield, Globe, Info, Bell, ChevronRight, Lock, LogOut } from 'lucide-react';
import { ScreenType } from '../types';

interface OtherScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onExportBackup?: () => void;
  onImportBackup?: () => void;
  onResetDefaults?: () => void;
  onLogout?: () => void;
}

export const OtherScreen: React.FC<OtherScreenProps> = ({
  onNavigate,
  onLogout,
}) => {
  return (
    <div id="screen-other" className="flex-1 flex flex-col overflow-y-auto bg-[#211F1F] text-white">
      {/* Top Header */}
      <div className="bg-[#006837] px-4 py-4 shadow-md shrink-0">
        <h1 className="text-white text-lg font-bold tracking-tight">
          Other
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-5 flex-1 pb-8">
        {/* General Preferences */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-neutral-300 px-1">
            General Preferences
          </span>
          <div className="bg-[#2B2E31] border border-neutral-700/60 rounded-2xl overflow-hidden divide-y divide-neutral-700/40">
            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-700/30 transition-colors">
              <div className="flex items-center gap-3.5">
                <Globe className="w-5 h-5 text-[#7BE4C2]" />
                <span className="text-sm font-medium text-white">Language / اللغة</span>
              </div>
              <span className="text-xs text-neutral-400">English / العربية</span>
            </div>

            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-700/30 transition-colors">
              <div className="flex items-center gap-3.5">
                <Shield className="w-5 h-5 text-[#7BE4C2]" />
                <span className="text-sm font-medium text-white">Security & Biometrics</span>
              </div>
              <span className="text-xs text-[#7BE4C2] font-semibold">Enabled</span>
            </div>

            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-700/30 transition-colors">
              <div className="flex items-center gap-3.5">
                <Bell className="w-5 h-5 text-[#7BE4C2]" />
                <span className="text-sm font-medium text-white">Notifications</span>
              </div>
              <span className="text-xs text-neutral-400">Allowed</span>
            </div>

            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-700/30 transition-colors">
              <div className="flex items-center gap-3.5">
                <Info className="w-5 h-5 text-[#7BE4C2]" />
                <span className="text-sm font-medium text-white">App Version</span>
              </div>
              <span className="text-xs text-neutral-400 font-mono">v4.39.0 (Offline)</span>
            </div>

            {onLogout && (
              <div
                id="btn-app-logout"
                onClick={onLogout}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-red-950/40 transition-colors text-red-300"
              >
                <div className="flex items-center gap-3.5">
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-medium">Log Out / تسجيل الخروج</span>
                </div>
                <span className="text-xs text-red-400 font-semibold">Exit</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
