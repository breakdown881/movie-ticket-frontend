import axiosClient from "../../../services/axiosClient";
import { Hall } from "../../../types/cinema.types";
import { GetShowtimesQuery, Showtime } from "../../../types/showtime.types";

export const showtimesApi = {
    // Lấy danh sách suất chiếu (có thể lọc theo movieId, hallId, date)
    getShowtimes: async (query?: GetShowtimesQuery): Promise<Showtime[]> => {
        return axiosClient.get('/showtimes', {params: query})
    },

    // Lấy chi tiết một suất chiếu theo ID
    getShowtimeById: async (id: string): Promise<Showtime> => {
        return axiosClient.get(`/showtimes/${id}`)
    },

    // Lấy danh sách tất cả các phòng chiếu / rạp
    getHalls: async (): Promise<Hall[]> => {
        return axiosClient.get('/halls')
    }
}

export default showtimesApi