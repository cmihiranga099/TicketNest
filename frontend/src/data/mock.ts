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
  },
  {
    id: "m4",
    title: "Neon Tide",
    genre: "Thriller",
    duration_min: 118,
    rating: "R",
    synopsis: "A dockworker uncovers a smuggling ring hidden beneath the city lights.",
    poster_url: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "m5",
    title: "Skyline Run",
    genre: "Action",
    duration_min: 110,
    rating: "PG-13",
    synopsis: "A courier must cross a locked-down metropolis before sunrise.",
    poster_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "m6",
    title: "Golden Vale",
    genre: "Family",
    duration_min: 96,
    rating: "PG",
    synopsis: "Two siblings discover a secret valley that grants one wish.",
    poster_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop"
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
  },
  {
    id: "s4",
    movie_id: "m4",
    hall: "Nova Hall",
    starts_at: "2024-09-19T21:30:00",
    base_price_cents: 1500
  },
  {
    id: "s5",
    movie_id: "m5",
    hall: "Aurora Hall",
    starts_at: "2024-09-20T18:00:00",
    base_price_cents: 1600
  },
  {
    id: "s6",
    movie_id: "m6",
    hall: "Echo Hall",
    starts_at: "2024-09-20T16:15:00",
    base_price_cents: 1100
  }
];

export const seatLayout = {
  rows: ["A", "B", "C", "D", "E", "F"],
  seatsPerRow: 10,
  booked: ["A3", "A4", "B7", "C1", "D5"],
  locked: ["B2", "F9"]
};
