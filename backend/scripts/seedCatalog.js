const BASE_URL = process.env.API_URL || "http://localhost:5000";

const CATEGORIES = [
  { name: "Electronics", description: "Phones, laptops, audio and accessories" },
  { name: "Fashion", description: "Clothing, footwear and accessories" },
  { name: "Home & Kitchen", description: "Cookware, decor and household essentials" },
  { name: "Books", description: "Fiction, non-fiction and educational titles" },
  { name: "Sports & Fitness", description: "Equipment and gear for sports and workouts" },
  { name: "Beauty & Personal Care", description: "Skincare, haircare and grooming" },
];

const PRODUCTS = {
  Electronics: [
    ["Aurora X1 Smartphone", "6.5-inch AMOLED display, 128GB storage, triple camera setup.", 2499900, 40],
    ["Nimbus 14 Laptop", "14-inch ultrabook, 16GB RAM, 512GB SSD, all-day battery life.", 5999900, 25],
    ["Pulse Fitness Smartwatch", "Heart-rate tracking, GPS, 7-day battery, water resistant.", 749900, 60],
    ["Clarity Pro Earbuds", "Active noise cancellation, 30-hour battery with case, IPX4 rated.", 399900, 80],
    ["FocusCam 4K Webcam", "4K resolution, auto-focus, built-in noise-cancelling mic.", 549900, 35],
    ["Zenith 11 Tablet", "11-inch display, stylus support, 64GB storage.", 1899900, 30],
    ["Streamline 27 Monitor", "27-inch QHD, 144Hz refresh rate, slim bezel.", 1599900, 20],
    ["TactileType Keyboard", "Mechanical keys, RGB backlight, USB-C connectivity.", 349900, 50],
    ["GlideMouse Wireless", "Ergonomic design, silent clicks, 2.4GHz + Bluetooth.", 129900, 90],
    ["VoltCore 20000 Power Bank", "20000mAh, fast charging, dual USB output.", 189900, 70],
    ["EchoBeam Bluetooth Speaker", "360-degree sound, 12-hour playtime, splash resistant.", 229900, 45],
    ["RapidCharge 65W Adapter", "GaN charger, compact design, dual-port fast charging.", 99900, 100],
  ],
  Fashion: [
    ["Classic Oxford Shirt", "100% cotton, regular fit, available in solid colours.", 129900, 60],
    ["Slim Fit Denim Jeans", "Stretchable denim, mid-rise, machine washable.", 149900, 55],
    ["Urban Bomber Jacket", "Lightweight polyester shell, ribbed cuffs.", 249900, 30],
    ["TrailWalk Sneakers", "Breathable mesh upper, cushioned sole.", 319900, 45],
    ["Handloom Cotton Saree", "Traditional handloom weave, 6-yard length.", 189900, 25],
    ["Festive Embroidered Kurta", "Cotton blend, embroidered yoke, unstitched set.", 169900, 35],
    ["Flowy Summer Dress", "Floral print, A-line cut, breathable fabric.", 139900, 40],
    ["Polarized Aviator Sunglasses", "UV400 protection, metal frame.", 89900, 70],
    ["Genuine Leather Belt", "Full-grain leather, reversible buckle.", 79900, 65],
    ["Everyday Leather Wallet", "RFID-blocking, slim bifold design.", 69900, 80],
    ["Classic Baseball Cap", "Adjustable strap, cotton twill.", 39900, 100],
    ["Weekender Canvas Bag", "Durable canvas, padded strap, spacious interior.", 219900, 30],
  ],
  "Home & Kitchen": [
    ["NonStick Cookware Set (5-pc)", "Induction-friendly, PFOA-free coating.", 299900, 25],
    ["PowerBlend Mixer Grinder", "750W motor, 3 jars, stainless steel blades.", 349900, 30],
    ["Cloud Soft Bedsheet Set", "King size, 300 thread count cotton.", 159900, 40],
    ["Blackout Window Curtains (Set of 2)", "Thermal insulated, room-darkening fabric.", 129900, 35],
    ["Ambience LED Table Lamp", "Touch-dimmable, warm white light.", 89900, 50],
    ["TurboSuck Vacuum Cleaner", "1200W, HEPA filter, bagless design.", 449900, 20],
    ["Porcelain Dinner Set (16-pc)", "Microwave and dishwasher safe.", 249900, 25],
    ["Airtight Storage Container Set", "BPA-free plastic, set of 10.", 59900, 60],
    ["Memory Foam Pillow (Pair)", "Cervical support, breathable cover.", 99900, 45],
    ["OrthoComfort Mattress (Queen)", "6-inch high-density foam, medium firm.", 899900, 15],
    ["Vintage Wall Clock", "Silent sweep movement, wooden frame.", 79900, 40],
    ["Insulated Steel Water Bottle", "24-hour cold retention, 1L capacity.", 69900, 90],
  ],
  Books: [
    ["The Silent Horizon (Fiction)", "A gripping tale of survival and hope.", 39900, 50],
    ["Atomic Focus (Self-Help)", "Practical strategies for building better habits.", 44900, 60],
    ["Unbroken Spirit (Biography)", "The inspiring life story of a trailblazer.", 34900, 40],
    ["The Everyday Chef (Cookbook)", "100 simple recipes for home cooking.", 49900, 35],
    ["Adventures of Pip (Children's Book)", "A colourful illustrated story for young readers.", 24900, 70],
    ["Foundations of Algebra (Textbook)", "Comprehensive guide for high school students.", 59900, 45],
    ["Guardians of Time (Comic)", "A graphic novel adventure across eras.", 29900, 55],
    ["Whispers in Verse (Poetry)", "A collection of contemporary poems.", 27900, 30],
    ["Wanderlust Diaries (Travel Guide)", "Hidden gems and travel tips across Asia.", 34900, 40],
    ["The Last Clue (Mystery)", "A detective thriller that keeps you guessing.", 32900, 50],
    ["Beyond the Stars (Sci-Fi)", "An interstellar journey of discovery.", 36900, 45],
    ["Empires of the Past (History)", "A deep dive into ancient civilisations.", 42900, 30],
  ],
  "Sports & Fitness": [
    ["ProGrip Yoga Mat", "6mm thickness, non-slip surface, carry strap included.", 79900, 60],
    ["IronCore Dumbbell Set", "Adjustable, 2.5kg to 10kg per dumbbell.", 349900, 25],
    ["StrikeMaster Cricket Bat", "English willow, lightweight grip.", 299900, 20],
    ["MatchPro Football (Size 5)", "FIFA-approved size, weather-resistant.", 99900, 50],
    ["SwiftAce Badminton Racket", "Carbon fibre shaft, lightweight frame.", 149900, 40],
    ["AirStride Running Shoes", "Responsive cushioning, breathable mesh.", 279900, 45],
    ["FlexPack Gym Bag", "Spacious compartments, shoe pocket.", 119900, 35],
    ["TensionBand Resistance Set", "5 resistance levels, door anchor included.", 69900, 55],
    ["SpeedRope Skipping Rope", "Adjustable length, ball-bearing handles.", 39900, 70],
    ["AeroShield Cycling Helmet", "Ventilated design, adjustable fit.", 159900, 30],
    ["HomeGlide Treadmill", "Foldable, 12 preset workout programs.", 2999900, 10],
    ["HydroShake Protein Shaker", "600ml, leak-proof, mixer ball included.", 29900, 90],
  ],
  "Beauty & Personal Care": [
    ["Gentle Foaming Face Wash", "For all skin types, sulphate-free.", 29900, 80],
    ["HydraGlow Moisturizer", "24-hour hydration, non-greasy formula.", 44900, 65],
    ["RepairPro Shampoo", "Sulphate-free, repairs damaged hair.", 34900, 70],
    ["Midnight Bloom Perfume", "Long-lasting floral fragrance, 50ml.", 149900, 35],
    ["Velvet Matte Lipstick", "Long-wear, smudge-proof formula.", 39900, 60],
    ["SunShield SPF 50 Sunscreen", "Broad spectrum, water-resistant.", 34900, 75],
    ["QuickDry Hair Dryer", "1800W, multiple heat settings.", 129900, 30],
    ["PrecisionCut Trimmer", "Cordless, 40-minute runtime.", 109900, 40],
    ["GlossFinish Nail Polish Set", "Set of 6 shades, quick-dry formula.", 49900, 50],
    ["Charcoal Detox Face Mask", "Deep cleansing, removes impurities.", 24900, 65],
    ["SilkTouch Body Lotion", "24-hour moisture, non-sticky.", 29900, 70],
    ["FreshGuard Deodorant", "48-hour protection, alcohol-free.", 19900, 100],
  ],
};

