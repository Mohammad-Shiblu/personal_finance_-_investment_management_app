
# Financial Management App

A comprehensive personal finance management application built with Next.js 14, PostgreSQL, and Docker. Track income, expenses, investments, and gain financial insights with powerful analytics and calculators.

## 🚀 Quick Start

### Using Docker (Recommended)
```bash
# Deploy with one command
./docker-deploy.sh
```

### Manual Setup
```bash
yarn install
yarn prisma generate
yarn prisma db push
yarn prisma db seed
yarn dev
```

**Access at:** http://localhost:3000

### Test Credentials
- **Email**: john@doe.com
- **Password**: johndoe123

## ✨ Features

### Core Features
- ✅ **Income Tracking** - Multiple sources, recurring income support
- ✅ **Expense Management** - Customizable categories, detailed tracking
- ✅ **Category Management** - Create and organize expense categories
- ✅ **Investment Portfolio** - Track ETFs, crypto, stocks, bonds with performance metrics
- ✅ **CSV Import** - Import bank statements (processed locally, no cloud storage)
- ✅ **Financial Calculators** - Compound interest, savings, retirement, loan calculators
- ✅ **Analytics Dashboard** - Trends, forecasting, spending insights
- ✅ **Password Reset** - Secure password recovery system

### Technical Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with bcrypt
- **Deployment**: Docker
- **Type Safety**: Full TypeScript implementation

## 🏗️ Architecture Overview

The application follows a modular architecture pattern similar to Flask/FastAPI applications:

### Backend Structure (NextJS API Routes)
```
lib/
├── services/          # Business logic layer
│   ├── income-service.ts
│   ├── expense-service.ts
│   ├── category-service.ts
│   ├── investment-service.ts
│   ├── calculator-service.ts
│   ├── analytics-service.ts
│   └── csv-import-service.ts
├── types.ts           # Type definitions
├── db.ts             # Database connection
└── auth-config.ts    # Authentication configuration

app/api/              # REST API endpoints (equivalent to Flask routes)
├── income/           # Income management endpoints
├── expenses/         # Expense tracking endpoints
├── categories/       # Category management endpoints
├── investments/      # Investment portfolio endpoints
├── calculators/      # Financial calculator endpoints
├── analytics/        # Analytics and insights endpoints
└── import/          # CSV import functionality
```

### Frontend Structure
```
app/                  # Next.js 14 App Router pages
├── page.tsx         # Landing page
├── layout.tsx       # Root layout
├── auth/            # Authentication pages (signin, signup, forgot-password, reset-password)
└── dashboard/       # Protected dashboard pages
    ├── income/      # Income management
    ├── expenses/    # Expense tracking
    ├── categories/  # Category management
    ├── investments/ # Investment portfolio
    ├── calculators/ # Financial calculators
    ├── analytics/   # Analytics dashboard
    └── import/      # CSV import

components/          # Reusable React components
├── ui/              # Base UI components (shadcn/ui)
├── charts/          # Data visualization components
├── dashboard/       # Dashboard-specific components
└── auth/           # Authentication components
```

### Database Schema
```
User                 # User accounts and authentication
├── Income          # Income tracking with recurring support
├── Expense         # Expense tracking with categorization
├── Category        # Customizable expense categories
├── Investment      # Portfolio tracking (ETFs, crypto, stocks, bonds)
└── Transaction     # Raw CSV import staging area
```

## 🛠️ Local Development Setup

### Prerequisites
- **Docker** (recommended) OR
- **Node.js 18+** and Yarn
- **PostgreSQL** (if not using Docker)

### Environment Variables
Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/financial_app"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Installation & Setup

1. **Install Dependencies**
   ```bash
   yarn install
   ```

2. **Database Setup**
   ```bash
   # Generate Prisma client
   yarn prisma generate
   
   # Push schema to database
   yarn prisma db push
   
   # Seed database with sample data
   yarn prisma db seed
   ```

