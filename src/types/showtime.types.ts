import { Movie } from './movie.types';
import { Hall } from './cinema.types';

export interface Showtime {
  id: string;
  movieId: string;
  hallId: string;
  startTime: string;
  endTime: string;
  price: number;
  movie?: Movie;
  hall?: Hall;
  createdAt?: string;
}

export interface CreateShowtimePayload {
  movieId: string;
  hallId: string;
  startTime: string;
  price: number;
}

export interface GetShowtimesQuery {
  movieId?: string;
  hallId?: string;
  date?: string;
}
