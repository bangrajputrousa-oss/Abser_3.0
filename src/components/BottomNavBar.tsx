import React from 'react';
import { Home, User, Users2, Users, LayoutGrid } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'services' as TabType,
      label: 'Services',
      icon: User,
    },
    {
      id: 'family' as TabType,
      label: 'Family',
      icon: Users2,
    },
    {
      id: 'workers' as TabType,
      label: 'Workers',
      icon: Users,
    },
    {
      id: 'other' as TabType,
      label: 'Other',
      icon: LayoutGrid,
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="w-full h-16 bg-[#1F2224] border-t border-[#2B2E32] flex items-center justify-around px-2 select-none z-30 shrink-0"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors"
          >
            <Icon
              className={`w-5 h-5 mb-1 transition-transform ${
                isActive
                  ? 'text-[#7BE4C2] stroke-[2.4] scale-105'
                  : 'text-[#8b919a] stroke-[1.8] hover:text-[#c4c8ce]'
              }`}
            />
            <span
              className={`text-[11px] leading-tight font-medium ${
                isActive ? 'text-[#7BE4C2]' : 'text-[#8b919a]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
