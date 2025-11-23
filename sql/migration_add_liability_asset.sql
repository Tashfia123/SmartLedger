-- Migration: Add liability and asset support to transactions and categories
-- Run this script to update your database schema

-- Step 1: Update categories table to allow liability and asset types
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_type_check;
ALTER TABLE categories ADD CONSTRAINT categories_type_check 
	CHECK (type IN ('income', 'expense', 'liability', 'asset'));

-- Step 2: Update transactions table to allow liability and asset types
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_transaction_type_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_transaction_type_check 
	CHECK (transaction_type IN ('income', 'expense', 'liability', 'asset'));

-- Step 3: Insert default categories for liability and asset types
INSERT INTO categories (name, type) VALUES
	-- Liability Categories
	('Current_Liabilities', 'liability'),
	('Long_Term_Liabilities', 'liability'),
	-- Asset Categories
	('Current_Assets', 'asset'),
	('Fixed_Assets', 'asset'),
	('Intangible_Assets', 'asset'),
	('Investments', 'asset')
ON CONFLICT (name) DO NOTHING;

-- Step 4: Insert subcategories for liability types
INSERT INTO subcategories (category_id, name)
SELECT c.category_id, v.name
FROM (
	VALUES
		-- Current Liabilities
		('Current_Liabilities', 'Accounts Payable'),
		('Current_Liabilities', 'Short-term Loans'),
		('Current_Liabilities', 'Accrued Expenses'),
		('Current_Liabilities', 'Taxes Payable'),
		('Current_Liabilities', 'Unearned Revenue'),
		('Current_Liabilities', 'Current Portion of Long-term Debt'),
		('Current_Liabilities', 'Bank Overdraft'),
		-- Long Term Liabilities
		('Long_Term_Liabilities', 'Long-term Loans'),
		('Long_Term_Liabilities', 'Bonds Payable'),
		('Long_Term_Liabilities', 'Mortgage Payable'),
		('Long_Term_Liabilities', 'Lease Obligations'),
		('Long_Term_Liabilities', 'Deferred Tax Liabilities'),
		('Long_Term_Liabilities', 'Pension Liabilities')
) AS v(category_name, name)
JOIN categories c ON c.name = v.category_name
ON CONFLICT (category_id, name) DO NOTHING;

-- Step 5: Insert subcategories for asset types
INSERT INTO subcategories (category_id, name)
SELECT c.category_id, v.name
FROM (
	VALUES
		-- Current Assets
		('Current_Assets', 'Cash'),
		('Current_Assets', 'Bank Accounts'),
		('Current_Assets', 'Accounts Receivable'),
		('Current_Assets', 'Inventory'),
		('Current_Assets', 'Prepaid Expenses'),
		('Current_Assets', 'Short-term Investments'),
		('Current_Assets', 'Marketable Securities'),
		-- Fixed Assets
		('Fixed_Assets', 'Property, Plant & Equipment'),
		('Fixed_Assets', 'Land'),
		('Fixed_Assets', 'Buildings'),
		('Fixed_Assets', 'Vehicles'),
		('Fixed_Assets', 'Machinery & Equipment'),
		('Fixed_Assets', 'Furniture & Fixtures'),
		('Fixed_Assets', 'Computer Equipment'),
		-- Intangible Assets
		('Intangible_Assets', 'Goodwill'),
		('Intangible_Assets', 'Patents'),
		('Intangible_Assets', 'Trademarks'),
		('Intangible_Assets', 'Copyrights'),
		('Intangible_Assets', 'Software Development Costs'),
		('Intangible_Assets', 'Licenses'),
		('Intangible_Assets', 'Brand Value'),
		-- Investments
		('Investments', 'Long-term Investments'),
		('Investments', 'Stocks'),
		('Investments', 'Bonds'),
		('Investments', 'Mutual Funds'),
		('Investments', 'Real Estate Investments'),
		('Investments', 'Investment Properties')
) AS v(category_name, name)
JOIN categories c ON c.name = v.category_name
ON CONFLICT (category_id, name) DO NOTHING;

