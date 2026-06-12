import React, { useState, useEffect } from 'react';
import {
  Wifi, WifiOff, Battery, Volume2, Sun, Moon, Bluetooth, Zap, ShieldAlert,
  ChevronDown, ChevronUp, Bell, Trash2, CheckCircle, Radio
} from 'lucide-react';
import { PhoneSettings, PhoneNotification } from '../types';

interface PhoneShellProps {
  children: React.ReactNode;
  settings: PhoneSettings;
  notifications: PhoneNotification[];
  onUpdateSettings: (updates: Partial<PhoneSettings>) => void;
  onClearNotifications: () => void;
  onClearNotificationId: (id: string) => void;
}

export const PhoneShell: React.FC<PhoneShellProps> = ({
  children,
  settings,
  notifications,
  onUpdateSettings,
  onClearNotifications,
  onClearNotificationId
}) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [systime, setSystime] = useState('12:00');
  
  // Realtime clock update
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setSystime(now.toTimeString().split(' ')[0].slice(0, 5));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`relative w-[320px] h-[660px] bg-[#121214] rounded-[55px] p-3 shadow-[0_0_80px_rgba(0,0,0,0.8)] border-[6px] border-[#2a2a2e] overflow-hidden flex flex-col select-none transition-all duration-300 ${
        settings.highContrastMode ? 'high-contrast' : ''
      }`}
      style={{ fontSize: `${settings.fontSizeScale * 13}px` }}
      id="phone-shell-wrapper"
    >
      {/* Physical notch pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full flex items-center justify-end px-3 z-50 border border-white/5 shadow-inner">
        <div className="w-2 h-2 bg-[#1a1a1a] rounded-full border border-blue-500/20"></div>
      </div>

      {/* 1. STATUS BAR */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className="w-full h-10 px-8 pt-4 bg-transparent flex justify-between items-center z-40 text-black/90 font-bold font-sans text-[10px] hover:bg-black/5 transition select-none shrink-0"
        style={{ color: settings.darkMode ? '#fff' : '#18181b' }}
      >
        <span>{systime}</span>
        
        <div className="flex items-center gap-1.5 font-bold">
          {settings.airplaneMode ? (
            <span className="text-[7.5px] uppercase tracking-wider text-red-500">AIR-MODE</span>
          ) : (
            <>
              {settings.wifiEnabled ? <Wifi className="w-3 h-3 text-orange-500" /> : <WifiOff className="w-3 h-3 text-red-400" />}
              {settings.bluetoothEnabled && <Bluetooth className="w-3 h-3 text-blue-500" />}
            </>
          )}
          
          <div className="flex items-center gap-0.5">
            <span className={settings.batterySaver ? 'text-yellow-405 font-bold' : ''}>
              {settings.batterySaver ? '45%' : '82%'}
            </span>
            <Battery className={`w-3.5 h-3.5 ${settings.batterySaver ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-800 fill-zinc-800'}`} style={{ color: settings.darkMode ? '#fff' : '#18181b', fill: settings.darkMode ? '#fff' : '#18181b' }} />
          </div>
        </div>
      </button>

      {/* 2. PULLDOWN EXPANSION PANEL (NOTIFICATION CENTER + QUICK SETTINGS) */}
      <div
        className={`absolute inset-x-0 top-8 bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800/80 z-35 transition-all duration-300 p-5 flex flex-col gap-4 text-white text-left ${
          panelOpen ? 'max-h-[85%] visible opacity-100' : 'max-h-0 invisible opacity-0 overflow-hidden'
        }`}
        id="phone-panel-dropdown"
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 font-mono">Control Center & Alerts</span>
          <button onClick={() => setPanelOpen(false)} className="p-1 rounded-full bg-slate-900 hover:bg-slate-800 transition">
            <ChevronUp className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Sliders layout */}
        <div className="flex flex-col gap-2 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-850">
          <div className="flex items-center gap-3">
            <Sun className="w-4.5 h-4.5 text-yellow-400" />
            <input
              type="range"
              min="10"
              max="100"
              value={settings.brightness}
              onChange={(e) => onUpdateSettings({ brightness: parseInt(e.target.value) })}
              className="flex-grow accent-emerald-500 h-1 rounded-full bg-slate-800"
            />
            <span className="text-[9px] font-mono text-slate-500">{settings.brightness}%</span>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-800/10 pt-2 mt-1">
            <Volume2 className="w-4.5 h-4.5 text-indigo-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              onChange={(e) => onUpdateSettings({ volume: parseInt(e.target.value) })}
              className="flex-grow accent-emerald-500 h-1 rounded-full bg-slate-850"
            />
            <span className="text-[9px] font-mono text-slate-500">{settings.volume}%</span>
          </div>
        </div>

        {/* Quick Toggles boxes */}
        <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-bold font-mono">
          <button
            onClick={() => onUpdateSettings({ wifiEnabled: !settings.wifiEnabled })}
            className={`p-2 rounded-xl flex flex-col items-center gap-1.5 border transition ${
              settings.wifiEnabled ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-850 bg-slate-900/40 text-slate-500'
            }`}
          >
            <Wifi className="w-4.5 h-4.5" />
            <span>WIFI</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
            className={`p-2 rounded-xl flex flex-col items-center gap-1.5 border transition ${
              settings.darkMode ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-850 bg-slate-900/40 text-slate-500'
            }`}
          >
            <Moon className="w-4.5 h-4.5" />
            <span>DARK</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ batterySaver: !settings.batterySaver })}
            className={`p-2 rounded-xl flex flex-col items-center gap-1.5 border transition ${
              settings.batterySaver ? 'border-yellow-500 bg-yellow-500/10 text-yellow-405' : 'border-slate-850 bg-slate-900/40 text-slate-500'
            }`}
          >
            <Zap className="w-4.5 h-4.5" />
            <span>SAVER</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ airplaneMode: !settings.airplaneMode })}
            className={`p-2 rounded-xl flex flex-col items-center gap-1.5 border transition ${
              settings.airplaneMode ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-slate-850 bg-slate-900/40 text-slate-500'
            }`}
          >
            <Radio className="w-4.5 h-4.5" />
            <span>FLIGHT</span>
          </button>
        </div>

        {/* Notifications feed segment */}
        <div className="flex-grow flex flex-col gap-2 min-h-[140px] max-h-[190px] overflow-y-auto pr-1 phone-scroll">
          <div className="flex justify-between items-center text-[9px] text-slate-500 border-b border-slate-900/50 pb-1.5">
            <span>ALERT MANAGER ({notifications.length})</span>
            {notifications.length > 0 && (
              <button onClick={onClearNotifications} className="hover:text-red-400 font-bold flex items-center gap-0.5">
                <Trash2 className="w-3 h-3" /> CLEAR ALL
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-6 gap-1">
              <Bell className="w-7 h-7 opacity-35 text-slate-400" />
              <span>Diagnostic alerts empty</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {notifications.map((item) => (
                <div key={item.id} className="p-3 bg-slate-900 border border-slate-850/60 rounded-xl flex items-start justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-grow text-left">
                    <div className="flex items-center gap-1.5 text-[8.5px] font-bold font-mono tracking-wider text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span>{item.app?.toUpperCase()} SERVICE</span>
                    </div>
                    <h5 className="font-bold text-slate-200 mt-1 truncate">{item.title}</h5>
                    <p className="text-[10.5px] text-slate-400 leading-snug mt-0.5">{item.body}</p>
                    <span className="text-[8px] text-slate-600 font-mono mt-1.5 block">{item.time}</span>
                  </div>
                  <button onClick={() => onClearNotificationId(item.id)} className="text-slate-500 hover:text-red-400 p-0.5">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. INNER CORE CONTENT VIEWPORT (Lockscreen or active sub-app) */}
      <div className={`flex-1 relative overflow-hidden flex flex-col ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-950'}`}>
        {children}
      </div>

      {/* Swipe up drag indicator / panel toggle hook */}
      {!panelOpen && (
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-800/40 rounded-full z-45 pointer-events-none"></div>
      )}
    </div>
  );
};
