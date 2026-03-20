// Pricing based on prevailing market rates in Kerala for premium open-air venues
// All prices in INR

export const VENUE_PRICING = {
  hourly: {
    base: 5000,     // ₹5,000 per hour
    label: 'Per Hour',
    description: 'Minimum 4 hours booking',
    minUnits: 4,
  },
  daily: {
    base: 35000,    // ₹35,000 per day
    label: 'Per Day',
    description: 'Full day access (10 AM - 10 PM)',
    minUnits: 1,
  },
  weekly: {
    base: 200000,   // ₹2,00,000 per week
    label: 'Per Week',
    description: '7 days continuous access',
    minUnits: 1,
  },
};

export const VALUE_ADDED_SERVICES = [
  {
    id: 'security',
    name: 'Event Security',
    category: 'Essential',
    description: 'Professional security personnel for your event. Uniformed guards with event management experience.',
    pricing: '₹2,500 per guard per shift (8 hrs)',
    pricePerUnit: 2500,
    unit: 'guard/shift',
    icon: 'Shield',
  },
  {
    id: 'parking',
    name: 'Valet Parking',
    category: 'Essential',
    description: 'Organized parking management with valet service. Capacity for up to 100 vehicles.',
    pricing: '₹15,000 flat rate (up to 50 cars) | ₹25,000 (up to 100 cars)',
    pricePerUnit: 15000,
    unit: 'package',
    icon: 'Car',
  },
  {
    id: 'catering',
    name: 'Premium Catering',
    category: 'Food & Beverage',
    description: 'Authentic Kerala cuisine with multi-cuisine options. Sadya, BBQ, Continental, Chinese & more. Vegetarian and non-vegetarian options.',
    pricing: 'From ₹800 per plate (veg) | ₹1,200 per plate (non-veg)',
    pricePerUnit: 800,
    unit: 'plate',
    icon: 'UtensilsCrossed',
  },
  {
    id: 'bar',
    name: 'Bar Setup with Bartender',
    category: 'Food & Beverage',
    description: 'Professional bar setup with experienced bartenders. Premium spirits, cocktails, mocktails & beverages. All necessary permits arranged.',
    pricing: '₹35,000 setup + ₹500/guest (drinks package)',
    pricePerUnit: 35000,
    unit: 'setup',
    icon: 'Wine',
  },
  {
    id: 'music',
    name: 'Music & Sound System',
    category: 'Entertainment',
    description: 'Professional DJ with high-end sound system, or live band arrangements. Includes speakers, microphones, and lighting.',
    pricing: 'DJ: ₹25,000 | Live Band: from ₹50,000 | Sound System: ₹15,000',
    pricePerUnit: 15000,
    unit: 'package',
    icon: 'Music',
  },
  {
    id: 'games',
    name: 'Fun & Games',
    category: 'Entertainment',
    description: 'Bouncy castles, carnival games, team building activities, traditional Kerala games (Uriyadi, Kambam), photo booth & more.',
    pricing: 'From ₹10,000 per activity package',
    pricePerUnit: 10000,
    unit: 'package',
    icon: 'Gamepad2',
  },
  {
    id: 'decoration',
    name: 'Theme Decorations',
    category: 'Accessories',
    description: 'Complete theme decoration packages — floral arrangements, lighting, mandaps, arches, table settings, and custom props.',
    pricing: 'From ₹50,000 (basic) | ₹1,50,000 (premium) | Custom quotes available',
    pricePerUnit: 50000,
    unit: 'package',
    icon: 'Sparkles',
  },
  {
    id: 'photography',
    name: 'Photography & Videography',
    category: 'Accessories',
    description: 'Professional photography and cinematic videography. Drone shots of the lush venue, candid moments, and post-production.',
    pricing: 'Photo: ₹30,000 | Video: ₹50,000 | Combo: ₹70,000',
    pricePerUnit: 30000,
    unit: 'package',
    icon: 'Camera',
  },
  {
    id: 'lighting',
    name: 'Ambient & Event Lighting',
    category: 'Accessories',
    description: 'Fairy lights among coconut trees, LED installations, spotlights, lanterns, and custom lighting designs.',
    pricing: 'From ₹20,000',
    pricePerUnit: 20000,
    unit: 'package',
    icon: 'Lightbulb',
  },
  {
    id: 'transport',
    name: 'Guest Transportation',
    category: 'Essential',
    description: 'Airport pickup, hotel transfers, and local transportation for guests. AC buses, luxury cars, and auto-rickshaws available.',
    pricing: 'From ₹5,000 per vehicle per day',
    pricePerUnit: 5000,
    unit: 'vehicle/day',
    icon: 'Bus',
  },
];

export const EVENT_TYPES = [
  { id: 'wedding', name: 'Wedding', icon: 'Heart' },
  { id: 'office_party', name: 'Office Party', icon: 'Briefcase' },
  { id: 'retirement', name: 'Retirement Party', icon: 'Award' },
  { id: 'family', name: 'Family Event', icon: 'Users' },
  { id: 'birthday', name: 'Birthday Party', icon: 'Cake' },
  { id: 'anniversary', name: 'Anniversary', icon: 'Star' },
  { id: 'corporate', name: 'Corporate Event', icon: 'Building' },
  { id: 'reunion', name: 'Reunion', icon: 'UsersRound' },
  { id: 'cultural', name: 'Cultural Event', icon: 'Palette' },
  { id: 'other', name: 'Other', icon: 'Calendar' },
];

export function calculateVenueCost(
  durationType: 'hourly' | 'daily' | 'weekly',
  units: number
): number {
  const pricing = VENUE_PRICING[durationType];
  const effectiveUnits = Math.max(units, pricing.minUnits);
  return pricing.base * effectiveUnits;
}
