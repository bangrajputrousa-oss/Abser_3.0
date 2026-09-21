import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, MessageSquare, Headphones } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState('9:15 AM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      id="android-status-bar"
      className="w-full h-7 px-3 flex items-center justify-between text-[11px] font-medium text-white/90 select-none bg-[#024e2e] z-30"
    >
      {/* Left side: Time & Notification icons */}
      <div className="flex items-center gap-1.5">
        <span className="font-semibold tracking-tight">{time}</span>
        <MessageSquare className="w-2.5 h-2.5 opacity-80" />
        <span className="text-[9px] opacity-70">🎮</span>
        <span className="text-[10px] opacity-70 font-mono">((o))</span>
        <span className="text-[9px] opacity-60">•</span>
      </div>

      {/* Right side: Network, Battery, Speed */}
      <div className="flex items-center gap-1.5">
        <Headphones className="w-2.5 h-2.5 opacity-80" />
        <div className="flex items-center gap-0.5 text-[9px] opacity-85 font-mono">
          <Wifi className="w-3 h-3" />
          <span>VoWiFi</span>
        </div>
        <span className="text-[8.5px] font-mono opacity-70">4.39 K/S</span>
        <div className="flex items-center gap-0.5 bg-black/30 px-1 py-0.5 rounded text-[10px] font-mono">
          <span>88</span>
          <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
