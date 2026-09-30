import axiosClient from "../../../services/axiosClient";
import { CheckoutPayload, CreatePaymentUrlPayload, CreatePaymentUrlResponse, HoldSeatsPayload, HoldSeatsResponse, Reservation, ValidateDiscountPayload, ValidateDiscountResponse } from "../../../types/booking.types";
import { ShowtimeSeatItem } from "../../../types/cinema.types";

export const bookingApi = {
    // 1. Lấy sơ đồ ghế real-time của suất chiếu (Ghép Physical Seats + Redis Held + DB Confirmed)
    getShowtimeSeats: async (showtimeId: string): Promise<ShowtimeSeatItem[]> => {
        return axiosClient.get(`/reservations/showtimes/${showtimeId}/seats`)
    },

    // 2. Tạm giữ ghế 10 phút (Kích hoạt Redis Distributed Lock & RabbitMQ Delay Queue)
    holdSeats: async (payload: HoldSeatsPayload): Promise<HoldSeatsResponse> => {
        return axiosClient.post('/reservations/hold', payload)
    },

    // 3. Hủy đơn giữ chỗ
    cancelReservation: async (reservationId: string): Promise<{ message: string; reservationId: string }> => {
        return axiosClient.patch(`/reservations/${reservationId}/cancel`)
    },

    // 4. Kiểm tra mã giảm giá (Discount voucher)
    validateDiscount: async (payload: ValidateDiscountPayload): Promise<ValidateDiscountResponse> => {
        return axiosClient.post('/discounts/validate', payload)
    },

    // 5. Tạo URL thanh toán online (VNPay / MoMo)
    createPaymentUrl: async (payload: CreatePaymentUrlPayload): Promise<CreatePaymentUrlResponse> => {
        return axiosClient.post('/payments/create-url', payload)
    },

    // 6. Thanh toán trực tiếp (Mock / Cash / Sandbox)
    checkout: async (payload: CheckoutPayload): Promise<{ message: string; reservation: Reservation }> => {
        return axiosClient.post('/payments/checkout', payload)
    }
}

export default bookingApi