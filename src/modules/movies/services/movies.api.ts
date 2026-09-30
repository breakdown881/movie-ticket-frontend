import axiosClient from "../../../services/axiosClient";
import { Genre, Movie, MovieStatistics } from "../../../types/movie.types";

export const moviesApi = {
    // Lấy toàn bộ danh sách phim
    getAllMovies: async (): Promise<Movie[]> => {
        return axiosClient.get('/movies')
    },

    // Lấy toàn bộ danh mục thể loại
    getGenres: async (): Promise<Genre[]> => {
        return axiosClient.get('/movies/genres')
    },

    // Lấy chi tiết một bộ phim theo ID
    getMovieById: async (id: string): Promise<Movie> => {
        return axiosClient.get(`/movies/${id}`)
    },

    // Lấy thống kê số vé bán và doanh thu phòng vé của phim
    getMovieStatistics: async (id: string): Promise<MovieStatistics> => {
        return axiosClient.get(`/movies/${id}/statistics`)
    }
}

export default moviesApi