-- Categories
INSERT INTO categories (name, type) VALUES
  -- Income
  ('Revenue','income'),
  ('Non_Operating_Income','income'),
  ('Finance_Income','income'),
  -- Expense
  ('COGS','expense'),
  ('Operating_Expense','expense'),
  ('Non_Operating_Expense','expense'),
  ('Finance_Expense','expense')
ON CONFLICT DO NOTHING;

-- Subcategories mapped to categories by name (idempotent via unique indexes)
INSERT INTO subcategories (category_id, name)
SELECT c.category_id, v.name
FROM (
  VALUES
    -- Revenue
    ('Revenue','IT Service Revenue'),
    ('Revenue','Subscription Revenue'),
    ('Revenue','Custom Software Development Fees'),
    ('Revenue','API Integration Fees'),
    ('Revenue','Maintenance & Support Fees'),
    ('Revenue','Licensing Revenue'),
    ('Revenue','Training & Consulting Fees'),
    ('Revenue','Affiliate & Referral Revenue'),
    ('Revenue','Ad Revenue'),
    ('Revenue','In-App Purchases'),

    -- Non_Operating_Income
    ('Non_Operating_Income','Rental Income'),
    ('Non_Operating_Income','Gain on Sale of Assets'),
    ('Non_Operating_Income','Foreign Exchange Gains'),
    ('Non_Operating_Income','Unrealized Gains on Investments'),
    ('Non_Operating_Income','Government Grants or Subsidies'),
    ('Non_Operating_Income','Lawsuit Settlements Received'),

    -- Finance_Income
    ('Finance_Income','Interest Earned on Investments'),
    ('Finance_Income','Interest Earned on Loans Given'),
    ('Finance_Income','Gain on Financial Instruments'),
    ('Finance_Income','Fair Value Gains on Investments'),
    ('Finance_Income','Dividends from Financial Securities'),

    -- COGS
    ('COGS','Cloud Hosting Costs'),
    ('COGS','Software Licenses'),
    ('COGS','Developer Costs'),
    ('COGS','Payment Gateway Fees'),
    ('COGS','Software Maintenance & Updates'),
    ('COGS','Customer Support Costs'),
    ('COGS','Server & Infrastructure Costs'),

    -- Operating_Expense
    ('Operating_Expense','Office Rent'),
    ('Operating_Expense','Office Service Charge'),
    ('Operating_Expense','Electricity Bill'),
    ('Operating_Expense','Internet Bill'),
    ('Operating_Expense','Salary & Wages'),
    ('Operating_Expense','Office Supplies'),
    ('Operating_Expense','Repair & Maintenance'),
    ('Operating_Expense','Allowances'),
    ('Operating_Expense','Telephone/Fax'),
    ('Operating_Expense','Entertainment'),
    ('Operating_Expense','Insurance'),
    ('Operating_Expense','HR & Recruitment Costs'),
    ('Operating_Expense','Software Subscriptions'),
    ('Operating_Expense','Bank Charges'),
    ('Operating_Expense','Depreciation'),
    ('Operating_Expense','Amortization'),
    ('Operating_Expense','Sales Commissions'),
    ('Operating_Expense','Advertising & Marketing Costs'),
    ('Operating_Expense','Public Relations (PR) Expenses'),
    ('Operating_Expense','Customer Acquisition Costs'),
    ('Operating_Expense','Website Maintenance Costs'),
    ('Operating_Expense','Research & Development Costs'),
    ('Operating_Expense','Refunds & Discounts Offered'),
    ('Operating_Expense','Bad Debts'),
    ('Operating_Expense','Penalties & Fines'),
    ('Operating_Expense','IT & Security Management Costs'),

    -- Non_Operating_Expense
    ('Non_Operating_Expense','Loss on Sale of Assets'),
    ('Non_Operating_Expense','Foreign Exchange Losses'),
    ('Non_Operating_Expense','Asset Impairment Losses'),
    ('Non_Operating_Expense','Litigation Expenses'),
    ('Non_Operating_Expense','Restructuring Costs'),
    ('Non_Operating_Expense','Donations & Charitable Contributions'),
    ('Non_Operating_Expense','Fines & Penalties'),
    ('Non_Operating_Expense','Unusual or One-Time Expenses'),

    -- Finance_Expense
    ('Finance_Expense','Loan Interest Expense'),
    ('Finance_Expense','Bond Interest Expense'),
    ('Finance_Expense','Interest on Bank Overdrafts'),
    ('Finance_Expense','Lease Interest'),
    ('Finance_Expense','Amortization of Loan Fees'),
    ('Finance_Expense','Late Payment Interest Charges')
) AS v(cat, name)
JOIN categories c ON c.name = v.cat
ON CONFLICT DO NOTHING;


