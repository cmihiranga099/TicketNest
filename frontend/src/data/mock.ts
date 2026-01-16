export const movies = [
  {
    id: "m1",
    title: "Solar Drift",
    genre: "Sci-Fi",
    duration_min: 128,
    rating: "PG-13",
    synopsis: "A rogue navigator chases a drifting planet that emits strange signals.",
    poster_url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "m2",
    title: "Midnight Deli",
    genre: "Drama",
    duration_min: 102,
    rating: "PG",
    synopsis: "A chef opens a night-only diner that mends a fractured city.",
    poster_url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "m3",
    title: "Copper Crown",
    genre: "Adventure",
    duration_min: 140,
    rating: "PG-13",
    synopsis: "A forgotten kingdom hunts for the heir who never returned.",
    poster_url: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1000&auto=format&fit=crop"
  }
];

export const showtimes = [
  {
    id: "s1",
    movie_id: "m1",
    hall: "Aurora Hall",
    starts_at: "2024-09-18T18:30:00",
    base_price_cents: 1400
  },
  {
    id: "s2",
    movie_id: "m1",
    hall: "Aurora Hall",
    starts_at: "2024-09-18T21:15:00",
    base_price_cents: 1600
  },
  {
    id: "s3",
    movie_id: "m2",
    hall: "Echo Hall",
    starts_at: "2024-09-19T19:00:00",
    base_price_cents: 1200
  }
];

export const seatLayout = {
  rows: ["A", "B", "C", "D", "E", "F"],
  seatsPerRow: 10,
  booked: ["A3", "A4", "B7", "C1", "D5"],
  locked: ["B2", "F9"]
};
