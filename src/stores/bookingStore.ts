import { create } from "zustand";
import { Reservation } from "../types/booking.types";
import { ShowtimeSeatItem } from "../types/cinema.types";
import { Showtime } from "../types/showtime.types";

interface BookingState {
    currentShowtime: Showtime | null
    selectedSeats: ShowtimeSeatItem[]
    currentReservation: Reservation | null

    setShowtime: (showtiem: Showtime) => void
    toggleSeatSelection: (seat: ShowtimeSeatItem) => void
    setReservation: (reservation: Reservation) => void
    clearBooking: () => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
    currentShowtime: null,
    selectedSeats: [],
    currentReservation: null,

    setShowtime: (showtime: Showtime) => set({ currentShowtime: showtime }),
    
    // Thêm hoặc gỡ ghế đang chọn
    toggleSeatSelection: (seat: ShowtimeSeatItem) => {
        const current = get().selectedSeats;
        const exists = current.find((s) => s.id === seat.id)

        if (exists) {
            set({selectedSeats: current.filter((s) => s.id !== seat.id)})
        } else {
            // Giới hạn tối đa chọn 8 ghế trong 1 lần đặt
            if (current.length >= 8) {
                throw new Error('Bạn chỉ được chọn tối đa 8 ghế trong một lần đặt!')
            }
            set({selectedSeats: [...current, seat]})
        }
    },

    setReservation: (reservation: Reservation) => set({ currentReservation: reservation }),
    
    clearBooking: () => set({
        selectedSeats: [],
        currentReservation: null
    })
}))