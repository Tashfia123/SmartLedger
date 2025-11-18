-- Insert test data for January through November 2025

-- January 2025
INSERT INTO transactions (transaction_type, date, category, sub_category, description, client_vendor, invoice_number, amount, payment_mode, payment_status, remarks) VALUES
('income', '2025-01-05', 'Revenue', 'IT Service Revenue', 'Monthly subscription service', 'TechCorp Inc', 'INV-2025-001', 50000.00, 'Bank Transfer', 'Completed', 'Q1 subscription'),
('income', '2025-01-12', 'Revenue', 'Custom Software Development Fees', 'Custom dashboard development', 'StartupXYZ', 'INV-2025-002', 75000.00, 'Bank Transfer', 'Completed', 'Phase 1 completed'),
('expense', '2025-01-03', 'COGS', 'Cloud Hosting Costs', 'AWS monthly hosting', 'Amazon Web Services', 'AWS-2025-001', 2500.00, 'Credit Card', 'Completed', 'Production servers'),
('expense', '2025-01-15', 'Operating_Expense', 'Office Rent', 'January office rent', 'Property Management Co', 'RENT-2025-01', 15000.00, 'Bank Transfer', 'Completed', 'Monthly rent'),
('expense', '2025-01-20', 'Operating_Expense', 'Salary & Wages', 'January payroll', 'Employees', 'PAY-2025-01', 120000.00, 'Bank Transfer', 'Completed', 'Monthly salaries');

-- February 2025
INSERT INTO transactions (transaction_type, date, category, sub_category, description, client_vendor, invoice_number, amount, payment_mode, payment_status, remarks) VALUES
('income', '2025-02-08', 'Revenue', 'Subscription Revenue', 'Annual subscription renewal', 'Enterprise Solutions Ltd', 'INV-2025-003', 120000.00, 'Bank Transfer', 'Completed', 'Annual plan'),
('income', '2025-02-18', 'Revenue', 'API Integration Fees', 'Payment gateway integration', 'PaymentPro Inc', 'INV-2025-004', 35000.00, 'Bank Transfer', 'Completed', 'Integration completed'),
('expense', '2025-02-05', 'COGS', 'Software Licenses', 'Development tools license', 'DevTools Corp', 'LIC-2025-001', 5000.00, 'Credit Card', 'Completed', 'Annual license'),
('expense', '2025-02-10', 'Operating_Expense', 'Electricity Bill', 'February electricity', 'Power Company', 'ELEC-2025-02', 2500.00, 'Bank Transfer', 'Completed', 'Monthly bill'),
('expense', '2025-02-15', 'Operating_Expense', 'Salary & Wages', 'February payroll', 'Employees', 'PAY-2025-02', 120000.00, 'Bank Transfer', 'Completed', 'Monthly salaries'),
('expense', '2025-02-22', 'Operating_Expense', 'Advertising & Marketing Costs', 'Social media campaign', 'Marketing Agency', 'MKT-2025-001', 15000.00, 'Bank Transfer', 'Completed', 'Q1 campaign');

-- March 2025
INSERT INTO transactions (transaction_type, date, category, sub_category, description, client_vendor, invoice_number, amount, payment_mode, payment_status, remarks) VALUES
('income', '2025-03-10', 'Revenue', 'IT Service Revenue', 'Quarterly service fee', 'TechCorp Inc', 'INV-2025-005', 150000.00, 'Bank Transfer', 'Completed', 'Q1 payment'),
('income', '2025-03-20', 'Revenue', 'Maintenance & Support Fees', 'Monthly support contract', 'Support Client A', 'INV-2025-006', 25000.00, 'Bank Transfer', 'Completed', 'Support services'),
('expense', '2025-03-05', 'COGS', 'Cloud Hosting Costs', 'AWS monthly hosting', 'Amazon Web Services', 'AWS-2025-003', 2800.00, 'Credit Card', 'Completed', 'Increased usage'),
('expense', '2025-03-15', 'Operating_Expense', 'Office Rent', 'March office rent', 'Property Management Co', 'RENT-2025-03', 15000.00, 'Bank Transfer', 'Completed', 'Monthly rent'),
('expense', '2025-03-20', 'Operating_Expense', 'Salary & Wages', 'March payroll', 'Employees', 'PAY-2025-03', 120000.00, 'Bank Transfer', 'Completed', 'Monthly salaries'),
('expense', '2025-03-25', 'Operating_Expense', 'Software Subscriptions', 'SaaS tools subscription', 'SaaS Provider', 'SUB-2025-001', 3000.00, 'Credit Card', 'Completed', 'Monthly subscriptions');