async function login() {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admintest@example.com",
      password: "AdminTest@2026",
    }),
  });
  const json = await res.json();
  if (!json.success) throw new Error("Admin login failed: " + json.message);
  return json.data.token;
}

async function getCategories(token) {
  const res = await fetch(`${BASE_URL}/api/categories`);
  const json = await res.json();
  return json.data;
}

async function ensureCategory(token, cat, existing) {
  const found = existing.find((c) => c.name === cat.name);
  if (found) return found._id;
  const res = await fetch(`${BASE_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cat),
  });
  const json = await res.json();
  if (!json.success) throw new Error("Category create failed: " + json.message);
  console.log(`  created category: ${cat.name}`);
  return json.data._id;
}

async function getProducts() {
  const res = await fetch(`${BASE_URL}/api/products`);
  const json = await res.json();
  return json.data;
}

async function createProduct(token, body) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error("Product create failed: " + json.message);
  return json.data;
}

async function main() {
  console.log("Logging in as admin...");
  const token = await login();

  console.log("Ensuring categories exist...");
  const existingCategories = await getCategories(token);
  const categoryIds = {};
  for (const cat of CATEGORIES) {
    categoryIds[cat.name] = await ensureCategory(token, cat, existingCategories);
  }

  console.log("Fetching existing products to avoid duplicates...");
  const existingProducts = await getProducts();
  const existingNames = new Set(existingProducts.map((p) => p.name));

  let created = 0;
  let skipped = 0;

  for (const [categoryName, items] of Object.entries(PRODUCTS)) {
    const categoryId = categoryIds[categoryName];
    for (const [name, description, price, initialStock] of items) {
      if (existingNames.has(name)) {
        skipped++;
        continue;
      }
      await createProduct(token, {
        name,
        description,
        price,
        category: categoryId,
        initialStock,
      });
      created++;
      process.stdout.write(".");
    }
  }

  console.log(`\nDone. Created: ${created}, Skipped (already existed): ${skipped}`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});
