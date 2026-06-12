import React, { useState } from 'react';
import { ChevronLeft, Shield, Eye, HelpCircle, Bell, Smartphone, User, Languages } from 'lucide-react';
import { PhoneSettings } from '../types';
import { LOCKSCREEN_WALLPAPERS } from '../data';

interface SettingsProps {
  onClose: () => void;
  settings: PhoneSettings;
  onUpdateSettings: (updates: Partial<PhoneSettings>) => void;
}

export const SettingsApp: React.FC<SettingsProps> = ({ onClose, settings, onUpdateSettings }) => {
  const [profileName, setProfileName] = useState(settings.userName);
  const [profileEmail, setProfileEmail] = useState(settings.userEmail);
  const [activeTab, setActiveTab] = useState<'root' | 'profile' | 'display' | 'security'>('root');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ userName: profileName, userEmail: profileEmail });
    setActiveTab('root');
  };

  return (
    <div className={`flex flex-col h-full font-sans transition-colors duration-200 ${settings.darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`} id="app-settings">
      {/* Header */}
      <div className={`p-4 border-b flex justify-between items-center ${settings.darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
        <button
          onClick={activeTab !== 'root' ? () => setActiveTab('root') : onClose}
          className="p-1 hover:bg-slate-500/10 rounded-full transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-display font-semibold tracking-tight text-sm">
          {activeTab === 'profile' ? 'My Profile' : activeTab === 'display' ? 'Display & Theme' : activeTab === 'security' ? 'Security & Gestures' : 'Settings'}
        </span>
        <div className="w-6 h-6"></div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 phone-scroll text-left">
        {activeTab === 'root' && (
          <div className="flex flex-col gap-5">
            {/* User Quick Card */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-3.5 rounded-3xl flex items-center gap-4 transition text-left border ${
                settings.darkMode ? 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-950' : 'bg-white hover:bg-slate-100 border-slate-200 shadow-sm'
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold font-display text-emerald-400 text-base">
                {settings.userName[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-200 font-display">{settings.userName}</h4>
                <p className="text-[10px] text-slate-500 truncate">{settings.userEmail}</p>
                <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 mt-1 inline-block font-mono">
                  💎 {settings.rewardPoints} Reward Points
                </span>
              </div>
            </button>

            {/* General System Sections */}
            <div className="flex flex-col gap-1">
              <h5 className="text-[10px] uppercase tracking-widest text-slate-500 px-2 font-bold mb-1.5">System Profiles</h5>
              
              <button
                onClick={() => setActiveTab('display')}
                className={`flex items-center justify-between p-3.5 rounded-2xl transition border ${
                  settings.darkMode ? 'bg-slate-950/40 border-slate-805 hover:bg-slate-950' : 'bg-white border-slate-150 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-4.5 h-4.5 text-emerald-400" />
                  <span className="text-xs font-semibold">Display & Theme Colors</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-455 font-semibold">
                  <span>{settings.darkMode ? 'Dark OS' : 'Light OS'}</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center justify-between p-3.5 rounded-2xl transition border ${
                  settings.darkMode ? 'bg-slate-950/40 border-slate-805 hover:bg-slate-950' : 'bg-white border-slate-150 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4.5 h-4.5 text-emerald-400" />
                  <span className="text-xs font-semibold">Security & Locks</span>
                </div>
                <span className="text-[10px] font-mono uppercase text-emerald-500">{settings.securityLock}</span>
              </button>
            </div>

            {/* Quick Toggle Settings */}
            <div className="flex flex-col gap-1">
              <h5 className="text-[10px] uppercase tracking-widest text-slate-500 px-2 font-bold mb-1.5">Network Preferences</h5>
              
              <div className={`p-4 rounded-3xl border flex flex-col gap-4 ${settings.darkMode ? 'bg-slate-950/40 border-slate-805' : 'bg-white border-slate-150'}`}>
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-semibold">WiFi Connectivity</p>
                    <p className="text-[10px] text-slate-500">Auto-connect to saved signals</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.wifiEnabled}
                    onChange={(e) => onUpdateSettings({ wifiEnabled: e.target.checked })}
                    className="w-8 h-4 rounded-full bg-slate-200 cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/10 pt-3">
                  <div className="text-xs">
                    <p className="font-semibold">Bluetooth Wireless</p>
                    <p className="text-[10px] text-slate-500">Pair wireless controllers & audio</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.bluetoothEnabled}
                    onChange={(e) => onUpdateSettings({ bluetoothEnabled: e.target.checked })}
                    className="w-8 h-4 rounded-full bg-slate-200 cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/10 pt-3">
                  <div className="text-xs">
                    <p className="font-semibold">Battery Saver Mode</p>
                    <p className="text-[10px] text-slate-500">Minimizes background animations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.batterySaver}
                    onChange={(e) => onUpdateSettings({ batterySaver: e.target.checked })}
                    className="w-8 h-4 rounded-full bg-slate-200 cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="text-center py-4 text-[9px] text-slate-500 font-mono">
              Phone OS v4.11-Exhibition Edition<br />
              All simulation assets stored locally
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-xs">
              <label className="font-semibold text-slate-400">Personal Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className={`p-3 rounded-2xl border text-slate-100 ${settings.darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <label className="font-semibold text-slate-400">Account Email</label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className={`p-3 rounded-2xl border text-slate-100 ${settings.darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </div>

            <div className="bg-slate-950/40 p-4 rounded-3xl border border-slate-805 mt-2 text-center text-xs text-slate-455">
              💡 Account rewards are synchronous. Purchases unlock loyalty stamps and reward coins credited here automatically.
            </div>

            <button
              type="submit"
              className="mt-4 w-full py-3 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition rounded-2xl text-xs shadow-md"
            >
              Update Account Profiles
            </button>
          </form>
        )}

        {activeTab === 'display' && (
          <div className="flex flex-col gap-6">
            <div className={`p-4 rounded-3xl border flex flex-col gap-4 ${settings.darkMode ? 'bg-slate-950/40 border-slate-805' : 'bg-white border-slate-150'}`}>
              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <p className="font-semibold">Dark Interface Theme</p>
                  <p className="text-[10px] text-slate-500">Enable soft deep-black canvas</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => onUpdateSettings({ darkMode: e.target.checked })}
                  className="w-8 h-4 rounded-full bg-slate-200 cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/10 pt-3">
                <div className="text-xs">
                  <p className="font-semibold">A11y High Contrast</p>
                  <p className="text-[10px] text-slate-500">Increases structural font weight</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.highContrastMode}
                  onChange={(e) => onUpdateSettings({ highContrastMode: e.target.checked })}
                  className="w-8 h-4 rounded-full bg-slate-200 cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="border-t border-slate-805/10 pt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold">Text Magnification Scale</span>
                  <span className="font-mono text-emerald-400">{settings.fontSizeScale}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="1.25"
                  step="0.125"
                  value={settings.fontSizeScale}
                  onChange={(e) => onUpdateSettings({ fontSizeScale: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Wallpapers Selector */}
            <div className="flex flex-col gap-2">
              <h5 className="text-[10px] uppercase tracking-widest text-slate-555 px-2 font-bold">Select OS Wallpaper</h5>
              <div className="grid grid-cols-2 gap-3">
                {LOCKSCREEN_WALLPAPERS.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => onUpdateSettings({ wallpaper: wp.url })}
                    className={`h-24 rounded-2xl relative overflow-hidden transition-all border-2 ${
                      settings.wallpaper === wp.url ? 'border-emerald-400 scale-[1.02] shadow-md' : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <img src={wp.url} alt={wp.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-2.5">
                      <span className="text-[10px] font-bold text-slate-200 font-display truncate">{wp.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="flex flex-col gap-3">
            <h5 className="text-[10px] uppercase tracking-widest text-slate-500 px-2 font-bold mb-1">Choose Screen Unlock Type</h5>
            
            {(['swipe', 'faceid', 'fingerprint'] as const).map((method) => (
              <button
                key={method}
                onClick={() => onUpdateSettings({ securityLock: method })}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition text-left ${
                  settings.securityLock === method 
                    ? 'border-emerald-500 bg-emerald-500/5' 
                    : settings.darkMode ? 'bg-slate-950/40 border-slate-805 hover:bg-slate-950' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-100">
                    {method === 'swipe' ? 'Swipe Gestures' : method === 'faceid' ? 'Biometric FaceID' : 'Fingerprint Touch ID'}
                  </h4>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    {method === 'swipe' ? 'Drag screen upwards to lock/unlock standard systems' : method === 'faceid' ? 'Simulate dynamic 3D facial sensor lasers' : 'Simulate bottom digital capacitive nodes scan'}
                  </p>
                </div>
                {settings.securityLock === method && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
