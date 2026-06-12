import { Product, Achievement, Customer, Category } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'ele-1',
    name: 'SmartCommerce Pro Phone',
    description: 'Our flagship 5G smartphone featuring a gorgeous 6.8" AMOLED display, powered by an advanced AI neural core, and equipped with a 200MP professional camera sensor. Designed for absolute premium performance.',
    price: 999,
    discount: 10,
    rating: 4.8,
    reviewCount: 342,
    category: 'Electronics',
    brand: 'SmartCommerce',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80'
    ],
    specs: {
      'Display': '6.8" 120Hz Super AMOLED',
      'Processor': 'Neural S600 Deca-Core',
      'RAM': '12GB High-Speed',
      'Storage': '256GB NVMe',
      'Battery': '5000mAh with SmartCharge',
      'Camera': '200MP Main + 12MP Ultra-wide'
    },
    stock: 24,
    ecoScore: 92,
    carbonSaved: 48,
    isTrending: true,
    isBestSeller: true,
    reviews: [
      { id: 'rev-ele-1', user: 'Alex Rivera', rating: 5, date: '2026-06-02', comment: 'Spectacular quality! The screen is unbelievably vibrant and the night mode photos are incredible.' },
      { id: 'rev-ele-2', user: 'Sophia Carter', rating: 4, date: '2026-06-08', comment: 'Very snappy interface, and battery life easily carries me through two whole days.' }
    ]
  },
  {
    id: 'ele-2',
    name: 'SmartCommerce ANC Earbuds',
    description: 'Active Noise Canceling ear pads featuring dynamic 11mm titanium composite drivers, up to 48dB hybrid cerebral sound suppression, and a remarkable 45-hour combined playtime. Includes tactile wellness commands.',
    price: 149,
    discount: 15,
    rating: 4.6,
    reviewCount: 184,
    category: 'Electronics',
    brand: 'SmartCommerce',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80'
    ],
    specs: {
      'ANC Level': '48dB Active Hybrid',
      'Battery Life': '9 hrs (Buds) / 45 hrs (With Case)',
      'Charging': 'USB-C and Wireless Charging',
      'Bluetooth': 'V5.3 Ultra-reliable Codec',
      'Waterproof': 'IPX5 Sweat-resistant'
    },
    stock: 9, // low stock alert!
    ecoScore: 82,
    carbonSaved: 12,
    isNewArrival: true,
    reviews: [
      { id: 'rev-ele-3', user: 'Marcus Thorne', rating: 5, date: '2026-06-01', comment: 'The sound cancellation is pure magic. Gym workouts are completely cataloged.' }
    ]
  },
  {
    id: 'fas-1',
    name: 'AeroStreets Premium Hoodie',
    description: 'Luxurious heavyweight loopback Terry cotton pullover carefully crafted from 100% GOTS certified organic materials. Dyed with ecological plant barks delivering a stylish urban silhouette without toxic footprints.',
    price: 80,
    discount: 20,
    rating: 4.7,
    reviewCount: 112,
    category: 'Fashion',
    brand: 'AeroStreets',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1510832198440-a52376950479?auto=format&fit=crop&w=600&q=80'
    ],
    specs: {
      'Material': '100% Organic GOTS Cotton',
      'Weight': '420GSM Premium Heavyweight',
      'Color Dye': 'Vegetable Bark Indigo',
      'Country': 'Ethically Tailored in USA'
    },
    stock: 45,
    ecoScore: 99,
    carbonSaved: 24,
    isBestSeller: true,
    reviews: [
      { id: 'rev-fas-1', user: 'Elise Green', rating: 5, date: '2026-06-05', comment: 'Thick, heavy, but so soft on the skin. I love the minimalist raw branding.' }
    ]
  },
  {
    id: 'fas-2',
    name: 'Metropolitan Tech Windbreaker',
    description: 'Precision engineered waterproof shell designed for modern metropolitan commutes. Windproof fabric crafted from ocean-harvested fibers and tailored with laser-welded dynamic layout seams.',
    price: 130,
    discount: 10,
    rating: 4.5,
    reviewCount: 64,
    category: 'Fashion',
    brand: 'AeroStreets',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Fiber Origin': 'Recycled Ocean Bottles',
      'Waterproof': '15,000mm Hydro-Sealed Rating',
      'Pockets': '6 Invisible YKK Zipped Modules',
      'Weight': 'Lightweight packable shell'
    },
    stock: 35,
    ecoScore: 96,
    carbonSaved: 38,
    isTrending: true,
    reviews: []
  },
  {
    id: 'foo-1',
    name: 'Ecosystem Athletic Trainers',
    description: 'State-of-the-art running shoes constructed with highly elastic carbon-neutral algae foam outsoles, and breathable knit uppers spun from post-consumer organic fibers. Ultimate stride cushion response.',
    price: 120,
    discount: 15,
    rating: 4.8,
    reviewCount: 145,
    category: 'Footwear',
    brand: 'SmartCommerce',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Upper': '100% Recycled Bottle Thread knit',
      'Midnight Cushion': 'Responsive Bio-Algae Soles',
      'Stack Height': '28mm Heel / 22mm Toe Box',
      'Weight': '210g Superlight profile'
    },
    stock: 5, // low stock alert!
    ecoScore: 97,
    carbonSaved: 52,
    isTrending: true,
    reviews: []
  },
  {
    id: 'foo-2',
    name: 'Cork Solace Slides',
    description: 'Perfect outdoor ergonomic slides structured with premium moisture-wicking cork oak bark beds and organic plantation rubber. Self-shaping orthotic support that fits your exact gait footprint.',
    price: 55,
    discount: 0,
    rating: 4.4,
    reviewCount: 29,
    category: 'Footwear',
    brand: 'HyggeSpace',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Insole': '100% Natural Portuguese Cork',
      'Outsole': 'Raw organic tree sap rubber',
      'Width': 'Standard medium orthotic fit',
      'Straps': 'Felt lining hypoallergenic'
    },
    stock: 62,
    ecoScore: 98,
    carbonSaved: 41,
    isNewArrival: true,
    reviews: []
  },
  {
    id: 'acc-1',
    name: 'SmartCommerce Solar Smartwatch',
    description: 'A revolutionary hybrid smart wearable packing high-density solar absorption rings. Harnesses normal indoor and ambient outdoor light to extend standby charging battery life indefinitely, boasting full health metrics.',
    price: 249,
    discount: 10,
    rating: 4.7,
    reviewCount: 93,
    category: 'Accessories',
    brand: 'SmartCommerce',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Glass Material': 'Solar-charging Sapphire Crystal',
      'Sensors': 'Precision SpO2, Heart Rate, ECG Tracker',
      'Battery Life': 'Infinite Standby / 30 Days GPS-mode',
      'Casing': 'Grade-5 Aerospace Titanium'
    },
    stock: 18,
    ecoScore: 92,
    carbonSaved: 64,
    isBestSeller: true,
    reviews: []
  },
  {
    id: 'acc-2',
    name: 'Minimalist Utility Backpack',
    description: 'Slim metropolitan backpack milled from fully waterproof military ballistic fabrics. Styled with 14 organized sections including padded safety sleeves for 16" laptops.',
    price: 85,
    discount: 5,
    rating: 4.6,
    reviewCount: 38,
    category: 'Accessories',
    brand: 'AeroStreets',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Volume': '22 Liters Compact capacity',
      'Main Fiber': '1680D Post-Industrial Ballistic Polyester',
      'YKK Seams': 'Polyurethane Water-sealed',
      'Grip handle': 'Unbreakable Cordura canvas'
    },
    stock: 13, // low stock alert!
    ecoScore: 89,
    carbonSaved: 16,
    isTrending: true,
    reviews: []
  },
  {
    id: 'app-1',
    name: 'SmartBrew Eco Induction Oven',
    description: 'An advanced kitchen induction cooktop and smart mini oven. High frequency heating elements reflect 100% core energy directly, consuming 40% less household wattage than traditional ovens.',
    price: 299,
    discount: 10,
    rating: 4.7,
    reviewCount: 78,
    category: 'Home Appliances',
    brand: 'SmartBrew',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Efficiency': 'EnergyStar Level A+++ Rating',
      'Capacity': '28L Dual-compartment',
      'Connectivity': 'Wi-Fi companion commands app',
      'Power Scale': '150W - 2200W Smooth Induction'
    },
    stock: 14, // low stock alert!
    ecoScore: 91,
    carbonSaved: 185,
    isBestSeller: true,
    reviews: []
  },
  {
    id: 'app-2',
    name: 'Barista Smart Espresso Machine',
    description: 'A barista-grade professional home extraction engine. Fully automated grain grinding and smart volumetric milk micro-foaming customized directly via touch panel settings on the client interface.',
    price: 599,
    discount: 15,
    rating: 4.9,
    reviewCount: 52,
    category: 'Home Appliances',
    brand: 'SmartBrew',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Pressure Pump': '19-Bar Italian Extraction Pump',
      'Thermal block': 'Stellar PID precise Temperature limits',
      'Burr Grinder': '30 Coaction level settings',
      'Waste recycling': 'Compacts user coffee tablets'
    },
    stock: 7, // low stock
    ecoScore: 90,
    carbonSaved: 110,
    isNewArrival: true,
    reviews: []
  },
  {
    id: 'ele-3',
    name: 'SmartCommerce Go Speaker',
    description: 'Compact hand-woven Bluetooth speaker wrapping high-density solar absorption rings. Fabricated elegantly from premium organic bamboo frames and post-consumer recycled fabrics delivering high acoustic resonance.',
    price: 119,
    discount: 5,
    rating: 4.7,
    reviewCount: 46,
    category: 'Electronics',
    brand: 'SmartCommerce',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Material': '100% Sustainable Bamboo Casing',
      'Acoustics': 'Dual 15W High-fidelity Drivers',
      'Power Source': 'Light-charged Solar + 24hr Internal Cell',
      'Resistance': 'IPX7 Waterproof rated'
    },
    stock: 22,
    ecoScore: 95,
    carbonSaved: 34,
    isTrending: true,
    reviews: []
  },
  {
    id: 'ele-4',
    name: 'Sora AI Projector Core',
    description: 'A modular ultra-portable pocket projector featuring crisp 1080p high definition projections, 1200 ANSI Lumens peak luminosity, and sound systems calibrated by neural intelligence algorithms. Built with easily swappable modules for long lifetime serviceability.',
    price: 399,
    discount: 10,
    rating: 4.8,
    reviewCount: 29,
    category: 'Electronics',
    brand: 'SmartCommerce',
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Resolution': 'Native 1920x1080 HD LED Core',
      'Luminosity': '1200 ANSI Lumens Ambient boost',
      'Module Design': 'Magnetic easily upgradable lenses',
      'Interface': 'Smart OS with built-in voice companion'
    },
    stock: 18,
    ecoScore: 91,
    carbonSaved: 68,
    isNewArrival: true,
    reviews: []
  },
  {
    id: 'fas-3',
    name: 'AeroStreets Organic Cargo Pants',
    description: 'Adventure-ready utilitarian cargo trousers tailored cleanly from non-toxic, chemical-free hemp fibers and durable organic linen. Features water-resistant beeswax outer coating and multiple pocket segments.',
    price: 95,
    discount: 15,
    rating: 4.5,
    reviewCount: 39,
    category: 'Fashion',
    brand: 'AeroStreets',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Blend': '55% Fine Hemp / 45% Organic Linen',
      'Coating': 'Natural bio-wax hydrophobic shield',
      'Hardware': 'Recycled zinc rivets and brass buttons',
      'Fit': 'Spacious ergonomic utility tailoring'
    },
    stock: 28,
    ecoScore: 98,
    carbonSaved: 29,
    isTrending: false,
    reviews: []
  },
  {
    id: 'fas-4',
    name: 'Atmosphere Thermal Eco Jacket',
    description: 'Perfect outdoor thermal insulator packed with high-loft down replacement filaments crafted entirely from post-consumer recycled marine plastics. Delivers sub-zero warmth and structured with clean hidden geometric seams.',
    price: 189,
    discount: 20,
    rating: 4.9,
    reviewCount: 71,
    category: 'Fashion',
    brand: 'AeroStreets',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Shell': '100% Recycled Ripstop Nylon',
      'Insulation': 'OceanBio-Down synthetic filaments',
      'Temp Index': 'Rated to -15°C sub-zero comfort',
      'Zippers': 'Waterproof YKK recyclables'
    },
    stock: 12,
    ecoScore: 97,
    carbonSaved: 88,
    isBestSeller: true,
    reviews: []
  },
  {
    id: 'foo-3',
    name: 'Ecosystem Zero Desert Boots',
    description: 'Classic, highly stylish crepe sole desert boots hand-tailored from ethically sourced recycled suede splits and structured over natural plantation sap crepe beds. Unyielding comfort designed to be re-soled for generation-long lifespans.',
    price: 145,
    discount: 0,
    rating: 4.8,
    reviewCount: 43,
    category: 'Footwear',
    brand: 'SmartCommerce',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Material': 'Ethical recycled suede split leather',
      'Sole': '100% Pure Virgin Crepe rubber',
      'Eyelets': 'Aero-grade aluminum rivets',
      'Footbed': 'Anatomical cork cushioning'
    },
    stock: 15,
    ecoScore: 96,
    carbonSaved: 49,
    isNewArrival: true,
    reviews: []
  },
  {
    id: 'foo-4',
    name: 'Algae Sea Strand Sandals',
    description: 'Amazingly lightweight, water-floated beach slides. Fabricated completely from eco-restorative lake algae bio-elastomers, actively purifying water sources during harvesting. Exceptionally soft and orthotic.',
    price: 45,
    discount: 10,
    rating: 4.6,
    reviewCount: 88,
    category: 'Footwear',
    brand: 'HyggeSpace',
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Source': 'Bloom lake algae bio-foams',
      'Texture': 'Slip-resistant organic wave texture',
      'Cleaning': '100% Machine washable',
      'Footprint': 'Carbon neutral manufacturing cycle'
    },
    stock: 50,
    ecoScore: 99,
    carbonSaved: 56,
    isTrending: true,
    reviews: []
  },
  {
    id: 'acc-3',
    name: 'AeroStreets Cork RFID Wallet',
    description: 'Ultra-slim bi-fold pocket card holder crafted from water-impervious Portuguese cork oak wood bark split. Integrated with built-in aerospace aluminum RFID signal block sheets protecting personal cards.',
    price: 39,
    discount: 10,
    rating: 4.7,
    reviewCount: 54,
    category: 'Accessories',
    brand: 'AeroStreets',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Exterior': 'Natural moisture-wicking cork bark',
      'Shield': '13.56 MHz RFID signal absorber',
      'Capacity': 'Holds up to 8 cards + billfold gap',
      'Weight': 'Just 19 grams ultra-light'
    },
    stock: 40,
    ecoScore: 98,
    carbonSaved: 22,
    isNewArrival: false,
    reviews: []
  },
  {
    id: 'acc-4',
    name: 'Ecostrap Compostable Case',
    description: 'Protective high-impact smartphone backplate built entirely from organic wheat straw fibers flax polymers and starch complexes. Undergoes organic degradation safely inside home compost fields within 180 days.',
    price: 29,
    discount: 5,
    rating: 4.5,
    reviewCount: 110,
    category: 'Accessories',
    brand: 'SmartCommerce',
    image: 'https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Ingredients': 'Wheat Straw fibers + Plant starch polymers',
      'Impact test': '8ft Mil-grade drop dampening',
      'Magnetic': 'Includes plant-derived magnetic array support',
      'Texture': 'Natural earthy speckled tactile touch'
    },
    stock: 85,
    ecoScore: 99,
    carbonSaved: 18,
    isBestSeller: true,
    reviews: []
  },
  {
    id: 'app-3',
    name: 'PureAir Bio Moss Purifier',
    description: 'A revolutionary, quiet indoor air living purifier. Directs ambient household drafts over an active living forest moss core, working naturally to trap PM2.5 details and VOC pollutants while venting oxygen. Emits gorgeous amber glow.',
    price: 220,
    discount: 10,
    rating: 4.8,
    reviewCount: 31,
    category: 'Home Appliances',
    brand: 'SmartBrew',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Core filter': 'Living, renewable moss air cartridge',
      'Coverage': 'Clears rooms up to 450 sq ft securely',
      'Sound profile': 'Whisper-quiet 20dB night mode',
      'Power load': 'Extremely eco-conscious 5W peak'
    },
    stock: 11,
    ecoScore: 99,
    carbonSaved: 145,
    isTrending: true,
    reviews: []
  },
  {
    id: 'app-4',
    name: 'SmartBrew Clean Counter Bin',
    description: 'Elegant counter-top smart kitchen companion that dehydrates and compacts bio-waste meal leftovers, turning raw scraps into nutrient-wealthy dry garden organic fertilizing soil under 4 hours.',
    price: 349,
    discount: 15,
    rating: 4.9,
    reviewCount: 42,
    category: 'Home Appliances',
    brand: 'SmartBrew',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'],
    specs: {
      'Method': 'Thermal dehydration + micro grinding',
      'Aromas': 'Dual active charcoal filters trap, digest vapors',
      'Cycle latency': 'Under 4 hours to nutrient dust',
      'Bin Capacity': '2.5L high capacity meal bucket'
    },
    stock: 9,
    ecoScore: 96,
    carbonSaved: 280,
    isBestSeller: true,
    reviews: []
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Electronics', itemCount: 4, icon: '📱', color: 'from-blue-600 to-cyan-400' },
  { id: 'cat-2', name: 'Fashion', itemCount: 4, icon: '👕', color: 'from-indigo-600 to-purple-400' },
  { id: 'cat-3', name: 'Footwear', itemCount: 4, icon: '👟', color: 'from-orange-600 to-yellow-400' },
  { id: 'cat-4', name: 'Accessories', itemCount: 4, icon: '🎒', color: 'from-emerald-600 to-teal-400' },
  { id: 'cat-5', name: 'Home Appliances', itemCount: 4, icon: '🍳', color: 'from-pink-600 to-rose-450' }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'Alex Rivera', email: 'alex.rivera@gmail.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', status: 'active', registerDate: '2026-01-14', purchaseCount: 12, spent: 1480.00 },
  { id: 'cust-2', name: 'Sophia Carter', email: 'sophia.carter@outlook.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', status: 'active', registerDate: '2026-02-19', purchaseCount: 8, spent: 1045.00 },
  { id: 'cust-3', name: 'Marcus Thorne', email: 'm.thorne@techinnovations.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', status: 'active', registerDate: '2026-04-03', purchaseCount: 5, spent: 540.00 },
  { id: 'cust-4', name: 'Elise Green', email: 'elise.green@ecoforest.org', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80', status: 'active', registerDate: '2026-05-11', purchaseCount: 3, spent: 235.00 },
  { id: 'cust-5', name: 'Jamie Mercer', email: 'jamie.mercer@gmail.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80', status: 'inactive', registerDate: '2025-11-20', purchaseCount: 14, spent: 1890.00 }
];

