import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Star, Heart, ShoppingCart, SlidersHorizontal, ArrowLeft, Minus, Plus,
  Trash2, CheckCircle, CreditCard, Radio, RotateCcw, Mic, Leaf,
  ChevronRight, Sparkles, Camera, LogOut, User, Mail, Lock, MapPin, 
  Bot, Clock, ShoppingBag, ShieldCheck, Send, Info, Award, MessageCircle
} from 'lucide-react';
import { Product, CartItem, Address, Order, PhoneSettings, FileDocument, Customer } from '../types';
import { COUPON_CODES, LIVE_STREAM_MESSAGES } from '../data';

interface ECommerceProps {
  products: Product[];
  settings: PhoneSettings;
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  customers: Customer[];
  onUpdateCart: (updated: CartItem[]) => void;
  onUpdateWishlist: (updated: Product[]) => void;
  onUpdateOrders: (updated: Order[]) => void;
  onUpdateSettings: (updates: Partial<PhoneSettings>) => void;
  onUpdateCustomers: (updatedCustomers: Customer[]) => void;
  onAddNotification: (title: string, body: string, app: string) => void;
  onAddFile?: (file: FileDocument) => void;
  onAddScreenshot?: (url: string, title: string) => void;
  onIncrementPoints: (pts: number) => void;
  onUpdateProducts?: (updatedProducts: Product[]) => void;
}

