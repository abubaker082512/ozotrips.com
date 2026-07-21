import passuImg from '../assets/passu cones.webp';
import attabadImg from '../assets/Attabad-Lake.webp';

export const attractions = [
  {
    id: 1,
    name: "Passu Cones",
    location: "Hunza Valley, Pakistan",
    category: "Mountain",
    image: passuImg,
    description: "Also known as Cathedral Ridge, these jagged, cone-shaped peaks rise over 6,000 meters above sea level along the Karakoram Highway, offering one of the most iconic mountain skylines in the world.",
    bestTime: "May to October",
    tourId: 1
  },
  {
    id: 2,
    name: "Attabad Lake",
    location: "Hunza Valley, Pakistan",
    category: "Scenic",
    image: attabadImg,
    description: "A stunning turquoise-colored lake formed in 2010 after a massive landslide. It offers boating, jet-skiing, and picturesque views framed by massive Karakoram peaks.",
    bestTime: "April to October",
    tourId: 1
  },
  {
    id: 3,
    name: "Fairy Meadows",
    location: "Gilgit-Baltistan, Pakistan",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    description: "A lush green alpine meadow nestled at the foot of Nanga Parbat, the ninth-highest mountain in the world. It provides breathtaking views and a base camp for trekking enthusiasts.",
    bestTime: "June to September",
    tourId: 2
  },
  {
    id: 4,
    name: "Katpana Cold Desert",
    location: "Skardu, Pakistan",
    category: "Scenic",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
    description: "One of the highest cold deserts in the world, characterized by white sand dunes that are occasionally covered in snow during winters, creating a surreal arctic desert experience.",
    bestTime: "May to September",
    tourId: 3
  },
  {
    id: 5,
    name: "Fushimi Inari Torii Gates",
    location: "Kyoto, Japan",
    category: "Historical",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    description: "The head shrine of the god Inari, famous for its winding path under thousands of vermilion torii gates that lead up Mount Inari, offering a mystical experience in Japan's cultural capital.",
    bestTime: "Year-round (Autumn is best)",
    tourId: 4
  },
  {
    id: 6,
    name: "Oia Cliffside Sunset",
    location: "Santorini, Greece",
    category: "Beach",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    description: "A picturesque village on the cliffs of Santorini, world-renowned for its stunning sunset views over the Aegean Sea, blue-domed churches, and whitewashed architecture.",
    bestTime: "May to October",
    tourId: 5
  },
  {
    id: 7,
    name: "The Matterhorn Peak",
    location: "Zermatt, Switzerland",
    category: "Mountain",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "One of the most famous and distinctive peaks in the Alps, straddling the border between Switzerland and Italy. A paradise for skiers, hikers, and mountaineers.",
    bestTime: "December to April (Ski), July to Sept (Hike)",
    tourId: 6
  },
  {
    id: 8,
    name: "Tegallalang Rice Terraces",
    location: "Ubud, Bali",
    category: "Scenic",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    description: "Lush green layered slopes famous for their traditional Balinese cooperative irrigation system (Subak), surrounded by tropical valleys and jungle swings.",
    bestTime: "April to October",
    tourId: 7
  },
  {
    id: 9,
    name: "Badshahi Mosque",
    location: "Lahore, Pakistan",
    category: "Historical",
    image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=800&q=80",
    description: "A colossal Mughal-era mosque built in 1673 by Emperor Aurangzeb. Its red sandstone walls, white marble domes, and vast courtyard represent the pinnacle of Mughal architecture.",
    bestTime: "October to March",
    tourId: 8
  },
  {
    id: 10,
    name: "Eiffel Tower",
    location: "Paris, France",
    category: "Historical",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "The world's most iconic iron tower standing tall in the heart of Paris beside the Seine River, offering beautiful city vistas.",
    bestTime: "Year-round",
    tourId: 5
  },
  {
    id: 11,
    name: "Pyramids of Giza",
    location: "Cairo, Egypt",
    category: "Historical",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80",
    description: "The last surviving wonder of the ancient world – massive monumental royal stone tombs built for Pharaohs.",
    bestTime: "October to April",
    tourId: 5
  },
  {
    id: 12,
    name: "Masjid al-Haram",
    location: "Makkah, Saudi Arabia",
    category: "Historical",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80",
    description: "The Great Mosque of Makkah – the largest mosque in the world, surrounding the holy Kaaba, offering a spiritual focus for millions of pilgrims.",
    bestTime: "Year-round",
    tourId: 9
  },
  {
    id: 13,
    name: "London Eye",
    location: "London, United Kingdom",
    category: "Scenic",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&w=800&q=80",
    description: "Gaze over the Thames, Big Ben, and the Parliament from this iconic giant observation wheel on the South Bank.",
    bestTime: "May to September",
    tourId: 5
  },
  {
    id: 14,
    name: "Jungfraujoch",
    location: "Bernese Alps, Switzerland",
    category: "Mountain",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    description: "The highest railway station in Europe at 3,454 meters, offering snowy glacier views and ice palace sculptures.",
    bestTime: "June to August",
    tourId: 6
  },
  {
    id: 15,
    name: "Male Overwater Villas",
    location: "Male Atoll, Maldives",
    category: "Beach",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    description: "Stay in luxury overwater bungalows floating on a turquoise Indian Ocean lagoon, offering direct private access to pristine water.",
    bestTime: "December to April",
    tourId: 7
  },
  {
    id: 16,
    name: "Sea of Stars",
    location: "Vaadhoo Island, Maldives",
    category: "Beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Witness bioluminescent plankton lighting up the shoreline like a glowing blue starry sky at night in a natural Maldives wonder.",
    bestTime: "June to October",
    tourId: 7
  },
  {
    id: 17,
    name: "Desert Safari Dunes",
    location: "Dubai, United Arab Emirates",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80",
    description: "Dune bashing, camel rides, sandboarding, and traditional Bedouin camp dinners under the night sky.",
    bestTime: "November to March",
    tourId: 8
  },
  {
    id: 18,
    name: "Hegra Historical Site",
    location: "Al-Ula, Saudi Arabia",
    category: "Historical",
    image: "https://images.unsplash.com/photo-1605886659779-7a760f384a6c?auto=format&fit=crop&w=800&q=80",
    description: "A UNESCO Heritage site containing monumental rock-cut tombs of the Nabataean Kingdom, carved with fine facades.",
    bestTime: "October to April",
    tourId: 9
  },
  {
    id: 19,
    name: "Mont Saint-Michel Abbey",
    location: "Normandy, France",
    category: "Historical",
    image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=800&q=80",
    description: "A stunning medieval abbey built on a tidal island, creating a surreal fairy-tale castle look when surrounded by water.",
    bestTime: "May to October",
    tourId: 5
  },
  {
    id: 20,
    name: "Banana Reef Marine Park",
    location: "North Male Atoll, Maldives",
    category: "Beach",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    description: "The Maldives' oldest diving site – incredible coral gardens, caves, and reef sharks offering top-tier snorkeling adventures.",
    bestTime: "December to April",
    tourId: 7
  }
];
