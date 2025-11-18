# SmartLedger - Transaction Management System

A full-stack web application for managing financial transactions with income and expense tracking, built with React, Node.js, Express, and PostgreSQL.

## Features

- 📊 **Dashboard** with interactive charts (Yearly, Monthly, Weekly, Today, This Month)
- 💰 **Transaction Entry** with smart form behavior
- 📋 **Summary Page** with filtering, search, and CSV export
- 📈 **Analytics** with multiple time period views
- 🔍 **Search** by client/vendor and invoice number
- ✏️ **Edit/Delete** transactions
- 👥 **Top Clients & Vendors** tracking
- 💵 **Income & Expense** categorization
- 📱 **Responsive Design** with sidebar navigation

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Chart.js
- **Backend**: Node.js, Express 5
- **Database**: PostgreSQL (Neon)
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL database (Neon recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd account
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   PORT=5000
   ```

4. **Initialize the database:**
   ```bash
   node scripts/initDb.js
   ```

5. **Start the development server:**
   ```bash
   # Terminal 1: Start backend
   npm start
   
   # Terminal 2: Start frontend
   cd client
   npm run dev
   ```

6. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Project Structure

```
.
├── api/                 # Vercel serverless function
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   └── utils/      # Utilities
│   └── dist/           # Build output
├── routes/             # Express API routes
├── scripts/            # Utility scripts
├── sql/                # Database schema & seeds
├── index.js            # Express app entry
├── db.js               # Database connection
└── vercel.json         # Vercel configuration
```

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/export` - Export to CSV
- `GET /api/transactions/monthly-summary` - Monthly summary
- `GET /api/transactions/yearly-summary` - Yearly summary
- `GET /api/transactions/weekly-summary` - Weekly summary
- `GET /api/transactions/today-summary` - Today's summary
- `GET /api/transactions/this-month-summary` - This month summary

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/subcategories?category=Revenue` - Get subcategories

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions to Vercel.

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable: `DATABASE_URL`
4. Deploy!

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PORT` | Server port (default: 5000) | No |

## Database Schema

The application uses the following main tables:
- `transactions` - All financial transactions
- `categories` - Income/expense categories
- `subcategories` - Subcategories for each category

See `sql/schema.sql` for the complete schema.

## Development

### Running Tests
```bash
# Backend tests (if added)
npm test

# Frontend tests (if added)
cd client
npm test
```

### Building for Production
```bash
cd client
npm run build
```

The built files will be in `client/dist/`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React, Express, and PostgreSQL

