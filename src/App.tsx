import { useState, useEffect } from 'react';
import {
  PhoneSettings, CartItem, Product, Order, Note, PhoneNotification,
  FileDocument, Achievement, Customer, Category
} from './types';
import { INITIAL_PRODUCTS, MOCK_ACHIEVEMENTS, INITIAL_CUSTOMERS, INITIAL_CATEGORIES } from './data';
import { ECommerceApp } from './components/ECommerceApp';
import { AdminPanelApp } from './components/AdminPanelApp';
import {
  Award, RefreshCw, Star, Info, CheckCircle, Leaf, Bot, 
  AppWindow, BarChart3, Compass, Sparkles, Code, Copy, Check,
  Sun, Moon, Play, UserCheck, ShieldCheck
} from 'lucide-react';

export default function App() {
  // 1. STATE INITIALIZATION (Binds fully to localStorage)
  const [settings, setSettings] = useState<PhoneSettings>(() => {
    const saved = localStorage.getItem('sim_settings');
    if (saved) return JSON.parse(saved);
    return {
      darkMode: true,
      airplaneMode: false,
      wifiEnabled: true,
      bluetoothEnabled: true,
      batterySaver: false,
      brightness: 80,
      volume: 60,
      wallpaper: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      language: 'English',
      userName: 'Guest User',
      userEmail: '',
      userAvatar: '',
      rewardPoints: 200, // seed standard starter balance
      securityLock: 'faceid',
      highContrastMode: false,
      fontSizeScale: 1
    };
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sim_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        // Auto-migrate old duplicate URLs to clean new unique assets
        const migrated = parsed.map(p => {
          if (p.id === 'foo-3' && (p.image.includes('photo-1520639888713') || !p.image)) {
            return {
              ...p,
              image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80',
              images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80']
            };
          }
          if (p.id === 'foo-4' && (p.image.includes('photo-1590658268037') || !p.image)) {
            return {
              ...p,
              image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80',
              images: ['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80']
            };
          }
          if (p.id === 'app-3' && (p.image.includes('photo-1584269600464') || !p.image)) {
            return {
              ...p,
              image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
              images: ['https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80']
            };
          }
          if (p.id === 'app-4' && (p.image.includes('photo-1517701604599') || !p.image)) {
            return {
              ...p,
              image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
              images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80']
            };
          }
          return p;
        });
        // Repair if some products are missing from saved entirely
        if (migrated.length < INITIAL_PRODUCTS.length) {
          const missing = INITIAL_PRODUCTS.filter(ip => !migrated.some(mp => mp.id === ip.id));
          return [...migrated, ...missing];
        }
        return migrated;
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sim_cart');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sim_wishlist');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sim_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<PhoneNotification[]>(() => {
    const saved = localStorage.getItem('sim_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'not-init', title: 'SmartCommerce Hub Connected', body: 'Customer app loaded directly. Onboarding active.', app: 'System', time: 'Just Now', read: false }
    ];
  });

  const [files, setFiles] = useState<FileDocument[]>(() => {
    const saved = localStorage.getItem('sim_files');
    return saved ? JSON.parse(saved) : [];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('sim_achievements');
    return saved ? JSON.parse(saved) : MOCK_ACHIEVEMENTS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('sim_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('sim_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // BRAND WORKSPACE VIEWS
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer');
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [showExporter, setShowExporter] = useState<boolean>(false);
  const [activeExportTab, setActiveExportTab] = useState<'products' | 'orders' | 'categories' | 'coupons' | 'customers'>('products');
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [walkthroughStep, setWalkthroughStep] = useState<number>(1);
  const [storageBytes, setStorageBytes] = useState(0);

  // 2. SYNCHRONOUS PERSISTENCE MECHANICS
  useEffect(() => {
    localStorage.setItem('sim_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('sim_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sim_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sim_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('sim_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sim_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sim_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('sim_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('sim_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('sim_categories', JSON.stringify(categories));
  }, [categories]);

  // Calculate local storage size for telemetry specs panel
  useEffect(() => {
    const bytes = encodeURIComponent(JSON.stringify(localStorage)).length;
    setStorageBytes(bytes);
  }, [settings, products, cart, wishlist, orders, notifications, files, customers, categories]);

  // CENTRAL NOTIFICATION SYSTEM LOG
  const handleAddNotification = (title: string, body: string, app: string) => {
    const newNotify: PhoneNotification = {
      id: `notify-${Date.now()}`,
      title,
      body,
      app,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotify, ...prev]);
  };

  // ACHIEVEMENT MANAGER (Direct user unlocks, awards points instantly)
  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      let earnedPoints = 0;
      const updated = prev.map(ach => {
        if (ach.id === id && !ach.unlocked) {
          earnedPoints = ach.points;
          handleAddNotification('Achievement Unlocked! 🏆', `${ach.title} (+${ach.points} Pts)`, 'System');
          return { ...ach, unlocked: true };
        }
        return ach;
      });

      if (earnedPoints > 0) {
        setSettings(prevSet => ({
          ...prevSet,
          rewardPoints: prevSet.rewardPoints + earnedPoints
        }));
      }
      return updated;
    });
  };

  // Check complex order triggers
  useEffect(() => {
    if (orders.length > 0) {
      const lastOrder = orders[0];
      
      // Check eco-friendly item (ecoScore >= 95)
      const hasEco = lastOrder.items.some(i => i.product.ecoScore >= 95);
      if (hasEco) {
        unlockAchievement('ach-3');
      }

      // Check applied savings coupon code
      if (lastOrder.discount > 0) {
        unlockAchievement('ach-4');
      }

      // Check multiple item items purchased (>=3 items combined quantity)
      const combinedQty = lastOrder.items.reduce((s, i) => s + i.quantity, 0);
      if (combinedQty >= 3) {
        unlockAchievement('ach-5');
      }
    }
  }, [orders]);

  // AUTOMATION WORKFLOW PRESENTATION MACROS FOR MOBILE APP DIRECT ACCESS
  const runMacroLogin = () => {
    // Locate Default Admin customer seed or build one
    const targetEmail = 'krishangpinash@gmail.com';
    let matchingCust = customers.find(c => c.email.toLowerCase() === targetEmail);
    if (!matchingCust) {
      matchingCust = {
        id: 'cust-seeded-1',
        name: 'Krishang Pinash',
        email: targetEmail,
        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=Krishang`,
        status: 'active',
        registerDate: new Date().toLocaleDateString(),
        purchaseCount: 0,
        spent: 0
      };
      setCustomers(prev => [matchingCust!, ...prev]);
    }
    
    // Log user session
    localStorage.setItem('sim_logged_user', JSON.stringify(matchingCust));
    setSettings(prev => ({
      ...prev,
      userName: matchingCust!.name,
      userEmail: matchingCust!.email,
      userAvatar: matchingCust!.avatar
    }));

    unlockAchievement('ach-1');
    handleAddNotification('Demo Login Sequenced', 'Authorized as Krishang Pinash. Welcome to EcoShop!', 'System');
    
    // Force a minor page state refresher by window storage events
    window.dispatchEvent(new Event('storage'));
    setWalkthroughStep(2);
  };

  const runMacroBrowse = () => {
    runMacroLogin(); // Ensure logged in
    unlockAchievement('ach-2');
    handleAddNotification('Store Accessed', 'Sora advisor catalog filters aligned!', 'Store');
    setWalkthroughStep(3);
  };

  const runMacroCart = () => {
    runMacroBrowse(); // Ensure logged in

    const phone = products.find(p => p.id === 'ele-1') || products[0];
    const buds = products.find(p => p.id === 'ele-2') || products[1];

    setCart([
      { id: `cart-macro-1`, product: phone, quantity: 1, selectedColor: 'Cyber Green', selectedSize: 'S' },
      { id: `cart-macro-2`, product: buds, quantity: 1, selectedColor: 'Default', selectedSize: 'M' }
    ]);

    handleAddNotification('Cart Restuffed', 'Injected flagship wares to your shopping bag!', 'Store');
    setWalkthroughStep(4);
  };

  const runMacroCheckout = () => {
    runMacroBrowse(); // Ensure logged in
    
    const invoiceID = `INV-${Math.floor(Math.random() * 900000 + 10000) * 11}`;
    const targetProduct = products[0]; // Pro Phone
    
    const freshOrder: Order = {
      id: invoiceID,
      items: [
        { id: 'itm-macro-1', product: targetProduct, quantity: 1, selectedColor: 'Titan Grey', selectedSize: 'M' }
      ],
      subtotal: targetProduct.price,
      tax: targetProduct.price * 0.08,
      shipping: 0,
      discount: targetProduct.price * 0.20, // 20% off with SMART20 code
      total: targetProduct.price * 0.88,
      address: {
        id: 'addr-macro',
        type: 'Home',
        fullName: 'Krishang Pinash',
        street: '1402 Silicon Heights, Innovation Dr',
        city: 'Sunnyvale',
        state: 'CA',
        zipCode: '94089',
        phone: '1-800-WEB',
        isDefault: true
      },
      paymentMethod: 'upi',
      date: new Date().toLocaleDateString(),
      status: 'placed'
    };

    setOrders([freshOrder, ...orders]);
    setCart([]);

    // Write Invoice TXT file
    const txtReceipt: FileDocument = {
      id: invoiceID,
      name: `Invoice #${invoiceID}.txt`,
      type: 'invoice',
      size: '10 KB',
      date: new Date().toLocaleDateString(),
      url: '#invoice',
      content: `--- VIRTUAL TRANSACTION ORDER RECEIPT ---
Invoice ID: ${invoiceID}
Vendor: SmartCommerce E-Commerce Ecosystem
Client Name: Krishang Pinash
Transaction Status: DISPATCHED & ENCRYPTED
Applied Promotion: SMART20 (20% OFF Student checkout discount)
Grand Total Charged: $${(targetProduct.price * 0.88).toFixed(2)}
`
    };
    setFiles(prev => [txtReceipt, ...prev]);

    // Fast-unlock targets
    unlockAchievement('ach-3');
    unlockAchievement('ach-4');

    handleAddNotification('Order Placed', `Transaction confirmed. Checkout Invoice txt written to local storage folders!`, 'Store');
    setWalkthroughStep(5);
  };

  const runMacroLogistics = () => {
    if (orders.length === 0) {
      runMacroCheckout();
    }

    setTimeout(() => {
      const target = orders[0] || { id: 'INV-DEMO', status: 'placed' };
      const nextStatus = 'shipped';
      
      setOrders(prev => prev.map((o, idx) => idx === 0 ? { ...o, status: nextStatus } : o));
      handleAddNotification('Logistics advanced', `Delivery status of #${target.id} advanced to SHIPPED!`, 'System');
      
      setViewMode('admin');
    }, 500);
  };

  // Reset local storage database to clear sandbox environment back to fresh defaults
  const handleFullReset = () => {
    if (confirm('Format whole SmartCommerce database and reset milestones?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Copy JSON code payload
  const handleCopyJSON = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const getExportDataString = () => {
    if (activeExportTab === 'products') return products;
    if (activeExportTab === 'orders') return orders;
    if (activeExportTab === 'categories') return categories;
    if (activeExportTab === 'customers') return customers;
    if (activeExportTab === 'coupons') return { 'SMART20': 20, 'SAVEGREEN25': 25, 'WELCOME10': 10 };
    return {};
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col items-center justify-start overflow-x-hidden font-sans select-none relative ${
      isLightMode 
        ? 'bg-[#f3f5f9] text-[#1a202c] selection:bg-indigo-100' 
        : 'bg-[#05060b] text-[#e5f1f4] selection:bg-indigo-500/30'
    }`}>
      
      {/* Background Ambient Glows */}
      {!isLightMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>
        </>
      )}

      {/* CORE PERSISTENT TOP NAVIGATION RESTRICTIONS */}
      <header className={`w-full z-40 transition-all border-b px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 shadow-lg ${
        isLightMode 
          ? 'bg-white border-zinc-200' 
          : 'bg-[#0a0c14]/90 border-[#1f263c]'
      }`}>
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl text-white shadow-md shadow-indigo-500/20">
            <AppWindow className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <h1 className={`text-base font-black tracking-tight flex items-center gap-1.5 font-display ${
              isLightMode ? 'text-zinc-900' : 'text-white'
            }`}>
              SmartCommerce <span className="text-[9.5px] bg-indigo-500/15 text-indigo-500 font-mono px-1.5 py-0.5 rounded font-black font-sans">Ecosystem</span>
            </h1>
            <p className={`text-[10px] leading-none ${isLightMode ? 'text-zinc-500' : 'text-zinc-450'}`}>Modern E-Commerce Portal & Admin Console</p>
          </div>
        </div>

        {/* Dynamic Dual-Tab Workspace View Toggle */}
        <div className={`p-1 rounded-2xl border flex gap-1 ${
          isLightMode ? 'bg-[#f0f2f5] border-zinc-200' : 'bg-[#121626] border-[#1e2338]'
        }`}>
          <button
            onClick={() => setViewMode('customer')}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition duration-200 flex items-center gap-1.5 ${
              viewMode === 'customer'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                : isLightMode ? 'text-zinc-500 hover:text-zinc-900' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <AppWindow className="w-3.5 h-3.5" /> Customer Mobile App
          </button>
          
          <button
            onClick={() => setViewMode('admin')}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition duration-200 flex items-center gap-1.5 ${
              viewMode === 'admin'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                : isLightMode ? 'text-zinc-500 hover:text-zinc-900' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Admin Portal
          </button>
        </div>

        {/* Source Exporter and Theme Swapper */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className={`p-2.5 rounded-xl border transition ${
              isLightMode 
                ? 'bg-[#f0f2f5] border-zinc-200 text-zinc-600 hover:bg-zinc-200' 
                : 'bg-[#121626] border-[#1e2338] text-zinc-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Toggle Theme"
          >
            {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-yellow-400" />}
          </button>

          <button
            onClick={() => setShowExporter(!showExporter)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              showExporter 
                ? 'bg-indigo-600 text-white border-transparent' 
                : isLightMode 
                  ? 'bg-[#f0f2f5] border-zinc-200 text-zinc-700 hover:bg-zinc-250' 
                  : 'bg-[#121626] border-[#1e2338] text-zinc-300 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Source Exporter
          </button>
        </div>
      </header>

      {/* DYNAMIC EXPANDABLE SOURCE EXPORTER HUB */}
      {showExporter && (
        <div className={`w-full px-6 py-5 border-b text-left ${
          isLightMode ? 'bg-[#fbfcff] border-zinc-200' : 'bg-[#0b0d16] border-[#1f263c]'
        }`}>
          <div className="max-w-7xl mx-auto flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div>
                <h3 className={`text-xs font-black uppercase tracking-wider font-display ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
                  Dynamic JSON Schema Exporter Panel
                </h3>
                <p className="text-[10px] text-zinc-500 font-sans mt-0.5">Capture real-time database state objects modified inside the customer login or admin console.</p>
              </div>

              <button
                onClick={() => handleCopyJSON(getExportDataString())}
                className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-[11px] font-black tracking-tight hover:from-blue-500 hover:to-indigo-500 transition flex items-center gap-1 shadow active:scale-95"
              >
                {hasCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopied ? 'COPIED TO CLIPBOARD!' : 'COPY CURRENT SCHEMA'}
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto">
              {(['products', 'orders', 'categories', 'coupons', 'customers'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveExportTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition ${
                    activeExportTab === tab
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : isLightMode 
                        ? 'bg-zinc-100 hover:bg-zinc-250 border border-transparent text-zinc-600' 
                        : 'bg-zinc-900/40 hover:bg-zinc-850 border border-transparent text-zinc-400'
                  }`}
                >
                  {tab} state database
                </button>
              ))}
            </div>

            <div className="relative rounded-xl overflow-hidden border border-white/5 bg-[#030407] p-4 text-xs font-mono select-text selection:bg-indigo-500/30 shadow-inner">
              <pre className="max-h-52 overflow-y-auto phone-scroll text-green-400 leading-normal text-[10.5px]">
                {JSON.stringify(getExportDataString(), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* CORE RETAIL WORKSPACE */}
      <main className="w-full max-w-7xl flex flex-col justify-start flex-grow p-4 md:p-6 lg:py-8 z-10 transition-all">
              {/* RENDER CASE A: COMPREHENSIVE BEAUTIFUL CUSTOMER APP PORTAL (CUSTOMER MODE) */}
        {viewMode === 'customer' ? (
          <div className="max-w-[410px] mx-auto w-full h-[810px] border border-slate-900/70 rounded-[36px] overflow-hidden shadow-2xl relative shrink-0 text-left bg-[#05060b] outline outline-8 outline-[#1e2338]/30">
            <ECommerceApp
              products={products}
              settings={settings}
              cart={cart}
              wishlist={wishlist}
              orders={orders}
              customers={customers}
              onUpdateCart={setCart}
              onUpdateWishlist={setWishlist}
              onUpdateOrders={setOrders}
              onUpdateSettings={(updates) => setSettings(prev => ({ ...prev, ...updates }))}
              onUpdateCustomers={setCustomers}
              onAddNotification={handleAddNotification}
              onAddFile={(newFile) => setFiles(prev => [newFile, ...prev])}
              onIncrementPoints={(pts) => setSettings(p => ({ ...p, rewardPoints: p.rewardPoints + pts }))}
              onUpdateProducts={setProducts}
            />
          </div>
        ) : (
          /* RENDER CASE B: GORGEOUS FULL-SCREEN RESPONSIVE DESKTOP ADMIN DASHBOARD */
          <div className="w-full h-[720px] border border-[#232d3f] rounded-3xl overflow-hidden shadow-2xl relative shrink-0 text-left">
            <AdminPanelApp
              onClose={() => setViewMode('customer')}
              products={products}
              orders={orders}
              customers={customers}
              categories={categories}
              onUpdateProducts={setProducts}
              onUpdateOrders={setOrders}
              onUpdateCustomers={setCustomers}
              onUpdateCategories={setCategories}
            />
          </div>
        )}

      </main>

      {/* FOOTER ROW */}
      <footer className="w-full text-center py-6 mt-auto border-t border-[#1f263c]/30">
        <p className="text-[10.5px] font-semibold text-zinc-500 uppercase tracking-widest leading-none">
          SmartCommerce &bull; Corporate presentation suite &bull; &copy; 2026
        </p>
      </footer>
    </div>
  );
}
