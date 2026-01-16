# CryptoPulse 🚀

A modern, real-time cryptocurrency tracking application built with Next.js 14, featuring a sleek dark UI with glassmorphism effects and SVG decorations.

## Features ✨

- **Real-time Market Data**: Track live cryptocurrency prices from CoinGecko API
- **Trending Coins**: See what's hot in the crypto market
- **User Authentication**: Secure login with NextAuth (Credentials & Google OAuth)
- **Favorites System**: Save and track your favorite cryptocurrencies
- **Detailed Coin Pages**: View comprehensive information about each coin
- **Responsive Design**: Beautiful UI that works on all devices
- **Modern UI**: Glassmorphism effects, SVG decorations, and smooth animations

## Tech Stack 🛠️

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/ui with Radix UI
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Getting Started 🚀

### Prerequisites

- Node.js 18+ 
- MongoDB database
- CoinGecko API access (free tier works)
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cryptopulse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure 📁

```
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── coins/            # Coin detail pages
│   ├── favorites/        # Favorites page
│   └── page.tsx          # Home page
├── components/
│   ├── auth/             # Auth forms
│   ├── coins/            # Coin components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # MongoDB connection
│   └── validators/       # Zod schemas
├── models/               # Mongoose models
├── services/             # API services
└── types/                # TypeScript types
```

## Features in Detail 📝

### Authentication
- Email/password registration and login
- Google OAuth integration
- Secure password hashing with bcrypt
- JWT-based sessions

### Market Data
- Real-time price updates
- 24h price change indicators
- Market cap rankings
- Trending coins sidebar

### Favorites
- Add/remove coins from favorites
- Persistent storage in MongoDB
- Quick access to tracked coins

### UI/UX
- Dark theme with glassmorphism
- Decorative SVG elements
- Smooth animations and transitions
- Responsive grid layouts
- Loading states and error handling

## API Routes 🔌

- `GET /api/coins/market` - Fetch market coins
- `GET /api/coins/trending` - Fetch trending coins
- `GET /api/coins/[id]` - Fetch coin details
- `GET /api/coins/favorites` - Get user favorites
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites` - Remove favorite
- `POST /api/auth/register` - User registration

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is open source and available under the MIT License.

## Acknowledgments 🙏

- [CoinGecko](https://www.coingecko.com/) for the cryptocurrency data API
- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Next.js](https://nextjs.org/) for the amazing framework
