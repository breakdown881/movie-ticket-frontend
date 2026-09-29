import { ReservationStatus, PaymentMethod, DiscountType } from './api.types';
import { Showtime } from './showtime.types';
import { Seat } from './cinema.types';

export interface Discount {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface ReservationSeat {
  id: string;
  reservationId: string;
  seatId: string;
  price: number;
  seat?: Seat;
}

export interface Reservation {
  id: string;
  userId: string;
  showtimeId: string;
  discountId?: string | null;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: ReservationStatus;
  expiresAt: string;
  reservationSeat?: ReservationSeat[];
  showtime?: Showtime;
  createdAt?: string;
}

export interface HoldSeatsPayload {
  showtimeId: string;
  seatIds: string[];
  discountCode?: string;
}

export interface HoldSeatsResponse {
  message: string;
  reservation: Reservation;
}

export interface ValidateDiscountPayload {
  code: string;
  orderAmount: number;
}

export interface ValidateDiscountResponse {
  valid: boolean;
  code: string;
  discountAmount: number;
  finalAmount: number;
  discount?: Discount;
}

export interface CreatePaymentUrlPayload {
  reservationId: string;
  paymentMethod: PaymentMethod;
  returnUrl?: string;
}

export interface CreatePaymentUrlResponse {
  paymentUrl: string;
}

export interface CheckoutPayload {
  reservationId: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentReturnResult {
  status: 'SUCCESS' | 'FAILED';
  message: string;
  reservationId?: string;
  transactionId?: string;
  amount?: number;
}