3. **Start Development Server**
   ```bash
   yarn dev
   ```

4. **Access the Application**
   - Open http://localhost:3000
   - Sign up for a new account or use test credentials above

### Database Management

- **View Database**: `yarn prisma studio`
- **Reset Database**: `yarn prisma db push --force-reset`
- **Seed Data**: `yarn prisma db seed`

## 📊 API Documentation

### Core Endpoints

#### Income Management
- `GET /api/income` - List user's income entries
- `POST /api/income` - Create new income entry
- `PUT /api/income` - Update income entry
- `DELETE /api/income/[id]` - Delete income entry
- `GET /api/income/summary` - Monthly income analytics

#### Expense Management
- `GET /api/expenses` - List user's expenses with filtering
- `POST /api/expenses` - Create new expense entry
- `PUT /api/expenses` - Update expense entry
- `DELETE /api/expenses/[id]` - Delete expense entry
- `GET /api/expenses/by-category` - Category breakdown analytics
- `GET /api/expenses/summary` - Monthly expense analytics

#### Category Management
- `GET /api/categories` - List user's categories
- `POST /api/categories` - Create custom category
- `PUT /api/categories` - Update category
- `DELETE /api/categories/[id]` - Delete category
- `GET /api/categories/[id]` - Category details with statistics

#### Investment Portfolio
- `GET /api/investments` - List user's investments
- `POST /api/investments` - Add new investment
- `PUT /api/investments` - Update investment
- `DELETE /api/investments/[id]` - Remove investment
- `GET /api/investments/portfolio` - Portfolio summary
- `PUT /api/investments/prices` - Bulk price updates

#### Financial Calculators
- `POST /api/calculators/compound-interest` - Compound interest calculator
- `POST /api/calculators/savings-growth` - Savings growth with contributions
- `POST /api/calculators/retirement` - Retirement planning calculator
- `POST /api/calculators/loan` - Loan payment calculator

#### CSV Import
- `POST /api/import/csv` - Upload and process CSV file
- `GET /api/import/transactions` - List unprocessed transactions
- `POST /api/import/transactions` - Process imported transactions
- `DELETE /api/import/transactions` - Delete imported transactions

#### Analytics & Insights
- `GET /api/analytics/dashboard` - Comprehensive dashboard data
- `GET /api/analytics/trends` - Trend analysis and forecasting
- `GET /api/analytics/insights` - Spending insights and patterns
- `GET /api/analytics/monthly` - Monthly financial summary

## 🎨 UI/UX Features

### Design System
- **Modern Design**: Clean, professional interface with consistent spacing
- **Color Palette**: Green-focused theme for financial growth
- **Typography**: Inter font family for excellent readability
- **Components**: shadcn/ui component library for consistency
- **Animations**: Framer Motion for smooth interactions

### User Experience
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Loading States**: Skeleton components during data fetching
- **Error Handling**: Graceful error messages and fallbacks
- **Form Validation**: Real-time validation with helpful feedback
- **Data Visualization**: Interactive charts with hover details and legends

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Clear focus indicators

## 🔧 Extending the Application

### Adding New Features

The modular architecture makes it easy to extend:

1. **Add New Service**: Create a new service file in `lib/services/`
2. **Define Types**: Add type definitions in `lib/types.ts`
3. **Create API Routes**: Add endpoints in `app/api/[feature]/`
4. **Build UI Components**: Create components in `components/[feature]/`
5. **Add Pages**: Create new pages in `app/[feature]/`

### Planned Extensions (Future Phases)
- **Notes System**: Rich text notes with tagging and search
- **Calendar Integration**: Financial events and bill reminders
- **Planning Tools**: Budget planning and goal setting
- **Reporting**: PDF export and advanced analytics
- **Multi-currency**: Support for international currencies
- **Mobile App**: React Native companion app

## 🔒 Security Features

