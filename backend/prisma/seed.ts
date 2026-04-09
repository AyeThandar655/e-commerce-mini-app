import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();

  // 50 products with real Unsplash images
  const productData = [
    // Electronics (15)
    {
      name: 'Wireless Noise-Cancelling Headphones',
      description:
        'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio.',
      price: 79.99,
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      stock: 50,
      category: 'Electronics',
    },
    {
      name: 'Bluetooth Portable Speaker',
      description:
        'Waterproof portable speaker with 360-degree sound and 12-hour playtime.',
      price: 49.99,
      imageUrl:
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
      stock: 75,
      category: 'Electronics',
    },
    {
      name: 'Wireless Earbuds Pro',
      description:
        'True wireless earbuds with active noise cancellation and transparency mode.',
      price: 129.99,
      imageUrl:
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
      stock: 100,
      category: 'Electronics',
    },
    {
      name: 'Smart Watch Series 5',
      description:
        'Fitness tracking smartwatch with heart rate monitor, GPS, and AMOLED display.',
      price: 199.99,
      imageUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      stock: 40,
      category: 'Electronics',
    },
    {
      name: '4K Ultra HD Webcam',
      description:
        '4K webcam with auto-focus, built-in ring light, and noise-cancelling microphone.',
      price: 89.99,
      imageUrl:
        'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop',
      stock: 60,
      category: 'Electronics',
    },
    {
      name: 'Mechanical Gaming Keyboard',
      description:
        'RGB mechanical keyboard with hot-swappable switches and aluminum frame.',
      price: 109.99,
      imageUrl:
        'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop',
      stock: 55,
      category: 'Electronics',
    },
    {
      name: 'Wireless Gaming Mouse',
      description:
        'Ultra-lightweight wireless mouse with 25K DPI sensor and 70-hour battery.',
      price: 59.99,
      imageUrl:
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
      stock: 80,
      category: 'Electronics',
    },
    {
      name: 'USB-C Hub 7-in-1',
      description:
        'Multiport adapter with HDMI 4K, USB 3.0, SD card reader, and 100W PD charging.',
      price: 39.99,
      imageUrl:
        'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop',
      stock: 120,
      category: 'Electronics',
    },
    {
      name: 'Portable SSD 1TB',
      description:
        'Ultra-fast external SSD with 1050MB/s read speed and shock-resistant design.',
      price: 89.99,
      imageUrl:
        'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&h=400&fit=crop',
      stock: 45,
      category: 'Electronics',
    },
    {
      name: 'Noise-Cancelling Microphone',
      description:
        'USB condenser microphone with cardioid pattern, perfect for podcasting and streaming.',
      price: 69.99,
      imageUrl:
        'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop',
      stock: 35,
      category: 'Electronics',
    },
    {
      name: 'Digital Camera Mirrorless',
      description:
        'Compact mirrorless camera with 24MP sensor, 4K video, and Wi-Fi connectivity.',
      price: 649.99,
      imageUrl:
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
      stock: 20,
      category: 'Electronics',
    },
    {
      name: 'Tablet 10-inch Display',
      description:
        '10-inch tablet with retina display, 64GB storage, and all-day battery life.',
      price: 329.99,
      imageUrl:
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
      stock: 30,
      category: 'Electronics',
    },
    {
      name: 'Power Bank 20000mAh',
      description:
        'High-capacity portable charger with 65W fast charging and LED display.',
      price: 34.99,
      imageUrl:
        'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
      stock: 90,
      category: 'Electronics',
    },
    {
      name: 'Electric Toothbrush',
      description:
        'Sonic electric toothbrush with 5 modes, smart timer, and 30-day battery.',
      price: 44.99,
      imageUrl:
        'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=400&fit=crop',
      stock: 70,
      category: 'Electronics',
    },
    {
      name: 'LED Desk Lamp',
      description:
        'Adjustable LED desk lamp with wireless charging base and 5 color temperatures.',
      price: 54.99,
      imageUrl:
        'https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?w=400&h=400&fit=crop',
      stock: 65,
      category: 'Electronics',
    },

    // Fashion & Accessories (10)
    {
      name: 'Classic Leather Watch',
      description:
        'Minimalist analog watch with genuine leather strap and sapphire crystal glass.',
      price: 149.99,
      imageUrl:
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
      stock: 25,
      category: 'Fashion',
    },
    {
      name: 'Polarized Sunglasses',
      description:
        'UV400 polarized sunglasses with lightweight titanium frame.',
      price: 59.99,
      imageUrl:
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
      stock: 85,
      category: 'Fashion',
    },
    {
      name: 'Canvas Backpack',
      description:
        'Durable canvas backpack with padded laptop compartment and anti-theft pocket.',
      price: 44.99,
      imageUrl:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      stock: 60,
      category: 'Fashion',
    },
    {
      name: 'Leather Wallet RFID',
      description:
        'Slim leather wallet with RFID blocking technology and 8 card slots.',
      price: 29.99,
      imageUrl:
        'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
      stock: 110,
      category: 'Fashion',
    },
    {
      name: 'Running Sneakers',
      description:
        'Lightweight running shoes with responsive cushioning and breathable mesh upper.',
      price: 89.99,
      imageUrl:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      stock: 45,
      category: 'Fashion',
    },
    {
      name: 'Cotton Baseball Cap',
      description:
        'Adjustable cotton baseball cap with embroidered logo and curved brim.',
      price: 19.99,
      imageUrl:
        'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=400&fit=crop',
      stock: 150,
      category: 'Fashion',
    },
    {
      name: 'Stainless Steel Water Bottle',
      description:
        'Double-wall insulated bottle keeps drinks cold 24hrs or hot 12hrs. BPA-free.',
      price: 24.99,
      imageUrl:
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
      stock: 200,
      category: 'Fashion',
    },
    {
      name: 'Crossbody Messenger Bag',
      description:
        'Vintage-style messenger bag with multiple compartments and adjustable strap.',
      price: 39.99,
      imageUrl:
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
      stock: 55,
      category: 'Fashion',
    },
    {
      name: 'Wool Beanie Hat',
      description:
        'Soft merino wool beanie with fleece lining for extra warmth.',
      price: 14.99,
      imageUrl:
        'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=400&fit=crop',
      stock: 130,
      category: 'Fashion',
    },
    {
      name: 'Silk Neck Tie',
      description:
        'Handcrafted 100% silk tie with classic pattern, perfect for formal occasions.',
      price: 34.99,
      imageUrl:
        'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=400&h=400&fit=crop',
      stock: 40,
      category: 'Fashion',
    },

    // Home & Living (10)
    {
      name: 'Scented Soy Candle Set',
      description:
        'Set of 3 hand-poured soy candles with natural essential oils. 40-hour burn time each.',
      price: 27.99,
      imageUrl:
        'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop',
      stock: 80,
      category: 'Home',
    },
    {
      name: 'Ceramic Plant Pot Set',
      description:
        'Modern minimalist ceramic pots with drainage holes. Set of 3 sizes.',
      price: 32.99,
      imageUrl:
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
      stock: 45,
      category: 'Home',
    },
    {
      name: 'Throw Blanket Cotton',
      description:
        'Ultra-soft cotton throw blanket with tassels. Machine washable.',
      price: 39.99,
      imageUrl:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      stock: 55,
      category: 'Home',
    },
    {
      name: 'Wall Art Canvas Print',
      description:
        'Abstract canvas wall art ready to hang. Gallery-wrapped on wooden frame.',
      price: 49.99,
      imageUrl:
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop',
      stock: 30,
      category: 'Home',
    },
    {
      name: 'Bamboo Cutting Board Set',
      description:
        'Eco-friendly bamboo cutting boards in 3 sizes with juice grooves.',
      price: 24.99,
      imageUrl:
        'https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=400&h=400&fit=crop',
      stock: 70,
      category: 'Home',
    },
    {
      name: 'French Press Coffee Maker',
      description:
        'Double-wall stainless steel French press for rich, flavorful coffee.',
      price: 29.99,
      imageUrl:
        'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=400&h=400&fit=crop',
      stock: 50,
      category: 'Home',
    },
    {
      name: 'Linen Cushion Covers',
      description:
        'Set of 4 linen cushion covers in neutral tones. 18x18 inches with hidden zipper.',
      price: 22.99,
      imageUrl:
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop',
      stock: 65,
      category: 'Home',
    },
    {
      name: 'Essential Oil Diffuser',
      description:
        'Ultrasonic aroma diffuser with LED mood lighting and auto shut-off.',
      price: 34.99,
      imageUrl:
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
      stock: 40,
      category: 'Home',
    },
    {
      name: 'Kitchen Knife Set',
      description:
        'Professional 5-piece stainless steel knife set with wooden block.',
      price: 59.99,
      imageUrl:
        'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=400&fit=crop',
      stock: 35,
      category: 'Home',
    },
    {
      name: 'Desk Organizer Wood',
      description:
        'Handcrafted wooden desk organizer with compartments for pens, phone, and cards.',
      price: 19.99,
      imageUrl:
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop',
      stock: 90,
      category: 'Home',
    },

    // Sports & Fitness (8)
    {
      name: 'Yoga Mat Premium',
      description:
        'Non-slip TPE yoga mat with alignment lines. 6mm thick with carrying strap.',
      price: 34.99,
      imageUrl:
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
      stock: 75,
      category: 'Sports',
    },
    {
      name: 'Resistance Bands Set',
      description:
        'Set of 5 resistance bands with different strengths, door anchor, and carry bag.',
      price: 19.99,
      imageUrl:
        'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop',
      stock: 100,
      category: 'Sports',
    },
    {
      name: 'Adjustable Dumbbell Set',
      description:
        'Space-saving adjustable dumbbells from 5-25 lbs with quick-change mechanism.',
      price: 149.99,
      imageUrl:
        'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400&h=400&fit=crop',
      stock: 25,
      category: 'Sports',
    },
    {
      name: 'Sports Gym Bag',
      description:
        'Spacious duffel bag with shoe compartment and wet pocket. Water-resistant.',
      price: 29.99,
      imageUrl:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      stock: 60,
      category: 'Sports',
    },
    {
      name: 'Jump Rope Speed',
      description:
        'Weighted speed jump rope with ball bearings and adjustable cable length.',
      price: 12.99,
      imageUrl:
        'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=400&fit=crop',
      stock: 120,
      category: 'Sports',
    },
    {
      name: 'Foam Roller Muscle',
      description:
        'High-density foam roller for deep tissue massage and muscle recovery.',
      price: 22.99,
      imageUrl:
        'https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?w=400&h=400&fit=crop',
      stock: 55,
      category: 'Sports',
    },
    {
      name: 'Fitness Tracker Band',
      description:
        'Slim fitness band with step counter, sleep tracking, and 7-day battery life.',
      price: 39.99,
      imageUrl:
        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop',
      stock: 85,
      category: 'Sports',
    },
    {
      name: 'Stainless Steel Shaker',
      description:
        'Protein shaker bottle with mixing ball and measurement markings. Leak-proof.',
      price: 14.99,
      imageUrl:
        'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=400&h=400&fit=crop',
      stock: 95,
      category: 'Sports',
    },

    // Books & Stationery (7)
    {
      name: 'Leather Journal Notebook',
      description:
        'Handmade leather-bound journal with 240 pages of acid-free paper.',
      price: 24.99,
      imageUrl:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
      stock: 50,
      category: 'Books',
    },
    {
      name: 'Fountain Pen Set',
      description:
        'Elegant fountain pen with 6 ink cartridges in a premium gift box.',
      price: 29.99,
      imageUrl:
        'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop',
      stock: 40,
      category: 'Books',
    },
    {
      name: 'Desk Calendar 2026',
      description:
        'Minimalist desk calendar with monthly views and note sections.',
      price: 12.99,
      imageUrl:
        'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=400&fit=crop',
      stock: 80,
      category: 'Books',
    },
    {
      name: 'Colored Pencil Set 48pc',
      description:
        'Professional-grade colored pencils with soft cores for smooth blending.',
      price: 18.99,
      imageUrl:
        'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop',
      stock: 60,
      category: 'Books',
    },
    {
      name: 'Bookend Set Marble',
      description: 'Pair of heavy marble bookends with non-slip felt pads.',
      price: 34.99,
      imageUrl:
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=400&fit=crop',
      stock: 30,
      category: 'Books',
    },
    {
      name: 'Sticky Notes Variety Pack',
      description:
        'Assorted colors and sizes sticky notes. 1200 sheets total for home and office.',
      price: 8.99,
      imageUrl:
        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop',
      stock: 200,
      category: 'Books',
    },
    {
      name: 'Reading Book Light',
      description:
        'Rechargeable clip-on book light with 3 brightness levels and flexible neck.',
      price: 15.99,
      imageUrl:
        'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=400&fit=crop',
      stock: 70,
      category: 'Books',
    },
  ];

  const products = await Promise.all(
    productData.map((data) => prisma.product.create({ data })),
  );

  console.log(`Created ${String(products.length)} products`);

  // Create sample user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create cart for user
  await prisma.cart.create({
    data: { userId: user.id },
  });

  console.log('Created cart for user');
  console.log('Database seed completed successfully!');
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
