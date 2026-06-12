import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Shield, Eye, ScanFace, Fingerprint } from 'lucide-react';
import { PhoneSettings } from '../types';

interface LockScreenProps {
  settings: PhoneSettings;
  onUnlock: () => void;
  onAddNotification: (title: string, body: string, app: string) => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ settings, onUnlock, onAddNotification }) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [fingerprintProgress, setFingerprintProgress] = useState(0);

  // Update real-time clock inside lockscreen
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Biometric Face ID laser scanner triggered upon clicking scan area
  const triggerFaceID = () => {
    if (biometricScanning === 'scanning') return;
    setBiometricScanning('scanning');
    
    setTimeout(() => {
      setBiometricScanning('success');
      setTimeout(() => {
        onUnlock();
        onAddNotification('Device Unlocked', 'FaceID biometric authorized successfully.', 'System');
        setBiometricScanning('idle');
      }, 700);
    }, 1800);
  };

  // Fingerprint touch-hold unlock loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (biometricScanning === 'scanning' && fingerprintProgress < 100) {
      timer = setInterval(() => {
        setFingerprintProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setBiometricScanning('success');
            setTimeout(() => {
              onUnlock();
              onAddNotification('Device Unlocked', 'Biometric Touch ID fingerprint approved.', 'System');
              setBiometricScanning('idle');
              setFingerprintProgress(0);
            }, 600);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [biometricScanning, fingerprintProgress]);

  const handleFingerprintDown = () => {
    if (biometricScanning === 'scanning') return;
    setBiometricScanning('scanning');
    setFingerprintProgress(0);
  };

  const handleFingerprintUp = () => {
    if (biometricScanning === 'scanning' && fingerprintProgress < 100) {
      setBiometricScanning('idle');
      setFingerprintProgress(0);
    }
  };

  return (
    <div
      className="absolute inset-0 select-none flex flex-col justify-between p-6 overflow-hidden bg-slate-950 text-white font-sans"
      id="phone-lockscreen"
    >
      {/* Background Wallpaper */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img src={settings.wallpaper} referrerPolicy="no-referrer" alt="Lockscreen Wallpaper" className="w-full h-full object-cover brightness-[0.7] transform scale-[1.01]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75"></div>
      </div>

      {/* Lock Symbol Icon */}
      <div className="relative z-10 self-center flex flex-col items-center mt-3 animate-pulse">
        <Lock className="w-5 h-5 text-orange-400" />
        <span className="text-[10px] tracking-widest uppercase font-black text-orange-400 mt-1 font-mono">ENCRYPTED OS</span>
      </div>

      {/* Clock, date and notifications preview card */}
      <div className="relative z-10 flex flex-col items-center text-center mt-2">
        <h1 className="text-5xl font-extrabold tracking-tight font-display animate-fade-in drop-shadow-md text-white">{time}</h1>
        <p className="text-xs uppercase font-bold tracking-widest text-[#e0e0e0] mt-2 font-mono drop-shadow">{date}</p>
      </div>

      {/* INTERACTIVE BIOMETRIC NODE ANCHORS */}
      <div className="relative z-10 flex flex-col items-center gap-6 my-auto">
        {settings.securityLock === 'faceid' && (
          <button
            onClick={triggerFaceID}
            className="flex flex-col items-center gap-2 group hover:scale-105 active:scale-95 transition"
          >
            <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              biometricScanning === 'scanning' 
                ? 'border-orange-400 bg-orange-500/10 scale-110 animate-pulse' 
                : biometricScanning === 'success' ? 'border-orange-500 bg-orange-500 text-slate-950' : 'border-white/50 bg-black/30 backdrop-blur-md text-slate-100'
            }`}>
              <ScanFace className={`w-6 h-6 ${biometricScanning === 'scanning' ? 'animate-bounce text-orange-450' : ''}`} />
            </div>
            
            <span className="text-[9.5px] uppercase font-mono font-bold tracking-widest text-slate-200">
              {biometricScanning === 'scanning' ? 'SCANNING LAZERS...' : biometricScanning === 'success' ? 'FACE APPROVED' : 'TAP FOR FACEID'}
            </span>
          </button>
        )}

        {settings.securityLock === 'fingerprint' && (
          <div className="flex flex-col items-center gap-2.5">
            <button
              onMouseDown={handleFingerprintDown}
              onMouseUp={handleFingerprintUp}
              onMouseLeave={handleFingerprintUp}
              onTouchStart={handleFingerprintDown}
              onTouchEnd={handleFingerprintUp}
              className="relative w-16 h-16 rounded-full flex items-center justify-center bg-black/40 border border-white/20 backdrop-blur-md active:scale-95 duration-200 transition focus:outline-none"
            >
              {/* Radial Progress Border representation */}
              {biometricScanning === 'scanning' && (
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="29"
                    fill="transparent"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 29}`}
                    strokeDashoffset={`${2 * Math.PI * 29 * (1 - fingerprintProgress / 100)}`}
                  />
                </svg>
              )}

              <Fingerprint className={`w-7 h-7 transition ${biometricScanning === 'scanning' ? 'text-orange-400 scale-105' : biometricScanning === 'success' ? 'text-orange-500' : 'text-slate-350'}`} />
            </button>
            <span className="text-[9.5px] uppercase font-mono font-bold tracking-widest text-slate-200">
              {biometricScanning === 'scanning' ? `SCANNING: ${fingerprintProgress}%` : 'HOLD TOUCH ID'}
            </span>
          </div>
        )}

        {settings.securityLock === 'swipe' && (
          <button
            onClick={onUnlock}
            className="flex flex-col items-center gap-2 bg-black/30 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:border-orange-500/40 transition active:scale-95"
          >
            <Unlock className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold">CLICK TO UNLOCK</span>
          </button>
        )}
      </div>

      {/* Swipe up instruction footer footer */}
      <div className="relative z-10 self-center mb-4 flex flex-col items-center text-slate-300 font-mono">
        <span className="text-[9.5px] tracking-widest uppercase font-bold animate-pulse text-slate-300">Swipe up to secure device</span>
        <div className="w-16 h-1 bg-white/45 rounded-full mt-2.5 animate-pulse"></div>
      </div>
    </div>
  );
};
