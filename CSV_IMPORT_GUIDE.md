# CSV Import Guide

## Overview
The Financial Management App supports importing transactions from CSV files. This guide explains the required format and provides examples.

## Required CSV Format

### Minimum Required Columns
Your CSV file must include these columns (order doesn't matter):
- **date**: Transaction date
- **description**: Transaction description
- **amount**: Transaction amount (positive number)
- **type**: Either "income" or "expense"

### Optional Columns
- **category**: Category name (useful for expenses)

## Column Name Variations

The import system automatically detects common column name variations:

### Date Column
Accepts: `date`, `transaction date`, `posted date`

### Description Column
Accepts: `description`, `memo`, `transaction`, `details`

### Amount Column
Accepts: `amount`, `value`, `sum`, `total`

### Type Column
Accepts: `type`, `transaction type`, `debit/credit`

### Category Column
Accepts: `category`, `merchant`, `vendor`

## CSV Format Examples

### Example 1: Basic Format
```csv
date,description,amount,type
2024-01-15,Monthly Salary,5000,income
2024-01-16,Grocery Shopping,150.50,expense
2024-01-17,Freelance Project,1200,income
2024-01-18,Electric Bill,85.30,expense
```

### Example 2: With Categories
```csv
date,description,amount,type,category
2024-01-15,Monthly Salary,5000,income,
2024-01-16,Whole Foods,150.50,expense,Groceries
2024-01-17,Freelance Project,1200,income,
2024-01-18,Electric Bill,85.30,expense,Utilities
2024-01-19,Netflix Subscription,15.99,expense,Entertainment
2024-01-20,Gas Station,45.00,expense,Transportation
```

### Example 3: Bank Statement Format
```csv
transaction date,memo,value,debit/credit
01/15/2024,Salary Deposit,5000.00,credit
01/16/2024,Walmart Purchase,150.50,debit
01/17/2024,Freelance Payment,1200.00,credit
01/18/2024,Utility Payment,85.30,debit
```

## Date Format Support

The system accepts various date formats:
- `YYYY-MM-DD` (2024-01-15) - Recommended
- `MM/DD/YYYY` (01/15/2024)
- `DD/MM/YYYY` (15/01/2024)
- `YYYY/MM/DD` (2024/01/15)

## Amount Format

- Use positive numbers only
- Decimal separator: period (.) or comma (,)
- Currency symbols ($, €, etc.) are automatically removed
- Examples: `150.50`, `$1,200.00`, `85.30`

## Transaction Type Detection

### Automatic Type Detection
If your CSV has a type column, the system recognizes:

**Income indicators**: `credit`, `deposit`, `income`, `+`
**Expense indicators**: `debit`, `withdrawal`, `expense`, `payment`, `-`

### Manual Type Column
You can explicitly specify:
- `income` - For income transactions
- `expense` - For expense transactions

## Import Process

### Step 1: Prepare Your CSV
1. Ensure your CSV has the required columns
2. Check date formats are consistent
3. Verify amounts are positive numbers
4. Confirm transaction types are specified

### Step 2: Upload File
1. Navigate to the Import page
2. Click "Choose File"
3. Select your CSV file
4. Click "Upload & Import"

### Step 3: Review Imported Transactions
1. System displays all imported transactions
2. Review for accuracy
3. Assign categories to expenses (if not already specified)

### Step 4: Process Transactions
1. Click "Process All" to convert all transactions
2. Or process individual transactions
3. Transactions are converted to Income/Expense records
4. Original imports are marked as processed

## Category Mapping

### If Categories Are in CSV
- System attempts to match category names with your existing categories
- If no match found, uses your first category as default
- You can reassign categories before processing

### If No Categories in CSV
- All expenses will need category assignment
- Use the dropdown in the import table
- Assign categories before clicking "Process"

## Common Issues and Solutions

### Issue: "Required columns not found"
**Solution**: Ensure your CSV has date, description, amount columns with recognizable names

### Issue: "Invalid date format"
**Solution**: Use YYYY-MM-DD format or ensure dates are consistent throughout the file

### Issue: "Amount must be a positive number"
**Solution**: Remove negative signs, use absolute values only

### Issue: "Type must be either income or expense"
**Solution**: Check your type column values match accepted formats

### Issue: "No valid data rows found"
**Solution**: Ensure your CSV has data rows after the header row

## Sample CSV Files

### Personal Finance Template
```csv
date,description,amount,type,category
2024-01-01,Opening Balance,10000,income,
2024-01-05,Salary,5000,income,
2024-01-06,Rent Payment,1500,expense,Housing
2024-01-07,Grocery Store,200,expense,Food
2024-01-08,Gas Station,50,expense,Transportation
2024-01-10,Restaurant,75,expense,Dining
2024-01-12,Gym Membership,50,expense,Health
2024-01-15,Freelance Work,800,income,
2024-01-18,Internet Bill,60,expense,Utilities
2024-01-20,Shopping,150,expense,Shopping
```

### Business Expenses Template
```csv
date,description,amount,type,category
2024-01-01,Client Payment,5000,income,
2024-01-03,Office Supplies,150,expense,Office
2024-01-05,Software Subscription,99,expense,Software
2024-01-07,Client Meeting Lunch,85,expense,Meals
2024-01-10,Travel Expenses,450,expense,Travel
2024-01-15,Client Payment,3500,income,
2024-01-18,Marketing Ads,200,expense,Marketing
2024-01-20,Equipment Purchase,800,expense,Equipment
```

## Tips for Best Results

1. **Use Consistent Formatting**: Keep date and amount formats consistent throughout the file
2. **Include Headers**: Always include a header row with column names
3. **Clean Data**: Remove any summary rows or totals from your CSV
4. **Test Small First**: Try importing a small sample file first
5. **Backup Data**: Keep a copy of your original CSV file
6. **Review Before Processing**: Always review imported transactions before processing
7. **Category Names**: Use category names that match your existing categories

## Exporting from Common Sources

### From Excel
1. Open your Excel file
2. File → Save As
3. Choose "CSV (Comma delimited) (*.csv)"
4. Save and import

### From Google Sheets
1. Open your Google Sheet
2. File → Download → Comma-separated values (.csv)
3. Import the downloaded file

### From Bank Statements
1. Log into your online banking
2. Navigate to transaction history
3. Look for "Export" or "Download" option
4. Choose CSV format
5. Download and import

## Need Help?

If you encounter issues:
1. Check the CSV format matches the examples above
2. Verify all required columns are present
3. Ensure data types are correct (dates, numbers)
4. Review the error messages for specific issues
5. Try with a smaller sample file first

## Advanced Features

### Bulk Import
- Import hundreds or thousands of transactions at once
- System processes them efficiently
- Review and process in batches if needed

### Error Handling
- System reports which rows failed to import
- Continue processing valid rows
- Review errors and fix source data

### Category Intelligence
- System attempts to match category names automatically
- Learn from your existing categories
- Suggest categories based on description patterns

---

**Ready to import?** Navigate to the Import page and upload your CSV file!
