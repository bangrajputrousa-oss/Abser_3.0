import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AbsherDualEmblem } from './AbsherBrandIcons';

interface OtpVerificationScreenProps {
  otpMobile?: string;
  onComplete: () => void;
  onBack: () => void;
}

export const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  otpMobile = '*****5773',
  onComplete,
  onBack,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);

  // As requested: "3. Otp section it's show 0.3 sec then go next screen."
  useEffect(() => {
    // Fill digits quickly to simulate SMS code arriving and auto-populating
    const t1 = setTimeout(() => setDigits(['5', '', '', '']), 60);
    const t2 = setTimeout(() => setDigits(['5', '7', '', '']), 130);
    const t3 = setTimeout(() => setDigits(['5', '7', '7', '']), 200);
    const t4 = setTimeout(() => setDigits(['5', '7', '7', '3']), 260);

    // After 0.3 sec (300ms), automatic advance to next screen!
    const timer = setTimeout(() => {
      onComplete();
    }, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="w-full h-full min-h-0 flex-1 bg-[#181A1C] text-white flex flex-col justify-between p-4 sm:p-5 select-none animate-in fade-in duration-75 relative overflow-y-auto">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between pt-1 pb-2 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="text-[#7BE4C2] hover:text-[#9df3d7] transition-colors p-1 -ml-1 cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
      </div>

      {/* Center Stage */}
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col items-center justify-center my-auto py-4">
        {/* Dual Emblems (Absher + Saudi MOI crest) */}
        <div className="mb-4 sm:mb-6">
          <AbsherDualEmblem className="h-13 sm:h-16" />
        </div>

        {/* Title */}
        <h1 className="text-white text-lg sm:text-xl font-bold text-center tracking-normal">
          Your Verification
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-300 text-xs sm:text-sm text-center mt-2 sm:mt-2.5 px-3 leading-relaxed font-normal">
          Please enter the code received on your mobile <span className="font-semibold text-white tracking-wide">{otpMobile}</span> via SMS
        </p>

        {/* 4 OTP Input Boxes */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-[280px] mt-6 sm:mt-8">
          {[0, 1, 2, 3].map((idx) => {
            const digit = digits[idx];
            return (
              <div
                key={idx}
                className={`h-12 sm:h-15 rounded-xl sm:rounded-2xl bg-[#2A2D30] border flex items-center justify-center text-white text-xl sm:text-2xl font-bold font-mono transition-all duration-75 ${
                  digit
                    ? 'border-[#7BE4C2]/80 bg-[#2D3336] shadow-sm'
                    : 'border-neutral-700/80'
                }`}
              >
                {digit ? (
                  <span className="animate-in zoom-in-50 duration-75">{digit}</span>
                ) : (
                  <span className="w-2.5 h-0.5 bg-neutral-600 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="w-full max-w-sm mx-auto pb-3 sm:pb-4 shrink-0">
        <button
          type="button"
          onClick={onComplete}
          className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#98E2C6] hover:bg-[#83dfbf] text-[#042d17] font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer text-center"
        >
          Use Absher Authenticator
        </button>
      </div>
    </div>
  );
};
