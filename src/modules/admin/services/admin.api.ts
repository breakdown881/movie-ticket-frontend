import axiosClient from "../../../services/axiosClient";
import { User, UserRole } from "../../../types/auth.types";
import { Discount } from "../../../types/booking.types";
import { GenerateSeatsPayload, Hall } from "../../../types/cinema.types";
import { CreateMoviePayload, Genre, Movie } from "../../../types/movie.types";
import { CreateShowtimePayload, Showtime } from "../../../types/showtime.types";

export const adminApi = {
    // ===== 1. QUẢN LÝ PHIM & THỂ LOẠI =====
    createMovie: async (payload: CreateMoviePayload): Promise<Movie> => {
        return axiosClient.post('/movies', payload);
    },

    updateMovie: async (id: string, payload: Partial<CreateMoviePayload>): Promise<Movie> => {
        return axiosClient.put(`/movies/${id}`, payload);
    },

    deleteMovie: async (id: string): Promise<{ message: string }> => {
        return axiosClient.delete(`/movies/${id}`);
    },

    createGenre: async (name: string, description?: string): Promise<Genre> => {
        return axiosClient.post('/movies/genres', { name, description });
    },

    // ===== 2. QUẢN LÝ PHÒNG CHIẾU & SINH GHẾ TỰ ĐỘNG =====
    createHall: async (name: string, totalSeats: number): Promise<Hall> => {
        return axiosClient.post('/halls', { name, totalSeats });
    },

    // API Sinh ma trận ghế tự động (Level 2 Concurrency Matrix)
    generateSeats: async (hallId: string, payload: GenerateSeatsPayload): Promise<{ message: string; count: number }> => {
        return axiosClient.post(`/halls/${hallId}/seats/generate`, payload);
    },

    // ===== 3. QUẢN LÝ LỊCH CHIẾU =====
    createShowtime: async (payload: CreateShowtimePayload): Promise<Showtime> => {
        return axiosClient.post('/showtimes', payload);
    },

    deleteShowtime: async (id: string): Promise<{ message: string }> => {
        return axiosClient.delete(`/showtimes/${id}`);
    },

    // ===== 4. QUẢN LÝ MÃ KHUYẾN MÃI (DISCOUNTS) =====
    getAllDiscounts: async (): Promise<Discount[]> => {
        return axiosClient.get('/discounts');
    },
    
    createDiscount: async (payload: Partial<Discount>): Promise<Discount> => {
        return axiosClient.post('/discounts', payload);
    },

    deleteDiscount: async (id: string): Promise<{ message: string }> => {
        return axiosClient.delete(`/discounts/${id}`);
    },

    // ===== 5. QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN RBAC =====
    getAllUsers: async (): Promise<User[]> => {
        return axiosClient.get('/users');
    },

    promoteUserRole: async (userId: string, role: UserRole): Promise<User> => {
        return axiosClient.patch(`/users/${userId}/role`, { role });
    },
};

export default adminApi