-- April 2025
INSERT INTO transactions (transaction_type, date, category, sub_category, description, client_vendor, invoice_number, amount, payment_mode, payment_status, remarks) VALUES
('income', '2025-04-07', 'Revenue', 'Custom Software Development Fees', 'Mobile app development', 'MobileFirst Co', 'INV-2025-007', 95000.00, 'Bank Transfer', 'Completed', 'App v2.0'),
('income', '2025-04-15', 'Revenue', 'Training & Consulting Fees', 'Team training session', 'Training Client B', 'INV-2025-008', 18000.00, 'Bank Transfer', 'Completed', 'On-site training'),
('expense', '2025-04-03', 'COGS', 'Developer Costs', 'Freelance developer', 'Freelancer John', 'DEV-2025-001', 12000.00, 'Bank Transfer', 'Completed', 'Contract work'),
('expense', '2025-04-10', 'Operating_Expense', 'Internet Bill', 'April internet service', 'ISP Provider', 'NET-2025-04', 800.00, 'Bank Transfer', 'Completed', 'Monthly bill'),
('expense', '2025-04-15', 'Operating_Expense', 'Salary & Wages', 'April payroll', 'Employees', 'PAY-2025-04', 120000.00, 'Bank Transfer', 'Completed', 'Monthly salaries'),
('expense', '2025-04-28', 'Operating_Expense', 'Office Supplies', 'Office equipment purchase', 'Office Supply Store', 'SUP-2025-001', 2500.00, 'Credit Card', 'Completed', 'Desks and chairs');

-- May 2025
INSERT INTO transactions (transaction_type, date, category, sub_category, description, client_vendor, invoice_number, amount, payment_mode, payment_status, remarks) VALUES
('income', '2025-05-12', 'Revenue', 'IT Service Revenue', 'Monthly service fee', 'TechCorp Inc', 'INV-2025-009', 50000.00, 'Bank Transfer', 'Completed', 'Monthly subscription'),
('income', '2025-05-22', 'Revenue', 'Licensing Revenue', 'Software license sale', 'License Buyer Co', 'INV-2025-010', 45000.00, 'Bank Transfer', 'Completed', 'Annual license'),
('expense', '2025-05-05', 'COGS', 'Payment Gateway Fees', 'Transaction fees', 'Payment Gateway', 'PG-2025-001', 3500.00, 'Bank Transfer', 'Completed', 'Monthly fees'),
('expense', '2025-05-15', 'Operating_Expense', 'Office Rent', 'May office rent', 'Property Management Co', 'RENT-2025-05', 15000.00, 'Bank Transfer', 'Completed', 'Monthly rent'),
('expense', '2025-05-20', 'Operating_Expense', 'Salary & Wages', 'May payroll', 'Employees', 'PAY-2025-05', 120000.00, 'Bank Transfer', 'Completed', 'Monthly salaries'),
('expense', '2025-05-25', 'Operating_Expense', 'Insurance', 'Business insurance premium', 'Insurance Co', 'INS-2025-001', 5000.00, 'Bank Transfer', 'Completed', 'Quarterly premium');

-- June 2025
INSERT INTO transactions (transaction_type, date, category, sub_category, description, client_vendor, invoice_number, amount, payment_mode, payment_status, remarks) VALUES
('income', '2025-06-08', 'Revenue', 'Subscription Revenue', 'New client subscription', 'NewClient Inc', 'INV-2025-011', 60000.00, 'Bank Transfer', 'Completed', 'Starter plan'),
('income', '2025-06-18', 'Revenue', 'API Integration Fees', 'Third-party API integration', 'Integration Client', 'INV-2025-012', 28000.00, 'Bank Transfer', 'Completed', 'API setup'),
('expense', '2025-06-05', 'COGS', 'Cloud Hosting Costs', 'AWS monthly hosting', 'Amazon Web Services', 'AWS-2025-006', 3000.00, 'Credit Card', 'Completed', 'Production servers'),
('expense', '2025-06-10', 'Operating_Expense', 'Electricity Bill', 'June electricity', 'Power Company', 'ELEC-2025-06', 2800.00, 'Bank Transfer', 'Completed', 'Monthly bill'),
('expense', '2025-06-15', 'Operating_Expense', 'Salary & Wages', 'June payroll', 'Employees', 'PAY-2025-06', 120000.00, 'Bank Transfer', 'Completed', 'Monthly salaries'),
('expense', '2025-06-30', 'Operating_Expense', 'Research & Development Costs', 'R&D project funding', 'R&D Lab', 'RD-2025-001', 20000.00, 'Bank Transfer', 'Completed', 'Q2 R&D project');

