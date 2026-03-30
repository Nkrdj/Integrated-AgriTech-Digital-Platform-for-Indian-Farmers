const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Advisory = require('../models/Advisory');
const { Scheme, SchemeApplication, MandiPrice } = require('../models/Scheme');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisanhub';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({}),
      Advisory.deleteMany({}), Scheme.deleteMany({}), MandiPrice.deleteMany({}),
      SchemeApplication.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // ── Admin user ──────────────────────────────────────
    const admin = await User.create({
      firstName: 'Admin', lastName: 'User',
      email: 'admin@example.com', phone: '0000000000',
      password: 'password123', role: 'admin',
      state: 'Tamil Nadu', district: 'Coimbatore', isActive: true
    });
    console.log('👤 Admin created — admin@example.com / password123');

    // ── Farmer user ─────────────────────────────────────
    const farmer = await User.create({
      firstName: 'Farmer', lastName: 'User',
      email: 'farmer@example.com', phone: '0000000000',
      password: 'password123', role: 'farmer',
      state: 'Tamil Nadu', district: 'Coimbatore', village: 'Annur',
      primaryCrop: 'Rice', landAcres: 4.2, language: 'Tamil'
    });
    console.log('🌾 Farmer created — farmer@example.com / password123');


    // ── Products ─────────────────────────────────────────
    const products = await Product.insertMany([
      { name: 'IR-64 Paddy Seeds',       category: 'seeds',      emoji: '🌾', imageUrl: '/images/seeds.png',      price: 85,   unit: 'per kg',     stock: 450, description: 'High-yielding semi-dwarf variety. Suitable for all seasons.', brand: 'IARI', createdBy: admin._id },
      { name: 'Hybrid Maize Seeds',       category: 'seeds',      emoji: '🌽', imageUrl: '/images/seeds.png',      price: 220,  unit: 'per kg',     stock: 180, description: 'Single cross hybrid. 110-day crop duration.', brand: 'Pioneer', createdBy: admin._id },
      { name: 'BT Cotton Seeds PKT',      category: 'seeds',      emoji: '🌿', imageUrl: '/images/seeds.png',      price: 950,  unit: 'per packet', stock: 35,  description: 'Bollgard II technology. High yield potential.', brand: 'Mahyco', createdBy: admin._id },
      { name: 'Hybrid Tomato Seeds',      category: 'seeds',      emoji: '🍅', imageUrl: '/images/seeds.png',      price: 320,  unit: 'per packet', stock: 60,  description: 'Indeterminate type. Disease resistant.', brand: 'Syngenta', createdBy: admin._id },
      { name: 'Urea 46% Nitrogen',        category: 'fertilizer', emoji: '🧪', imageUrl: '/images/fertilizer.png', price: 320,  unit: 'per bag',    stock: 12,  description: 'Prilled urea for topdressing. 50 kg bag.', brand: 'IFFCO', createdBy: admin._id },
      { name: 'DAP Fertilizer 50kg',      category: 'fertilizer', emoji: '🧫', imageUrl: '/images/fertilizer.png', price: 1350, unit: 'per bag',    stock: 95,  description: 'Di-ammonium phosphate. 18-46-0 grade.', brand: 'Coromandel', createdBy: admin._id },
      { name: 'NPK 19:19:19 5kg',         category: 'fertilizer', emoji: '⚗️', imageUrl: '/images/fertilizer.png', price: 540,  unit: 'per bag',    stock: 60,  description: 'Water soluble NPK. For foliar spray and fertigation.', brand: 'SQM', createdBy: admin._id },
      { name: 'Organic Compost 25kg',     category: 'fertilizer', emoji: '🌱', imageUrl: '/images/fertilizer.png', price: 180,  unit: 'per bag',    stock: 200, description: 'Enriched vermicompost. OMRI certified.', brand: 'BioGreen', createdBy: admin._id },
      { name: 'Chlorpyrifos 20 EC 1L',    category: 'pesticide',  emoji: '🛡️', imageUrl: '/images/pesticide.png',  price: 450,  unit: 'per litre',  stock: 80,  description: 'Broad spectrum insecticide. Controls stem borers and soil insects.', brand: 'Dow', createdBy: admin._id },
      { name: 'Neem Oil Spray 1L',        category: 'pesticide',  emoji: '🍃', imageUrl: '/images/pesticide.png',  price: 280,  unit: 'per litre',  stock: 60,  description: 'Organic pest repellent. Safe for beneficial insects.', brand: 'NaturePlus', createdBy: admin._id },
      { name: 'Mancozeb 75% WP 500g',     category: 'pesticide',  emoji: '🔬', imageUrl: '/images/pesticide.png',  price: 190,  unit: 'per pack',   stock: 110, description: 'Broad spectrum fungicide. Controls blast and blight.', brand: 'Indofil', createdBy: admin._id },
      { name: 'Emamectin Benzoate 250g',  category: 'pesticide',  emoji: '💊', imageUrl: '/images/pesticide.png',  price: 620,  unit: 'per pack',   stock: 0,   description: 'Highly effective against lepidopterous pests.', brand: 'Syngenta', createdBy: admin._id },
      { name: 'Knapsack Sprayer 16L',     category: 'equipment',  emoji: '🔧', imageUrl: '/images/equipment.png',  price: 1200, unit: 'per piece',  stock: 25,  description: 'Manual piston pump sprayer. Adjustable nozzle.', brand: 'Aspee', createdBy: admin._id },
      { name: 'Drip Irrigation Kit 1ac',  category: 'equipment',  emoji: '💧', imageUrl: '/images/equipment.png',  price: 4500, unit: 'per set',    stock: 10,  description: 'Complete drip kit for 1 acre. Lateral + emitters included.', brand: 'Jain', createdBy: admin._id },
      { name: 'Soil pH Testing Kit',      category: 'equipment',  emoji: '🧑‍🔬', imageUrl: '/images/equipment.png',  price: 350,  unit: 'per kit',    stock: 40,  description: '50-test kit. Measures pH, N, P, K levels.', brand: 'Kelway', createdBy: admin._id },
      { name: 'Solar Fence Energizer',    category: 'equipment',  emoji: '⚡', imageUrl: '/images/equipment.png',  price: 3200, unit: 'per unit',   stock: 8,   description: '2J solar powered fence controller. 5km range.', brand: 'Koltec', createdBy: admin._id },
    ]);
    console.log(`📦 ${products.length} products created`);

    // ── Advisories ───────────────────────────────────────
    await Advisory.insertMany([
      { title: 'Rice Stem Borer Detected', type: 'pest', crop: 'Rice', severity: 'high', content: 'Apply Cartap Hydrochloride 50% SP @ 1.0 kg/ha dissolved in 500 L of water. Drain fields before application. Monitor light traps and repeat treatment in 10 days if infestation persists. Set pheromone traps at 5 per hectare for monitoring.', createdBy: admin._id },
      { title: 'Urea Top Dressing Schedule', type: 'fertilizer', crop: 'Rice', severity: 'medium', content: 'Apply 30 kg Urea per hectare at panicle initiation stage. Ensure 5 cm standing water in field before application. Best time is evening (after 4 PM) to minimise volatilisation losses. Do not apply before rain.', createdBy: admin._id },
      { title: 'Skip Irrigation — Rain Expected', type: 'irrigation', crop: 'All Crops', severity: 'medium', content: 'Heavy rainfall forecast Thursday–Friday. Skip scheduled irrigation on Wednesday. Ensure field drainage channels are cleared by Wednesday evening to prevent waterlogging. Resume irrigation Saturday if soil at 5 cm depth is dry.', createdBy: admin._id },
      { title: 'Cotton Bollworm Alert', type: 'pest', crop: 'Cotton', severity: 'high', content: 'Bollworm populations increasing in Coimbatore and Erode districts. Install pheromone traps at 5 per hectare. Spray Emamectin Benzoate 5% SG @ 220 g/ha if 5 or more larvae per 10 plants observed. Rotate with Spinosad for resistance management.', createdBy: admin._id },
      { title: 'Pre-season Soil Testing', type: 'soil', crop: 'All Crops', severity: 'low', content: 'Get soil tested at nearest KVK or TNAU before next sowing season. Test for pH, organic carbon, available N, P, K and micronutrients. Free testing available at District Agriculture Office with farmer card. Results in 7 working days.', createdBy: admin._id },
      { title: 'Post-harvest Straw Management', type: 'general', crop: 'Rice', severity: 'low', content: 'Do not burn paddy straw — burning destroys beneficial soil microbes and contributes to air pollution. Instead: incorporate into soil using a rotavator (subsidised at KVK), make vermicompost, or use as mulch for next crop. Contact your block agricultural officer for rotavator subsidy.', createdBy: admin._id },
    ]);
    console.log('📋 6 advisories created');

    // ── Schemes ──────────────────────────────────────────
    await Scheme.insertMany([
      { title: 'PM Fasal Bima Yojana', ministry: 'Ministry of Agriculture & Farmers Welfare', emoji: '🌾', category: 'insurance', description: 'Comprehensive crop insurance covering losses due to natural calamities, pest and disease outbreaks. Subsidised premium of 1.5–5% for farmers.', benefits: 'Financial support up to 100% of insured sum for total crop loss.', eligibility: 'All farmers growing notified crops in notified areas. Loanee farmers mandatorily covered.', tags: ['Insurance', 'All Crops', 'Natural Calamity'], deadline: 'Apply by 31 Mar 2026', createdBy: admin._id },
      { title: 'PM-KISAN Direct Benefit Transfer', ministry: 'Ministry of Agriculture & Farmers Welfare', emoji: '💰', category: 'direct_benefit', description: 'Income support of ₹6,000 per year in three equal instalments of ₹2,000 directly credited to eligible farmer bank accounts.', benefits: '₹6,000 per year credited in 3 instalments.', eligibility: 'All land-holding farmer families with cultivable land. Subject to exclusion criteria.', tags: ['Direct Transfer', '₹6,000/year', 'All Farmers'], deadline: 'Ongoing — Enroll anytime', createdBy: admin._id },
      { title: 'Kisan Credit Card (KCC)', ministry: 'NABARD / RBI', emoji: '💳', category: 'loan', description: 'Short-term revolving credit for agricultural needs, post-harvest expenses and allied activities at subsidised interest rates of 4–7% per annum.', benefits: 'Credit limit based on land and crop. Interest subvention of 3% for timely repayment.', eligibility: 'All farmers, sharecroppers, tenant farmers and SHG members.', tags: ['Credit', 'Low Interest', 'Short-term Loan'], deadline: 'Apply at nearest bank branch', createdBy: admin._id },
      { title: 'Soil Health Card Scheme', ministry: 'Ministry of Agriculture', emoji: '🧪', category: 'other', description: 'Provides soil health cards with crop-wise nutrient recommendations for individual farms based on soil testing results.', benefits: 'Free soil testing and personalised fertilizer recommendation card.', eligibility: 'All farmers. Card issued once every 2 years.', tags: ['Free Testing', 'Fertilizer Guide', 'Soil Health'], deadline: 'Ongoing — Visit KVK', createdBy: admin._id },
      { title: 'PM Krishi Sinchayee Yojana', ministry: 'Ministry of Jal Shakti', emoji: '💧', category: 'subsidy', description: 'Subsidy for micro-irrigation systems (drip and sprinkler) to improve water use efficiency and enhance crop productivity.', benefits: 'Up to 55% subsidy for small/marginal farmers. 45% for others.', eligibility: 'All farmers with own or leased land. Priority to SC/ST and small/marginal farmers.', tags: ['Drip Irrigation', '55% Subsidy', 'Water Conservation'], deadline: 'Apply by 30 Jun 2026', createdBy: admin._id },
      { title: 'NABARD Farm Mechanisation Subsidy', ministry: 'NABARD', emoji: '⚙️', category: 'subsidy', description: 'Financial assistance for purchase of farm machinery and equipment to reduce labour costs and improve operational efficiency.', benefits: '40–50% subsidy on eligible machinery. Higher subsidy for SC/ST farmers.', eligibility: 'Individual farmers, FPOs, cooperative societies. Subject to state scheme guidelines.', tags: ['Equipment', '40–50% Subsidy', 'Mechanisation'], deadline: 'Apply by 15 Apr 2026', createdBy: admin._id },
    ]);
    console.log('🏛️  6 schemes created');

    // ── Mandi Prices ─────────────────────────────────────
    const today = new Date();
    await MandiPrice.insertMany([
      { crop: 'Rice (Ponni)', emoji: '🌾', price: 2100, unit: 'per quintal', market: 'Erode APMC',      state: 'Tamil Nadu', prevPrice: 2036, change: 64,   date: today },
      { crop: 'Maize',        emoji: '🌽', price: 1450, unit: 'per quintal', market: 'Salem APMC',      state: 'Tamil Nadu', prevPrice: 1465, change: -15,  date: today },
      { crop: 'Onion',        emoji: '🧅', price: 1820, unit: 'per quintal', market: 'Coimbatore APMC', state: 'Tamil Nadu', prevPrice: 1680, change: 140,  date: today },
      { crop: 'Tomato',       emoji: '🍅', price: 890,  unit: 'per quintal', market: 'Coimbatore APMC', state: 'Tamil Nadu', prevPrice: 938,  change: -48,  date: today },
      { crop: 'Cotton',       emoji: '🌿', price: 6200, unit: 'per quintal', market: 'Tirupur APMC',    state: 'Tamil Nadu', prevPrice: 6120, change: 80,   date: today },
      { crop: 'Groundnut',    emoji: '🥜', price: 5100, unit: 'per quintal', market: 'Pollachi APMC',   state: 'Tamil Nadu', prevPrice: 5050, change: 50,   date: today },
      { crop: 'Sugarcane',    emoji: '🎋', price: 3200, unit: 'per quintal', market: 'Erode APMC',      state: 'Tamil Nadu', prevPrice: 3150, change: 50,   date: today },
      { crop: 'Banana',       emoji: '🍌', price: 1650, unit: 'per quintal', market: 'Coimbatore APMC', state: 'Tamil Nadu', prevPrice: 1720, change: -70,  date: today },
    ]);
    // ── Orders ───────────────────────────────────────────
    await Order.create({
      farmer: farmer._id,
      items: [
        { product: products[4]._id, name: products[4].name, emoji: products[4].emoji, price: products[4].price, quantity: 2, subtotal: products[4].price * 2 },
        { product: products[8]._id, name: products[8].name, emoji: products[8].emoji, price: products[8].price, quantity: 1, subtotal: products[8].price }
      ],
      subtotal: products[4].price * 2 + products[8].price,
      tax: Math.round((products[4].price * 2 + products[8].price) * 0.05),
      total: (products[4].price * 2 + products[8].price) + 60 + Math.round((products[4].price * 2 + products[8].price) * 0.05),
      status: 'processing',
      statusStep: 1
    });
    console.log('📦 1 sample order created');

    // ── Scheme Applications ───────────────────────────────
    const schemes = await Scheme.find();
    await SchemeApplication.create({
      farmer: farmer._id,
      scheme: schemes[0]._id,
      status: 'pending'
    });
    console.log('📜 1 scheme application created');

    console.log('\n✅ Database seeded successfully!');
    console.log('─────────────────────────────────────');
    console.log('  Admin:  admin@example.com / password123');
    console.log('  Farmer: farmer@example.com / password123');
    console.log('─────────────────────────────────────\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