export const COUPON_CODES: Record<string, number> = {
  'SMART20': 20,       // 20% Off as explicitly requested!
  'SAVEGREEN25': 25,   // 25% Off
  'WELCOME10': 10,     // 10% Off
  'BARGAIN50': 50      // 50% Off (Admin testing bypass)
};

export const LOCKSCREEN_WALLPAPERS = [
  { id: 'wp-1', name: 'Smart Blue Ambient', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
  { id: 'wp-2', name: 'Cosmic Indigo Canopy', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { id: 'wp-3', name: 'Glassmorphism Wave', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80' },
  { id: 'wp-4', name: 'Cybernetic Grid', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80' }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', title: 'First Steps', description: 'Complete your first virtual phone unlock', points: 50, icon: '🔓', unlocked: false },
  { id: 'ach-2', title: 'Savvy Researcher', description: 'Query the AI Chatbot Assistant for an item recommendation', points: 100, icon: '🤖', unlocked: false },
  { id: 'ach-3', title: 'Power Brand Adherent', description: 'Purchase an eco-friendly product with EcoScore > 90', points: 200, icon: '🌱', unlocked: false },
  { id: 'ach-4', title: 'Bargain Hunter', description: 'Apply a valid discount coupon (SMART20) at checkout', points: 150, icon: '🎟️', unlocked: false },
  { id: 'ach-5', title: 'E-commerce Champion', description: 'Complete an order of 3 or more items combined', points: 300, icon: '🛍️', unlocked: false },
  { id: 'ach-6', title: 'Productive Writer', description: 'Create and save a custom itemized Shopping Note', points: 100, icon: '📝', unlocked: false }
];

export const LIVE_STREAM_MESSAGES = [
  'Wow! This SmartCommerce interface is incredibly fluid!',
  'Adding the Pro Phone to my cart... spectacular specs!',
  'Is the Smartwatch really powered by light?',
  'Does code SMART20 actually give a 20% discount?',
  'Excellent design, perfect for college presentations!',
  'Placed my order, and instantly received the generated invoice!',
  'Love the dark glassmorphism styling here.',
  'Checking stock level: ANC Earbuds says only 9 left!',
  'Does the assistant reply instantly using Gemini?',
  'Beautiful! Best UI project I’ve seen.'
];