-- July 2025
INSERT INTO transactions (transaction_type, date, category, sub_category, description, client_vendor, invoice_number, amount, payment_mode, payment_status, remarks) VALUES
('income', '2025-07-10', 'Revenue', 'IT Service Revenue', 'Q3 service payment', 'TechCorp Inc', 'INV-2025-013', 150000.00, 'Bank Transfer', 'Completed', 'Quarterly payment'),
('income', '2025-07-25', 'Revenue', 'Affiliate & Referral Revenue', 'Affiliate commission', 'Affiliate Partner', 'INV-2025-014', 15000.00, 'Bank Transfer', 'Completed', 'Q2 commissions'),
('expense', '2025-07-05', 'COGS', 'Software Maintenance & Updates', 'Software updates', 'Software Vendor', 'MAINT-2025-001', 8000.00, 'Credit Card', 'Completed', 'System updates'),
('expense', '2025-07-15', 'Operating_Expense', 'Office Rent', 'July office rent', 'Property Management Co', 'RENT-2025-07', 15000.00, 'Bank Transfer', 'Completed', 'Monthly rent'),
('expense', '2025-07-20', 'Operating_Expense', 'Salary & Wages', 'July payroll', 'Employees', 'PAY-2025-07', 120000.00, 'Bank Transfer', 'Completed', 'Monthly salaries'),
('expense', '2025-07-28', 'Operating_Expense', 'Repair & Maintenance', 'Office equipment repair', 'Repair Service', 'REP-2025-001', 3500.00, 'Credit Card', 'Completed', 'AC repair');

-- August 2025
INSERT INTO transactions (transaction_type, date, category, sub_category, description, client_vendor, invoice_number, amount, payment_mode, payment_status, remarks) VALUES
('income', '2025-08-12', 'Revenue', 'Custom Software Development Fees', 'E-commerce platform', 'EcomClient Ltd', 'INV-2025-015', 110000.00, 'Bank Transfer', 'Completed', 'Platform development'),
('income', '2025-08-20', 'Revenue', 'Training & Consulting Fees', 'Management consulting', 'Consulting Client', 'INV-2025-016', 22000.00, 'Bank Transfer', 'Completed', 'Strategy session'),
('expense', '2025-08-05', 'COGS', 'Customer Support Costs', 'Support tools subscription', 'Support Tools Co', 'SUP-2025-002', 2000.00, 'Credit Card', 'Completed', 'Monthly subscription'),
('expense', '2025-08-10', 'Operating_Expense', 'Internet Bill', 'August internet service', 'ISP Provider', 'NET-2025-08', 800.00, 'Bank Transfer', 'Completed', 'Monthly bill'),
('expense', '2025-08-15', 'Operating_Expense', 'Salary & Wages', 'August payroll', 'Employees', 'PAY-2025-08', 120000.00, 'Bank Transfer', 'Completed', 'Monthly salaries'),
('expense', '2025-08-22', 'Operating_Expense', 'Sales Commissions', 'Sales team commission', 'Sales Team', 'COMM-2025-001', 18000.00, 'Bank Transfer', 'Completed', 'Q3 commissions');

