import React, { useEffect } from 'react';
import { AbsherIcon } from './AbsherBrandIcons';

interface LoadingInformationScreenProps {
  durationMs?: number;
  onComplete: () => void;
}

export const LoadingInformationScreen: React.FC<LoadingInformationScreenProps> = ({
  durationMs = 150,
  onComplete,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onComplete]);

  return (
    <div className="w-full h-full min-h-0 flex-1 bg-[#181A1C] text-white flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-75">
      {/* Centered Absher Emblem */}
      <div className="flex flex-col items-center justify-center">
        <AbsherIcon className="w-14 h-16 text-white" />
        <span className="text-white text-sm font-medium mt-4 tracking-wide font-sans">
          Loading Information
        </span>
      </div>
    </div>
  );
};
