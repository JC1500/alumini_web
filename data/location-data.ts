// src/data/location-data.ts

export type LocationData = Record<
  string,
  Record<string, string[]>
>;

export const locationData: LocationData = {
  Uttarakhand: {
    Dehradun: [
      "Dehradun",
      "Rishikesh",
      "Vikasnagar",
      "Mussoorie",
    ],
    Nainital: [
      "Haldwani",
      "Nainital",
      "Ramnagar",
      "Bhimtal",
    ],
    Haridwar: [
      "Haridwar",
      "Roorkee",
      "Manglaur",
      "Laksar",
    ],
    Almora: ["Almora", "Ranikhet", "Dwarahat"],
    Chamoli: ["Gopeshwar", "Joshimath", "Karnaprayag"],
    Pauri: ["Pauri", "Kotdwar", "Srinagar"],
    Tehri: ["New Tehri", "Chamba", "Narendranagar"],
    UdhamSinghNagar: [
      "Rudrapur",
      "Kashipur",
      "Kichha",
      "Khatima",
    ],
    Pithoragarh: ["Pithoragarh", "Dharchula"],
    Bageshwar: ["Bageshwar", "Kapkote"],
    Champawat: ["Champawat", "Tanakpur"],
    Uttarkashi: ["Uttarkashi", "Barkot"],
  },

  Delhi: {
    "Central Delhi": ["Daryaganj", "Karol Bagh"],
    "New Delhi": ["Connaught Place", "Chanakyapuri"],
    "South Delhi": ["Saket", "Mehrauli"],
  },

  Maharashtra: {
    Mumbai: ["Mumbai", "Bandra", "Andheri"],
    Pune: ["Pune", "Pimpri-Chinchwad", "Baramati"],
    Nagpur: ["Nagpur", "Kamptee"],
  },

  Karnataka: {
    BengaluruUrban: ["Bengaluru", "Yelahanka"],
    Mysuru: ["Mysuru", "Nanjangud"],
    Dharwad: ["Hubballi", "Dharwad"],
  },

  "Uttar Pradesh": {
    Lucknow: ["Lucknow", "Malihabad"],
    "Gautam Buddha Nagar": ["Noida", "Greater Noida"],
    Varanasi: ["Varanasi", "Ramnagar"],
    KanpurNagar: ["Kanpur"],
  },
};