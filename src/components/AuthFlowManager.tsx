import React, { useState } from 'react';
import { AppState } from '../types';
import { LoginScreen } from './LoginScreen';
import { LoadingInformationScreen } from './LoadingInformationScreen';
import { OtpVerificationScreen } from './OtpVerificationScreen';

export type AuthStage = 'login' | 'loading_1' | 'otp' | 'loading_2';

interface AuthFlowManagerProps {
  appState: AppState;
  onAuthenticated: () => void;
}

export const AuthFlowManager: React.FC<AuthFlowManagerProps> = ({
  appState,
  onAuthenticated,
}) => {
  const [stage, setStage] = useState<AuthStage>('login');

  const otpMobile = appState.loginConfig?.otpMobile || '*****5773';

  // Step 1: Login credentials verified -> trigger Sequence Step 2
  const handleLoginSuccess = () => {
    setStage('loading_1');
  };

  // Step 2: Loading screen 1 (0.15s) -> transitions to Step 3 (OTP)
  const handleLoading1Complete = () => {
    setStage('otp');
  };

  // Step 3: OTP screen (0.3s) -> transitions to Step 4 (Loading 2)
  const handleOtpComplete = () => {
    setStage('loading_2');
  };

  // Step 4: Loading screen 2 (0.10s) -> enters main app!
  const handleLoading2Complete = () => {
    onAuthenticated();
  };

  const handleOtpBack = () => {
    setStage('login');
  };

  return (
    <div className="w-full h-full min-h-0 flex-1 bg-[#181A1C] text-white flex flex-col overflow-hidden">
      {stage === 'login' && (
        <LoginScreen appState={appState} onSuccess={handleLoginSuccess} />
      )}

      {stage === 'loading_1' && (
        <LoadingInformationScreen
          durationMs={150} // 0.1s - 0.2s as requested
          onComplete={handleLoading1Complete}
        />
      )}

      {stage === 'otp' && (
        <OtpVerificationScreen
          otpMobile={otpMobile}
          onComplete={handleOtpComplete} // 0.3s as requested
          onBack={handleOtpBack}
        />
      )}

      {stage === 'loading_2' && (
        <LoadingInformationScreen
          durationMs={100} // 0.1s as requested
          onComplete={handleLoading2Complete}
        />
      )}
    </div>
  );
};
