# 🎬 Movie Ticket Reservation System (Frontend)

[![React](https://img.shields.io/badge/React-18%2F19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3%2Fv4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/Zustand-v4%2Fv5-443E38)](https://github.com/pmndrs/zustand)
[![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)

A high-performance, enterprise-grade movie theater ticketing client built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Seamlessly integrated with the **NestJS Backend Architecture** featuring real-time seat locking via Redis, RabbitMQ delay-queue hold expiration (10-minute timer), payment gateways (VNPay & MoMo), and Role-Based Access Control (RBAC).

---

## 📑 Table of Contents
1. [Architectural Overview](#-architectural-overview)
2. [Tech Stack & Decision Rationale](#-tech-stack--decision-rationale)
3. [Project Directory Structure](#-project-directory-structure)
4. [Screen Inventory & Backend API Mapping](#-screen-inventory--backend-api-mapping)
5. [Core Business Workflows](#-core-business-workflows)
6. [Getting Started & Installation](#-getting-started--installation)
7. [Environment Configuration (.env)](#-environment-configuration-env)
8. [Security & Web Vitals Optimization](#-security--web-vitals-optimization)
9. [Development Roadmap](#-development-roadmap)

---

## 🏛 Architectural Overview

The frontend architecture follows **Feature-driven Modular Design**, built for high concurrency handling, low latency state synchronization, and an immersive cinema dark theme.

```mermaid
flowchart TD
    Client["React 19 / Vite Client"] 
    API["NestJS Backend (port 3000 /api/v1)"]
    Redis["Redis Distributed Lock (10m TTL)"]
    Postgres["PostgreSQL Database"]
    RabbitMQ["RabbitMQ Delay Queue"]
    PaymentGateway["Payment Gateway (VNPay / MoMo)"]

    Client -->|1. Browse Movies & Showtimes| API
    Client -->|2. Fetch Real-time Seat Layout| API
    API -->|Merge DB Seats + Redis Locks| Client
    Client -->|3. Hold Seats (Acquire Lock)| API
    API -->|Atomic SETNX| Redis
    API -->|Record Pending Order| Postgres
    API -->|Enqueue 10m TTL Message| RabbitMQ
    Client -->|4. 10:00 Countdown & Checkout| API
    Client -->|5. Redirect to Gateway| PaymentGateway
    PaymentGateway -->|6. Return Callback URL| Client
    Client -->|7. Render Dynamic E-Ticket with QR| Client
```

---

## ⚡ Tech Stack & Decision Rationale

| Category | Technology | Rationale & Production Usage |
|---|---|---|
| **Core Framework** | **React 18+ / 19** | Industry standard reactive UI library, concurrent rendering, and fine-grained state updates |
| **Bundler & Tooling** | **Vite** | Instant server boot, lightning-fast Hot Module Replacement (HMR), optimized tree-shaking |
| **Language** | **TypeScript (Strict Mode)** | 100% Type-safety, contract synchronization with NestJS backend DTOs & response envelopes |
| **Styling Engine** | **Tailwind CSS** | Utility-first CSS, responsive dark cinema aesthetics, zero CSS runtime overhead |
| **UI Primitives** | **Radix UI / Shadcn UI** | Headless accessible components (WCAG 2.2 AA compliant), highly customizable dialogs & tabs |
| **Icons** | **Lucide React** | Lightweight, tree-shakable SVG iconography |
| **Client State** | **Zustand** | Minimal boilerplate global store for Authentication session & active Booking workflow |
| **Server State** | **TanStack Query (React Query v5)** | Declarative server-state caching, background re-fetching, deduplication, and seat polling |
| **Form Management** | **React Hook Form + Zod** | Controlled form performance, type-safe client-side schema matching backend class-validators |
| **HTTP Client** | **Axios** | Robust request/response interceptor pipeline (automatic JWT injection, unwrap NestJS data envelope) |
| **Routing & Guards** | **React Router DOM v6/v7** | Client routing with nested layouts, Public routes, Protected routes, and Admin RBAC Guards |
| **QR Code & Utilities** | **qrcode.react & date-fns** | Client-side QR generation for digital movie check-in and standardized date-time formatting |

---

## 📁 Project Directory Structure

```text
movie-ticket-frontend/
├── public/                     # Static assets, favicon, brand logos
├── src/
│   ├── assets/                 # SVGs, banners, movie posters placeholders
│   ├── common/                 # Shared cross-cutting components & utilities
│   │   ├── components/         # Base UI: Button, Input, Modal, Badge, Spinner
│   │   │   ├── ui/             # Radix / Shadcn primitives (Dialog, Dropdown, Tabs...)
│   │   │   └── feedback/       # ErrorBoundary, SkeletonLoader, EmptyState
│   │   ├── constants/          # Application enums: SeatType, OrderStatus, UserRole
│   │   ├── hooks/              # Custom hooks: useCountdown, useDebounce, useAuth
│   │   ├── layouts/            # ClientLayout, AdminLayout, AuthLayout
│   │   └── utils/              # formatCurrency (VND), formatDate, storage helpers
│   ├── config/                 # api.config.ts, routes.config.ts
│   ├── modules/                # Feature-driven domain modules
│   │   ├── auth/               # Sign In, Sign Up, Forgot/Reset Password, Social Auth
│   │   │   ├── components/     # LoginForm, RegisterForm, SocialButtons
│   │   │   ├── pages/          # LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage
│   │   │   └── services/       # auth.api.ts
│   │   ├── movies/             # Movie catalog & Genre classification
│   │   │   ├── components/     # MovieCard, MovieFilter, TrailerModal, MovieStatsCard
│   │   │   ├── pages/          # HomePage, MovieDetailPage, MovieListingPage
│   │   │   └── services/       # movies.api.ts
│   │   ├── showtimes/          # Screenings schedule & cinema halls
│   │   │   ├── components/     # DatePickerStrip, HallBadge, ShowtimeSlotPicker
│   │   │   └── pages/          # ShowtimeSchedulePage
│   │   ├── booking/            # Real-time seat map, hold lock, checkout & e-ticket
│   │   │   ├── components/     # SeatMatrix, SeatLegend, CountdownTimer, VoucherInput
│   │   │   ├── pages/          # SeatBookingPage, CheckoutPage, PaymentReturnPage, TicketDetailPage
│   │   │   └── services/       # booking.api.ts, payment.api.ts
│   │   ├── user/               # Customer account portal
│   │   │   ├── components/     # TicketHistoryCard, ProfileForm
│   │   │   ├── pages/          # UserProfilePage, MyTicketsPage
│   │   │   └── services/       # user.api.ts
│   │   └── admin/              # Management Portal (Protected by ADMIN Role)
│   │       ├── components/     # AdminSidebar, AdminHeader, SeatMatrixGenerator
│   │       ├── pages/          # DashboardPage, AdminMoviesPage, AdminHallsPage, AdminShowtimesPage, AdminDiscountsPage, AdminUsersPage
│   │       └── services/       # admin.api.ts
│   ├── routes/                 # AppRoutes.tsx, ProtectedRoute.tsx, AdminRoute.tsx
│   ├── services/               # axiosClient.ts (Interceptors, Base URL configuration)
│   ├── stores/                 # Zustand state stores: authStore.ts, bookingStore.ts
│   ├── types/                  # Strict TypeScript contracts mirroring NestJS DTOs
│   │   ├── auth.types.ts
│   │   ├── movie.types.ts
│   │   ├── cinema.types.ts
│   │   ├── showtime.types.ts
│   │   ├── booking.types.ts
│   │   └── user.types.ts
│   ├── App.tsx                 # Root Providers (QueryClient, Toaster, Router)
│   └── main.tsx                # Application bootstrap entry point
├── .env.example                # Template environment variables
├── index.html                  # HTML entry template
├── package.json                # Project dependencies and script runner
├── tailwind.config.js          # Tailwind CSS styling configuration
├── tsconfig.json               # TypeScript compiler options
└── vite.config.ts              # Vite configuration
```

---

## 🗺 Screen Inventory & Backend API Mapping

### 1. Customer Portal (12 Screens)

| # | Screen Name | Route Path | Associated NestJS Backend API | Key Functional Scope |
|:---:|---|---|---|---|
| **1** | **Home Page** | `/` | `GET /movies`<br>`GET /movies/genres` | Hero Carousel, Trailer preview modal, Quick booking selector, Now Showing vs Coming Soon tabs. |
| **2** | **Movie Catalog** | `/movies` | `GET /movies`<br>`GET /movies/genres` | Paginated movie grid, Debounced search, Multi-criteria filter (Genre, 2D/3D/IMAX, Release Date). |
| **3** | **Movie Details** | `/movies/:id` | `GET /movies/:id`<br>`GET /movies/:id/statistics`<br>`GET /showtimes?movieId=:id` | Synopsis, Cast & Crew, YouTube trailer popup, Box office statistics, Showtimes grouped by Hall & Date. |
| **4** | **Showtimes & Halls** | `/showtimes` | `GET /halls`<br>`GET /showtimes` | Horizontal calendar strip (next 7 days), Cinema hall selector, Time slots with base pricing. |
| **5** | **Real-Time Seat Map** | `/booking/seat-selection/:showtimeId` | `GET /showtimes/:id`<br>`GET /reservations/showtimes/:showtimeId/seats`<br>`POST /reservations/hold` | **Core Feature**: Interactive seat matrix (Standard, VIP, Couple). Polling real-time lock status (`AVAILABLE`, `HELD`, `CONFIRMED`). Multi-seat selection with price multipliers. |
| **6** | **Checkout & Hold Timer** | `/booking/checkout/:reservationId` | `POST /discounts/validate`<br>`POST /payments/create-url`<br>`POST /payments/checkout`<br>`PATCH /reservations/:id/cancel` | **10:00 Minute Countdown Timer** (synchronized with Redis TTL & RabbitMQ DLX). Dynamic discount validation. VNPay/MoMo redirection. Cancel reservation button. |
| **7** | **Payment Callback & E-Ticket** | `/booking/payment-return` | `GET /payments/vnpay/return` | Verification of payment gateway response code. Visual E-Ticket with QR Code generator for admission scanning. Download / Print PDF. |
| **8** | **Sign In** | `/auth/login` | `POST /auth/login`<br>`POST /auth/google`<br>`POST /auth/facebook` | Credential login, One-click Google/Facebook OAuth. Automatic JWT token persistence. |
| **9** | **Sign Up** | `/auth/register` | `POST /auth/register` | Registration form with password strength indicator and phone validation. |
| **10** | **Forgot Password** | `/auth/forgot-password` | `POST /auth/forgot-password` | Request password reset token via email with anti-enumeration protection. |
| **11** | **Reset Password** | `/auth/reset-password` | `POST /auth/reset-password` | Enter 256-bit reset token and establish new credentials. |
| **12** | **Account & Bookings** | `/profile`<br>`/my-tickets` | `GET /users/me`<br>`PATCH /reservations/:id/cancel` | Profile management. Categorized tickets (Upcoming, Past, Cancelled). **Cancel Ticket button** (Allowed only > 60 mins before showtime per backend rule). |

---

### 2. Admin Portal (6 Screens - RBAC Guard: `ADMIN`)

| # | Screen Name | Route Path | Associated NestJS Backend API | Key Administrative Features |
|:---:|---|---|---|---|
| **13** | **Admin Dashboard** | `/admin/dashboard` | `GET /movies`<br>`GET /users`<br>`GET /discounts` | Metric cards (Revenue, Tickets sold, Occupancy rate). Real-time chart visualization. |
| **14** | **Movies & Genres** | `/admin/movies` | `GET|POST /movies/genres`<br>`GET|POST|PUT|DELETE /movies`<br>`GET /movies/:id/statistics` | Full movie CRUD. Genre management. Poster image URL, trailer embed, lifetime box office analytics view. |
| **15** | **Halls & Seat Matrix** | `/admin/halls` | `GET|POST /halls`<br>`GET /halls/:id/seats`<br>`POST /halls/:id/seats/generate` | Cinema hall management. **Visual Seat Matrix Generator**: configure Rows (A-Z), Columns (1-20), designate VIP/Couple blocks, and auto-generate. |
| **16** | **Showtimes Scheduler** | `/admin/showtimes` | `GET|POST|DELETE /showtimes` | Visual timeline/calendar by hall. Automated screening scheduling with **Anti-Conflict collision detection** validation. |
| **17** | **Discounts & Coupons** | `/admin/discounts` | `GET|POST|PUT|DELETE /discounts` | Voucher management: Fixed / Percentage rules, usage limits, minimum order values, active toggles. |
| **18** | **Users & RBAC** | `/admin/users` | `GET /users`<br>`PATCH /users/:id/role` | Member management directory. Role promotion/demotion (`USER` ⇄ `ADMIN`). |

---

## 🔄 Core Business Workflows

### 1. High-Concurrency Seat Locking & State Flow
1. **Layout Polling**: Upon entering `/booking/seat-selection/:showtimeId`, TanStack Query polls `GET /reservations/showtimes/:showtimeId/seats` every 3000ms.
2. **Selection**: Customer picks available seats. Pricing calculates dynamically:
   - `Standard`: $1.0\times$ Base Price
   - `VIP`: $1.2\times$ Base Price
   - `Couple`: $1.5\times$ Base Price
3. **Lock Acquisition (`POST /reservations/hold`)**:
   - Sends `{ showtimeId, seatIds }`.
   - **Status 201**: Success. Stores `reservationId` and `expiresAt` in Zustand `bookingStore`, navigates to `/booking/checkout/:reservationId`.
   - **Status 409 Conflict**: Another user locked one or more seats in that exact millisecond. Displays warning notification toast and invalidates cache to immediately reflect current seat states.
4. **Checkout Countdown**:
   - `<CountdownTimer />` calculates remaining seconds against `expiresAt`.
   - When timer reaches `00:00`: Backend RabbitMQ delay consumer releases the Redis locks. The frontend displays an expiry dialog and routes the user back to seat selection.

### 2. Payment Gateway Redirection (VNPay / MoMo)
1. User validates optional promo code via `POST /discounts/validate`.
2. User selects **VNPay QR** and clicks **Proceed to Payment**.
3. Frontend dispatches `POST /payments/create-url` with `{ reservationId, paymentMethod: 'VNPAY', returnUrl: window.location.origin + '/booking/payment-return' }`.
4. Browser redirects to the signed payment gateway URL.
5. Upon completion, the gateway sends server IPN to NestJS and redirects customer browser back to `/booking/payment-return?vnp_ResponseCode=00&vnp_TxnRef=...`.
6. Frontend parses query parameters and renders the verified **E-Ticket with QR Code**.

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: v18.x or v20+ LTS
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Backend API**: Running at `http://localhost:3000/api/v1`

### Step-by-Step Setup:

```bash
# 1. Navigate to the frontend directory
cd d:/movie-ticket-frontend

# 2. Initialize Vite React TypeScript project (if starting fresh)
npm create vite@latest . -- --template react-ts

# 3. Install core dependencies
npm install react-router-dom @tanstack/react-query axios zustand lucide-react clsx tailwind-merge
npm install react-hook-form zod @hookform/resolvers qrcode.react sonner date-fns

# Install development styling dependencies
npm install -D tailwindcss postcss autoprefixer @types/node

# Generate Tailwind configuration
npx tailwindcss init -p

# 4. Set up environment variables
cp .env.example .env

# 5. Start development server
npm run dev
```

The application will be accessible at: `http://localhost:5173`

---

## ⚙️ Environment Configuration (.env)

Create a `.env` file in the root directory:

```env
# Backend API Base URL (NestJS Global Prefix: /api/v1)
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Backend Origin Host (for static uploads / Swagger docs)
VITE_BACKEND_ORIGIN=http://localhost:3000

# Client Application Metadata
VITE_APP_NAME="CineTicket Cinema Chain"
VITE_APP_PORT=5173

# Seat Polling Interval in milliseconds
VITE_SEAT_POLLING_INTERVAL=3000

# Social Authentication Credentials
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

---

## 🔒 Security & Web Vitals Optimization

1. **API Security & Token Persistence**:
   - Axios Request Interceptor injects `Authorization: Bearer <token>` dynamically from memory/storage.
   - Axios Response Interceptor catches `401 Unauthorized` responses and cleans session state to prevent stale access.
   - Automatic unwrapping of NestJS `TransformInterceptor` envelope (`{ success: true, statusCode: 200, data: T }`).
   - Pure JSX rendering guarantees automatic text escaping against Cross-Site Scripting (XSS).
2. **Role-Based Access Control (RBAC)**:
   - Protected routes wrapped with `AdminRoute` check for `user?.role === 'ADMIN'`. Unauthorized users encounter an immediate `403 Forbidden` guard.
3. **Performance & Optimization**:
   - **Lazy Loading & Code Splitting**: All top-level page routes loaded via `React.lazy()` and wrapped in `Suspense` fallbacks.
   - **Seat Grid Memoization**: `<SeatItem />` elements memoized via `React.memo` with custom comparison logic to prevent 100+ re-renders during single-seat clicks.
   - **Debounced Search**: Text searches for movie titles throttled by 400ms to reduce unnecessary API pressure.

---

## 📅 Development Roadmap

- [x] **Sprint 0: Architecture & Screen Inventory**: Complete screen mapping, API audit, README specification.
- [ ] **Sprint 1: Scaffold & Base Foundation**: Vite React-TS setup, Tailwind Dark Theme, Axios Interceptors, Base UI primitives.
- [ ] **Sprint 2: Authentication & User Session**: Login, Register, Forgot/Reset Password, Zustand `authStore`.
- [ ] **Sprint 3: Movie Catalog & Showtimes**: Home Page, Movie Detail (trailer popup & box office stats), Hall schedule viewer.
- [ ] **Sprint 4: Seat Map & Concurrency Engine (Core)**: Interactive seat matrix, 3s polling, `POST /reservations/hold` integration with 409 Conflict handling.
- [ ] **Sprint 5: Checkout & Payment Gateways**: 10-minute Countdown Timer, Coupon verification, VNPay / MoMo redirect & E-Ticket QR view.
- [ ] **Sprint 6: Admin Portal (RBAC)**: Dashboard, Movies CRUD, Seat Matrix Generator, Showtime Anti-Conflict Scheduler, Discounts & Users.
- [ ] **Sprint 7: Testing & Containerization**: Multi-tab concurrency verification, WCAG accessibility audit, Dockerfile (Nginx multi-stage).