-- September 2025
INSERT INTO transactions (transaction_type, date, category, sub_category, description, client_vendor, invoice_number, amount, payment_mode, payment_status, remarks) VALUES
('income', '2025-09-08', 'Revenue', 'IT Service Revenue', 'Monthly service fee', 'TechCorp Inc', 'INV-2025-017', 50000.00, 'Bank Transfer', 'Completed', 'Monthly subscription'),
('income', '2025-09-18', 'Revenue', 'Maintenance & Support Fees', 'Support contract renewal', 'Support Client B', 'INV-2025-018', 30000.00, 'Bank Transfer', 'Completed', 'Annual support'),
('expense', '2025-09-05', 'COGS', 'Cloud Hosting Costs', 'AWS monthly hosting', 'Amazon Web Services', 'AWS-2025-009', 3200.00, 'Credit Card', 'Completed', 'Production servers'),
('expense', '2025-09-15', 'Operating_Expense', 'Office Rent', 'September office rent', 'Property Management Co', 'RENT-2025-09', 15000.00, 'Bank Transfer', 'Completed', 'Monthly rent'),
('expense', '2025-09-20', 'Operating_Expense', 'Salary & Wages', 'September payroll', 'Employees', 'PAY-2025-09', 120000.00, 'Bank Transfer', 'Completed', 'Monthly salaries'),
('expense', '2025-09-25', 'Operating_Expense', 'Bank Charges', 'Bank service charges', 'Bank', 'BANK-2025-001', 500.00, 'Bank Transfer', 'Completed', 'Monthly fees');

-- October 2025
INSERT INTO transactions (transaction_type, date, category, sub_category, description, client_vendor, invoice_number, amount, payment_mode, payment_status, remarks) VALUES
('income', '2025-10-10', 'Revenue', 'Subscription Revenue', 'Enterprise subscription', 'Enterprise Client', 'INV-2025-019', 180000.00, 'Bank Transfer', 'Completed', 'Annual enterprise plan'),
('income', '2025-10-22', 'Revenue', 'API Integration Fees', 'Custom API development', 'API Client Co', 'INV-2025-020', 42000.00, 'Bank Transfer', 'Completed', 'API project'),
('expense', '2025-10-05', 'COGS', 'Software Licenses', 'Development software', 'DevTools Corp', 'LIC-2025-002', 6000.00, 'Credit Card', 'Completed', 'New licenses'),
('expense', '2025-10-10', 'Operating_Expense', 'Electricity Bill', 'October electricity', 'Power Company', 'ELEC-2025-10', 2700.00, 'Bank Transfer', 'Completed', 'Monthly bill'),
('expense', '2025-10-15', 'Operating_Expense', 'Salary & Wages', 'October payroll', 'Employees', 'PAY-2025-10', 120000.00, 'Bank Transfer', 'Completed', 'Monthly salaries'),
('expense', '2025-10-28', 'Operating_Expense', 'Website Maintenance Costs', 'Website updates', 'Web Dev Agency', 'WEB-2025-001', 5000.00, 'Bank Transfer', 'Completed', 'Site maintenance');

-- November 2025
INSERT INTO transactions (transaction_type, date, category, sub_category, description, client_vendor, invoice_number, amount, payment_mode, payment_status, remarks) VALUES
('income', '2025-11-08', 'Revenue', 'IT Service Revenue', 'Monthly service fee', 'TechCorp Inc', 'INV-2025-021', 50000.00, 'Bank Transfer', 'Completed', 'Monthly subscription'),
('income', '2025-11-18', 'Revenue', 'Custom Software Development Fees', 'Mobile app update', 'MobileFirst Co', 'INV-2025-022', 65000.00, 'Bank Transfer', 'Completed', 'App v2.1'),
('income', '2025-11-25', 'Non_Operating_Income', 'Rental Income', 'Office space rental', 'Subtenant Co', 'RENT-IN-2025-01', 8000.00, 'Bank Transfer', 'Completed', 'Monthly rental'),
('expense', '2025-11-05', 'COGS', 'Cloud Hosting Costs', 'AWS monthly hosting', 'Amazon Web Services', 'AWS-2025-011', 3500.00, 'Credit Card', 'Completed', 'Production servers'),
('expense', '2025-11-15', 'Operating_Expense', 'Office Rent', 'November office rent', 'Property Management Co', 'RENT-2025-11', 15000.00, 'Bank Transfer', 'Completed', 'Monthly rent'),
('expense', '2025-11-20', 'Operating_Expense', 'Salary & Wages', 'November payroll', 'Employees', 'PAY-2025-11', 120000.00, 'Bank Transfer', 'Completed', 'Monthly salaries'),
('expense', '2025-11-28', 'Operating_Expense', 'Advertising & Marketing Costs', 'Holiday marketing campaign', 'Marketing Agency', 'MKT-2025-002', 25000.00, 'Bank Transfer', 'Completed', 'Q4 campaign');