- **Authentication**: Secure session management with NextAuth.js
- **Password Hashing**: bcrypt for password security
- **CSRF Protection**: Built-in CSRF protection
- **SQL Injection Prevention**: Prisma ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection
- **Environment Variables**: Sensitive data stored in environment variables

## 📈 Performance Optimizations

- **Static Generation**: NextJS static page generation where possible
- **Image Optimization**: NextJS automatic image optimization
- **Code Splitting**: Automatic code splitting and lazy loading
- **Database Indexing**: Optimized database queries with proper indexing
- **Caching**: Strategic caching for frequently accessed data

## 🧪 Testing

The application includes comprehensive error handling and validation:

- **Form Validation**: Client and server-side validation
- **API Error Handling**: Consistent error responses
- **Database Constraints**: Data integrity at the database level
- **TypeScript**: Compile-time type checking

## 🐳 Docker Deployment

### Quick Start
```bash
# Deploy everything
./docker-deploy.sh

# View logs
docker logs -f financial_app

# Stop services
docker stop financial_app financial_app_db

# Cleanup
./docker-cleanup.sh
```

### Manual Docker Commands
```bash
# 1. Create network
docker network create financial_network

# 2. Start PostgreSQL
docker run -d --name financial_app_db \
  --network financial_network \
  -e POSTGRES_USER=financial_user \
  -e POSTGRES_PASSWORD=mypassword123 \
  -e POSTGRES_DB=financial_app \
  -p 5432:5432 \
  -v financial_db_data:/var/lib/postgresql/data \
  postgres:15-alpine

# 3. Build app
docker build -t financial-app .

# 4. Run app
docker run -d --name financial_app \
  --network financial_network \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://financial_user:mypassword123@financial_app_db:5432/financial_app" \
  -e NEXTAUTH_SECRET="RFP1Mg2UMxCzmxcnCsVHoG4gd7fGtH6C" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  financial-app

# 5. Setup database
docker exec financial_app npx prisma db push
docker exec financial_app npx prisma db seed
```

### What's Included
- Next.js application (optimized production build)
- PostgreSQL database with persistent storage
- Automatic database setup and seeding
- No docker-compose required

## 🔐 Password Reset

Users can reset forgotten passwords:

1. Click "Forgot password?" on sign-in page
2. Enter email address
3. Use the reset link (displayed in development mode)
4. Set new password

See `PASSWORD_RESET_GUIDE.md` for details.

## 📂 Project Structure

```
├── app/                    # Next.js pages and API routes
├── components/             # Reusable React components
├── lib/                    # Services and utilities
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
└── .env                    # Environment variables
```

## 📚 Documentation

- **QUICK_START.md** - Get started in 5 minutes
- **DOCKER_DEPLOYMENT.md** - Complete Docker guide
- **CSV_IMPORT_GUIDE.md** - CSV format and import instructions
- **PASSWORD_RESET_GUIDE.md** - Password recovery setup
- **IMPLEMENTATION_SUMMARY.md** - Detailed feature documentation
- **FEATURES_CHECKLIST.md** - Complete feature list (200+)

## 🔒 Security

- ✅ Secure password hashing (bcrypt)
- ✅ Session-based authentication
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (React)
- ✅ CSRF protection
- ✅ Password reset with time-limited tokens
- ✅ User data isolation

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! The codebase includes comprehensive comments explaining all functions and business logic.

## 🐛 Troubleshooting

### Docker Issues
```bash
# View logs
docker logs -f financial_app

# Restart services
docker restart financial_app financial_app_db

# Clean slate
./docker-cleanup.sh
docker volume rm financial_db_data
./docker-deploy.sh
```

### Database Issues
```bash
# Reset database
yarn prisma db push --force-reset
yarn prisma db seed
```

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Budget planning
- [ ] Bill reminders
- [ ] Multi-currency support
- [ ] Mobile app
- [ ] Bank sync integration
- [ ] PDF reports

---

**Built with ❤️ using Next.js, PostgreSQL, and Docker**
