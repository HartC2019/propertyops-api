DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS users;



CREATE TABLE users (
  id serial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  created_at timestamp DEFAULT current_timestamp
);




CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nickname TEXT NOT NULL,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code INTEGER NOT NULL,
    property_type TEXT NOT NULL,
    year_built INTEGER,
    bedrooms INTEGER,
    bathrooms DECIMAL(3,1),
    square_feet INTEGER,
    purchase_price DECIMAL(10,2),
    purchase_date DATE,
    monthly_rent DECIMAL(10,2),
    cover_image_url TEXT,
    electric_paid_by TEXT,
    water_paid_by TEXT,
    gas_paid_by TEXT,
    trash_paid_by TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
