// Seeded, deterministic demo data. Every run of the demo sees the same
// restaurants, prices and friends. Swap this out for a real API behind
// src/services/restaurantService.js.

export const TAX_RATE = 0.09375; // San José sales tax used for estimates and carts
export const DELIVERY_SERVICE_RATE = 0.12; // service fee on delivery orders

export const HOME = { lat: 37.3352, lng: -121.8811, label: 'SJSU · Downtown San José' };

export const CUISINES = ['Pizza', 'Burgers', 'Mexican', 'Chinese', 'Indian', 'Sushi', 'Thai', 'Coffee'];

// [name, category, base price]
const MENUS = {
  Pizza: [
    ['Cheese slice', 'Mains', 3.75], ['Pepperoni slice', 'Mains', 4.25], ['Margherita pie (12")', 'Mains', 14],
    ['Garlic knots (6)', 'Sides', 5], ['Caesar salad', 'Sides', 7.5], ['Fountain soda', 'Drinks', 2.5],
  ],
  Burgers: [
    ['Classic cheeseburger', 'Mains', 8.5], ['Double smash burger', 'Mains', 11.5], ['Veggie burger', 'Mains', 9.5],
    ['Fries', 'Sides', 3.75], ['Onion rings', 'Sides', 4.75], ['Milkshake', 'Drinks', 5.5],
  ],
  Mexican: [
    ['Street tacos (2)', 'Mains', 6.5], ['Carne asada burrito', 'Mains', 10.5], ['Chicken quesadilla', 'Mains', 9],
    ['Chips & guacamole', 'Sides', 5.5], ['Elote', 'Sides', 4.5], ['Horchata', 'Drinks', 3.5],
  ],
  Chinese: [
    ['Chow mein', 'Mains', 9.5], ['Kung pao chicken', 'Mains', 12.5], ['Mapo tofu', 'Mains', 11],
    ['Pork dumplings (6)', 'Sides', 7], ['Egg rolls (2)', 'Sides', 4.5], ['Jasmine tea', 'Drinks', 2.5],
  ],
  Indian: [
    ['Chana masala', 'Mains', 10.5], ['Chicken tikka masala', 'Mains', 13.5], ['Veg biryani', 'Mains', 12],
    ['Garlic naan', 'Sides', 3.5], ['Samosas (2)', 'Sides', 5], ['Mango lassi', 'Drinks', 4.5],
  ],
  Sushi: [
    ['California roll', 'Mains', 7.5], ['Spicy tuna roll', 'Mains', 9], ['Salmon nigiri (4)', 'Mains', 10],
    ['Miso soup', 'Sides', 3], ['Edamame', 'Sides', 4.5], ['Green tea', 'Drinks', 2.5],
  ],
  Thai: [
    ['Pad see ew', 'Mains', 11], ['Pad thai', 'Mains', 11.5], ['Green curry', 'Mains', 12.5],
    ['Spring rolls (2)', 'Sides', 5.5], ['Tom yum soup', 'Sides', 6.5], ['Thai iced tea', 'Drinks', 4.5],
  ],
  Coffee: [
    ['Bagel & cream cheese', 'Mains', 4.5], ['Breakfast burrito', 'Mains', 7.5], ['Avocado toast', 'Mains', 8.5],
    ['Blueberry muffin', 'Sides', 3.75], ['Latte', 'Drinks', 4.75], ['Cold brew', 'Drinks', 4.25],
  ],
};

const D = 'delivery';
const C = 'carryout';
const I = 'dinein';

