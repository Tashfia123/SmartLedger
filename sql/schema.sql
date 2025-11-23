-- Schema: categories, subcategories, transactions

CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income','expense','liability','asset'))
);

-- Ensure each category name is unique globally
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

CREATE TABLE IF NOT EXISTS subcategories (
  sub_id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);

-- Ensure subcategory names are unique within a category
CREATE UNIQUE INDEX IF NOT EXISTS idx_subcategories_cat_name ON subcategories(category_id, name);

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id SERIAL PRIMARY KEY,
  user_id INT,
  transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('income','expense','liability','asset')),
  date DATE DEFAULT CURRENT_DATE,
  category VARCHAR(100),
  sub_category VARCHAR(100),
  description TEXT,
  client_vendor VARCHAR(100),
  invoice_number VARCHAR(50),
  amount DECIMAL(20,2) NOT NULL,
  payment_mode VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'Pending',
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


