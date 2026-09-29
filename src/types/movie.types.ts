export interface Genre {
  id: string;
  name: string;
  description?: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  trailerUrl?: string;
  durationMinutes: number;
  releaseDate: string;
  endDate?: string;
  genres?: Genre[];
  createdAt?: string;
}

export interface MovieStatistics {
  movieId: string;
  movieTitle: string;
  totalTicketsSold: number;
  grossRevenue: number;
  totalShowtimes: number;
  lifetimeOccupancyRate?: number;
}

export interface CreateMoviePayload {
  title: string;
  description: string;
  posterUrl: string;
  trailerUrl?: string;
  durationMinutes: number;
  releaseDate: string;
  endDate?: string;
  genreIds?: string[];
}
