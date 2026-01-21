export const movies = [
  {
    id: "m1",
    title: "Dune: Part Two",
    genre: "Sci-Fi",
    duration_min: 166,
    rating: "PG-13",
    synopsis: "Paul Atreides unites with the Fremen while a war for Arrakis tests prophecy and power.",
    poster_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "m2",
    title: "Oppenheimer",
    genre: "Drama",
    duration_min: 180,
    rating: "R",
    synopsis: "The story of J. Robert Oppenheimer and the race to build the first atomic bomb.",
    poster_url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "m3",
    title: "Inside Out 2",
    genre: "Animation",
    duration_min: 96,
    rating: "PG",
    synopsis: "Riley navigates a new school year as unexpected emotions join Headquarters.",
    poster_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "m4",
    title: "Godzilla x Kong: The New Empire",
    genre: "Action",
    duration_min: 115,
    rating: "PG-13",
    synopsis: "Godzilla and Kong face a hidden threat that could end their world.",
    poster_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "m5",
    title: "A Quiet Place: Day One",
    genre: "Horror",
    duration_min: 99,
    rating: "PG-13",
    synopsis: "A woman in New York survives the day the world goes silent.",
    poster_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "m6",
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animation",
    duration_min: 140,
    rating: "PG",
    synopsis: "Miles Morales teams with Spider-heroes across the multiverse to stop a new threat.",
    poster_url: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1000&auto=format&fit=crop"
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
