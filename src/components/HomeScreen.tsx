import React, { useState } from 'react';
import {
  ShoppingBag, Bot, FileText, Settings, Plus, Compass, FolderDown,
  Image as ImageIcon, BarChart3, Search, Award
} from 'lucide-react';
import { PhoneSettings } from '../types';

interface AppIconDefinition {
  id: string;
  name: string;
  icon: React.ReactNode;
  badgeCount?: number;
  colorClass: string;
}

interface HomeScreenProps {
  settings: PhoneSettings;
  cartCount: number;
  notesCount: number;
  filesCount: number;
  notifyCount: number;
  onLaunchApp: (appId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  settings,
  cartCount,
  notesCount,
  filesCount,
  notifyCount,
  onLaunchApp
}) => {
  const [appSearchQuery, setAppSearchQuery] = useState('');

  const appIcons: AppIconDefinition[] = [
    {
      id: 'store',
      name: 'ECO-Store',
      icon: <ShoppingBag className="w-5 h-5 text-white" />,
      badgeCount: cartCount,
      colorClass: 'bg-gradient-to-tr from-orange-600 to-amber-400 border border-orange-500/30 shadow-[0_4px_12px_rgba(249,115,22,0.3)]'
    },
    {
      id: 'chatbot',
      name: 'Sora Chat',
      icon: <Bot className="w-5 h-5 text-orange-400" />,
      badgeCount: 0,
      colorClass: 'bg-gradient-to-tr from-zinc-900 to-zinc-800 border border-white/10 shadow-md'
    },
    {
      id: 'notes',
      name: 'Shopping Notes',
      icon: <FileText className="w-5 h-5 text-white" />,
      badgeCount: notesCount,
      colorClass: 'bg-zinc-900 border border-zinc-805 bg-gradient-to-br from-zinc-900 via-zinc-950 to-orange-950/20'
    },
    {
      id: 'settings',
      name: 'Phone Settings',
      icon: <Settings className="w-5 h-5 text-zinc-400" />,
      badgeCount: 0,
      colorClass: 'bg-gradient-to-tr from-zinc-900 to-zinc-800 border border-white/10'
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: <Plus className="w-5 h-5 text-zinc-400" />,
      badgeCount: 0,
      colorClass: 'bg-gradient-to-tr from-zinc-900 to-zinc-800 border border-white/10'
    },
    {
      id: 'browser',
      name: 'Browser',
      icon: <Compass className="w-5 h-5 text-zinc-400" />,
      badgeCount: 0,
      colorClass: 'bg-gradient-to-tr from-[#121214] to-[#1e1e24] border border-white/10'
    },
    {
      id: 'files',
      name: 'Invoices',
      icon: <FolderDown className="w-5 h-5 text-white" />,
      badgeCount: filesCount,
      colorClass: 'bg-gradient-to-tr from-orange-950/40 to-zinc-900 border border-orange-500/10'
    },
    {
      id: 'gallery',
      name: 'OS Photos',
      icon: <ImageIcon className="w-5 h-5 text-zinc-400" />,
      badgeCount: 0,
      colorClass: 'bg-gradient-to-tr from-zinc-900 to-zinc-800 border border-white/10'
    },
    {
      id: 'admin',
      name: 'Admin Panel',
      icon: <BarChart3 className="w-5 h-5 text-zinc-400" />,
      badgeCount: 0,
      colorClass: 'bg-gradient-to-tr from-zinc-900 to-[#1e1a24] border border-white/10'
    }
  ];

  const filteredApps = appIcons.filter(app =>
    app.name.toLowerCase().includes(appSearchQuery.toLowerCase())
  );

  // Core navigation quick dock shortcuts
  const dockApps = appIcons.filter(app =>
    ['store', 'chatbot', 'notes', 'settings'].includes(app.id)
  );

  return (
    <div className="absolute inset-0 p-6 flex flex-col justify-between select-none bg-transparent" id="phone-homescreen">
      {/* Background Wallpaper image layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img src={settings.wallpaper} referrerPolicy="no-referrer" alt="Home Wallpaper" className="w-full h-full object-cover brightness-[0.7]" />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* App Finder Search Bar */}
      <div className="relative z-10 w-full mb-4">
        <input
          type="text"
          placeholder="Search premium apps..."
          value={appSearchQuery}
          onChange={(e) => setAppSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 text-white placeholder-zinc-400 text-[11px] rounded-full focus:outline-none backdrop-blur-md font-sans"
        />
        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
      </div>

      {/* Main Apps grid drawer segment */}
      <div className="relative z-10 flex-grow grid grid-cols-4 gap-y-6 gap-x-3 items-start content-start pt-2 h-[60%] overflow-y-auto pr-1 phone-scroll">
        {filteredApps.map((app) => (
          <button
            key={app.id}
            onClick={() => onLaunchApp(app.id)}
            className="flex flex-col items-center gap-1.5 focus:outline-none group active:scale-95 transition duration-150 relative col-span-1"
          >
            {/* The icon tile */}
            <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center relative shadow-lg group-hover:brightness-[1.15] transition duration-205 pointer-events-none ${app.colorClass}`}>
              {app.icon}
              {app.badgeCount !== undefined && app.badgeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-500 text-white font-black text-[9px] border border-slate-950 flex items-center justify-center animate-pulse">
                  {app.badgeCount}
                </span>
              )}
            </div>

            {/* Label name */}
            <span className="text-[9px] text-zinc-300 font-semibold truncate w-full text-center drop-shadow">
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {/* Fixed bottom Dock segment in translucent layout */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[28px] p-3 flex justify-around gap-2.5 shadow-xl">
        {dockApps.map((app) => (
          <button
            key={app.id}
            onClick={() => onLaunchApp(app.id)}
            className="flex flex-col items-center focus:outline-none hover:scale-105 active:scale-95 duration-150 transition"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative shadow ${app.colorClass}`}>
              {app.icon}
              {app.badgeCount !== undefined && app.badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white font-black text-[8px] border border-slate-950 flex items-center justify-center">
                  {app.badgeCount}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
