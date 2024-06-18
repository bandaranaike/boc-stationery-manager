-- Migration script for stationery_stock.db

-- Drop existing tables if they exist
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS branches;

-- Create items table
CREATE TABLE items (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       code TEXT NOT NULL,
                       name TEXT NOT NULL,
                       total_value REAL NOT NULL DEFAULT 0.0,
                       total_stock INTEGER NOT NULL DEFAULT 0,
                       reorder_level INTEGER NOT NULL DEFAULT 0,
                       status TEXT NOT NULL DEFAULT 'active'
);

-- Create stocks table
CREATE TABLE stocks (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        item_id INTEGER NOT NULL,
                        date TEXT NOT NULL,
                        unit_price REAL NOT NULL,
                        stock INTEGER NOT NULL,
                        initial_stock INTEGER NOT NULL,
                        FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Create branches table
CREATE TABLE branches (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          name TEXT NOT NULL,
                          code TEXT NOT NULL
);

-- Sample data insertion (optional)
INSERT INTO items (code, name, total_value, total_stock, reorder_level, status) VALUES
                                                                                    ('ST001', 'Pens', 100.0, 500, 50, 'active'),
                                                                                    ('ST002', 'Notebooks', 200.0, 300, 30, 'active');

INSERT INTO stocks (item_id, date, unit_price, stock, initial_stock) VALUES
                                                                         (1, '2024-06-18', 0.20, 500, 500),
                                                                         (2, '2024-06-18', 0.67, 300, 300);

INSERT INTO branches (name, code) VALUES
                                      ('Central Province Office', 'CPO'),
                                      ('Western Province Office', 'WPO');
