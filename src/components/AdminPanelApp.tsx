import React, { useState } from 'react';
import {
  BarChart3, Package, ShoppingCart, Users, Edit3, Trash2, ArrowUpRight, TrendingUp,
  DollarSign, PlusCircle, Check, AlertCircle, ShoppingBag, Folder, Settings, ShieldAlert,
  Search, SlidersHorizontal, RefreshCw, Layers, ChevronLeft
} from 'lucide-react';
import { Product, Order, Customer, Category } from '../types';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

interface AdminPanelProps {
  onClose: () => void;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  categories: Category[];
  onUpdateProducts: (updatedList: Product[]) => void;
  onUpdateOrders: (updatedOrders: Order[]) => void;
  onUpdateCustomers: (updatedCustomers: Customer[]) => void;
  onUpdateCategories: (updatedCategories: Category[]) => void;
}

export const AdminPanelApp: React.FC<AdminPanelProps> = ({
  onClose,
  products,
  orders,
  customers,
  categories,
  onUpdateProducts,
  onUpdateOrders,
  onUpdateCustomers,
  onUpdateCategories
}) => {
  const [activeSegment, setActiveSegment] = useState<'dashboard' | 'products' | 'categories' | 'inventory' | 'customers' | 'orders'>('dashboard');

  // Product and Category form modifiers (Add or Edit)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Search filter
  const [query, setQuery] = useState('');

  // Product Form states
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Electronics');
  const [pPrice, setPPrice] = useState(0);
  const [pDiscount, setPDiscount] = useState(0);
  const [pStock, setPStock] = useState(0);
  const [pDesc, setPDesc] = useState('');
  const [pBrand, setPBrand] = useState('Generic');
  const [pEcoScore, setPEcoScore] = useState(85);
  const [pCarbonSaved, setPCarbonSaved] = useState(15);

  // Category Form states
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('📁');
  const [catColor, setCatColor] = useState('from-blue-600 to-cyan-400');

  // Summary Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 3840.45; // seeding base mock sales
  const pendingOrdersCount = orders.filter(o => o.status === 'placed' || o.status === 'packed').length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const activeCustomersCount = customers.filter(c => c.status === 'active').length + 1; // plus current user
  const lowStockProducts = products.filter(p => p.stock < 15);

  // RECHARTS ANALYTICS DATA BINDINGS
  // 1. Revenue Over Time (AreaChart)
  const revenueChartData = [
    { name: 'Mon', revenue: 450, organic: 210 },
    { name: 'Tue', revenue: 780, organic: 380 },
    { name: 'Wed', revenue: 640, organic: 310 },
    { name: 'Thu', revenue: 1050, organic: 520 },
    { name: 'Fri', revenue: 1250, organic: 620 },
    { name: 'Sat', revenue: 1600, organic: 880 },
    { name: 'Sun', revenue: orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) + 1100) : 1850, organic: 1120 }
  ];

  // 2. Orders Volume (BarChart)
  const ordersChartData = [
    { name: 'Electronics', orders: products.filter(p => p.category === 'Electronics').length * 4 + orders.length },
    { name: 'Fashion', orders: products.filter(p => p.category === 'Fashion').length * 6 },
    { name: 'Footwear', orders: products.filter(p => p.category === 'Footwear').length * 5 },
    { name: 'Accessories', orders: products.filter(p => p.category === 'Accessories').length * 3 },
    { name: 'Appliances', orders: products.filter(p => p.category === 'Home Appliances').length * 2 }
  ];

  // 3. Category Product Shares (PieChart)
  const productPerformanceData = categories.map((cat, index) => {
    const totalItems = products.filter(p => p.category === cat.name).length;
    return {
      name: cat.name,
      value: totalItems > 0 ? totalItems : 1,
      color: ['#3b82f6', '#6366f1', '#f97316', '#10b981', '#ec4899'][index % 5]
    };
  });

  // 4. Customer Growth Trajectory (LineChart)
  const customerGrowthData = [
    { month: 'Jan', members: 45 },
    { month: 'Feb', members: 62 },
    { month: 'Mar', members: 89 },
    { month: 'Apr', members: 110 },
    { month: 'May', members: 145 },
    { month: 'Jun', members: 145 + customers.length }
  ];

  // Handlers for Product CRUD
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsAddingProduct(false);
    setPName(prod.name);
    setPCategory(prod.category);
    setPPrice(prod.price);
    setPDiscount(prod.discount);
    setPStock(prod.stock);
    setPDesc(prod.description);
    setPBrand(prod.brand);
    setPEcoScore(prod.ecoScore);
    setPCarbonSaved(prod.carbonSaved);
    setActiveSegment('products');
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsAddingProduct(true);
    setPName('');
    setPCategory('Electronics');
    setPPrice(120);
    setPDiscount(10);
    setPStock(45);
    setPBrand('SmartCommerce');
    setPDesc('A premium quality product listed on our smart-bound ecosystem.');
    setPEcoScore(90);
    setPCarbonSaved(15);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return;

    if (isAddingProduct) {
      const categoryImages: Record<string, string> = {
        'Electronics': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=80',
        'Fashion': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
        'Footwear': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
        'Accessories': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
        'Home Appliances': 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80'
      };
      const chosenImage = categoryImages[pCategory] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: pName,
        description: pDesc,
        price: pPrice,
        discount: pDiscount,
        rating: 4.5,
        reviewCount: 1,
        category: pCategory,
        brand: pBrand,
        image: chosenImage,
        images: [chosenImage],
        specs: { 'Material': 'Alloy', 'Config': 'Premium' },
        stock: pStock,
        ecoScore: pEcoScore,
        carbonSaved: pCarbonSaved
      };
      onUpdateProducts([newProduct, ...products]);
      setIsAddingProduct(false);
    } else if (editingProduct) {
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: pName,
            category: pCategory,
            price: pPrice,
            discount: pDiscount,
            stock: pStock,
            description: pDesc,
            brand: pBrand,
            ecoScore: pEcoScore,
            carbonSaved: pCarbonSaved
          };
        }
        return p;
      });
      onUpdateProducts(updated);
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Delete this product from your database? This will sync immediately.')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  // Handlers for Category CRUD
  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setIsAddingCategory(false);
    setCatName(cat.name);
    setCatIcon(cat.icon);
    setCatColor(cat.color);
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsAddingCategory(true);
    setCatName('');
    setCatIcon('📁');
    setCatColor('from-purple-600 to-indigo-400');
  };

  const handleSaveCategoryForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (isAddingCategory) {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: catName,
        itemCount: products.filter(p => p.category === catName).length,
        icon: catIcon,
        color: catColor
      };
      onUpdateCategories([...categories, newCat]);
      setIsAddingCategory(false);
    } else if (editingCategory) {
      const updated = categories.map(c => {
        if (c.id === editingCategory.id) {
          return { ...c, name: catName, icon: catIcon, color: catColor };
        }
        return c;
      });
      onUpdateCategories(updated);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Delete this category? Products in this category will remain unchanged.')) {
      onUpdateCategories(categories.filter(c => c.id !== id));
    }
  };

  // Advances order status in pipeline
  const advanceOrderStatus = (id: string) => {
    const flow: Record<string, 'placed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered'> = {
      'placed': 'packed',
      'packed': 'shipped',
      'shipped': 'out_for_delivery',
      'out_for_delivery': 'delivered',
      'delivered': 'placed'
    };

    const updated = orders.map(o => {
      if (o.id === id) {
        return { ...o, status: flow[o.status] || 'delivered' };
      }
      return o;
    });
    onUpdateOrders(updated);
  };

  // Search filter predicate
  const processedProducts = products.filter(p => {
    return p.name.toLowerCase().includes(query.toLowerCase()) ||
           p.category.toLowerCase().includes(query.toLowerCase()) ||
           p.brand.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-[#0b0c10] text-[#e5f1f4] font-sans antialiased" id="admin-portal-dashboard">
      
      {/* PERSISTENT HEADER ROW (Full width) */}
      <div className="bg-[#141824] px-6 py-4 border-b border-[#232d3f] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl text-white shadow-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5 font-display">
              SmartCommerce Control Tower <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-mono px-1.5 py-0.5 rounded font-black">ADMIN MODE</span>
            </h2>
            <p className="text-[9.5px] text-[#8fa0b5] font-semibold uppercase tracking-wider font-mono">E-Commerce Live Metrics & Resource CRUD</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 bg-[#232d3f] hover:bg-[#2d3a52] text-zinc-300 font-bold rounded-xl text-xs transition duration-150 flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4 text-zinc-450" /> Back to Phone OS
        </button>
      </div>

      {/* THREE SECTION WORKSPACE */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        
        {/* LEFT NAV BAR BAR */}
        <div className="w-[200px] border-r border-[#232d3f] bg-[#10131e] flex flex-col justify-between p-3 shrink-0">
          <div className="flex flex-col gap-1.5">
            <span className="text-[8.5px] uppercase text-zinc-500 font-black tracking-widest pl-2 mb-2 block">DASHBOARD CORE</span>
            
            <button
              onClick={() => { setActiveSegment('dashboard'); setEditingProduct(null); setIsAddingProduct(false); }}
              className={`p-3 rounded-2xl flex items-center gap-3 font-semibold text-xs text-left transition duration-200 ${
                activeSegment === 'dashboard' ? 'bg-indigo-600/15 border-l-4 border-indigo-500 text-white font-extrabold' : 'text-[#8fa0b5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0 text-indigo-400" /> Executive Center
            </button>

            <button
              onClick={() => { setActiveSegment('products'); setEditingProduct(null); setIsAddingProduct(false); }}
              className={`p-3 rounded-2xl flex items-center gap-3 font-semibold text-xs text-left transition duration-200 ${
                activeSegment === 'products' ? 'bg-indigo-600/15 border-l-4 border-indigo-500 text-white font-extrabold' : 'text-[#8fa0b5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 shrink-0 text-[#f97316]" /> Catalog CRUD
            </button>

            <button
              onClick={() => { setActiveSegment('categories'); setEditingCategory(null); setIsAddingCategory(false); }}
              className={`p-3 rounded-2xl flex items-center gap-3 font-semibold text-xs text-left transition duration-200 ${
                activeSegment === 'categories' ? 'bg-indigo-600/15 border-l-4 border-indigo-500 text-white font-extrabold' : 'text-[#8fa0b5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0 text-pink-400" /> Categories Grid
            </button>

            <button
              onClick={() => { setActiveSegment('inventory'); setEditingProduct(null); setIsAddingProduct(false); }}
              className={`p-3 rounded-2xl flex items-center gap-3 font-semibold text-xs text-left transition duration-200 ${
                activeSegment === 'inventory' ? 'bg-indigo-600/15 border-l-4 border-indigo-500 text-white font-extrabold' : 'text-[#8fa0b5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" /> Stock Alerts
              {lowStockProducts.length > 0 && (
                <span className="ml-auto w-4.5 h-4.5 bg-red-650 text-white font-black text-[9px] rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {lowStockProducts.length}
                </span>
              )}
            </button>

            <span className="text-[8.5px] uppercase text-zinc-500 font-black tracking-widest pl-2 mt-4 mb-2 block">MEMBERS & SALES</span>

            <button
              onClick={() => { setActiveSegment('customers'); setEditingProduct(null); setIsAddingProduct(false); }}
              className={`p-3 rounded-2xl flex items-center gap-3 font-semibold text-xs text-left transition duration-200 ${
                activeSegment === 'customers' ? 'bg-indigo-600/15 border-l-4 border-indigo-500 text-white font-extrabold' : 'text-[#8fa0b5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 shrink-0 text-[#10b981]" /> Customers Area
            </button>

            <button
              onClick={() => { setActiveSegment('orders'); setEditingProduct(null); setIsAddingProduct(false); }}
              className={`p-3 rounded-2xl flex items-center gap-3 font-semibold text-xs text-left transition duration-200 ${
                activeSegment === 'orders' ? 'bg-indigo-600/15 border-l-4 border-indigo-500 text-white font-extrabold' : 'text-[#8fa0b5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4 shrink-0 text-indigo-400" /> Orders Tracker
              {pendingOrdersCount > 0 && (
                <span className="ml-auto px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-[8px] font-bold rounded-full font-mono">
                  {pendingOrdersCount} REQ
                </span>
              )}
            </button>
          </div>

          <div className="bg-[#141824] p-3 rounded-xl border border-[#232d3f] text-[10px] text-zinc-400 text-left">
            <span className="font-extrabold text-[#e5f1f4] uppercase block mb-1">DATA BINDING STATUS</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[9px]">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              <span>STATE ALIGNED</span>
            </div>
            <p className="mt-1 text-[9px] text-[#8fa0b5] leading-snug">Modifying database entities instantly synchronizes visual models inside the user app.</p>
          </div>
        </div>

        {/* MAIN BODY AREA AREA */}
        <div className="flex-1 bg-[#0b0c10] p-6 overflow-y-auto phone-scroll text-left">
          
          {/* TAB 1: EXECUTIVE ANALYTICS CENTER */}
          {activeSegment === 'dashboard' && (
            <div className="flex flex-col gap-6">
              
              {/* BENTO STATS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-[#141824] p-5 rounded-2xl border border-[#1e2538] flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-zinc-450 uppercase tracking-widest font-extrabold block">TOTAL SALES REVENUE</span>
                    <h3 className="text-xl font-black text-white mt-1.5 tracking-tight font-display">${totalRevenue.toFixed(2)}</h3>
                    <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1 font-mono">
                      <ArrowUpRight className="w-3 h-3" /> +18.4% vs last week
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#141824] p-5 rounded-2xl border border-[#1e2538] flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-zinc-450 uppercase tracking-widest font-extrabold block">TOTAL RESERVATIONS</span>
                    <h3 className="text-xl font-black text-white mt-1.5 tracking-tight font-display">{orders.length + 52} Orders</h3>
                    <span className="text-[9px] text-[#8fa0b5] font-semibold mt-1 font-mono block">
                      {orders.length} real checkouts logged
                    </span>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/25 rounded-2xl text-blue-400">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#141824] p-5 rounded-2xl border border-[#1e2538] flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-zinc-450 uppercase tracking-widest font-extrabold block">ACTIVE WAREHOUSE ITEMS</span>
                    <h3 className="text-xl font-black text-white mt-1.5 tracking-tight font-display">{totalStock} Units</h3>
                    <span className="text-[9px] text-indigo-400 font-bold flex items-center gap-0.5 mt-1 font-mono">
                      {products.length} distinct products
                    </span>
                  </div>
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl text-indigo-400">
                    <Package className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#141824] p-5 rounded-2xl border border-[#1e2538] flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-zinc-450 uppercase tracking-widest font-extrabold block">ACTIVE CLIENT PROFILES</span>
                    <h3 className="text-xl font-black text-white mt-1.5 tracking-tight font-display">{activeCustomersCount} Members</h3>
                    <span className="text-[9px] text-purple-400 font-bold flex items-center gap-0.5 mt-1 font-mono">
                      100% cloud secure retention
                    </span>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/25 rounded-2xl text-purple-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* RECHARTS PLOTS (GRID OF TWO COLUMNS COHESIVE GRAPHS) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* Graph 1: Revenue AreaChart */}
                <div className="bg-[#141824] p-5 rounded-2xl border border-[#232d3f] text-[#e5f1f4]">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest mb-4 text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Revenue Flow Trend (Weekly)
                  </h4>
                  <div className="h-[240px] text-[10px] font-mono">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232d3f" />
                        <XAxis dataKey="name" stroke="#8fa0b5" />
                        <YAxis stroke="#8fa0b5" />
                        <Tooltip contentStyle={{ backgroundColor: '#141824', borderColor: '#232d3f', color: '#fff' }} />
                        <Legend />
                        <Area type="monotone" dataKey="revenue" name="Total Sales ($)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                        <Area type="monotone" dataKey="organic" name="Organic Search ($)" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorOrganic)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Graph 2: Order volumes catalog block (BarChart) */}
                <div className="bg-[#141824] p-5 rounded-2xl border border-[#232d3f]">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest mb-4 text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-blue-400" /> Orders Index across Categories
                  </h4>
                  <div className="h-[240px] text-[10px] font-mono">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ordersChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232d3f" />
                        <XAxis dataKey="name" stroke="#8fa0b5" tick={{ fontSize: 9 }} />
                        <YAxis stroke="#8fa0b5" />
                        <Tooltip contentStyle={{ backgroundColor: '#141824', borderColor: '#232d3f', color: '#fff' }} />
                        <Bar dataKey="orders" name="Order Volume" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                          {ordersChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#6366f1', '#f97316', '#10b981', '#ec4899'][index % 5]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Graph 3: Customer Growth Trajectory */}
                <div className="bg-[#141824] p-5 rounded-2xl border border-[#232d3f]">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest mb-4 text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-400" /> Customer Enrollment Growth
                  </h4>
                  <div className="h-[200px] text-[10px] font-mono">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232d3f" />
                        <XAxis dataKey="month" stroke="#8fa0b5" />
                        <YAxis stroke="#8fa0b5" />
                        <Tooltip contentStyle={{ backgroundColor: '#141824', borderColor: '#232d3f', color: '#fff' }} />
                        <Line type="monotone" dataKey="members" name="Registered Members" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Graph 4: Catalog Composition share (PieChart) */}
                <div className="bg-[#141824] p-5 rounded-2xl border border-[#232d3f] flex flex-col justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-white flex items-center gap-1.5 mb-1">
                    <Layers className="w-4 h-4 text-indigo-400" /> Catalog Product Densities
                  </h4>
                  <div className="flex flex-1 items-center justify-around">
                    <div className="w-[140px] h-[140px] text-[10px] font-mono">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={productPerformanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {productPerformanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs text-left">
                      {productPerformanceData.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                          <span className="text-zinc-300 font-medium">{entry.name}:</span>
                          <span className="text-white font-black">{entry.value} items</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* LOW STOCK ALERTS INLINE MODULE */}
              <div className="bg-[#141824] p-5 rounded-2xl border border-[#e11d48]/10 text-left">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#f43f5e] flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5 animate-bounce" /> Warehouse Low Stock Warning Index
                  </h4>
                  <span className="text-[10px] font-mono bg-[#f43f5e]/15 text-[#f43f5e] px-2.5 py-0.5 rounded font-bold">Thresold &lt; 15 units</span>
                </div>
                {lowStockProducts.length === 0 ? (
                  <p className="text-xs text-[#8fa0b5]">Clean report! All listed wares satisfy safe warehouse stock levels.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {lowStockProducts.map(p => (
                      <div key={p.id} className="p-3 bg-[#0d0f17] rounded-xl border border-red-500/20 flex justify-between items-center">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <h5 className="text-[11px] font-black text-white truncate">{p.name}</h5>
                            <span className="text-[9px] text-[#8fa0b5] font-mono uppercase">{p.category}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs text-red-400 font-extrabold block font-mono">{p.stock} left</span>
                          <button
                            onClick={() => {
                              onUpdateProducts(products.map(x => x.id === p.id ? { ...x, stock: 55 } : x));
                            }}
                            className="text-[9px] uppercase font-bold text-emerald-400 hover:underline hover:text-emerald-350 transition block mt-0.5 font-mono"
                          >
                            RESTOCK (+50)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCT CATALOGUE AND RESOURCE CRUD */}
          {activeSegment === 'products' && (
            <div className="flex flex-col gap-5">
              
              {!editingProduct && !isAddingProduct ? (
                <div className="bg-[#141824] p-5 rounded-2xl border border-[#232d3f]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider font-display">Warehouse Active Catalog</h4>
                      <p className="text-[10.5px] text-[#8fa0b5] mt-0.5">Define specs, prices, discount thresholds, and launch new merchandise bundles safely.</p>
                    </div>
                    
                    <button
                      onClick={handleOpenAddProduct}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition duration-150 flex items-center gap-1.5 self-start active:scale-95 shadow-md"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Premium Product
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Filter product inventories dynamically (e.g. Pro Phone, Accessories, 20% off...)"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-[#0d0f17] border border-[#232d3f] rounded-xl px-10 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-zinc-500 transition duration-150"
                    />
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse table-auto text-xs">
                      <thead>
                        <tr className="border-b border-[#232d3f] text-[#8fa0b5] uppercase font-mono tracking-widest text-[9.5px]">
                          <th className="pb-3.5 pl-2">Product Name</th>
                          <th className="pb-3.5">Category</th>
                          <th className="pb-3.5">Price</th>
                          <th className="pb-3.5">Discount</th>
                          <th className="pb-3.5">Stock Level</th>
                          <th className="pb-3.5">Carbon Saved</th>
                          <th className="pb-3.5 text-right pr-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#232d3f]/40 font-medium text-zinc-300">
                        {processedProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-white/5 transition duration-150">
                            <td className="py-3 pl-2 flex items-center gap-3">
                              <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-cover shadow border border-white/5" />
                              <div className="min-w-0">
                                <span className="font-extrabold text-white block truncate pr-2 font-display">{p.name}</span>
                                <span className="text-[9.5px] text-zinc-500 font-mono block">{p.brand}</span>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[9px] rounded-full font-bold">{p.category}</span>
                            </td>
                            <td className="py-3 font-mono font-bold text-white">${p.price}</td>
                            <td className="py-3 font-mono text-emerald-400 font-semibold">{p.discount}% Off</td>
                            <td className="py-3">
                              <span className={`font-mono font-bold ${p.stock < 15 ? 'text-red-400 animate-pulse font-black' : 'text-zinc-300'}`}>
                                {p.stock} left
                              </span>
                            </td>
                            <td className="py-3 font-mono text-indigo-400">{p.carbonSaved} kg CO₂</td>
                            <td className="py-3 text-right pr-2">
                              <div className="inline-flex gap-1">
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-1.5 hover:bg-indigo-500/10 text-zinc-400 hover:text-indigo-400 rounded-lg transition"
                                  title="Edit Specs"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1.5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-lg transition"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              ) : (
                /* ADD OR EDIT PRODUCT INNER FORM */
                <form onSubmit={handleSaveProductForm} className="bg-[#141824] p-6 rounded-2xl border border-[#232d3f] flex flex-col gap-4 text-left max-w-2xl mx-auto">
                  <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest font-display pb-3 border-b border-[#232d3f]">
                    {isAddingProduct ? 'Create New Global Database SKU' : `Configure Product Resource: ${pName}`}
                  </h3>

                  <div className="flex flex-col gap-1 text-xs">
                    <label className="font-bold text-zinc-450 uppercase font-mono tracking-wider">PRODUCT NAME</label>
                    <input
                      required
                      type="text"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="p-3 bg-[#0d0f17] rounded-xl border border-[#232d3f] text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="SmartCommerce Pro Phone Max"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1 text-xs">
                      <label className="font-bold text-zinc-450 uppercase font-mono tracking-wider">SKU Category</label>
                      <select
                        value={pCategory}
                        onChange={(e) => setPCategory(e.target.value)}
                        className="p-3 bg-[#0d0f17] rounded-xl border border-[#232d3f] text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      <label className="font-bold text-zinc-450 uppercase font-mono tracking-wider">Brand Name</label>
                      <input
                        type="text"
                        value={pBrand}
                        onChange={(e) => setPBrand(e.target.value)}
                        className="p-3 bg-[#0d0f17] rounded-xl border border-[#232d3f] text-slate-100 focus:outline-none focus:border-indigo-500"
                        placeholder="SmartCommerce"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      <label className="font-bold text-zinc-450 uppercase font-mono tracking-wider">Retail Price ($)</label>
                      <input
                        required
                        type="number"
                        value={pPrice}
                        onChange={(e) => setPPrice(parseFloat(e.target.value) || 0)}
                        className="p-3 bg-[#0d0f17] rounded-xl border border-[#232d3f] text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="flex flex-col gap-1 text-xs">
                      <label className="font-bold text-zinc-450 uppercase font-mono tracking-wider">Discount (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={pDiscount}
                        onChange={(e) => setPDiscount(parseInt(e.target.value) || 0)}
                        className="p-3 bg-[#0d0f17] rounded-xl border border-[#232d3f] text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      <label className="font-bold text-zinc-450 uppercase font-mono tracking-wider">Stock Level</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={pStock}
                        onChange={(e) => setPStock(parseInt(e.target.value) || 0)}
                        className="p-3 bg-[#0d0f17] rounded-xl border border-[#232d3f] text-slate-100 focus:outline-none focus:border-indigo-505 font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      <label className="font-bold text-zinc-450 uppercase font-mono tracking-wider">EcoScore (1-100)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={pEcoScore}
                        onChange={(e) => setPEcoScore(parseInt(e.target.value) || 90)}
                        className="p-3 bg-[#0d0f17] rounded-xl border border-[#232d3f] text-slate-100 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      <label className="font-bold text-zinc-450 uppercase font-mono tracking-wider">Carbon saved (kg)</label>
                      <input
                        type="number"
                        value={pCarbonSaved}
                        onChange={(e) => setPCarbonSaved(parseInt(e.target.value) || 0)}
                        className="p-3 bg-[#0d0f17] rounded-xl border border-[#232d3f] text-slate-100 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-xs">
                    <label className="font-bold text-zinc-450 uppercase font-mono tracking-wider">Product Description</label>
                    <textarea
                      required
                      value={pDesc}
                      onChange={(e) => setPDesc(e.target.value)}
                      className="p-3 bg-[#0d0f17] rounded-xl border border-[#232d3f] text-slate-100 focus:outline-none focus:border-indigo-500 h-28 resize-none text-xs leading-relaxed"
                      placeholder="Add elegant bullet specifications or product descriptions..."
                    />
                  </div>

                  <div className="flex gap-2.5 mt-3 pt-3 border-t border-[#232d3f]">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs transition duration-150 active:scale-95 text-center"
                    >
                      Commit Database changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setIsAddingProduct(false);
                      }}
                      className="px-6 py-3 bg-[#232d3f] hover:bg-[#2d3a52] text-zinc-300 font-semibold rounded-xl text-xs transition duration-150"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* TAB 3: CATEGORIES LIST CRUD */}
          {activeSegment === 'categories' && (
            <div className="flex flex-col gap-5">
              
              {!editingCategory && !isAddingCategory ? (
                <div className="bg-[#141824] p-5 rounded-2xl border border-[#232d3f]">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider font-display">Category Classifications ({categories.length})</h4>
                      <p className="text-[10.5px] text-[#8fa0b5] mt-0.5">Control menu sections and product category allocations throughout the Client Store.</p>
                    </div>

                    <button
                      onClick={handleOpenAddCategory}
                      className="px-4 py-2 bg-pink-650 hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition duration-150 flex items-center gap-1.5 active:scale-95"
                    >
                      <PlusCircle className="w-4 h-4" /> Create Category
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(cat => {
                      const count = products.filter(p => p.category === cat.name).length;
                      return (
                        <div key={cat.id} className="p-4 bg-[#0d0f17] rounded-2xl border border-[#232d3f] flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-lg shadow border border-white/5">
                              {cat.icon || '📁'}
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-extrabold text-white font-display">{cat.name}</h4>
                              <span className="text-[10px] text-zinc-500 font-mono">{count} SKUs active</span>
                            </div>
                          </div>

                          <div className="flex gap-1 text-right shrink-0">
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              className="p-1.5 hover:bg-indigo-500/10 text-zinc-400 hover:text-indigo-400 rounded-lg transition"
                              title="Edit Class"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-lg transition"
                              title="Delete Class"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveCategoryForm} className="bg-[#141824] p-6 rounded-2xl border border-[#232d3f] flex flex-col gap-4 text-left max-w-md mx-auto">
                  <h3 className="text-xs font-extrabold text-pink-400 uppercase tracking-widest font-mono">
                    {isAddingCategory ? 'Configure Brand New Category' : `Modify Category: ${catName}`}
                  </h3>

                  <div className="flex flex-col gap-1 text-xs">
                    <label className="font-bold text-zinc-450 uppercase font-mono">Category Name</label>
                    <input
                      required
                      type="text"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      className="p-3 bg-[#0d0f17] rounded-xl border border-[#232d3f] text-slate-100 focus:outline-none"
                      placeholder="e.g. Footwear"
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-xs">
                    <label className="font-bold text-zinc-450 uppercase font-mono">Representative Emoji Icon</label>
                    <input
                      required
                      type="text"
                      value={catIcon}
                      onChange={(e) => setCatIcon(e.target.value)}
                      className="p-3 bg-[#0d0f17] rounded-xl border border-[#232d3f] text-center text-lg text-slate-100 focus:outline-none font-mono"
                      placeholder="👟"
                    />
                  </div>

                  <div className="flex gap-2.5 mt-2.5 pt-3 border-t border-[#232d3f]">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-pink-650 hover:bg-pink-600 text-white font-extrabold rounded-xl text-xs transition active:scale-95"
                    >
                      Save Category
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setIsAddingCategory(false);
                      }}
                      className="px-4 py-2.5 bg-[#232d3f] hover:bg-[#2d3a52] text-zinc-300 font-semibold rounded-xl text-xs transition"
                    >
                      Close
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* TAB 4: WAREHOUSE ALERTS (SIMULATED INVENTORY CHECK) */}
          {activeSegment === 'inventory' && (
            <div className="bg-[#141824] p-5 rounded-2xl border border-[#232d3f]">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider font-display">Simulated Stock & Warehouse Auditing</h4>
                  <p className="text-[10.5px] text-[#8fa0b5] mt-0.5 font-sans">Quickly restock items with low counts, observe current inventory indexes and keep logistics in check.</p>
                </div>
                
                <button
                  onClick={() => {
                    const replenished = products.map(p => p.stock < 15 ? { ...p, stock: 45 } : p);
                    onUpdateProducts(replenished);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition duration-150 flex items-center gap-1.5 active:scale-95"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-slow" /> Repack All Alerts (+45 Units)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className={`p-4 rounded-xl border text-left flex justify-between items-center ${
                    p.stock < 15 ? 'bg-red-950/20 border-red-500/30' : 'bg-[#0d0f17] border-[#232d3f]'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-9 h-9 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-white truncate font-display">{p.name}</h4>
                        <span className="text-[10px] text-zinc-500 font-mono tracking-wider">{p.category}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-4">
                      <span className={`text-xs block font-bold font-mono tracking-tight ${p.stock < 15 ? 'text-red-400 animate-pulse font-black' : 'text-zinc-400'}`}>
                        {p.stock} units
                      </span>
                      <div className="flex gap-2 mt-1 justify-end">
                        <button
                          onClick={() => {
                            onUpdateProducts(products.map(x => x.id === p.id ? { ...x, stock: Math.max(0, x.stock - 5) } : x));
                          }}
                          className="text-[9px] font-mono text-pink-400 hover:underline"
                        >
                          DEDUCT (-5)
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => {
                            onUpdateProducts(products.map(x => x.id === p.id ? { ...x, stock: x.stock + 15 } : x));
                          }}
                          className="text-[9px] font-mono text-emerald-400 hover:underline"
                        >
                          STOCK (+15)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACTIVE CUSTOMER MANAGEMENT MANAGEMENT */}
          {activeSegment === 'customers' && (
            <div className="bg-[#141824] p-5 rounded-2xl border border-[#232d3f]">
              <div className="mb-4 text-left">
                <h4 className="text-sm font-black text-white uppercase tracking-wider font-display">Client Members Workspace</h4>
                <p className="text-[10.5px] text-[#8fa0b5] mt-0.5">Review registered member profiles, cumulative historical checkouts spent value, status, and account registration dates.</p>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse divide-y divide-[#232d3f]/40 text-zinc-300 font-medium">
                  <thead>
                    <tr className="border-b border-[#232d3f] text-[#8fa0b5] uppercase font-mono tracking-wider text-[9.5px]">
                      <th className="pb-3.5 pl-2">Customer Profile</th>
                      <th className="pb-3.5">Email Contact</th>
                      <th className="pb-3.5">Account Status</th>
                      <th className="pb-3.5 font-mono">Enrolled Date</th>
                      <th className="pb-3.5 font-mono">Shopping Count</th>
                      <th className="pb-3.5 text-right pr-2 font-mono">Cumulative Spent ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-white/5 transition duration-150">
                        <td className="py-3 pl-2 flex items-center gap-2.5">
                          <img src={c.avatar} alt={c.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-white/10" />
                          <span className="font-extrabold text-white font-display">{c.name}</span>
                        </td>
                        <td className="py-3 text-zinc-450 font-mono">{c.email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            c.status === 'active' ? 'bg-[#10b981]/15 text-[#10b981]' : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 font-mono">{c.registerDate}</td>
                        <td className="py-3 font-mono pl-6">{c.purchaseCount} purchases</td>
                        <td className="py-3 text-right pr-2 font-mono text-white font-extrabold">${c.spent.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SALES DELIVERY DISPATCH TRACKER */}
          {activeSegment === 'orders' && (
            <div className="bg-[#141824] p-5 rounded-2xl border border-[#232d3f]">
              <div className="mb-4 text-left">
                <h4 className="text-sm font-black text-white uppercase tracking-wider font-display">Sales Delivery Pipelines</h4>
                <p className="text-[10.5px] text-[#8fa0b5] mt-0.5">Control order status transitions live. Advance delivery phases to trigger automated tracking updates inside the Customer App.</p>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center text-[#8fa0b5] bg-[#0d0f17] rounded-xl border border-[#232d3f] flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="w-8 h-8 text-zinc-500 opacity-40 animate-pulse" />
                  <span>No checkouts placed. Go to the Customer Mobile app to purchase items!</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3 font-mono">
                  {orders.map((o) => (
                    <div key={o.id} className="p-4 bg-[#0d0f17] rounded-xl border border-[#232d3f] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left text-xs">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 text-[9.5px] uppercase text-[#8fa0b5]">
                          <span className="font-extrabold text-indigo-400 font-sans text-xs">#{o.id}</span>
                          <span>•</span>
                          <span>{o.date}</span>
                        </div>
                        
                        <div className="text-zinc-400 pl-1">
                          {o.items.map((it, i) => (
                            <span key={i} className="block font-sans text-[11px] leading-relaxed">
                              • {it.product.name} <span className="font-mono text-[9px] text-[#556b82]">(x{it.quantity})</span>
                            </span>
                          ))}
                        </div>

                        <span className="text-[11px] text-[#8fa0b5] font-sans mt-1.5 block">
                          Client: <span className="text-white font-bold">{o.address.fullName}</span>, {o.address.city}
                        </span>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-4">
                        <div>
                          <span className="block text-[9.5px] text-[#8fa0b5]">Grand Total:</span>
                          <span className="text-emerald-400 font-extrabold text-sm pl-0.5">${o.total.toFixed(2)}</span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 bg-[#141824] px-2.5 py-1.5 rounded-lg border border-[#232d3f]">
                            <span className="text-[10px] text-[#8fa0b5]">Status:</span>
                            <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">{o.status.replace(/_/g, ' ')}</span>
                          </div>
                          
                          <button
                            onClick={() => advanceOrderStatus(o.id)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-[10px] font-bold rounded-lg transition"
                          >
                            Advance Phase
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
