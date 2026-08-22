import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createProperty } from "#db/queries/properties";
import { createIncome } from "#db/queries/income";

await db.connect();
await seed();
await db.end();

async function seed() {
  // Create test user
  const user = await createUser("chase", "password123");

  // Seed properties
  const mapleDuplex = await createProperty({
    user_id: user.id,
    nickname: "Maple Duplex",
    street: "123 Maple Ave",
    city: "Denver",
    state: "CO",
    zip_code: 80211,
    property_type: "Duplex",
    year_built: 1988,
    bedrooms: 4,
    bathrooms: 2.5,
    square_feet: 2100,
    purchase_price: 425000,
    purchase_date: "2021-03-15",
    monthly_rent: 2850,
    cover_image_url:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    electric_paid_by: "Tenant",
    water_paid_by: "Landlord",
    gas_paid_by: "Tenant",
    trash_paid_by: "Landlord",
    notes: "Recently renovated duplex.",
  });

  const downtownCondo = await createProperty({
    user_id: user.id,
    nickname: "Downtown Condo",
    street: "450 Market St",
    city: "Denver",
    state: "CO",
    zip_code: 80202,
    property_type: "Condo",
    year_built: 2017,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1100,
    purchase_price: 510000,
    purchase_date: "2023-07-20",
    monthly_rent: 3100,
    cover_image_url:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    electric_paid_by: "Tenant",
    water_paid_by: "HOA",
    gas_paid_by: "HOA",
    trash_paid_by: "HOA",
    notes: "Modern downtown condo.",
  });

  const pineStreetRental = await createProperty({
    user_id: user.id,
    nickname: "Pine Street Rental",
    street: "789 Pine St",
    city: "Lakewood",
    state: "CO",
    zip_code: 80226,
    property_type: "Single Family",
    year_built: 1995,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1650,
    purchase_price: 385000,
    purchase_date: "2019-09-01",
    monthly_rent: 2450,
    cover_image_url:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    electric_paid_by: "Tenant",
    water_paid_by: "Tenant",
    gas_paid_by: "Tenant",
    trash_paid_by: "Landlord",
    notes: "Long-term rental property.",
  });

  // Seed income
  await createIncome({
    property_id: mapleDuplex.id,
    amount: 2850,
    category: "Rent",
    payment_date: "2026-08-01",
    note: "August rent",
  });

  await createIncome({
    property_id: downtownCondo.id,
    amount: 3100,
    category: "Rent",
    payment_date: "2026-08-01",
    note: "August rent",
  });

  await createIncome({
    property_id: pineStreetRental.id,
    amount: 2450,
    category: "Rent",
    payment_date: "2026-08-01",
    note: "August rent",
  });

  await db.query(`
  INSERT INTO expense
    (property_id, amount, category, expense_date, note)
  VALUES
    (1, 125.00, 'Maintenance', '2026-08-05', 'Plumbing repair'),
    (1, 85.50, 'Utility', '2026-08-10', 'Water bill'),
    (1, 450.00, 'Tax', '2026-08-15', 'Property tax payment'),
    (1, 200.00, 'Enhancement', '2026-08-18', 'New light fixtures');
`);

  console.log("🌱 Database seeded.");
}