// [id, name, cuisine, miles north, miles east, rating, price factor, fulfillment, delivery fee, street]
const SEEDS = [
  ['tonys', "Tony's Pizza", 'Pizza', 0.5, 0.4, 4.4, 0.95, [D, C, I], 2.99, 'E San Fernando St'],
  ['slice', 'Slice Republic', 'Pizza', -0.3, 0.2, 4.1, 0.9, [C, I], 0, 'S 4th St'],
  ['fornaio', 'Fornaio Napoletana', 'Pizza', 1.4, -1.1, 4.7, 1.25, [D, C, I], 3.99, 'The Alameda'],
  ['burgerspot', 'Burger Spot', 'Burgers', 0.6, -0.4, 4.2, 1.0, [D, C, I], 2.49, 'W Santa Clara St'],
  ['smash', 'Smash Shack', 'Burgers', -1.2, 0.9, 4.5, 1.1, [D, C], 3.49, 'Story Rd'],
  ['grill408', 'Grill 408', 'Burgers', 2.1, 1.3, 4.0, 0.9, [C, I], 0, 'N 13th St'],
  ['tacohouse', 'Taco House', 'Mexican', 0.4, 0.7, 4.3, 1.0, [D, C, I], 1.99, 'E Santa Clara St'],
  ['pastor', 'El Pastor Truck', 'Mexican', -0.6, 1.2, 4.6, 0.85, [C], 0, 'E William St'],
  ['rosa', 'La Cocina de Rosa', 'Mexican', 1.8, 2.2, 4.4, 1.15, [D, I], 3.49, 'Alum Rock Ave'],
  ['goldenwok', 'Golden Wok', 'Chinese', 0.8, -0.2, 4.0, 0.95, [D, C, I], 2.99, 'N 1st St'],
  ['dins', "Din's Dumpling House", 'Chinese', 1.1, 0.5, 4.6, 1.1, [C, I], 0, 'N 5th St'],
  ['szechuan', 'Szechuan Garden', 'Chinese', -2.3, -1.9, 4.3, 1.05, [D, C, I], 3.49, 'Meridian Ave'],
  ['curryup', 'Curry Up Cart', 'Indian', 0.2, 0.3, 4.3, 0.85, [C], 0, 'Paseo de San Antonio'],
  ['bombay', 'Bombay Spice Kitchen', 'Indian', 1.6, -0.8, 4.5, 1.05, [D, C, I], 3.49, 'Stockton Ave'],
  ['tandoori', 'Tandoori Nights', 'Indian', -1.5, 0.6, 4.1, 1.0, [D, C], 2.99, 'S 10th St'],
  ['sakura', 'Sakura Sushi Bar', 'Sushi', 0.7, 0.1, 4.4, 1.05, [D, C, I], 3.99, 'Jackson St'],
  ['rollcall', 'Roll Call', 'Sushi', -0.4, -0.6, 4.0, 0.9, [D, C], 2.99, 'S 2nd St'],
  ['kaze', 'Kaze Omakase', 'Sushi', 2.6, -1.4, 4.8, 1.4, [I], 0, 'Lincoln Ave'],
  ['thaibasil', 'Thai Basil', 'Thai', 0.3, -0.5, 4.3, 0.95, [D, C, I], 2.99, 'S Market St'],
  ['lotus', 'Lotus Thai Kitchen', 'Thai', 1.2, 1.0, 4.6, 1.1, [D, C, I], 3.49, 'E Julian St'],
  ['bangkok', 'Bangkok Express', 'Thai', -2.0, 2.4, 3.9, 0.85, [D, C], 1.99, 'Tully Rd'],
  ['spartan', 'Spartan Grind', 'Coffee', 0.1, 0.1, 4.4, 0.95, [C, I], 0, 'S 7th St'],
  ['beanthere', 'Bean There Café', 'Coffee', 0.9, 0.6, 4.2, 1.0, [D, C, I], 2.49, 'E St John St'],
  ['voyager', 'Voyager Roasters', 'Coffee', 1.3, -1.6, 4.7, 1.15, [C, I], 0, 'Park Ave'],
];

const LAT_PER_MILE = 1 / 69;
const LNG_PER_MILE = 1 / 54.9; // at ~37° N

const roundQuarter = (n) => Math.round(n * 4) / 4;
export const round2 = (n) => Math.round(n * 100) / 100;

function buildRestaurant([id, name, cuisine, north, east, rating, factor, fulfillment, deliveryFee, street]) {
  const menuItems = MENUS[cuisine].map(([itemName, category, base], i) => ({
    id: `${id}-${i}`,
    name: itemName,
    category,
    price: roundQuarter(base * factor),
  }));
  const cheapestMain = Math.min(...menuItems.filter((m) => m.category === 'Mains').map((m) => m.price));
  return {
    id,
    name,
    cuisine,
    address: `${street}, San José`,
    location: { lat: HOME.lat + north * LAT_PER_MILE, lng: HOME.lng + east * LNG_PER_MILE },
    rating,
    fulfillmentOptions: fulfillment,
    menuItems,
    fees: {
      delivery: fulfillment.includes(D) ? deliveryFee : null,
      deliveryServiceRate: DELIVERY_SERVICE_RATE,
    },
    // The "cheapest" promise: the cheapest main on the menu plus tax, for one person.
    estimatedCostPerPerson: round2(cheapestMain * (1 + TAX_RATE)),
    estimateBasis: menuItems.find((m) => m.price === cheapestMain && m.category === 'Mains').name,
  };
}

export const RESTAURANTS = SEEDS.map(buildRestaurant);

export const FRIENDS = [
  { id: 'alex', name: 'Alex Chen', prefs: ['Pizza', 'Mexican'], north: 0.3, east: 0.2 },
  { id: 'priya', name: 'Priya Nair', prefs: ['Indian', 'Thai'], north: -0.4, east: 0.5 },
  { id: 'jordan', name: 'Jordan Reyes', prefs: ['Burgers', 'Pizza'], north: 0.6, east: -0.3 },
  { id: 'mei', name: 'Mei Tanaka', prefs: ['Sushi', 'Chinese'], north: 0.2, east: -0.6 },
  { id: 'sam', name: 'Sam Okafor', prefs: ['Thai', 'Mexican'], north: -0.7, east: -0.2 },
  { id: 'diego', name: 'Diego Morales', prefs: ['Mexican', 'Burgers'], north: 0.9, east: 0.8 },
].map((f) => ({
  ...f,
  location: { lat: HOME.lat + f.north * LAT_PER_MILE, lng: HOME.lng + f.east * LNG_PER_MILE },
}));

export const FULFILLMENT_LABELS = { delivery: 'Delivery', carryout: 'Carry-out', dinein: 'Dine-in' };
