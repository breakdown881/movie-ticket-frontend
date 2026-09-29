import { SeatType, SeatStatus } from './api.types';

export interface Hall {
  id: string;
  name: string;
  totalSeats: number;
  createdAt?: string;
}

export interface Seat {
  id: string;
  hallId: string;
  row: string;
  seatNumber: number;
  seatType: SeatType;
}

export interface ShowtimeSeatItem {
  id: string;
  row: string;
  seatNumber: number;
  seatType: SeatType;
  status: SeatStatus;
}

export interface GenerateSeatsPayload {
  rows: string[];
  seatsPerRow: number;
  vipRows?: string[];
}
