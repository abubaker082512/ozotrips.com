export const UMRAH_PRESETS = {
  economy: {
    name: "ECONOMY PACKAGE",
    inclusions: [
      "Return Flight",
      "E-Visa Processing",
      "Shared Ground Transport",
      "Accommodations",
      "24/7 Pilgrims Support"
    ],
    exclusions: [
      "Meals",
      "Travel and health insurance",
      "Laundry and room service charges"
    ]
  },
  classic_premium: {
    name: "GROUND CLASSIC & PREMIUM PACKAGES",
    inclusions: [
      "E-Visa Processing",
      "Ground Transport",
      "Accommodations",
      "24/7 Pilgrims Support"
    ],
    exclusions: [
      "Return Flight",
      "Meals",
      "Travel and health insurance",
      "Laundry and room service charges"
    ]
  },
  luxury: {
    name: "GROUND LUXURY PACKAGES",
    inclusions: [
      "E-Visa Processing",
      "Ground Transport",
      "Accommodations",
      "FREE Breakfast",
      "24/7 Pilgrims Support"
    ],
    exclusions: [
      "Return Flight",
      "Laundry and room service charges",
      "Travel and health insurance"
    ]
  }
};

export const tours = [
  {
    id: 1,
    title: "Hunza Valley Autumn Splendor",
    type: "local",
    category: "Mountain",
    image: "https://images.unsplash.com/photo-1627588147983-6cc33190df0e?auto=format&fit=crop&w=800&q=80",
    duration: "7 Days",
    rating: 4.9,
    reviews: 142,
    price: 350,
    currency: "$",
    description: "Witness the magical transition of Hunza Valley as the trees turn golden, orange, and red. Visit Altit & Baltit forts, walk the Attabad Lake suspension bridge, and view the majestic Rakaposhi peak.",
    highlights: ["Altit & Baltit Fort visits", "Boating in Attabad Lake", "Passu Cones view point", "Khunjerab Pass (Pak-China border)"]
  },
  {
    id: 2,
    title: "Fairy Meadows & Nanga Parbat Base Camp",
    type: "local",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    duration: "5 Days",
    rating: 4.8,
    reviews: 98,
    price: 280,
    currency: "$",
    description: "Embark on a thrilling jeep ride and a scenic hike to the legendary Fairy Meadows, offering an unmatched reflection of the world's ninth-highest mountain, Nanga Parbat, in the clear lakes.",
    highlights: ["Thrilling Tatto Jeep Track", "Camping under the stars", "Hike to Nanga Parbat Base Camp", "Stunning reflection lakes"]
  },
  {
    id: 3,
    title: "Skardu & Cold Desert Safari",
    type: "local",
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
    duration: "6 Days",
    rating: 4.7,
    reviews: 84,
    price: 320,
    currency: "$",
    description: "Discover the breathtaking beauty of Skardu. Traverse the sand dunes of Katpana Cold Desert, boat on Lower Kachura Lake (Shangrila), and visit the historic Kharpocho Fort overlooking the Indus River.",
    highlights: ["Katpana Cold Desert ATV rides", "Shangrila Resort & Lake visit", "Sadpara Lake view", "Deosai National Park day trip"]
  },
  {
    id: 4,
    title: "Kyoto Heritage & Zen Gardens",
    type: "international",
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    duration: "8 Days",
    rating: 4.9,
    reviews: 215,
    price: 1850,
    currency: "$",
    description: "Immerse yourself in Japan's cultural heart. Wander through Fushimi Inari Shrine's iconic torii gates, participate in a traditional tea ceremony, and admire the golden reflection of Kinkaku-ji temple.",
    highlights: ["Fushimi Inari Torii Gate trail", "Kinkaku-ji (Golden Pavilion)", "Traditional Tea Ceremony", "Bamboo forest of Arashiyama"]
  },
  {
    id: 5,
    title: "Santorini Sunset & Caldera Cruise",
    type: "international",
    category: "Beach",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    duration: "5 Days",
    rating: 4.9,
    reviews: 320,
    price: 1450,
    currency: "$",
    description: "Experience the ultimate Mediterranean dream in Santorini. Stay in iconic whitewashed cliffside villas, cruise around the volcanic caldera, and catch the world's most famous sunset at Oia.",
    highlights: ["Sunset catamaran cruise with dinner", "Wine tasting tour in local vineyards", "Explore Oia & Fira CLIFF pathways", "Swim in red and black sand beaches"]
  },
  {
    id: 6,
    title: "Swiss Alps Luxury Ski & Spa",
    type: "international",
    category: "Mountain",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    duration: "6 Days",
    rating: 4.8,
    reviews: 110,
    price: 2400,
    currency: "$",
    description: "An exquisite escape in Zermatt, overlooking the iconic Matterhorn. Enjoy world-class skiing, relax in outdoor heated thermal spas, and ride the Gornergrat rack railway for spectacular views.",
    highlights: ["All-inclusive ski pass", "Matterhorn glacier paradise access", "Luxury alpine spa treatments", "Panoramic Gornergrat railway ride"]
  },
  {
    id: 7,
    title: "Bali Beach & Rainforest Escape",
    type: "international",
    category: "Beach",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    duration: "7 Days",
    rating: 4.7,
    reviews: 412,
    price: 950,
    currency: "$",
    description: "Unwind amidst the tropical paradise of Bali. Relax on the golden sands of Nusa Dua, explore the lush monkey forests and rice terraces of Ubud, and visit the sacred sea temples.",
    highlights: ["Ubud Sacred Monkey Forest", "Tegallalang Rice Terrace swing", "Tanah Lot temple sunset view", "Snorkeling at Nusa Penida"]
  },
  {
    id: 8,
    title: "Lahore Mughal History & Food Walk",
    type: "local",
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=800&q=80",
    duration: "3 Days",
    rating: 4.9,
    reviews: 176,
    price: 120,
    currency: "$",
    description: "Delve into the architectural marvels of the Mughal Empire. Visit the grand Badshahi Mosque, explore Lahore Fort's Sheesh Mahal, and indulge in legendary street foods at Gawalmandi Food Street.",
    highlights: ["Badshahi Mosque & Lahore Fort tour", "Wazir Khan Mosque photo walk", "Food tasting tour at Old Lahore", "Wagah Border flag ceremony"]
  },
  {
    id: 9,
    title: "Economy Umrah Package",
    type: "international",
    category: "Umrah",
    presetType: "economy",
    image: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=800&q=80",
    duration: "15 Days",
    rating: 4.8,
    reviews: 64,
    price: 850,
    currency: "$",
    description: "Perform your holy pilgrimage with our highly-demanded Economy Umrah Package. Includes budget hotels and full guidance.",
    makkahHotel: "Al Kiswah Towers",
    makkahDistance: "900m",
    madinahHotel: "Al Kiswah Madinah",
    madinahDistance: "750m",
    inclusions: UMRAH_PRESETS.economy.inclusions,
    exclusions: UMRAH_PRESETS.economy.exclusions,
    highlights: ["Makkah Ziyarats (Jabal al-Nour)", "Madinah Ziyarats (Quba Mosque)", "24/7 on-ground assistance", "Comfortable air-conditioned buses"]
  },
  {
    id: 10,
    title: "Classic Ground Umrah Package",
    type: "international",
    category: "Umrah",
    presetType: "classic_premium",
    image: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80",
    duration: "10 Days",
    rating: 4.9,
    reviews: 42,
    price: 1100,
    currency: "$",
    description: "An elegant, ground-only travel solution for pilgrims. Stay closer to the Holy Haram in Makkah and Al-Masjid an-Nabawi in Madinah.",
    makkahHotel: "Hilton Suites Makkah",
    makkahDistance: "100m",
    madinahHotel: "Pullman Zamzam Madinah",
    madinahDistance: "150m",
    inclusions: UMRAH_PRESETS.classic_premium.inclusions,
    exclusions: UMRAH_PRESETS.classic_premium.exclusions,
    highlights: ["Close-range Haram accommodations", "Private executive transfers", "Guided Ziyarat sessions", "Zamzam water supply support"]
  },
  {
    id: 11,
    title: "Luxury Ground Umrah Package",
    type: "international",
    category: "Umrah",
    presetType: "luxury",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    duration: "12 Days",
    rating: 4.9,
    reviews: 31,
    price: 1850,
    currency: "$",
    description: "Experience maximum comfort and spiritual peace. Stay in ultra-luxury properties right on the courtyard of Haram and Masjid-an-Nabawi.",
    makkahHotel: "Makkah Clock Royal Tower (Fairmont)",
    makkahDistance: "0m (In Haram Court)",
    madinahHotel: "The Oberoi Madinah",
    madinahDistance: "50m",
    inclusions: UMRAH_PRESETS.luxury.inclusions,
    exclusions: UMRAH_PRESETS.luxury.exclusions,
    highlights: ["Zero-distance Haram Makkah stay", "Premium buffet breakfast", "VIP airport lounge transfers", "Private religious guide"]
  }
];