export const ECommerceApp: React.FC<ECommerceProps> = ({
  products,
  settings,
  cart,
  wishlist,
  orders,
  customers,
  onUpdateCart,
  onUpdateWishlist,
  onUpdateOrders,
  onUpdateSettings,
  onUpdateCustomers,
  onAddNotification,
  onAddFile,
  onAddScreenshot,
  onIncrementPoints,
  onUpdateProducts
}) => {
  // --- AUTH STATES & ACCOUNTS SESSIONS ---
  const [currentUser, setCurrentUser] = useState<Customer | null>(() => {
    const saved = localStorage.getItem('sim_logged_user');
    if (saved) return JSON.parse(saved);
    return null;
  });

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up inputs
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpStreet, setSignUpStreet] = useState('');
  const [signUpCity, setSignUpCity] = useState('');
  const [signUpZip, setSignUpZip] = useState('');
  const [signUpAvatarSeed, setSignUpAvatarSeed] = useState('Krishang');

  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Navigation tabs
  // tab options: 'catalog' | 'search' | 'cart' | 'chatbot' | 'orders' | 'profile' | 'details' | 'checkout'
  const [activeTab, setActiveTab] = useState<'catalog' | 'search' | 'cart' | 'chatbot' | 'orders' | 'profile' | 'details' | 'checkout'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search, voice, and filtering configs
  const [searchQuery, setSearchQuery] = useState('');
  const [voicesearchActive, setVoicesearchActive] = useState(false);
  const [voicesearchQuery, setVoicesearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'best' | 'price-asc' | 'price-desc' | 'eco'>('best');
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Product specs custom configuration
  const [zoomLevel, setZoomLevel] = useState<1 | 2>(1);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(180);
  const [detailColor, setDetailColor] = useState('Default');
  const [detailSize, setDetailSize] = useState('M');

  // Customer Reviews inputs
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number>(0); // 0 means All
  const [newReviewStars, setNewReviewStars] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState<string>('');

  // Cart, payment, checkout states
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // savings %
  const [addressFullName, setAddressFullName] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressZip, setAddressZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  
  // Real layout asking data inputs
  const [addressPhone, setAddressPhone] = useState('');
  const [addressEmail, setAddressEmail] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressLandmark, setAddressLandmark] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1); // 1 = Address details, 2 = Pay & Confirm
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [qrCodeTimer, setQrCodeTimer] = useState<number>(300); // 5 mins counter
  const [paymentVerified, setPaymentVerified] = useState<boolean>(false);
  const [scanningUpi, setScanningUpi] = useState<boolean>(false);
  
  // Simulated Card Payment form inputs
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // AI Assistant Chatbot state variables
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; isMock?: boolean }>>([
    { sender: 'ai', text: '👋 Hi! I\'m Sora, your Smart Shopper AI.\n\nAsk me about specs, compare products, or seek eco-friendly items in our catalog (like modular phones or bio-algae sneakers!). What can I guide you with today?' }
  ]);
  const chatThreadEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chatbot stream
  useEffect(() => {
    if (activeTab === 'chatbot') {
      chatThreadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatLoading, activeTab]);

  // Sync auth address inputs once logged in
  useEffect(() => {
    if (currentUser) {
      // Sync address states
      setAddressFullName(currentUser.name);
      setAddressEmail(currentUser.email);
      // Retrieve registered profile defaults
      const savedStreet = localStorage.getItem(`addr_street_${currentUser.id}`) || '1402 Silicon Heights, Innovation Dr';
      const savedCity = localStorage.getItem(`addr_city_${currentUser.id}`) || 'Sunnyvale';
      const savedZip = localStorage.getItem(`addr_zip_${currentUser.id}`) || '94089';
      const savedPhone = localStorage.getItem(`addr_phone_${currentUser.id}`) || '+1 (555) 019-2831';
      const savedState = localStorage.getItem(`addr_state_${currentUser.id}`) || 'CA';
      const savedLandmark = localStorage.getItem(`addr_landmark_${currentUser.id}`) || 'Opposite Green Spark Tech Park';
      setAddressStreet(savedStreet);
      setAddressCity(savedCity);
      setAddressZip(savedZip);
      setAddressPhone(savedPhone);
      setAddressState(savedState);
      setAddressLandmark(savedLandmark);
    }
  }, [currentUser]);

  // Live countdown timer for the UPI QR Code
  useEffect(() => {
    let interval: any;
    if (activeTab === 'checkout' && checkoutStep === 2 && paymentMethod === 'upi' && !paymentVerified) {
      interval = setInterval(() => {
        setQrCodeTimer(prev => (prev > 1 ? prev - 1 : 300));
      }, 1000);
    } else {
      setQrCodeTimer(300);
    }
    return () => clearInterval(interval);
  }, [activeTab, checkoutStep, paymentMethod, paymentVerified]);

  // Reset detail sub-options when product is switched
  useEffect(() => {
    if (selectedProduct) {
      setDetailColor('Default');
      setDetailSize('M');
      setReviewRatingFilter(0);
      setNewReviewComment('');
      setNewReviewStars(5);
      setReviewSubmitSuccess('');
    }
  }, [selectedProduct]);

  // Handle Demo 1-Click login or state restorations
  const handleDemoSignIn = (emailSelected: string) => {
    // Check if customer exists
    const matchingCust = customers.find(c => c.email.toLowerCase() === emailSelected.toLowerCase());
    if (matchingCust) {
      const loggedIn: Customer = { ...matchingCust, status: 'active' };
      setCurrentUser(loggedIn);
      localStorage.setItem('sim_logged_user', JSON.stringify(loggedIn));
      // Update shared layout state
      onUpdateSettings({
        userName: loggedIn.name,
        userEmail: loggedIn.email,
        userAvatar: loggedIn.avatar
      });
      onAddNotification('Welcome Back!', `Logged in successfully as ${loggedIn.name}`, 'Account');
      onIncrementPoints(20);
      setAuthError('');
      setAuthSuccess('Logged in successfully!');
    } else {
      // Create it under demo defaults
      const newDemo: Customer = {
        id: `demo-${Date.now()}`,
        name: 'Krishang Pinash',
        email: emailSelected,
        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=Krishang`,
        status: 'active',
        registerDate: new Date().toLocaleDateString(),
        purchaseCount: 0,
        spent: 0
      };
      onUpdateCustomers([newDemo, ...customers]);
      setCurrentUser(newDemo);
      localStorage.setItem('sim_logged_user', JSON.stringify(newDemo));
      onUpdateSettings({
        userName: newDemo.name,
        userEmail: newDemo.email,
        userAvatar: newDemo.avatar
      });
      onAddNotification('Account Created', 'Initialized demo account with Krishang Pinash.', 'Account');
      onIncrementPoints(50);
      setAuthError('');
    }
  };

  // Signup form submit handler
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setAuthError('Please fill out all required name, email and password fields.');
      return;
    }

    if (!signUpEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    // Check conflict
    const conflict = customers.find(c => c.email.toLowerCase() === signUpEmail.toLowerCase());
    if (conflict) {
      setAuthError('This email is already registered. Please sign in instead.');
      return;
    }

    // Create Customer profile
    const avatarURL = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${signUpAvatarSeed || signUpName}`;
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: signUpName.trim(),
      email: signUpEmail.trim().toLowerCase(),
      avatar: avatarURL,
      status: 'active',
      registerDate: new Date().toLocaleDateString(),
      purchaseCount: 0,
      spent: 0
    };

    // Store secure mock lock variables in localStorage
    localStorage.setItem(`pwd_${newCust.email}`, signUpPassword.trim());
    localStorage.setItem(`addr_street_${newCust.id}`, signUpStreet.trim() || '1402 Silicon Heights, Innovation Dr');
    localStorage.setItem(`addr_city_${newCust.id}`, signUpCity.trim() || 'Sunnyvale');
    localStorage.setItem(`addr_zip_${newCust.id}`, signUpZip.trim() || '94089');

    // Update parent databases
    const updatedCustList = [newCust, ...customers];
    onUpdateCustomers(updatedCustList);

    // Dynamic sign-in
    setCurrentUser(newCust);
    localStorage.setItem('sim_logged_user', JSON.stringify(newCust));
    onUpdateSettings({
      userName: newCust.name,
      userEmail: newCust.email,
      userAvatar: newCust.avatar
    });

    onAddNotification('Registration Successful 🎉', `Welcome to EcoShop, ${newCust.name}! 100 Reward points added.`, 'EcoShop');
    onIncrementPoints(100);
    setAuthSuccess('Account registered successfully!');
    setActiveTab('catalog');
  };

  // Signin form submit handler
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!signInEmail.trim() || !signInPassword.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }

    // Look for registration
    const matchingCust = customers.find(c => c.email.toLowerCase() === signInEmail.trim().toLowerCase());
    if (!matchingCust) {
      setAuthError('No registered profile matches this email. Check inputs or Sign Up.');
      return;
    }

    // Retrieve saved password mockup (default is "password")
    const correctPwd = localStorage.getItem(`pwd_${matchingCust.email}`) || 'password';
    if (signInPassword.trim() !== correctPwd) {
      setAuthError('Incorrect Password credentials. Please try again.');
      return;
    }

    const loggedIn: Customer = { ...matchingCust, status: 'active' };
    setCurrentUser(loggedIn);
    localStorage.setItem('sim_logged_user', JSON.stringify(loggedIn));
    
    // Sync settings userName
    onUpdateSettings({
      userName: loggedIn.name,
      userEmail: loggedIn.email,
      userAvatar: loggedIn.avatar
    });

    onAddNotification('Sign In Successful', `Welcome back, ${loggedIn.name}!`, 'Account');
    onIncrementPoints(25);
    setAuthSuccess('Logged in successfully!');
    setActiveTab('catalog');
  };

  // Logout routine
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sim_logged_user');
    onAddNotification('Logged Out', 'You have securely signed out of your account session.', 'Account');
    setSignInEmail('');
    setSignInPassword('');
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setAuthError('');
    setAuthSuccess('');
    // Clear user metadata in settings
    onUpdateSettings({
      userName: 'Guest User',
      userEmail: '',
      userAvatar: ''
    });
  };

  // Update profile address credentials
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    localStorage.setItem(`addr_street_${currentUser.id}`, addressStreet);
    localStorage.setItem(`addr_city_${currentUser.id}`, addressCity);
    localStorage.setItem(`addr_zip_${currentUser.id}`, addressZip);

    // Save display attributes to main profile
    const updatedCustomers = customers.map(c => 
      c.id === currentUser.id ? { ...c, name: addressFullName } : c
    );
    onUpdateCustomers(updatedCustomers);
    
    const updatedSession = { ...currentUser, name: addressFullName };
    setCurrentUser(updatedSession);
    localStorage.setItem('sim_logged_user', JSON.stringify(updatedSession));

    onUpdateSettings({ userName: addressFullName });
    onAddNotification('Profile Updated', 'Address credentials and bio metrics synchronized locally.', 'Account');
    
    alert('Billing details updated successfully!');
  };

  // Voice Search Simulation routines
  const startVoiceSearchSimulation = () => {
    setVoicesearchActive(true);
    setVoicesearchQuery('Listening...');
    
    const voicePrompts = [
      'Show me flagship phone',
      'Organic organic hoodie',
      'Sustainable eco products',
      'Barista espresso maker'
    ];
    const picked = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];

    setTimeout(() => {
      setVoicesearchQuery(`"${picked}"`);
    }, 1200);

    setTimeout(() => {
      setVoicesearchActive(false);
      setSearchQuery(picked.replace(/phone|products|maker/g, '').trim());
      if (picked.includes('phone') || picked.includes('Pro')) {
        setSelectedCategory('Electronics');
        setActiveTab('catalog');
      } else if (picked.includes('eco') || picked.includes('sustainable')) {
        setSearchQuery('eco');
        setActiveTab('catalog');
      } else {
        setSelectedCategory('All');
        setActiveTab('catalog');
      }
      onAddNotification('Voice Query Active', `Found results for "${picked}"`, 'Store');
      onIncrementPoints(15);
    }, 2400);
  };

  // Shopping Catalog filtering logic
  const filteredProducts = products.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
    const matchesPrice = p.price <= priceRange;
    return matchesQuery && matchesCategory && matchesBrand && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'eco') return b.ecoScore - a.ecoScore;
    // 'best' rating sort
    return b.rating - a.rating;
  });

  // Unique categories list
  const categoriesList = ['All', 'Electronics', 'Fashion', 'Footwear', 'Accessories', 'Home Appliances'];

  // Add to Shopping Bag Cart
  const handleAddToCart = (prod: Product) => {
    const doubleEntry = cart.find(i => i.product.id === prod.id && i.selectedColor === detailColor && i.selectedSize === detailSize);
    if (doubleEntry) {
      const updated = cart.map(item => {
        if (item.id === doubleEntry.id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      onUpdateCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}`,
        product: prod,
        quantity: 1,
        selectedColor: detailColor,
        selectedSize: detailSize
      };
      onUpdateCart([...cart, newItem]);
    }
    onAddNotification('Cart Updated Bag', `${prod.name} saved to basket.`, 'Cart');
    onIncrementPoints(20);
  };

  // Promo code validation
  const handleApplyPromo = () => {
    const rate = COUPON_CODES[promoCode.toUpperCase().trim()];
    if (rate) {
      setAppliedDiscount(rate);
      onAddNotification('Promo Synchronized', `Applied discount of ${rate}% off successfully!`, 'Cart');
      onIncrementPoints(30);
    } else {
      alert('Invalid coupon code. Try WELCOME10, SAVEGREEN25, or SMART20!');
    }
  };

  // Cost Aggregations
  const subtotal = cart.reduce((tot, item) => {
    const discountRate = item.product.discount;
    const actualPrice = item.product.price * (1 - discountRate / 100);
    return tot + (actualPrice * item.quantity);
  }, 0);

  const discountVal = subtotal * (appliedDiscount / 100);
  const taxVal = (subtotal - discountVal) * 0.08; // 8% VAT
  const shippingVal = subtotal > 150 ? 0 : 15;
  const grandTotal = subtotal - discountVal + taxVal + shippingVal;

  // Checkout pipeline
  const processCheckoutPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Session dead. Please login before paying.');
      return;
    }

    setPaymentProcessing(true);

    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);

      const invoiceID = `INV-${Math.floor(Math.random() * 900000 + 10000) * 11}`;
      const itemizedDesc = cart.map(i => `${i.product.name} x${i.quantity} @ $${i.product.price}`).join('\n');
      
      const invoiceData: FileDocument = {
        id: invoiceID,
        name: `Invoice #${invoiceID}.txt`,
        type: 'invoice',
        size: '12 KB',
        date: new Date().toLocaleDateString(),
        url: '#invoice',
        content: `--- SMARTCOMMERCE TRANSACTION RECEIPT ---
Invoice ID: ${invoiceID}
Customer: ${addressFullName || currentUser.name} (${addressEmail || currentUser.email})
Contact Phone: ${addressPhone || '+1 (555) 019-2831'}
Billing Street: ${addressStreet}${addressLandmark ? ', Landmark: ' + addressLandmark : ''}
City/State/Zip: ${addressCity}, ${addressState || 'CA'} ${addressZip}
Payment Method: ${paymentMethod.toUpperCase()}${paymentMethod === 'upi' ? ` (${upiApp.toUpperCase()}: ${upiId || 'Paid via QR Code'})` : ''}

------ ITEMS PURCHASED ------
${itemizedDesc}

Subtotal: $${subtotal.toFixed(2)}
Coupon Deductions: -$${discountVal.toFixed(2)}
Sales Tax (8%): $${taxVal.toFixed(2)}
Shipping: $${shippingVal.toFixed(2)}
=============================
TOTAL SECURED CHARGED: $${grandTotal.toFixed(2)}

Status: DISPATCHED & LOGGED
Thank you for supporting GOTS certified organic loops!
`
      };

      if (onAddFile) {
        onAddFile(invoiceData);
      }

      // Add a default Address model
      const actualAddress: Address = {
        id: `addr-${Date.now()}`,
        type: 'Home',
        fullName: addressFullName || currentUser.name,
        street: addressStreet + (addressLandmark ? ` (Lmrk: ${addressLandmark})` : ''),
        city: addressCity || 'Sunnyvale',
        state: addressState || 'CA',
        zipCode: addressZip || '94089',
        phone: addressPhone || '+1 (555) 019-2831',
        isDefault: true
      };

      // Create new active order record
      const newOrder: Order = {
        id: invoiceID,
        items: cart,
        subtotal,
        tax: taxVal,
        shipping: shippingVal,
        discount: discountVal,
        total: grandTotal,
        address: actualAddress,
        paymentMethod,
        date: new Date().toLocaleDateString(),
        status: 'placed'
      };

      // Sync customer logs counters
      const updatedCustomers = customers.map(c => {
        if (c.id === currentUser.id) {
          const newSpent = c.spent + grandTotal;
          const newQty = c.purchaseCount + 1;
          return { ...c, spent: newSpent, purchaseCount: newQty };
        }
        return c;
      });
      onUpdateCustomers(updatedCustomers);

      // Save order record
      onUpdateOrders([newOrder, ...orders]);
      onUpdateCart([]); // clear checkouts
      onIncrementPoints(200); // 200 reward points
      onAddNotification('Payment Confirmed 💳', `Order #${invoiceID} placed. Invoice TXT log generated!`, 'EcoShop');
      
      setTrackingOrder(newOrder);
      setActiveTab('orders');
    }, 2000);
  };

  // Screen grabs camera snapping
  const triggerCameraSnap = () => {
    if (!selectedProduct) return;
    if (onAddScreenshot) {
      onAddScreenshot(selectedProduct.image, `Simulated 3D AR View: ${selectedProduct.name}`);
    }
    onAddNotification('Screengrab Capture Created', 'Item catalog snapshot saved to mock file systems.', 'Media');
    onIncrementPoints(40);
    alert('Screengrab captured! Product view saved to system files.');
  };

  // Submit product feedback review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !currentUser) return;

    if (!newReviewComment.trim()) {
      alert('Please fill out a feedback text description.');
      return;
    }

    const reviewId = `rev-${Date.now()}`;
    const newRev = {
      id: reviewId,
      user: currentUser.name,
      rating: newReviewStars,
      date: new Date().toLocaleDateString(),
      comment: newReviewComment.trim()
    };

    const currentRevList = selectedProduct.reviews || [];
    const updatedReviews = [newRev, ...currentRevList];

    // Recalculate average star rating
    const overallSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverage = parseFloat((overallSum / updatedReviews.length).toFixed(1));

    const updatedProductList = products.map(p => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          reviews: updatedReviews,
          rating: newAverage,
          reviewCount: updatedReviews.length
        };
      }
      return p;
    });

    if (onUpdateProducts) {
      onUpdateProducts(updatedProductList);
    }
    
    // Update active focus item
    setSelectedProduct(prev => prev ? {
      ...prev,
      reviews: updatedReviews,
      rating: newAverage,
      reviewCount: updatedReviews.length
    } : null);

    onAddNotification('Feedback Logged', `Submitted a ${newReviewStars}-star review on ${selectedProduct.name}`, 'Review');
    onIncrementPoints(50);
    
    setReviewSubmitSuccess('Thank you! Your verified review has been logged into the catalog database.');
    setNewReviewComment('');
  };

  // Bot ChatGPT mock query or API query
  const handleBotChatSend = async (textToSend: string) => {
    if (!textToSend.trim() || chatLoading) return;

    const userMessage = { sender: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: chatHistory })
      });

      const data = await res.json();
      const aiResponseText = data.text || 'I experienced a connection fluctuation. Please ask about items again!';
      
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponseText, isMock: data.isMock }]);
      onIncrementPoints(15);
    } catch {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: '⚠️ Sora experienced a minor network signal drop. Here is a helpful fallback tip: Code **SMART20** is active and grants **20% OFF** duringcheckout! Alternatively, examine our sustainable organic **AeroStreets Premium Hoodie** ($80, 20% off) of 99% GOTS organic certified cotton.'
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // --- RENDERING ROUTINES ---

  // RENDER AUTH SCREENS
  if (!currentUser) {
    return (
      <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans min-h-[600px] overflow-y-auto phone-scroll text-left" id="ecommerce-auth-panel">
        
        {/* Splash header */}
        <div className="p-6 pb-2 pt-8 flex flex-col items-center text-center">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-3xl text-slate-950 shadow-lg shadow-emerald-500/20 mb-4 animate-bounce duration-[2000ms]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-display font-black text-xl text-white tracking-tight">SmartCommerce</h2>
          <p className="text-[10px] text-emerald-400 font-mono tracking-widest font-black uppercase mt-1">🌿 Circular Eco-Wares</p>
          <span className="text-slate-550 text-[10.5px] mt-2 max-w-[260px] leading-relaxed">
            Sustainable shopping with transparent carbon emission score indexes and direct-to-door delivery.
          </span>
        </div>

        {/* Core Auth Forms */}
        <div className="flex-1 px-5 py-4">
          <div className="flex bg-slate-900/60 p-1 rounded-2xl border border-slate-850 mb-5 text-[11px] font-bold">
            <button
              onClick={() => { setAuthMode('signin'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-xl transition ${authMode === 'signin' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-xl transition ${authMode === 'signup' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-400'}`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[10.5px] leading-normal rounded-xl mb-4 font-mono font-medium">
              ⚠️ {authError}
            </div>
          )}

          {authSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[10.5px] leading-normal rounded-xl mb-4 font-mono font-bold">
              ✅ {authSuccess}
            </div>
          )}

          {authMode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-wider font-bold text-slate-500 font-mono">E-Mail Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g. krishangpinash@gmail.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/60 pl-8.5 pr-3 py-2.5 rounded-xl text-xs focus:outline-none transition text-slate-200 placeholder-slate-600"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-wider font-bold text-slate-500 font-mono">Secret Password</label>
                <div className="relative font-mono">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/60 pl-8.5 pr-3 py-2.5 rounded-xl text-xs focus:outline-none transition text-slate-200 placeholder-slate-600"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 text-slate-905 font-black hover:bg-emerald-400 rounded-2xl text-xs transition mt-2 shadow shadow-emerald-500/10 active:scale-98"
              >
                SECURE SIGN IN
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1.5 phone-scroll">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-wider font-bold text-slate-500 font-mono">Full Customer Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Krishang Pinash"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/60 pl-8.5 pr-3 py-2 rounded-xl text-xs focus:outline-none transition text-slate-200 placeholder-slate-600"
                  />
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-wider font-bold text-slate-500 font-mono">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. krishangpinash@gmail.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/60 pl-8.5 pr-3 py-2 rounded-xl text-xs focus:outline-none transition text-slate-200 placeholder-slate-600"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-wider font-bold text-slate-500 font-mono">Secure Password *</label>
                <div className="relative font-mono">
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/60 pl-8.5 pr-3 py-2 rounded-xl text-xs focus:outline-none transition text-slate-200 placeholder-slate-600"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="border-t border-slate-850/60 my-1 pt-2">
                <span className="text-[9.5px] font-bold text-indigo-400 block mb-1">Pre-fill Destination Address</span>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      placeholder="Street Address (e.g., 1402 Silicon Dr)"
                      value={signUpStreet}
                      onChange={(e) => setSignUpStreet(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs text-slate-200 placeholder-slate-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City (e.g., Sunnyvale)"
                      value={signUpCity}
                      onChange={(e) => setSignUpCity(e.target.value)}
                      className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs text-slate-200 placeholder-slate-600"
                    />
                    <input
                      type="text"
                      placeholder="ZIP (e.g., 94089)"
                      value={signUpZip}
                      onChange={(e) => setSignUpZip(e.target.value)}
                      className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs text-slate-200 placeholder-slate-600"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 rounded-2xl text-xs transition mt-2 shadow active:scale-95"
              >
                CREATE ECO ACCOUNT
              </button>
            </form>
          )}

          {/* Quick Demo log in suggestions */}
          <div className="border-t border-slate-850/60 mt-6 pt-4 flex flex-col gap-2">
            <span className="text-[9.5px] uppercase font-mono tracking-widest text-slate-500 font-bold block">Quick Demo Accounts</span>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleDemoSignIn('krishangpinash@gmail.com')}
                className="py-2 px-3 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-[10.5px] text-zinc-300 rounded-xl transition flex justify-between items-center group text-left"
              >
                <div>
                  <span className="font-extrabold block text-white group-hover:text-emerald-400">Krishang Pinash</span>
                  <span className="text-[8.5px] text-slate-500 font-mono">krishangpinash@gmail.com</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition" />
              </button>

              <button
                onClick={() => handleDemoSignIn('alexrivera@gmail.com')}
                className="py-2 px-3 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-[10.5px] text-zinc-300 rounded-xl transition flex justify-between items-center group text-left"
              >
                <div>
                  <span className="font-extrabold block text-white group-hover:text-emerald-400 font-sans">Alex Rivera (Customer Seed)</span>
                  <span className="text-[8.5px] text-slate-500 font-mono">alexrivera@gmail.com</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SHOPPING VISUAL MODE ONCE VERIFIED ACTIVE
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans relative" id="app-ecommerce">
      
      {/* 1. STORE HEADER STICKY */}
      <div className="bg-[#05060b] p-4.5 border-b border-slate-900/60 sticky top-0 z-20 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-left">
            {activeTab === 'details' && (
              <button 
                onClick={() => { setSelectedProduct(null); setActiveTab('catalog'); }} 
                className="p-1.5 hover:bg-slate-900 rounded-full text-slate-400 hover:text-white transition mr-1"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
            )}
            
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-[#8692a6] uppercase tracking-widest font-black leading-none mb-1">DELIVER TO</span>
              <button 
                onClick={() => { setSelectedProduct(null); setActiveTab('profile'); }}
                className="text-white hover:text-blue-400 font-extrabold text-[13px] tracking-tight leading-tight flex items-center gap-1 transition"
              >
                {currentUser && addressStreet ? (
                  <span className="truncate max-w-[150px]">{addressStreet}, {addressCity}</span>
                ) : (
                  <span>Register Address</span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* AI Assistant chat toggle icon with notification bubble */}
            <button
              onClick={() => { setSelectedProduct(null); setActiveTab('chatbot'); }}
              className={`p-2.5 rounded-xl border transition relative ${
                activeTab === 'chatbot'
                  ? 'bg-blue-650/20 border-blue-500/40 text-blue-400'
                  : 'border-slate-850 bg-slate-900/40 text-slate-400 hover:text-white'
              }`}
              title="Sora AI Assistant"
            >
              <MessageCircle className="w-4.5 h-4.5 text-blue-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-550 border border-slate-950 rounded-full animate-pulse"></span>
            </button>

            {/* Logout controller */}
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl text-[11px] font-black tracking-wider uppercase transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Global Catalog Search controls (Only shown on Catalog tabs) */}
        {activeTab === 'catalog' && (
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search phones, sneakers, jackets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-[#0e111b] border border-slate-850/80 rounded-2xl text-xs focus:outline-none focus:border-blue-500/80 transition text-slate-200 placeholder-slate-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3.5" />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-10 top-3 text-[9px] font-mono font-black text-slate-500 hover:text-emerald-400"
                >
                  CLEAR
                </button>
              ) : null}
              
              <button
                onClick={startVoiceSearchSimulation}
                className={`absolute right-3.5 top-3.5 transition p-0.5 rounded ${voicesearchActive ? 'text-red-500 animate-pulse' : 'text-blue-400 hover:text-blue-300'}`}
                title="Voice Search"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-2xl border flex items-center justify-center transition h-9 w-9 ${showFilters ? 'bg-blue-600 text-white border-transparent' : 'bg-slate-900 border-[#1e2338] text-slate-400 hover:text-white'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Voice active overlay screen */}
      {voicesearchActive && (
        <div className="absolute inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center p-6 text-center text-white backdrop-blur-sm">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center animate-pulse mb-4">
            <Mic className="w-8 h-8 text-emerald-400 animate-bounce" />
          </div>
          <h3 className="text-base font-bold text-white font-display">Mic Shopping Agent</h3>
          <p className="text-slate-400 text-[10.5px] mt-1 max-w-[200px] leading-relaxed">Speak clearly into your device, simulating speech queries.</p>
          <div className="mt-6 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-xs font-mono font-bold text-emerald-400">
            {voicesearchQuery || '"Listening..."'}
          </div>
        </div>
      )}

      {/* 2. CORE WORKSPACE VIEWS STREAM */}
      <div className="flex-grow overflow-y-auto w-full p-4 phone-scroll select-text pb-20">

        {/* CUSTOM CATALOG FILTER BOX */}
        {activeTab === 'catalog' && showFilters && (
          <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl mb-4 text-left flex flex-col gap-3">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[9px] tracking-wider uppercase font-bold text-emerald-400 font-mono">Catalog Filter Matrix</span>
              <button onClick={() => setShowFilters(false)} className="text-[9px] font-bold text-slate-500 hover:text-white uppercase">Close</button>
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between text-[10px] text-slate-400">
                <label className="font-bold">MAX PRICE THRESHOLD</label>
                <span className="font-mono text-emerald-400 font-bold">${priceRange}</span>
              </div>
              <input
                type="range"
                min="30"
                max="2000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5 mt-1 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-500 font-mono">BRAND FILTER</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl text-slate-300 focus:outline-none"
                >
                  <option value="All">All Brands</option>
                  <option value="SmartCommerce">SmartCommerce</option>
                  <option value="AeroStreets">AeroStreets</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setPriceRange(2000);
                  setSelectedCategory('All');
                  setSelectedBrand('All');
                }}
                className="self-end py-2.5 border border-slate-800 text-[9px] font-bold rounded-xl text-slate-400 hover:text-white transition"
              >
                RESET FILTERS
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: SHOP CATALOG FEED */}
        {activeTab === 'catalog' && (
          <div className="flex flex-col gap-5 text-left">
            
            {/* Category horizontal scroller */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black tracking-wider uppercase font-mono text-slate-350">SHOP CATEGORIES</span>
                <button 
                  onClick={() => { setSelectedCategory('All'); setShowFilters(true); }}
                  className="text-[11px] font-black text-blue-400 hover:text-blue-300 transition"
                >
                  View All
                </button>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none phone-scroll">
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-[10.5px] font-black uppercase transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 font-black'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-850'
                    }`}
                  >
                    {cat === 'All' ? 'All items' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Launcher Hero banner in Deep Blue-purple gradient */}
            <div className="p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 border border-indigo-500/20 rounded-3xl flex items-center justify-between shadow-xl relative overflow-hidden">
              {/* Star Background overlay */}
              <div className="absolute right-4 top-2 opacity-15">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <div className="relative z-10 flex flex-col items-start text-left max-w-[85%]">
                <span className="bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/10 font-black px-2.5 py-0.5 rounded-full text-[8.5px] font-mono uppercase tracking-wider mb-2">
                  SPECIAL LAUNCH DISCOUNT
                </span>
                <h4 className="font-display font-black text-sm text-white leading-tight">
                  Super Saver: 20% Discount
                </h4>
                <p className="text-[10px] text-indigo-150 mt-1 leading-normal font-medium">
                  Apply coupon code <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white font-extrabold mx-0.5 border border-white/5">SMART20</span> on bill
                </p>
              </div>
            </div>

            {/* Products catalog listing */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] font-black tracking-wider uppercase font-mono text-slate-350">FEATURED COLLECTION</span>
                
                {/* Micro clean sorted select dropdown aligning with the image */}
                <div className="relative flex items-center gap-1 bg-[#0f111a] hover:bg-slate-900 border border-slate-850 px-2.5 py-1.5 rounded-xl transition cursor-pointer">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-transparent hover:text-white text-blue-400 text-[10.5px] font-black pr-4 focus:outline-none cursor-pointer outline-none font-sans"
                  >
                    <option value="best" className="bg-[#0c0e17] text-white">Best rated</option>
                    <option value="price-asc" className="bg-[#0c0e17] text-white">Price: Low to High</option>
                    <option value="price-desc" className="bg-[#0c0e17] text-white">Price: High to Low</option>
                    <option value="eco" className="bg-[#0c0e17] text-white">Eco Score</option>
                  </select>
                  <span className="absolute right-2.5 text-blue-400 pointer-events-none text-[7.5px]">▼</span>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center rounded-3xl border border-slate-850 p-6 bg-slate-900/20 flex flex-col items-center">
                  <span className="text-xs font-semibold text-slate-500">No matching items found</span>
                  <p className="text-[9px] text-slate-450 mt-1 max-w-[160px]">Try adjusting your price margin values or clearing variables.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3.5 pb-12">
                  {filteredProducts.map(p => {
                    const discounted = p.price * (1 - p.discount / 100);
                    const isWished = wishlist.some(wi => wi.id === p.id);
                    const cardCartQty = cart.filter(item => item.product.id === p.id).reduce((sum, item) => sum + item.quantity, 0);
                    return (
                      <div
                        key={p.id}
                        className="p-3 bg-[#0c0e17] border border-[#1a2035]/90 hover:border-slate-800 rounded-3xl flex flex-col justify-between aspect-[1/1.3] text-left group transition duration-300 relative"
                      >
                        {/* Wishlist toggle heart button overlay */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const alreadyIn = wishlist.some(wi => wi.id === p.id);
                            if (alreadyIn) {
                              onUpdateWishlist(wishlist.filter(wi => wi.id !== p.id));
                              onAddNotification('Wishlist Modified', `Removed ${p.name} from saved list.`, 'Wish');
                            } else {
                              onUpdateWishlist([...wishlist, p]);
                              onAddNotification('Wishlist Saved', `Saved ${p.name} to wishlist list.`, 'Wish');
                            }
                          }}
                          className="absolute top-4.5 right-4.5 bg-slate-950/50 hover:bg-slate-950/80 p-1.5 rounded-full z-10 transition duration-200 shadow-sm border border-white/5"
                        >
                          <Heart 
                            className={`w-3.5 h-3.5 transition-transform active:scale-90 ${
                              isWished 
                                ? 'fill-[#ef4444] text-[#ef4444]' 
                                : 'text-slate-205 z-10'
                            }`} 
                          />
                        </button>

                        <div 
                          className="flex-1 flex flex-col justify-between h-full cursor-pointer"
                          onClick={() => { setSelectedProduct(p); setActiveTab('details'); }}
                        >
                          <div className="h-[55%] w-full rounded-2xl bg-slate-950 overflow-hidden relative mb-2.5">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-102 transition duration-300" 
                            />
                            {cardCartQty > 0 && (
                              <span className="absolute top-2 left-2 bg-blue-600 text-white font-mono font-black text-[7.5px] px-1.5 py-0.5 rounded uppercase tracking-wider shadow flex items-center gap-1 z-10">
                                🛒 {cardCartQty} IN CART
                              </span>
                            )}
                            {p.discount > 0 ? (
                              <span className="absolute bottom-2 left-2 bg-[#10b981] text-[#05060b] font-mono font-black text-[7.5px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                                OFFER
                              </span>
                            ) : p.ecoScore >= 95 ? (
                              <span className="absolute bottom-2 left-2 bg-[#10b981]/90 text-slate-950 font-black text-[7.5px] px-1.5 py-0.5 rounded flex items-center gap-0.5 font-mono uppercase">
                                🌱 ECO {p.ecoScore}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-500 font-mono leading-none">{p.brand}</span>
                              <h5 className="font-bold text-[11.5px] text-white line-clamp-1 truncate mt-0.5 leading-snug">{p.name}</h5>
                            </div>

                            <div>
                              <div className="flex justify-between items-baseline mt-1">
                                <span className="text-xs font-black text-[#f3f4f6] font-mono">
                                  ${discounted.toFixed(0)}
                                  {p.discount > 0 && <span className="text-[9px] text-[#8692a6] line-through ml-1.5 font-normal font-sans">${p.price}</span>}
                                </span>
                              </div>

                              <div className="flex justify-between items-center mt-1.5 border-t border-slate-900/30 pt-1">
                                <span className="text-[9.5px] font-black text-yellow-500 flex items-center gap-0.5 leading-none">
                                  ⭐ {p.rating}
                                </span>
                                <span className="text-[9.5px] text-slate-450 font-mono font-black leading-none">
                                  {p.stock} left
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: PRODUCT DETAILS (WITH ROTATOR & COMPREHENSIVE STAR REVIEWS SUBMITS) */}
        {activeTab === 'details' && selectedProduct && (
          <div className="flex flex-col gap-4 text-left">
            
            {/* 360 Rotator representation block */}
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-3xl relative overflow-hidden flex flex-col">
              <span className="absolute top-3 left-3 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase flex items-center gap-1">
                <RotateCcw className="w-3 h-3 animate-spin duration-3000" /> 360° Sandbox Frame
              </span>

              <button
                onClick={triggerCameraSnap}
                className="absolute top-3 right-3 p-1.5 bg-slate-950 border border-slate-800 hover:border-slate-500 rounded-xl text-slate-400 hover:text-white transition"
                title="Capture HD snapshot"
              >
                <Camera className="w-4 h-4" />
              </button>

              <div className="w-full h-40 flex items-center justify-center my-2 select-none">
                <img
                  src={selectedProduct.image}
                  referrerPolicy="no-referrer"
                  style={{
                    transform: `rotateY(${rotationAngle}deg) scale(${zoomLevel})`,
                    filter: isRotating ? 'hue-rotate(20deg) saturate(1.1)' : 'none'
                  }}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full rounded-2xl object-cover shadow-2xl transition-transform duration-100"
                />
              </div>

              {/* Angle rotation adjust sliders */}
              <div className="flex flex-col gap-1 font-mono text-[9px] text-slate-500">
                <div className="flex justify-between">
                  <span>CAMERA ANGLE: {rotationAngle}°</span>
                  <div className="flex gap-2.5">
                    <button onClick={() => setZoomLevel(zoomLevel === 1 ? 2 : 1)} className="hover:text-emerald-400">ZOOM {zoomLevel}X</button>
                    <button onClick={() => setRotationAngle(180)} className="hover:text-emerald-400">RESET</button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(parseInt(e.target.value))}
                  onMouseDown={() => setIsRotating(true)}
                  onMouseUp={() => setIsRotating(false)}
                  className="w-full h-1 bg-slate-850 accent-emerald-500 rounded-lg cursor-pointer mt-1"
                />
              </div>
            </div>

            {/* Title & Brand */}
            <div className="flex flex-col gap-1">
              <span className="text-[8.5px] font-mono uppercase tracking-widest text-slate-500">{selectedProduct.brand} • {selectedProduct.category}</span>
              <h3 className="font-display font-extrabold text-base text-white leading-tight">{selectedProduct.name}</h3>
              
              <div className="flex items-center gap-3.5 text-xs text-slate-400 mt-1">
                <span className="text-emerald-400 font-extrabold text-sm font-mono">
                  ${(selectedProduct.price * (1 - selectedProduct.discount / 100)).toFixed(0)}
                  {selectedProduct.discount > 0 && <span className="text-[10px] text-slate-600 line-through ml-1.5">${selectedProduct.price}</span>}
                </span>
                <span>|</span>
                <span className="flex items-center gap-1 font-semibold text-[11px]">
                  ⭐ {selectedProduct.rating} ({selectedProduct.reviewCount} total reviews)
                </span>
                <span>|</span>
                <span className="font-mono text-emerald-500 font-extrabold text-[10.5px]">♻️ ECO {selectedProduct.ecoScore}</span>
              </div>
            </div>

            {/* Carbon Offset statement */}
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <span className="text-[9px] font-mono tracking-wider font-extrabold text-emerald-400 block uppercase">Planetary Scorecard</span>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                  Circular synthesis limits emission rates, carbon offset yields save **{selectedProduct.carbonSaved} kg of CO2**.
                </p>
              </div>
              <span className="text-sm shrink-0 bg-emerald-500/10 h-8 w-8 rounded-full flex items-center justify-center border border-emerald-500/25">🌱</span>
            </div>

            {/* Config selectors */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-1">
              <div className="flex flex-col gap-1.5 text-left">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 font-mono">Select Color Colorway</span>
                <div className="flex gap-1.5">
                  {['Default', 'Cyber Green', 'Titan Gray'].map(c => (
                    <button
                      key={c}
                      onClick={() => setDetailColor(c)}
                      className={`px-2 py-1 text-[9px] font-bold border rounded-lg transition ${detailColor === c ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-black' : 'border-slate-800 text-slate-400 hover:border-slate-600'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 font-mono">Select Unit Spec</span>
                <div className="flex gap-1.5">
                  {['S', 'M', 'L'].map(s => (
                    <button
                      key={s}
                      onClick={() => setDetailSize(s)}
                      className={`w-7 h-7 flex items-center justify-center text-[9px] font-bold border rounded-lg transition ${detailSize === s ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-black' : 'border-slate-800 text-slate-400 hover:border-slate-600'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Spec lines */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 font-mono">TECHNICAL SPECIFICATIONS</span>
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-3 flex flex-col gap-1.5 font-mono text-[9.5px]">
                {Object.entries(selectedProduct.specs || {}).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-slate-850/40 pb-1 last:border-0 last:pb-0">
                    <span className="text-slate-500 font-bold uppercase">{k}:</span>
                    <span className="text-slate-350 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-900 pt-3">{selectedProduct.description}</p>

            {/* REVIEWS HUB SECTION WITH FILTERS & FORM */}
            <div className="border-t border-slate-900 pt-4 flex flex-col gap-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono flex justify-between items-center">
                <span>Verified Customer Product Reviews</span>
                <span className="text-indigo-400">({selectedProduct.reviews?.length || 0})</span>
              </h4>

              {/* Star review filter bar */}
              <div className="flex gap-1.5 overflow-x-auto pb-1.5">
                <button
                  onClick={() => setReviewRatingFilter(0)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-bold font-mono transition ${reviewRatingFilter === 0 ? 'bg-indigo-500 text-white' : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-white'}`}
                >
                  ALL
                </button>
                {[5, 4, 3, 2, 1].map(starsVal => (
                  <button
                    key={starsVal}
                    onClick={() => setReviewRatingFilter(starsVal)}
                    className={`px-2 py-1 rounded-lg text-[9px] font-bold font-mono whitespace-nowrap transition flex items-center gap-0.5 ${reviewRatingFilter === starsVal ? 'bg-indigo-500 text-white' : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-white'}`}
                  >
                    {starsVal} ⭐
                  </button>
                ))}
              </div>

              {/* Submit feedback text area form */}
              <form onSubmit={handleReviewSubmit} className="bg-slate-900/60 p-3.5 border border-slate-850 rounded-2xl flex flex-col gap-3">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-400 font-mono">Submit Verified Sentiment Review</span>
                
                {reviewSubmitSuccess && (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 p-2 border border-emerald-500/20 rounded-lg">✓ {reviewSubmitSuccess}</span>
                )}

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold text-[10.5px]">Award Star Rating:</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setNewReviewStars(st)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star className={`w-4 h-4 ${st <= newReviewStars ? 'text-emerald-400 fill-emerald-400' : 'text-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-0.5">
                  <textarea
                    placeholder="Enter item feedback comment here... rating logs award 50 bonus reward points!"
                    required
                    rows={2}
                    value={newReviewComment}
                    onChange={(e) => { setNewReviewComment(e.target.value); setReviewSubmitSuccess(''); }}
                    className="bg-slate-950 border border-slate-800 focus:border-emerald-500/60 p-2.5 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-[10px] font-black tracking-tight transition"
                >
                  PUBLISH REVIEW FEEDBACK (+50 Points)
                </button>
              </form>

              {/* Render review cards list */}
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto phone-scroll pr-1">
                {(selectedProduct.reviews || []).length === 0 ? (
                  <span className="text-[10.5px] text-slate-600 italic py-2">No customer comments published for this item yet. Be the first to share!</span>
                ) : (
                  (selectedProduct.reviews || [])
                    .filter(r => reviewRatingFilter === 0 || r.rating === reviewRatingFilter)
                    .map(r => (
                      <div key={r.id} className="p-3 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col gap-1.5 text-xs text-left">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-extrabold text-white">{r.user}</span>
                          <span className="text-slate-500 pr-1">{r.date}</span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star 
                              key={index} 
                              className={`w-3 h-3 ${index < r.rating ? 'text-emerald-400 fill-emerald-400' : 'text-slate-800'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-slate-450 leading-relaxed text-[11px] mt-0.5">{r.comment}</p>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* ADD TO BASKET PRIMARY ACTION BUTTON */}
            <div className="sticky bottom-0 bg-slate-950 border-t border-slate-900 p-2 mt-4 z-10 flex gap-2 w-full">
              <button
                onClick={() => {
                  if (wishlist.some(p => p.id === selectedProduct.id)) {
                    onUpdateWishlist(wishlist.filter(p => p.id !== selectedProduct.id));
                    onAddNotification('Wishlist Modified', 'Removed item from saved list.', 'Wish');
                  } else {
                    onUpdateWishlist([...wishlist, selectedProduct]);
                    onAddNotification('Wishlist Updated', 'Saved item to your wishlist list.', 'Wish');
                  }
                }}
                className={`p-3 border rounded-2xl transition ${wishlist.some(p => p.id === selectedProduct.id) ? 'border-red-500/50 bg-red-400/5 text-red-400' : 'border-slate-800 text-slate-500 hover:text-white'}`}
              >
                <Heart className={`w-4 h-4 ${wishlist.some(p => p.id === selectedProduct.id) ? 'fill-red-500' : ''}`} />
              </button>

              {(() => {
                const detailCartQty = cart.filter(item => item.product.id === selectedProduct.id).reduce((sum, item) => sum + item.quantity, 0);
                return (
                  <button
                    onClick={() => handleAddToCart(selectedProduct)}
                    disabled={selectedProduct.stock === 0}
                    className={`flex-1 py-3 font-black tracking-tight rounded-2xl text-xs transition flex justify-center items-center gap-1.5 shadow ${detailCartQty > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'}`}
                  >
                    <ShoppingCart className="w-4 h-4" /> 
                    {selectedProduct.stock === 0 ? 'SOLD OUT' : detailCartQty > 0 ? `ADDED (${detailCartQty} IN BASKET)` : 'ADD TO BASKET BAG'}
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 2: SHOPPING CART */}
        {activeTab === 'cart' && (
          <div className="p-1 flex flex-col gap-4 text-left">
            <h3 className="text-xs font-bold uppercase text-slate-500 font-mono tracking-wider flex justify-between items-center">
              <span>Your Shopping Cart Basket</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">({cart.length} unique)</span>
            </h3>

            {cart.length === 0 ? (
              <div className="py-16 text-center border border-slate-900 rounded-3xl p-6 bg-slate-900/10 flex flex-col items-center">
                <ShoppingCart className="w-10 h-10 text-emerald-400/20 mb-3 animate-pulse" />
                <span className="text-xs font-semibold text-slate-400">Basket is empty</span>
                <p className="text-[10px] text-slate-550 mt-1 max-w-[200px] leading-relaxed">
                  Head over to the Catalog list or use Sora AI shopper bot tab to discover high-fidelity circular wearables.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="mt-5 px-4 py-2 bg-slate-900 hover:bg-slate-850 text-[10px] font-black tracking-wide uppercase text-slate-300 rounded-xl transition border border-slate-800"
                >
                  BROWSE STORE DEALS
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pb-6">
                
                {/* Cart Row */}
                {cart.map(item => {
                  const itemPrice = item.product.price * (1 - item.product.discount / 100);
                  return (
                    <div key={item.id} className="p-3 bg-slate-905 border border-slate-900 hover:border-slate-850 rounded-2xl flex items-center justify-between gap-3 text-xs transition">
                      <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-xl object-cover" />
                      
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-white truncate text-[11.5px] font-display">{item.product.name}</h4>
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block tracking-wider mt-0.5">
                          COLOR: {item.selectedColor} • spec: {item.selectedSize}
                        </span>
                        <div className="text-[10px] text-emerald-400 font-mono font-black mt-1">
                          ${itemPrice.toFixed(0)} 
                          {item.product.discount > 0 && <span className="text-[8px] text-slate-650 font-normal line-through ml-1">${item.product.price}</span>}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          onClick={() => onUpdateCart(cart.filter(c => c.id !== item.id))}
                          className="text-slate-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Adjust quantities */}
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-full px-1.5 py-0.5 select-none">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                onUpdateCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity - 1 } : c));
                              } else {
                                onUpdateCart(cart.filter(c => c.id !== item.id));
                              }
                            }}
                            className="p-0.5 text-slate-500 hover:text-white"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-[9.5px] font-mono text-slate-200 px-1 font-bold">{item.quantity}</span>
                          <button
                            onClick={() => {
                              if (item.quantity < item.product.stock) {
                                onUpdateCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
                              } else {
                                alert(`Only ${item.product.stock} catalog units in database.`);
                              }
                            }}
                            className="p-0.5 text-slate-500 hover:text-white"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Subtotals listing */}
                <div className="border-t border-slate-900 pt-3 flex flex-col gap-2 font-mono text-[9.5px] text-slate-450 text-left">
                  <div className="flex justify-between">
                    <span>ITEMS SUBTOTAL:</span>
                    <span className="text-white font-bold">${subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SALES TAX (VAT 8%):</span>
                    <span className="text-white font-bold">${taxVal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DISPATCH express SHIPPING:</span>
                    <span className="text-white font-bold">{shippingVal === 0 ? 'FREE' : `$${shippingVal}`}</span>
                  </div>
                  
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>APPLIED VOUCHER DEDUCTION (-{appliedDiscount}%):</span>
                      <span className="font-extrabold">-${discountVal.toFixed(0)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-850 pt-2 flex justify-between font-sans text-xs text-left">
                    <span className="font-extrabold text-white">GRAND ESTIMATED COST:</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">${grandTotal.toFixed(0)}</span>
                  </div>
                </div>

                {/* Coupon applying */}
                <div className="bg-slate-900 border border-slate-850/70 rounded-2xl p-3 mt-1.5 text-xs flex flex-col gap-2">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-450 font-mono">Apply Coupon Voucher</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="WELCOME10, SMART20 etc."
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:outline-none focus:border-indigo-500 text-xs px-2.5 py-1.5 rounded-xl uppercase font-mono text-white placeholder-slate-650"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10.5px] font-black text-emerald-400 rounded-xl"
                    >
                      APPLY
                    </button>
                  </div>
                  {appliedDiscount > 0 && (
                    <span className="text-[9px] text-emerald-400 font-mono font-bold">✓ Coupon code registered: {appliedDiscount}% savings activated!</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setPaymentSuccess(null);
                    setCardHolder(currentUser.name);
                    setCardNumber('');
                    setCardExpiry('');
                    setCardCvv('');
                    setCheckoutStep(1); // Reset to address details step
                    setPaymentVerified(false);
                    setQrCodeTimer(300);
                    setActiveTab('checkout');
                  }}
                  className="mt-3 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black tracking-tight text-xs rounded-2xl text-center shadow transition active:scale-98 uppercase"
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: SECURE CHECKOUT FORMS WITH ROTATING CARD COMPONENTS */}
        {activeTab === 'checkout' && (
          <div className="p-1 flex flex-col gap-4 text-left">
            
            {/* Steps indicator */}
            <div className="flex items-center justify-between bg-[#0e111b] border border-slate-850 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${checkoutStep === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white font-black'}`}>
                  {checkoutStep === 1 ? '1' : '✓'}
                </div>
                <div className="flex flex-col text-left">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${checkoutStep === 1 ? 'text-white' : 'text-slate-400'}`}>Dispatch Info</span>
                  <span className="text-[8px] text-slate-500 font-mono">Step 1 of 2</span>
                </div>
              </div>
              <div className="h-[1px] flex-1 bg-slate-800 mx-3"></div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${checkoutStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                  2
                </div>
                <div className="flex flex-col text-left">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${checkoutStep === 2 ? 'text-white' : 'text-slate-500'}`}>Pay & Confirm</span>
                  <span className="text-[8px] text-slate-600 font-mono">Step 2 of 2</span>
                </div>
              </div>
            </div>

            {/* STEP 1: REALISTIC DELIVERY ASKING DATA */}
            {checkoutStep === 1 ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!addressFullName || !addressPhone || !addressStreet || !addressCity || !addressZip) {
                    alert('Please complete all required fields.');
                    return;
                  }
                  setCheckoutStep(2);
                }} 
                className="flex flex-col gap-3.5"
              >
                <div className="bg-slate-900 border border-slate-850/70 p-4 rounded-2xl flex flex-col gap-3 text-xs text-left">
                  <span className="text-[9px] font-mono tracking-wider font-extrabold text-slate-400 block uppercase">🏡 Delivery Contact & Destination</span>
                  
                  {/* Recipient Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] text-slate-405 font-bold uppercase tracking-wide">Recipient Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Krishang Pinash"
                      required
                      value={addressFullName}
                      onChange={(e) => setAddressFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Contact Phone & Email */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] text-slate-405 font-bold uppercase tracking-wide">Contact Phone *</label>
                      <input
                        type="tel"
                        placeholder="e.g. +1 (555) 019-2831"
                        required
                        value={addressPhone}
                        onChange={(e) => setAddressPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] text-slate-405 font-bold uppercase tracking-wide">Delivery Email</label>
                      <input
                        type="email"
                        placeholder="e.g. customercare@link.com"
                        value={addressEmail}
                        onChange={(e) => setAddressEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Street address */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] text-slate-405 font-bold uppercase tracking-wide">Street Address *</label>
                    <input
                      type="text"
                      placeholder="e.g. 1402 Silicon Heights, Innovation Dr"
                      required
                      value={addressStreet}
                      onChange={(e) => setAddressStreet(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Area Landmark */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] text-slate-405 font-bold uppercase tracking-wide">Landmark / Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. Opp Green Spark Tech Park / Leave at front desk"
                      value={addressLandmark}
                      onChange={(e) => setAddressLandmark(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] text-slate-405 font-bold uppercase tracking-wide">City *</label>
                      <input
                        type="text"
                        placeholder="Sunnyvale"
                        required
                        value={addressCity}
                        onChange={(e) => setAddressCity(e.target.value)}
                        className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] text-slate-405 font-bold uppercase tracking-wide">State *</label>
                      <input
                        type="text"
                        placeholder="CA"
                        required
                        value={addressState}
                        onChange={(e) => setAddressState(e.target.value)}
                        className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] text-slate-405 font-bold uppercase tracking-wide">ZIP *</label>
                      <input
                        type="text"
                        placeholder="94089"
                        required
                        value={addressZip}
                        onChange={(e) => setAddressZip(e.target.value)}
                        className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-205 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl text-xs transition tracking-wide uppercase shadow active:scale-98"
                >
                  Continue to Payment gateway
                </button>
              </form>
            ) : (
              /* STEP 2: PAYMENT GATEWAY CHOOSE & DISPATCH ORDER */
              <form onSubmit={processCheckoutPayment} className="flex flex-col gap-3.5">
                
                {/* Back button to state 1 */}
                <button
                  type="button"
                  onClick={() => setCheckoutStep(1)}
                  className="flex items-center gap-1.5 text-[10px] text-slate-450 hover:text-white transition w-max font-bold font-mono uppercase"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to delivery details
                </button>

                {/* Gateway buttons selector */}
                <div className="bg-slate-900 border border-slate-850/70 p-3.5 rounded-2xl flex flex-col gap-2">
                  <span className="text-[9px] font-mono tracking-wider font-extrabold text-[#8692a6] block uppercase mb-1">SELECT PAYMENT METHOD</span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-extrabold font-mono">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2.5 px-1 rounded-xl flex flex-col items-center gap-1.5 transition border ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-600/10 text-blue-400 font-extrabold' : 'border-slate-850/80 bg-[#0c0e17] text-slate-500'}`}
                    >
                      <span className="text-[14px]">⚡</span>
                      <span>UPI APPS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2.5 px-1 rounded-xl flex flex-col items-center gap-1.5 transition border ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-600/10 text-blue-400 font-extrabold' : 'border-slate-850/80 bg-[#0c0e17] text-slate-500'}`}
                    >
                      <span className="text-[14px]">💳</span>
                      <span>CREDIT CARD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`py-2.5 px-1 rounded-xl flex flex-col items-center gap-1.5 transition border ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-600/10 text-blue-400 font-extrabold' : 'border-slate-850/80 bg-[#0c0e17] text-slate-500'}`}
                    >
                      <span className="text-[14px]">📦</span>
                      <span>C.O.D.</span>
                    </button>
                  </div>
                </div>

                {/* DYNAMIC SUBSECTION: UPI INTERACTIVE SCAN QR CODE SETUP */}
                {paymentMethod === 'upi' && (
                  <div className="bg-slate-900 border border-slate-850/75 p-4 rounded-2xl flex flex-col gap-3.5">
                    
                    {/* UPI App shortcut filters */}
                    <div className="flex justify-between items-center bg-[#07090e] p-2 rounded-xl">
                      <span className="text-[8px] font-black uppercase text-slate-500 font-mono leading-none">Quick Scan Format</span>
                      <div className="flex gap-1.5 text-[8.5px] font-bold">
                        {['gpay', 'phonepe', 'paytm', 'other'].map((app) => (
                          <button
                            key={app}
                            type="button"
                            onClick={() => {
                              setUpiApp(app as any);
                              setUpiId(app === 'other' ? '' : `krishang@${app === 'gpay' ? 'okaxis' : app === 'phonepe' ? 'ybl' : 'paytm'}`);
                            }}
                            className={`px-1.5 py-0.5 rounded transition uppercase border text-[8px] font-black ${upiApp === app ? 'bg-blue-600/25 border-blue-500/50 text-blue-405' : 'bg-[#0f111a] border-slate-800 text-slate-450'}`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* QR SCAN CONTAINER MOCK */}
                    <div className="bg-[#0c0e17] border border-[#1a2035] p-4.5 rounded-2xl flex flex-col items-center gap-3 relative text-center">
                      <span className="text-[8.5px] font-mono tracking-wider font-black text-blue-400 uppercase">Interactive UPI QR Code</span>
                      
                      {/* Countdowns clock expires */}
                      <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-full text-[9px] font-mono text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0"></span>
                        <span>QR Session expires in: <strong className="text-red-400 font-black">{Math.floor(qrCodeTimer / 60)}:{(qrCodeTimer % 60).toString().padStart(2, '0')}</strong></span>
                      </div>

                      {/* Pure SVG generated custom QR code graphic box */}
                      <div className="relative p-2.5 bg-white rounded-2xl shadow-lg border border-slate-200 cursor-pointer select-none">
                        <svg className="w-28 h-28 text-slate-950" viewBox="0 0 100 100">
                          {/* Top-Left Finder */}
                          <rect x="0" y="0" width="22" height="22" fill="#000" />
                          <rect x="3" y="3" width="16" height="16" fill="#fff" />
                          <rect x="6" y="6" width="10" height="10" fill="#000" />

                          {/* Top-Right Finder */}
                          <rect x="78" y="0" width="22" height="22" fill="#000" />
                          <rect x="81" y="3" width="16" height="16" fill="#fff" />
                          <rect x="84" y="6" width="10" height="10" fill="#000" />

                          {/* Bottom-Left Finder */}
                          <rect x="0" y="78" width="22" height="22" fill="#000" />
                          <rect x="3" y="81" width="16" height="16" fill="#fff" />
                          <rect x="6" y="84" width="10" height="10" fill="#000" />

                          {/* Alignments and pixels */}
                          <rect x="78" y="78" width="8" height="8" fill="#000" />
                          <path d="M 28,4 H 42 M 48,4 H 72 M 28,10 H 36 M 40,10 H 56 M 62,10 H 72 M 28,16 H 38 M 50,16 H 68" stroke="#000" strokeWidth="4" />
                          <path d="M 4,28 V 40 M 10,28 V 34 M 10,38 V 58 M 16,28 V 48 M 16,52 V 68" stroke="#000" strokeWidth="4" />
                          <path d="M 28,28 H 42 V 42 H 28 Z M 52,28 H 68 V 38 H 52 Z M 28,52 H 52 V 62 H 28 Z M 62,44 H 92 V 62 H 62 Z" fill="#000" />
                          <path d="M 42,42 H 52 V 48 H 42 Z M 76,28 H 88 V 42 H 76 Z" fill="#000" />
                          <path d="M 64,64 H 88 V 70 H 64 Z" fill="#000" />

                          {/* Centered logo icon branding block */}
                          <rect x="38" y="38" width="24" height="24" rx="4" fill="#05060b" />
                          <text x="50" y="52" fill="#3b82f6" fontSize="10.5" fontWeight="extrabold" textAnchor="middle" fontFamily="sans-serif">🌱</text>
                        </svg>

                        {/* Interactive dynamic approval overlays */}
                        {paymentVerified ? (
                          <div className="absolute inset-0 bg-slate-950/95 rounded-2xl flex flex-col items-center justify-center text-emerald-400 p-2">
                            <CheckCircle className="w-8 h-8 animate-bounce mb-1" />
                            <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400">PAID SECURE</span>
                            <span className="text-[8px] opacity-80 font-mono text-white mt-0.5">Approved via UPI</span>
                          </div>
                        ) : scanningUpi ? (
                          <div className="absolute inset-0 bg-[#05060b]/95 rounded-2xl flex flex-col items-center justify-center p-2">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-1.5"></div>
                            <span className="text-[9px] font-bold text-slate-300">Checking signal...</span>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-0.5 mt-1">
                        <span className="text-[8px] uppercase tracking-wider font-mono text-[#8692a6]">Verified Smartpay merchant</span>
                        <span className="text-[11px] font-black text-white font-mono leading-none">merchant.ecoshope@paytm</span>
                        <span className="text-[12px] text-blue-400 font-extrabold font-mono mt-1">Total Due: ${grandTotal.toFixed(2)}</span>
                      </div>

                      {/* Quick click simulators */}
                      <div className="w-full border-t border-slate-900 pt-3 flex flex-col gap-2">
                        {!paymentVerified ? (
                          <button
                            type="button"
                            onClick={() => {
                              setScanningUpi(true);
                              setTimeout(() => {
                                setScanningUpi(false);
                                setPaymentVerified(true);
                                onAddNotification('Instant UPI Scan Verified', 'Transaction captured! Merchant invoice code logged.', 'EcoShop');
                              }, 1600);
                            }}
                            className="w-full py-2 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/35 text-blue-405 font-black text-[10px] uppercase rounded-xl tracking-wide transition active:scale-97 flex items-center justify-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Tap to Simulate Scanning App
                          </button>
                        ) : (
                          <div className="py-2 bg-green-500/10 border border-green-500/30 text-green-400 font-black rounded-xl text-[10px] uppercase flex items-center justify-center gap-1">
                            ✓ Instant Scan approved. Tap CONFIRM below.
                          </div>
                        )}

                        {/* Push prompt UPI VPA input secondary fallback */}
                        <div className="flex gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-850/80 items-center">
                          <input
                            type="text"
                            placeholder="Or enter UPI ID (e.g. krishang@ybl)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="flex-1 bg-transparent text-[10px] font-mono pr-2 text-white focus:outline-none placeholder-slate-650"
                          />
                          <button
                            type="button"
                            disabled={scanningUpi || paymentVerified}
                            onClick={() => {
                              if (!upiId) {
                                alert('Please input a valid UPI VPA adress.');
                                return;
                              }
                              setScanningUpi(true);
                              setTimeout(() => {
                                setScanningUpi(false);
                                setPaymentVerified(true);
                                onAddNotification('VPA prompt approved', 'Customer phone verified signature matched.', 'Account');
                              }, 1400);
                            }}
                            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg text-[9px] font-black uppercase text-slate-350 transition relative"
                          >
                            Request
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* DYNAMIC CARD COMPONENT (IF CARD SELECTED) */}
                {paymentMethod === 'card' && (
                  <div className="bg-slate-900 border border-slate-850/70 p-3.5 rounded-2xl flex flex-col gap-3 text-left">
                    <span className="text-[9px] font-mono tracking-wider font-bold text-[#8692a6] uppercase block">CREDIT/DEBIT CARD GATEWAY</span>
                    
                    {/* Live styled Credit Card mockup widget */}
                    <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-4.5 text-white font-mono text-[10px] flex flex-col justify-between h-32 shadow-xl border border-indigo-500/10 relative overflow-hidden">
                      <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-sans font-black text-[12px] uppercase tracking-wide text-white block">EcoCard Premium</span>
                          <span className="text-[7.5px] uppercase text-indigo-200 tracking-widest leading-none">Smart Circular Network</span>
                        </div>
                        <CreditCard className="w-5.5 h-5.5 text-blue-300" />
                      </div>
                      
                      <span className="text-sm font-black text-white tracking-widest block py-2 text-left">
                        {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                      </span>

                      <div className="flex justify-between items-end text-[8px] border-t border-white/10 pt-1.5">
                        <div className="text-left">
                          <span className="text-indigo-200 block uppercase text-[6.5px]" style={{ fontSize: '6px' }}>Card Holder</span>
                          <span className="font-sans font-extrabold text-white uppercase text-[9px] truncate max-w-[120px] inline-block">{cardHolder || 'GUEST CUSTOMER'}</span>
                        </div>
                        <div className="text-right flex gap-3">
                          <div>
                            <span className="text-indigo-200 block uppercase text-[6.5px]" style={{ fontSize: '6px' }}>Expiry</span>
                            <span className="text-white font-extrabold text-[9px]">{cardExpiry || 'MM/YY'}</span>
                          </div>
                          <div>
                            <span className="text-indigo-200 block uppercase text-[6.5px]" style={{ fontSize: '6px' }}>CVV</span>
                            <span className="text-white font-extrabold text-[9px]">{cardCvv ? '•••' : 'MM'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inputs panel */}
                    <div className="flex flex-col gap-2.5 mt-1.5">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8.5px] uppercase tracking-wide text-slate-400 font-extrabold font-mono">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="Krishang Pinash"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-white placeholder-slate-650 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8.5px] uppercase tracking-wide text-slate-400 font-extrabold font-mono font-mono">16-Digit Card Number</label>
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => {
                            // clean non numbers
                            const sanitized = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            setCardNumber(sanitized);
                          }}
                          className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-mono text-white placeholder-slate-650 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="flex flex-col gap-0.5">
                          <label className="text-[8.5px] uppercase tracking-wide text-slate-400 font-extrabold font-mono font-mono">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-mono text-white placeholder-slate-650 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <label className="text-[8.5px] uppercase tracking-wide text-slate-400 font-extrabold font-mono font-mono">CVV Security</label>
                          <input
                            type="password"
                            placeholder="•••"
                            required
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => {
                              const numbersOnly = e.target.value.replace(/[^0-9]/gi, '');
                              setCardCvv(numbersOnly);
                            }}
                            className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-mono text-white placeholder-slate-650 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* COD DETAILS */}
                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-slate-900 border border-slate-850/80 text-slate-300 text-[10.5px] leading-relaxed rounded-2xl text-left flex gap-2.5 items-start">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <span className="font-extrabold text-white block uppercase text-[9px] font-mono tracking-wider mb-0.5">CASH ON ARRIVAL LOGISTICS RULE</span>
                      <span>
                        No pre-payment required! You can settle this securely on delivery using cash, cards, or scanning of delivery executive's smartphone. An exclusive carbon-conservation logistics handler surcharge of is applied.
                      </span>
                    </div>
                  </div>
                )}

                {/* MINI INVOICE CALCULATOR / LEDGER DRAWER */}
                <div className="p-3.5 bg-[#0e111b] border border-slate-850/60 rounded-2xl">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900 mb-1.5 text-[9px] font-mono font-extrabold text-slate-500 uppercase tracking-widest">
                    <span>LEDGER SUMMARY</span>
                    <span>CHARGE AMOUNT</span>
                  </div>
                  <div className="flex flex-col gap-1 text-[10.5px]">
                    <div className="flex justify-between text-[#8692a6]">
                      <span>In-Basket Items Subtotal</span>
                      <span className="font-mono text-slate-300">${subtotal.toFixed(0)}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-450 font-medium">
                        <span>Eco-Coupon Discount Saved</span>
                        <span className="font-mono text-emerald-400">-${discountVal.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#8692a6]">
                      <span>Local VAT & GST clearance (8%)</span>
                      <span className="font-mono text-slate-300">${taxVal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-[#8692a6]">
                      <span>Express logistics handling</span>
                      <span className="font-mono text-slate-300">
                        {shippingVal === 0 ? <strong className="text-emerald-400">FREE</strong> : `$${shippingVal.toFixed(0)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-black text-white text-[11px] pt-1.5 border-t border-slate-900 mt-1">
                      <span className="flex items-center gap-1">TOTAL TO DEBIT <ShieldCheck className="w-3.5 h-3.5 text-blue-400 inline" /></span>
                      <span className="font-mono text-[12px] text-blue-450">$ {grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Final dispatch checkout trigger block */}
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl text-xs transition tracking-wide uppercase shadow active:scale-95 disabled:opacity-45"
                >
                  {paymentProcessing 
                    ? 'AUTHORIZING TRANSACTION...' 
                    : paymentMethod === 'upi' && !paymentVerified
                      ? `CONFIRM SECURED DISPATCH • $${grandTotal.toFixed(0)}`
                      : `CONFIRM SECURED DISPATCH • $${grandTotal.toFixed(0)}`
                  }
                </button>

                <p className="text-[8.5px] text-center text-slate-500 font-mono tracking-tight leading-snug">
                  🛡️ Securely processed with AES-256 SSL Encryption layer. By clicking complete you acknowledge conservation ledger dispatch instructions.
                </p>

              </form>
            )}

          </div>
        )}

        {/* TAB 3: LIVE RECEPTING & ORDER PROGRESS SHIPMENT TRACKING */}
        {activeTab === 'orders' && (
          <div className="p-1 flex flex-col gap-4 text-left">
            <h3 className="text-xs font-bold uppercase text-slate-500 font-mono tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" /> Historic logs & track dispatch
            </h3>

            {orders.length === 0 ? (
              <div className="py-16 text-center border border-slate-900 rounded-3xl p-6 bg-slate-900/10 flex flex-col items-center">
                <ShoppingBag className="w-10 h-10 text-emerald-400/20 mb-3" />
                <span className="text-xs font-semibold text-slate-400">Order history empty</span>
                <p className="text-[10px] text-slate-550 mt-1 max-w-[170px] leading-relaxed">Place your first order in our checkout card tab to trace dispatch statuses.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 pb-6">
                
                {/* Active Tracking module if user has order */}
                {(() => {
                  const activeRecord = trackingOrder || orders[0];
                  // Let's draw progressive timelines
                  const steps: Record<string, number> = { 'placed': 1, 'packed': 2, 'shipped': 3, 'out_for_delivery': 4, 'delivered': 5 };
                  const currentIdx = steps[activeRecord.status] || 1;
                  
                  return (
                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-3xl flex flex-col gap-3.5">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-850/55 text-xs text-left">
                        <div>
                          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Live Logistic Tracker</span>
                          <span className="text-white font-extrabold font-mono">{activeRecord.id}</span>
                        </div>
                        <span className="text-[9.5px] uppercase font-mono tracking-wider bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-black font-sans">
                          {activeRecord.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Timeline bubbles visualizer */}
                      <div className="flex justify-between items-center relative py-4 select-none px-1">
                        {/* Horizontal connecting vector */}
                        <div className="absolute top-[48%] left-8 right-8 h-0.5 bg-slate-800 pointer-events-none"></div>
                        <div 
                          className="absolute top-[48%] left-8 h-0.5 bg-emerald-500 transition-all duration-300 pointer-events-none"
                          style={{ width: `${(currentIdx - 1) * 23.5}%` }}
                        ></div>

                        {[
                          { val: 1, label: 'Placed', cell: '🛍️' },
                          { val: 2, label: 'Packed', cell: '📦' },
                          { val: 3, label: 'Shipped', cell: '✈️' },
                          { val: 4, label: 'Out', cell: '🚚' },
                          { val: 5, label: 'Done', cell: '✓' }
                        ].map(st => (
                          <div key={st.val} className="flex flex-col items-center gap-1.5 z-10">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] border font-black transition-all duration-200 ${st.val <= currentIdx ? 'bg-emerald-500 border-none text-slate-950 scale-105 shadow' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                              {st.cell}
                            </div>
                            <span className={`text-[8px] font-bold font-mono tracking-wider uppercase ${st.val <= currentIdx ? 'text-white' : 'text-slate-650'}`}>{st.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl font-mono text-[9.5px] text-slate-450 leading-relaxed text-left flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold text-slate-500">Logistics dispatch detail</span>
                        <div><strong>RECIPIENT:</strong> {activeRecord.address.fullName}</div>
                        <div><strong>STREET SHIPPING:</strong> {activeRecord.address.street}, {activeRecord.address.city}, CA</div>
                        <div><strong>PAYMENT GATEWAY:</strong> {activeRecord.paymentMethod.toUpperCase()}</div>
                        <div className="border-t border-slate-850 pt-1.5 mt-1 text-white font-extrabold flex justify-between">
                          <span>Verified Charge Amount:</span>
                          <span className="text-emerald-400 font-mono font-black">${activeRecord.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* List of remaining orders */}
                <div className="flex flex-col gap-2 text-left">
                  <span className="text-[9.5px] uppercase font-mono tracking-widest text-slate-500 font-bold block mb-1">ALL ACCOUNT TRANSACTIONS</span>
                  
                  {orders.map(o => (
                    <button
                      key={o.id}
                      onClick={() => setTrackingOrder(o)}
                      className={`p-3 border rounded-2xl flex justify-between items-center group text-left transition duration-200 ${o.id === (trackingOrder?.id || orders[0].id) ? 'bg-indigo-500/5 border-indigo-500/25' : 'bg-slate-900/35 border-slate-900 hover:border-slate-800'}`}
                    >
                      <div>
                        <span className="font-bold font-mono text-white block text-xs truncate max-w-[140px]">{o.id}</span>
                        <span className="text-[9px] text-slate-500 font-mono font-bold block mt-0.5 uppercase">DATE: {o.date} • items: {o.items.length}</span>
                      </div>
                      
                      <div className="text-right">
                        <span className="font-mono font-black text-emerald-400 block text-xs">${o.total.toFixed(0)}</span>
                        <span className="text-[8px] block uppercase text-indigo-400 font-bold tracking-wider">{o.status.replace(/_/g, ' ')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SORA CHATBOT ASSISTANT NATIVE TAB IMPLEMENTATION */}
        {activeTab === 'chatbot' && (
          <div className="flex flex-col h-[525px] bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden relative">
            
            {/* Header */}
            <div className="bg-slate-900 p-3 border-b border-slate-850 flex justify-between items-center text-left">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/35 text-emerald-400 text-xs">
                    🤖
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-slate-950 rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-display font-black text-xs text-white leading-tight flex items-center gap-1">
                    Sora Shopper <Sparkles className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  </h4>
                  <span className="text-[8px] font-mono tracking-wider font-extrabold text-slate-550 uppercase">Eco AI Shopping Guide</span>
                </div>
              </div>

              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-400/30 font-mono text-[8.5px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                ACTIVE
              </div>
            </div>

            {/* Chat list stream */}
            <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3.5 phone-scroll max-h-[385px]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] text-left ${m.sender === 'user' ? 'self-end' : 'self-start'}`}
                >
                  <div
                    className={`px-3 py-2.5 text-[11px] leading-relaxed rounded-2xl ${
                      m.sender === 'user'
                        ? 'bg-emerald-500 text-slate-955 font-bold rounded-tr-none'
                        : 'bg-slate-900 border border-slate-850 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                  {m.isMock && (
                    <span className="text-[7.5px] text-slate-600 font-mono mt-1 text-right italic font-bold">
                      ⚡ rule-based backup mode
                    </span>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div className="self-start flex gap-1.5 p-2 bg-slate-900 border border-slate-850 rounded-xl rounded-tl-none">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
                </div>
              )}
              <div ref={chatThreadEndRef} />
            </div>

            {/* suggestion chips */}
            {messages.length === 1 && (
              <div className="flex gap-2 p-2 bg-slate-950 overflow-x-auto select-none phone-scroll">
                {[
                  { label: '🎫 Promo Coupons', prompt: 'Which active coupon codes can I use to save big?' },
                  { label: '📱 Compare Mobiles', prompt: 'Which smartphone features a 200MP camera and OLED screen?' },
                  { label: '🌱 Carbon Savings', prompt: 'Which products score highest on planetary conservation EcoScore?' }
                ].map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleBotChatSend(c.prompt)}
                    className="p-1 px-3 bg-slate-900 border border-slate-850 hover:border-emerald-400/35 text-[9px] text-slate-300 font-bold rounded-full whitespace-nowrap active:scale-95 transition shrink-0"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input buttons */}
            <div className="p-2 bg-slate-900 border-t border-slate-850 sticky bottom-0 text-left">
              <div className="flex gap-1.5 justify-between items-center">
                <input
                  type="text"
                  placeholder="Ask Sora Shopper AI anything..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleBotChatSend(chatInput); }}
                  className="flex-1 bg-slate-950 border border-slate-800 text-[11px] p-2 rounded-xl focus:outline-none focus:border-emerald-500 text-white placeholder-slate-655"
                />
                <button
                  onClick={() => handleBotChatSend(chatInput)}
                  disabled={!chatInput.trim() || chatLoading}
                  className="p-2 bg-emerald-500 rounded-xl text-slate-950 hover:bg-emerald-400 font-bold transition disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE HUB & ADDRESS MANAGEMENTS */}
        {activeTab === 'profile' && (
          <div className="p-1 flex flex-col gap-4 text-left">
            <h3 className="text-xs font-bold uppercase text-slate-500 font-mono tracking-wider flex justify-between items-center">
              <span>Customer Account Credentials</span>
              <button onClick={handleLogout} className="p-1 text-red-400 hover:text-red-300 transition text-[9px] font-black uppercase flex items-center gap-1 bg-red-500/10 px-2 rounded-lg border border-red-500/15">
                <LogOut className="w-3 h-3" /> Log Out
              </button>
            </h3>

            {/* Profile badge details card */}
            <div className="p-4 bg-slate-900 border border-slate-850 rounded-3xl flex items-center gap-3 shadow text-left">
              <img src={currentUser.avatar} alt="Avatar" className="w-12 h-12 bg-slate-950 rounded-2xl border border-slate-800 shrink-0" />
              <div>
                <h4 className="font-display font-black text-sm text-white">{currentUser.name}</h4>
                <span className="text-[9px] font-mono text-slate-500 block">{currentUser.email}</span>
                <span className="text-[9px] font-bold text-indigo-400 block tracking-wide font-sans mt-0.5 uppercase mb-1">
                  Verified Member • Joined {currentUser.registerDate || 'June 2026'}
                </span>
                <div className="flex gap-2">
                  <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-black font-mono tracking-tight">💎 {settings.rewardPoints} presentation Coins</span>
                  <span className="text-[8px] bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded font-black font-sans uppercase">Level {Math.floor(settings.rewardPoints / 250) + 1}</span>
                </div>
              </div>
            </div>

            {/* Address modifying Form */}
            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-3">
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-3xl flex flex-col gap-3 text-xs text-left">
                <span className="text-[9px] font-mono tracking-wider font-extrabold text-slate-450 uppercase block">Registered Billing Coordinates</span>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[8.5px] font-bold font-mono text-slate-500">RECIPIENT NAME</label>
                  <input
                    type="text"
                    required
                    value={addressFullName}
                    onChange={(e) => setAddressFullName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8.5px] font-bold font-mono text-slate-500">STREET DELIVERY ADDRESS</label>
                  <input
                    type="text"
                    required
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8.5px] font-bold font-mono text-slate-500 font-bold uppercase">City Location</label>
                    <input
                      type="text"
                      required
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[8.5px] font-bold font-mono text-slate-500 font-bold uppercase">Postal Zip Code</label>
                    <input
                      type="text"
                      required
                      value={addressZip}
                      onChange={(e) => setAddressZip(e.target.value)}
                      className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-mono text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-tight text-xs rounded-2xl text-center shadow transition"
              >
                SAVE LOGISTIC PREFERENCES
              </button>
            </form>

            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-3.5 font-sans text-xs text-slate-450 leading-relaxed text-left">
              <span className="text-[9px] font-mono tracking-widest font-extrabold text-indigo-405 block uppercase mb-1 flex items-center gap-1">
                <Award className="w-4 h-4 text-indigo-400" /> SYSTEM EXPORT MATRIX
              </span>
              Verify your shopping history logs on the upper <strong>Source Exporter Panel</strong> or review incoming orders dynamically under the <strong>Admin Portal</strong> order logs list. Registered client data syncs seamlessly!
            </div>
          </div>
        )}

      </div>

      {/* 3. CORE BOTTOM TAB NAVIGATION BAR */}
      <div className="bg-[#090b11]/90 backdrop-blur-md border-t border-slate-900 p-2.5 shrink-0 absolute bottom-0 left-0 right-0 z-20 flex justify-around items-center select-none shadow-2xl">
        {[
          { id: 'catalog', label: 'Shop', icon: ShoppingBag },
          { id: 'search', label: 'Discover', icon: SlidersHorizontal },
          { id: 'chatbot', label: 'Sora AI', icon: Bot },
          { id: 'cart', label: 'Cart', icon: ShoppingCart },
          { id: 'orders', label: 'Track', icon: Clock },
          { id: 'profile', label: 'Profile', icon: User }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id || (tab.id === 'catalog' && activeTab === 'details');
          const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
          return (
            <button
              key={tab.id}
              onClick={() => { setSelectedProduct(null); setActiveTab(tab.id as any); }}
              className={`flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-xl transition ${isActive ? 'text-emerald-450 scale-102 font-black' : 'text-slate-500 hover:text-slate-350'}`}
            >
              <div className="relative">
                <TabIcon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-350'}`} />
                {tab.id === 'cart' && totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-blue-600 text-white rounded-full text-[8px] font-black h-3.5 min-w-[14px] px-1 flex items-center justify-center border border-[#090b11] animate-pulse">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="text-[8.5px] font-bold block" style={{ fontSize: '8.5px' }}>{tab.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
