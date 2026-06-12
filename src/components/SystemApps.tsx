import React, { useState } from 'react';
import { Search, Globe, ChevronLeft, ChevronRight, RefreshCw, FileText, Download, CheckCircle, Image as ImageIcon, Trash2, ArrowLeft } from 'lucide-react';
import { FileDocument } from '../types';

interface AppProps {
  onClose: () => void;
  files: FileDocument[];
  onAddNotification?: (title: string, body: string, app: string) => void;
  onNavigateToTab?: (tab: string, productId?: string) => void;
}

// ==================== CALCULATOR APP ====================
export const CalculatorApp: React.FC<AppProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNum = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleCalculate = () => {
    if (!equation) return;
    try {
      const fullEq = equation + display;
      // Safety evaluation of mathematical expression in simulated code
      const sanitized = fullEq.replace(/[^- \d/*+.]/g, '');
      // eslint-disable-next-line no-eval
      const result = eval(sanitized);
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans p-4" id="app-calculator">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-display font-semibold tracking-wide">Calculator</span>
        <div className="w-6 h-6"></div>
      </div>

      <div className="flex-1 flex flex-col justify-end pb-8">
        <div className="text-right text-slate-400 text-lg mb-2 h-8 font-mono">{equation}</div>
        <div className="text-right text-5xl font-light font-mono truncate">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-3 bg-slate-900/50 p-4 rounded-3xl backdrop-blur-md">
        <button onClick={handleClear} className="h-14 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-emerald-400 transition">C</button>
        <button onClick={() => handleOp('/')} className="h-14 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-emerald-400 transition">÷</button>
        <button onClick={() => handleOp('*')} className="h-14 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-emerald-400 transition">×</button>
        <button onClick={() => handleOp('-')} className="h-14 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-emerald-400 transition">-</button>

        <button onClick={() => handleNum('7')} className="h-14 rounded-full bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-lg transition">7</button>
        <button onClick={() => handleNum('8')} className="h-14 rounded-full bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-lg transition">8</button>
        <button onClick={() => handleNum('9')} className="h-14 rounded-full bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-lg transition">9</button>
        <button onClick={() => handleOp('+')} className="h-14 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-emerald-400 transition">+</button>

        <button onClick={() => handleNum('4')} className="h-14 rounded-full bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-lg transition">4</button>
        <button onClick={() => handleNum('5')} className="h-14 rounded-full bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-lg transition">5</button>
        <button onClick={() => handleNum('6')} className="h-14 rounded-full bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-lg transition">6</button>
        <button onClick={handleCalculate} className="row-span-2 h-30 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 font-bold text-slate-950 text-2xl transition flex items-center justify-center">=</button>

        <button onClick={() => handleNum('1')} className="h-14 rounded-full bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-lg transition">1</button>
        <button onClick={() => handleNum('2')} className="h-14 rounded-full bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-lg transition">2</button>
        <button onClick={() => handleNum('3')} className="h-14 rounded-full bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-lg transition">3</button>

        <button onClick={() => handleNum('0')} className="col-span-2 h-14 rounded-full bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-lg transition text-left pl-8">0</button>
        <button onClick={() => handleNum('.')} className="h-14 rounded-full bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-lg transition">.</button>
      </div>
    </div>
  );
};


// ==================== BROWSER APP ====================
export const BrowserApp: React.FC<AppProps> = ({ onClose, onNavigateToTab }) => {
  const [url, setUrl] = useState('google.com');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittingUrl, setSubmittingUrl] = useState('google.com');
  const [currentTab, setCurrentTab] = useState<'home' | 'search' | 'details'>('home');

  const handleGoToUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingUrl(url);
    if (url.includes('shop') || url.includes('vortex') || url.includes('eco')) {
      setCurrentTab('search');
    } else {
      setCurrentTab('home');
    }
  };

  const trendingTopics = [
    { text: 'Vortex Pro reviews', keyword: 'Vortex Pro 15 Max' },
    { text: 'Eco-friendly sustainable clothes', keyword: 'Organic Hoodie' },
    { text: 'Best noise canceling headphones 2026', keyword: 'Earbuds' },
    { text: 'Bamboo modern lifestyle home chairs', keyword: 'Chair' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-150 font-sans" id="app-browser">
      {/* Search Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800/60 sticky top-0 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <form onSubmit={handleGoToUrl} className="flex-1 flex items-center bg-slate-900 border border-slate-700/60 rounded-full px-3 py-1">
            <Globe className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none text-slate-100 font-mono"
            />
          </form>
          
          <button onClick={() => setSubmittingUrl(url)} className="p-1.5 text-slate-400 hover:text-emerald-400 transition rounded-full hover:bg-slate-850">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main browser display body */}
      <div className="flex-grow overflow-y-auto w-full bg-slate-900 p-4 phone-scroll">
        {currentTab === 'home' ? (
          <div className="flex flex-col items-center justify-center pt-8 text-center px-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xl shadow-md font-display">G</div>
              <span className="text-2xl font-bold font-display tracking-tight text-white">GreenSearch</span>
            </div>
            <p className="text-slate-400 text-xs mb-8">Simulation of a privacy-focused carbon-neutral search engine</p>

            <div className="w-full relative mb-8">
              <input
                type="text"
                placeholder="Search database or type web URL..."
                value={searchQuery}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setCurrentTab('search');
                    setUrl(`greensearch.org/q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-11 pr-4 bg-slate-950 text-slate-150 rounded-2xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition text-sm shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
            </div>

            <div className="w-full bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest text-left mb-3">Trending Deals & Topics</h4>
              <div className="flex flex-col gap-2.5 text-left">
                {trendingTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(topic.keyword);
                      setUrl(`greensearch.org/q=${encodeURIComponent(topic.keyword)}`);
                      setCurrentTab('search');
                    }}
                    className="flex items-center gap-3 text-xs text-slate-300 hover:text-emerald-300 py-1 transition group"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                    <span>{topic.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300">Search results for <span className="text-emerald-400">"{searchQuery || url}"</span></h3>
              <button onClick={() => setCurrentTab('home')} className="text-xs text-emerald-400 hover:underline">Home</button>
            </div>

            {/* Results mockup */}
            <div className="flex flex-col gap-3">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-805 text-left hover:border-emerald-400/40 transition">
                <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-wider">Matched Simulator App</span>
                <h4 className="text-sm font-semibold text-emerald-300 hover:underline mt-0.5" onClick={() => onNavigateToTab?.('store')}>
                  Go directly to Phone Store Catalog
                </h4>
                <p className="text-slate-400 text-xs mt-1">Found immediate active records for phone simulator items. Click here to check prices, stock levels, and flash sale details.</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-805 text-left">
                <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">www.vortex-mobility.com/reviews</span>
                <h4 className="text-sm font-semibold text-slate-200 mt-1">Flagship Vortex Pro 15 Max Deep-Dive Analysis</h4>
                <p className="text-slate-400 text-xs mt-1">Includes benchmark scores, 200MP camera tests, and 24-hour battery endurance logs. Conclusion: Best overall mobile launcher of 2026.</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-805 text-left">
                <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">www.gogreenreview.org/eco-living</span>
                <h4 className="text-sm font-semibold text-slate-200 mt-1">Top Rated Eco-Friendly Products Under $500</h4>
                <p className="text-slate-400 text-xs mt-1">Reviewing sustainable design choices including EcoNexus Lite repairable elements (EcoScore: 98/100) and plant-dyed urban apparel.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// ==================== FILE MANAGER APP ====================
export const FileManagerApp: React.FC<AppProps> = ({ onClose, files }) => {
  const [selectedFile, setSelectedFile] = useState<FileDocument | null>(null);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans" id="app-file-manager">
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
        <button onClick={selectedFile ? () => setSelectedFile(null) : onClose} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-display font-semibold text-sm">{selectedFile ? selectedFile.name : 'Files & Downloads'}</span>
        <div className="w-6 h-6"></div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 phone-scroll">
        {selectedFile ? (
          <div className="flex flex-col bg-slate-950 p-5 rounded-3xl border border-slate-800 max-h-[100%] shadow-2xl relative text-left">
            <span className="self-end text-[10px] font-mono text-emerald-400 border border-emerald-400/40 rounded-full px-2 py-0.5 bg-emerald-500/10 mb-4 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> OFFICIAL RECEIPT
            </span>
            <div className="text-slate-400 text-[10px] font-mono">Invoice Date: {selectedFile.date}</div>
            <div className="text-white font-bold text-sm mt-1">{selectedFile.name}</div>
            <hr className="border-slate-800 my-4" />
            
            <div className="whitespace-pre-wrap text-slate-300 font-mono text-[11px] bg-slate-900/50 p-3 rounded-2xl max-h-[300px] overflow-y-auto mb-4 border border-slate-800 phone-scroll">
              {selectedFile.content || 'No text content available inside this simulated document.'}
            </div>

            <button
              onClick={() => {
                alert(`Invoice PDF "${selectedFile.name}" printed successfully inside phone file storage! Saved to gallery.`);
              }}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 transition text-slate-950 font-semibold rounded-2xl flex items-center justify-center gap-2 text-xs"
            >
              <Download className="w-4 h-4" /> Save Local Copy
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Downloaded Invoices ({files.length})</h4>
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 bg-slate-950/40 rounded-3xl p-6 border border-slate-805">
                <FileText className="w-10 h-10 mb-2 opacity-40 text-emerald-400" />
                <span className="text-xs font-medium text-slate-400">No invoices generated yet</span>
                <p className="text-[10px] text-slate-500 mt-1 max-w-[180px]">Complete any virtual checkout sequence to save auto-generated invoice receipts here instantly.</p>
              </div>
            ) : (
              files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className="flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-slate-950 rounded-2xl border border-slate-805 hover:border-emerald-500/30 transition text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-slate-200 truncate pr-2">{file.name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{file.size} • {file.date}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// ==================== GALLERY APP ====================
export interface GalleryScreenshot {
  id: string;
  url: string;
  title: string;
  date: string;
}

interface GalleryAppProps extends AppProps {
  screenshots: GalleryScreenshot[];
  onDeleteScreenshot: (id: string) => void;
}

export const GalleryApp: React.FC<GalleryAppProps> = ({ onClose, screenshots, onDeleteScreenshot }) => {
  const [activePhoto, setActivePhoto] = useState<GalleryScreenshot | null>(null);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans" id="app-gallery">
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
        <button onClick={activePhoto ? () => setActivePhoto(null) : onClose} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-display font-semibold text-sm">{activePhoto ? 'Photo Viewer' : 'Media Gallery'}</span>
        <div className="w-6 h-6"></div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 phone-scroll">
        {activePhoto ? (
          <div className="flex flex-col h-full justify-between pb-8">
            <div className="flex-1 flex items-center justify-center bg-slate-950/80 rounded-3xl p-2 border border-slate-800 overflow-hidden relative">
              <img src={activePhoto.url} alt={activePhoto.title} referrerPolicy="no-referrer" className="max-w-full max-h-[300px] rounded-2xl object-cover" />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xs font-bold text-slate-200">{activePhoto.title}</h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{activePhoto.date}</p>
              
              <button
                onClick={() => {
                  onDeleteScreenshot(activePhoto.id);
                  setActivePhoto(null);
                }}
                className="mt-6 mx-auto px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs rounded-full flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Photo
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Saved Media / Screenshots ({screenshots.length})</h4>
            {screenshots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500 bg-slate-950/20 rounded-3xl p-6 border border-slate-805">
                <ImageIcon className="w-10 h-10 mb-2 opacity-40 text-emerald-400" />
                <span className="text-xs font-medium text-slate-400">Library Empty</span>
                <p className="text-[10px] text-slate-500 mt-1 max-w-[190px]">In e-commerce details, click the camera icon to snap simulated photos, saving dynamic assets here instantly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {screenshots.map((snap) => (
                  <button
                    key={snap.id}
                    onClick={() => setActivePhoto(snap)}
                    className="aspect-square bg-slate-950 border border-slate-800 rounded-xl overflow-hidden active:scale-95 transition hover:border-emerald-500/40"
                  >
                    <img src={snap.url} alt={snap.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
