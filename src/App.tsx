import React, { useState, useEffect, useRef } from 'react';
import { AppState, ScreenType, TabType } from './types';
import {
  loadAppState,
  saveAppState,
  exportToDeviceStorage,
  importFromDeviceStorage,
  INITIAL_STATE,
} from './utils/storage';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeScreen } from './components/HomeScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { PersonalDetailsScreen } from './components/PersonalDetailsScreen';
import { PassportScreen } from './components/PassportScreen';
import { ResidentIdScreen } from './components/ResidentIdScreen';
import { LicenseScreen } from './components/LicenseScreen';
import { VisaScreen } from './components/VisaScreen';
import { ServicesScreen } from './components/ServicesScreen';
import { FamilyScreen } from './components/FamilyScreen';
import { WorkersScreen } from './components/WorkersScreen';
import { OtherScreen } from './components/OtherScreen';
import { ControlPanelScreen } from './components/ControlPanelScreen';
import { ControlPanelLockModal } from './components/ControlPanelLockModal';
import { AuthFlowManager } from './components/AuthFlowManager';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(loadAppState);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showLockModal, setShowLockModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Sync tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentScreen('home');
    } else if (tab === 'services') {
      setCurrentScreen('services');
    } else if (tab === 'family') {
      setCurrentScreen('family');
    } else if (tab === 'workers') {
      setCurrentScreen('workers');
    } else if (tab === 'other') {
      setCurrentScreen('other');
    }
  };

  // Navigation handler with strict lock enforcement for Control Panel
  const handleNavigate = (screen: ScreenType) => {
    if (screen === 'control_panel') {
      setShowLockModal(true);
      return;
    }
    setCurrentScreen(screen);
  };

  // Unlocked callback
  const handleControlPanelUnlocked = () => {
    setShowLockModal(false);
    setCurrentScreen('control_panel');
    showToast('Control panel unlocked successfully');
  };

  // Back handler
  const handleBack = () => {
    if (currentScreen === 'control_panel') {
      setCurrentScreen(activeTab === 'home' ? 'home' : activeTab);
    } else if (
      currentScreen === 'personal_details' ||
      currentScreen === 'passport' ||
      currentScreen === 'resident_id' ||
      currentScreen === 'license' ||
      currentScreen === 'visa'
    ) {
      setCurrentScreen('profile');
    } else if (currentScreen === 'profile') {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('home');
      setActiveTab('home');
    }
  };

  // Save changes from Control Panel
  const handleSaveState = (newState: AppState) => {
    setAppState(newState);
    saveAppState(newState);
    showToast('Changes saved to device storage!');
  };

  // Export to Android Device File Manager
  const handleExportBackup = () => {
    exportToDeviceStorage(appState);
    showToast('Database exported to Device Storage (.json)');
  };

  // Import from Device File Manager
  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const importedData = await importFromDeviceStorage(file);
      setAppState(importedData);
      saveAppState(importedData);
      showToast('Data restored from file successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error: Failed to import JSON file');
    }
    // reset input
    e.target.value = '';
  };

  // Reset to initial screenshot data
  const handleResetDefaults = () => {
    if (window.confirm('Reset all data to initial screenshot details?')) {
      setAppState(INITIAL_STATE);
      saveAppState(INITIAL_STATE);
      showToast('Reset to default screenshot data');
    }
  };

  // Determine if bottom navigation bar should be visible
  const showBottomNav =
    isAuthenticated &&
    (currentScreen === 'home' ||
      currentScreen === 'services' ||
      currentScreen === 'family' ||
      currentScreen === 'workers' ||
      currentScreen === 'other' ||
      currentScreen === 'profile' ||
      currentScreen === 'personal_details' ||
      currentScreen === 'passport' ||
      currentScreen === 'resident_id');

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full bg-[#211F1F] flex items-center justify-center sm:p-2 md:p-4 text-white font-sans antialiased selection:bg-[#7BE4C2] selection:text-black overflow-hidden">
      {/* Hidden file input for importing device backup */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main Android App Container - Fluidly adjustable with display resolution */}
      <div
        id="android-device-frame"
        className="relative w-full max-w-md h-[100dvh] sm:h-[min(880px,calc(100dvh-1.5rem))] bg-[#211F1F] sm:rounded-[36px] overflow-hidden flex flex-col shadow-2xl border-0 sm:border sm:border-neutral-800"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Dynamic Screen Routing */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {!isAuthenticated ? (
            <AuthFlowManager
              appState={appState}
              onAuthenticated={() => {
                setIsAuthenticated(true);
                showToast('Welcome to Absher');
              }}
            />
          ) : (
            <>
              {currentScreen === 'home' && (
                <HomeScreen appState={appState} onNavigate={handleNavigate} />
              )}

              {currentScreen === 'profile' && (
                <ProfileScreen
                  appState={appState}
                  onNavigate={handleNavigate}
                  onBack={handleBack}
                />
              )}

              {currentScreen === 'personal_details' && (
                <PersonalDetailsScreen
                  appState={appState}
                  onBack={handleBack}
                />
              )}

              {currentScreen === 'passport' && (
                <PassportScreen
                  appState={appState}
                  onBack={handleBack}
                />
              )}

              {currentScreen === 'resident_id' && (
                <ResidentIdScreen
                  appState={appState}
                  onBack={handleBack}
                />
              )}

              {currentScreen === 'license' && (
                <LicenseScreen
                  appState={appState}
                  onBack={handleBack}
                />
              )}

              {currentScreen === 'visa' && (
                <VisaScreen
                  appState={appState}
                  onBack={handleBack}
                />
              )}

              {currentScreen === 'services' && (
                <ServicesScreen onNavigate={handleNavigate} />
              )}

              {currentScreen === 'family' && <FamilyScreen />}

              {currentScreen === 'workers' && <WorkersScreen />}

              {currentScreen === 'other' && (
                <OtherScreen
                  onNavigate={handleNavigate}
                  onExportBackup={handleExportBackup}
                  onImportBackup={handleTriggerImport}
                  onResetDefaults={handleResetDefaults}
                  onLogout={() => {
                    setIsAuthenticated(false);
                    showToast('Logged out');
                  }}
                />
              )}

              {currentScreen === 'control_panel' && (
                <ControlPanelScreen
                  appState={appState}
                  onSave={handleSaveState}
                  onBack={handleBack}
                  onExportBackup={handleExportBackup}
                  onImportBackup={handleTriggerImport}
                  onResetDefaults={handleResetDefaults}
                  onLogout={() => {
                    setIsAuthenticated(false);
                    showToast('Locked to Login Screen');
                  }}
                />
              )}
            </>
          )}
        </main>

        {/* Bottom Navigation Bar */}
        {showBottomNav && (
          <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
        )}

        {/* Android Navigation Pill Indicator at bottom of screen */}
        <div className="w-full bg-[#1F2224] py-1 flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-neutral-600 rounded-full" />
        </div>
      </div>

      {/* Control Panel Security Lock Modal */}
      <ControlPanelLockModal
        isOpen={showLockModal}
        onSuccess={handleControlPanelUnlocked}
        onCancel={() => setShowLockModal(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 left-1/2 -translate-x-1/2 bg-[#211F1F]/95 text-white border border-[#7BE4C2]/50 shadow-2xl rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-[#7BE4C2] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
