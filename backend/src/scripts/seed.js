const { query, initDB, pool } = require("../config/db");

const sampleHotels = [
  {
    title: "The Palm Retreat",
    description: "Relax in a tropical luxury resort with a beautiful swimming pool, spacious rooms, lush garden views, private cabanas, and premium hospitality crafted for leisure.",
    price: 4500,
    latitude: 13.0827,
    longitude: 80.2707,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: 142,
  },
  {
    title: "Ocean Pearl Resort",
    description: "Enjoy a peaceful coastal escape with modern interiors, ocean-inspired spaces, relaxing sound of waves, and beachside dining experiences.",
    price: 6500,
    latitude: 9.9252,
    longitude: 78.1198,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 210,
  },
  {
    title: "Green Valley Escape",
    description: "A comfortable nature retreat for families and weekend travellers, surrounded by mist-covered hills, organic plantation walks, and fresh mountain air.",
    price: 2800,
    latitude: 11.0168,
    longitude: 76.9558,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews: 88,
  },
  {
    title: "The Ivory Suites",
    description: "Contemporary urban accommodation with elegant suites, convenient business hub access, rooftop lounge, and thoughtful executive guest facilities.",
    price: 5200,
    latitude: 12.9716,
    longitude: 77.5946,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1000&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviews: 175,
  },
  {
    title: "Hilltop Heritage Stay",
    description: "Discover a charming hill retreat with warm wooden interiors, colonial architecture, scenic panoramic valley vistas, and a relaxing fireplace atmosphere.",
    price: 3200,
    latitude: 10.0889,
    longitude: 77.0595,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1000&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: 95,
  },
  {
    title: "Royal Courtyard Hotel",
    description: "Experience classic palatial elegance with beautifully styled courtyard corridors, comfortable luxury suites, chandeliers, and royal culinary hospitality.",
    price: 7800,
    latitude: 17.385,
    longitude: 78.4867,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 320,
  },
  {
    title: "Cedar House Boutique",
    description: "A welcoming boutique stay with natural stone textures, quiet pine tree surroundings, artisan breakfast, and cosy rooms for a thoroughly restful holiday.",
    price: 2400,
    latitude: 11.4102,
    longitude: 76.695,
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1000&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviews: 64,
  },
];

async function seedDatabase() {
  try {
    console.log("Ensuring database tables exist...");
    await initDB();

    console.log("Clearing existing hotel data...");
    await query("TRUNCATE TABLE hotels RESTART IDENTITY;");

    console.log(`Seeding ${sampleHotels.length} sample hotels...`);
    for (const hotel of sampleHotels) {
      await query(
        `INSERT INTO hotels (title, description, latitude, longitude, price, image, rating, reviews)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [
          hotel.title,
          hotel.description,
          hotel.latitude,
          hotel.longitude,
          hotel.price,
          hotel.image,
          hotel.rating,
          hotel.reviews,
        ]
      );
    }

    console.log("Seed completed successfully!");
  } catch (err) {
    console.error("Failed to seed database:", err);
  } finally {
    await pool.end();
  }
}

seedDatabase();
