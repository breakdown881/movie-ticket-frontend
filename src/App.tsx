import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';

// Khởi tạo Query Client cho toàn ứng dụng
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tránh refetch liên tục khi chuyển tab
      retry: 1
    }
  }
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        {/* Toaster thông báo popup hiện đại ở góc trên bên phải */}
        <Toaster richColors position="top-right" theme="dark" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;