
# Financial Management App - Phase 1 Foundation

A comprehensive financial management web application built with NextJS and PostgreSQL. This is the foundational phase that provides core financial tracking capabilities and is designed to be extended with additional features like notes, calendar, and planning tools.

## 🚀 Live Demo

The application is now running and available for testing with pre-seeded data.

### Test Credentials
- **Email**: john@doe.com
- **Password**: johndoe123

## ✨ Features

### Core Financial Management
- **Income Tracking**: Record and manage multiple income sources with recurring entry support
- **Expense Management**: Track expenses with customizable categories and detailed categorization
- **Investment Portfolio**: Manual entry for ETFs, crypto, stocks, and bonds with performance tracking
- **CSV Import**: Import transactions from bank statements (processed locally, no cloud storage required)
- **Financial Calculators**: Compound interest, savings growth, retirement planning, and loan calculators
- **Analytics & Insights**: Trend analysis, forecasting, and spending pattern insights
- **Interactive Charts**: Responsive visualizations using Recharts for data analysis

### Technical Features
- **User Authentication**: Secure email/password authentication with NextAuth.js
- **Real-time Dashboard**: Financial overview with summary cards and recent transactions
- **Responsive Design**: Mobile-first design that works on all devices
- **Data Visualization**: Interactive charts for income vs expenses, category breakdowns, and trends
- **Local Processing**: CSV files processed in-memory without external storage dependencies
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions

## 🏗️ Architecture Overview

The application follows a modular architecture pattern similar to Flask/FastAPI applications:

### Backend Structure (NextJS API Routes)
```
lib/
├── services/          # Business logic layer (equivalent to Flask services)
│   ├── income-service.ts
│   ├── expense-service.ts
│   ├── category-service.ts
│   ├── investment-service.ts
│   ├── calculator-service.ts
│   ├── analytics-service.ts
│   └── csv-import-service.ts
├── types.ts           # Type definitions (equivalent to models.py)
├── db.ts             # Database connection
├── auth-config.ts    # Authentication configuration
├── aws-config.ts     # Cloud storage configuration
└── s3.ts            # File operations

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
app/                  # NextJS 14 App Router pages
├── page.tsx         # Landing page
├── layout.tsx       # Root layout
├── auth/            # Authentication pages
└── dashboard/       # Protected dashboard pages

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
- Node.js 18+ and Yarn package manager
- PostgreSQL database

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

## 🚀 Deployment

### Local Deployment
The application is designed for easy local deployment:

```bash
# Build for production
yarn build

# Start production server
yarn start
```

### Environment Setup
1. Set up PostgreSQL database
2. Configure AWS S3 bucket
3. Set environment variables
4. Run database migrations
5. Seed initial data

## 📝 License

This project is built as a foundational financial management application designed to be extended and customized for specific use cases.

## 🤝 Contributing

The modular architecture and comprehensive comments make it easy to understand and extend the codebase. Each service includes detailed documentation about its purpose, parameters, and business logic.

## 📞 Support

For questions about the architecture or extending the application, refer to the comprehensive code comments and type definitions throughout the codebase.

---

**Phase 1 Foundation Complete** - Ready for extension with additional features and capabilities.
