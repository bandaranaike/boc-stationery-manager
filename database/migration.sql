-- Migration script for stationery_stock.db

-- Drop existing tables if they exist
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS settings;

-- Create items table
CREATE TABLE items (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       code TEXT NOT NULL,
                       name TEXT NOT NULL,
                       total_value REAL NULL DEFAULT 0.0,
                       total_stock INTEGER NULL DEFAULT 0,
                       reorder_level INTEGER NOT NULL DEFAULT 0,
                       status TEXT NULL DEFAULT 'active'
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

-- Create settings table
CREATE TABLE settings (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          name TEXT NOT NULL,
                          key TEXT NOT NULL,
                          value TEXT NOT NULL
);
