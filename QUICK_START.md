# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check
- ✅ Node.js 18+ installed
- ✅ Yarn package manager installed
- ✅ PostgreSQL running locally

### Step 1: Install Dependencies (1 minute)
```bash
yarn install
```

### Step 2: Configure Database (1 minute)
The `.env` file is already configured with:
```env
DATABASE_URL="postgresql://financial_user:mypassword123@localhost:5432/financial_app"
NEXTAUTH_SECRET="RFP1Mg2UMxCzmxcnCsVHoG4gd7fGtH6C"
NEXTAUTH_URL="http://localhost:3000"
```

**Create the database:**
```bash
# Create PostgreSQL user and database
createuser financial_user
createdb financial_app
# Set password for user (use: mypassword123)
psql -c "ALTER USER financial_user WITH PASSWORD 'mypassword123';"
```

### Step 3: Set Up Database Schema (2 minutes)
```bash
# Generate Prisma client
yarn prisma generate

# Create database tables
yarn prisma db push

# Seed with sample data
yarn prisma db seed
```

### Step 4: Start the Application (1 minute)
```bash
yarn dev
```

### Step 5: Access the App
Open your browser and navigate to:
```
http://localhost:3000
```

### Step 6: Sign In
Use the test account:
- **Email**: john@doe.com
- **Password**: johndoe123

---

## 🎯 What You Can Do Now

### ✅ Income Management
1. Click "Income" in the sidebar
2. Click "Add Income" button
3. Enter your income details
4. Save and view in the table

### ✅ Expense Tracking
1. Click "Expenses" in the sidebar
2. Click "Add Expense" button
3. Enter expense details and select category
4. Save and filter by category

### ✅ CSV Import
1. Click "Import" in the sidebar
2. Prepare a CSV file with columns: date, description, amount, type
3. Upload the file
4. Review and process transactions

**Sample CSV:**
```csv
date,description,amount,type,category
2024-01-15,Salary,5000,income,
2024-01-16,Groceries,150,expense,Food
2024-01-17,Gas,45,expense,Transportation
```

### ✅ Investment Portfolio
1. Click "Investments" in the sidebar
2. Click "Add Investment" button
3. Enter investment details (name, type, quantity, prices)
4. View portfolio performance

### ✅ Financial Calculators
1. Click "Calculators" in the sidebar
2. Choose a calculator:
   - Compound Interest
   - Savings Growth
   - Retirement Planning
   - Loan Payment
3. Enter values and calculate

### ✅ Analytics Dashboard
1. Click "Analytics" in the sidebar
2. View your financial insights:
   - Monthly summary
   - Income/expense trends
   - Savings rate
   - Spending insights
   - Top categories

---

## 📊 Sample Data Included

The seed script creates:
- ✅ Test user account (john@doe.com)
- ✅ Sample expense categories
- ✅ Sample income entries
- ✅ Sample expense entries
- ✅ Sample investment portfolio

---

## 🔧 Common Commands

### Development
```bash
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server
```

### Database
```bash
yarn prisma studio    # Open database GUI
yarn prisma db push   # Update database schema
yarn prisma db seed   # Seed sample data
yarn prisma generate  # Regenerate Prisma client
```

### Reset Everything
```bash
yarn prisma db push --force-reset  # Reset database
yarn prisma db seed                # Re-seed data
```

---

## 📁 Project Structure

```
financial_management_app/
├── app/
│   ├── api/              # Backend API routes
│   │   ├── income/       # Income endpoints
│   │   ├── expenses/     # Expense endpoints
│   │   ├── investments/  # Investment endpoints
│   │   ├── calculators/  # Calculator endpoints
│   │   ├── analytics/    # Analytics endpoints
│   │   └── import/       # CSV import endpoints
│   ├── dashboard/        # Frontend pages
│   │   ├── income/       # Income management page
│   │   ├── expenses/     # Expense management page
│   │   ├── investments/  # Investment portfolio page
│   │   ├── calculators/  # Financial calculators page
│   │   ├── analytics/    # Analytics dashboard page
│   │   └── import/       # CSV import page
│   └── auth/             # Authentication pages
├── components/           # Reusable UI components
├── lib/
│   ├── services/         # Business logic layer
│   ├── types.ts          # TypeScript type definitions
│   └── db.ts             # Database connection
├── prisma/
│   └── schema.prisma     # Database schema
└── .env                  # Environment variables
```

---

## 🎨 Features Overview

### ✅ Fully Implemented
- [x] User authentication (sign up, sign in, sign out)
- [x] Income tracking with recurring support
- [x] Expense tracking with categories
- [x] CSV import for bulk transactions
- [x] Investment portfolio management
- [x] Financial calculators (4 types)
- [x] Analytics and insights
- [x] Monthly summaries
- [x] Trend analysis
- [x] Spending insights

### 🔒 Security
- [x] Secure password hashing
- [x] Session-based authentication
- [x] User-specific data isolation
- [x] SQL injection prevention
- [x] XSS protection

### 💾 Data Storage
- [x] PostgreSQL database
- [x] Local CSV processing (no cloud required)
- [x] Efficient data serialization

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Prisma Client Not Generated
```bash
yarn prisma generate
```

### Can't Sign In
```bash
# Reset and re-seed database
yarn prisma db push --force-reset
yarn prisma db seed
```

---

## 📚 Additional Resources

- **Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md` for detailed feature documentation
- **CSV Import Guide**: See `CSV_IMPORT_GUIDE.md` for CSV format examples
- **README**: See `README.md` for complete project documentation

---

## 🎉 You're All Set!

The application is now running with all features fully functional:
- ✅ Add and track income
- ✅ Manage expenses with categories
- ✅ Import transactions from CSV
- ✅ Track investment portfolio
- ✅ Use financial calculators
- ✅ View analytics and insights

**Start exploring and managing your finances!** 🚀

---

## 💡 Tips

1. **Start with Categories**: Create expense categories that match your spending habits
2. **Regular Updates**: Update your income and expenses regularly for accurate analytics
3. **Use CSV Import**: Bulk import transactions from your bank statements
4. **Track Investments**: Keep your investment prices updated for accurate portfolio tracking
5. **Review Analytics**: Check the analytics page monthly to understand your spending patterns
6. **Use Calculators**: Plan your financial goals with the built-in calculators

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the error messages in the browser console
3. Check the terminal for server errors
4. Verify your database connection
5. Ensure all dependencies are installed

---

**Happy Financial Planning!** 💰📊
