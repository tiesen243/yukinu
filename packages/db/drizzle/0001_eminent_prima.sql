INSERT INTO "users" (id, username, email, role) VALUES
  ('ckv1user0000000000000001', 'alice', 'alice@example.com', 'user'),
  ('ckv1user0000000000000002', 'bobby', 'bob@example.com', 'user'),
  ('ckv1user0000000000000003', 'carolyn', 'carol@example.com', 'user'),
  ('ckv1user0000000000000004', 'davida', 'dave@example.com', 'user'),
  ('ckv1user0000000000000005', 'evelyn', 'eve@example.com', 'user'),
  ('ckv1user0000000000000006', 'frankie', 'frank@example.com', 'user'),
  ('ckv1user0000000000000007', 'grace', 'grace@example.com', 'user'),
  ('ckv1user0000000000000008', 'heidi', 'heidi@example.com', 'user'),
  ('ckv1user0000000000000009', 'ivanhoe', 'ivan@example.com', 'user'),
  ('ckv1user0000000000000010', 'judith', 'judy@example.com', 'vendor_owner');--> statement-breakpoint

INSERT INTO "profiles" (id, full_name, bio, gender, date_of_birth) VALUES
  ('ckv1user0000000000000001', 'Alice Smith', 'Bio 1', 'female', '1990-01-01'),
  ('ckv1user0000000000000002', 'Bobby Jones', 'Bio 2', 'male', '1989-02-02'),
  ('ckv1user0000000000000003', 'Carolyn White', 'Bio 3', 'female', '1991-03-03'),
  ('ckv1user0000000000000004', 'Davida Black', 'Bio 4', 'male', '1992-04-04'),
  ('ckv1user0000000000000005', 'Evelynn Green', 'Bio 5', 'female', '1993-05-05'),
  ('ckv1user0000000000000006', 'Frankie Blue', 'Bio 6', 'male', '1994-06-06'),
  ('ckv1user0000000000000007', 'Grace Red', 'Bio 7', 'female', '1995-07-07'),
  ('ckv1user0000000000000008', 'Heidi Yellow', 'Bio 8', 'female', '1996-08-08'),
  ('ckv1user0000000000000009', 'Ivanhoe Purple', 'Bio 9', 'male', '1997-09-09'),
  ('ckv1user0000000000000010', 'Judith Orange', 'Bio 10', 'female', '1998-10-10');--> statement-breakpoint

INSERT INTO "vendors" (id, owner_id, name, description, image, address) VALUES
  ('ckv1vendor00000000000001', 'ckv1user0000000000000010', 'Skibidi Store', 'Best vendor', 'vendor1.jpg', '123 Vendor St');--> statement-breakpoint

INSERT INTO "categories" (id, name, image) VALUES 
  ('cat000000000000000000001', 'Electronics', 'electronics.jpg'),
  ('cat000000000000000000002', 'Books', 'books.jpg'),
  ('cat000000000000000000003', 'Clothing', 'clothing.jpg'),
  ('cat000000000000000000004', 'Home', 'home.jpg'),
  ('cat000000000000000000005', 'Toys', 'toys.jpg'),
  ('cat000000000000000000006', 'Sports', 'sports.jpg'),
  ('cat000000000000000000007', 'Beauty', 'beauty.jpg'),
  ('cat000000000000000000008', 'Garden', 'garden.jpg'),
  ('cat000000000000000000009', 'Automotive', 'automotive.jpg'),
  ('cat000000000000000000010', 'Music', 'music.jpg');--> statement-breakpoint

INSERT INTO "products" (id, vendor_id, category_id, sku, name, description, price) VALUES   
  ('prod00000000000000000001', 'ckv1vendor00000000000001', 'cat000000000000000000001', 'SKU001', 'Smartphone', 'Latest smartphone', 699.99),
  ('prod00000000000000000002', 'ckv1vendor00000000000001', 'cat000000000000000000002', 'SKU002', 'Novel', 'Bestselling novel', 19.99),
  ('prod00000000000000000003', 'ckv1vendor00000000000001', 'cat000000000000000000003', 'SKU003', 'T-Shirt', 'Comfortable cotton T-shirt', 14.99),
  ('prod00000000000000000004', 'ckv1vendor00000000000001', 'cat000000000000000000004', 'SKU004', 'Desk Lamp', 'LED desk lamp with adjustable arm', 39.99),
  ('prod00000000000000000005', 'ckv1vendor00000000000001', 'cat000000000000000000005', 'SKU005', 'Action Figure', 'Collectible action figure', 24.99),
  ('prod00000000000000000006', 'ckv1vendor00000000000001', 'cat000000000000000000006', 'SKU006', 'Basketball', 'Official size basketball', 29.99),
  ('prod00000000000000000007', 'ckv1vendor00000000000001', 'cat000000000000000000007', 'SKU007', 'Face Cream', 'Moisturizing skincare cream', 18.50),
  ('prod00000000000000000008', 'ckv1vendor00000000000001', 'cat000000000000000000008', 'SKU008', 'Garden Shovel', 'Sturdy metal garden shovel', 12.99),
  ('prod00000000000000000009', 'ckv1vendor00000000000001', 'cat000000000000000000009', 'SKU009', 'Car Vacuum', 'Portable car vacuum cleaner', 34.99),
  ('prod00000000000000000010', 'ckv1vendor00000000000001', 'cat000000000000000000010', 'SKU010', 'Guitar Strings', 'High-quality acoustic guitar strings', 9.99),
  ('prod00000000000000000011', 'ckv1vendor00000000000001', 'cat000000000000000000001', 'SKU011', 'Wireless Earbuds', 'Noise-cancelling wireless earbuds', 59.99),
  ('prod00000000000000000012', 'ckv1vendor00000000000001', 'cat000000000000000000004', 'SKU012', 'Electric Kettle', 'Stainless steel electric kettle', 49.99);--> statement-breakpoint

INSERT INTO "product_images" (id, product_id, url) VALUES 
  ('img000000000000000000001', 'prod00000000000000000001', 'smartphone.jpg'),
  ('img000000000000000000002', 'prod00000000000000000002', 'novel.jpg'),
  ('img000000000000000000003', 'prod00000000000000000003', 'tshirt.jpg'),
  ('img000000000000000000004', 'prod00000000000000000004', 'desklamp.jpg'),
  ('img000000000000000000005', 'prod00000000000000000005', 'actionfigure.jpg'),
  ('img000000000000000000006', 'prod00000000000000000006', 'basketball.jpg'),
  ('img000000000000000000007', 'prod00000000000000000007', 'facecream.jpg'),
  ('img000000000000000000008', 'prod00000000000000000008', 'gardenshovel.jpg'),
  ('img000000000000000000009', 'prod00000000000000000009', 'carvacuum.jpg'),
  ('img000000000000000000010', 'prod00000000000000000010', 'guitarstrings.jpg'),
  ('img000000000000000000011', 'prod00000000000000000011', 'earbuds.jpg'),
  ('img000000000000000000012', 'prod00000000000000000012', 'kettle.jpg');--> statement-breakpoint

INSERT INTO "product_variants" (id, product_id, name) VALUES 
  ('var000000000000000000001', 'prod00000000000000000001', 'Color'),
  ('var000000000000000000002', 'prod00000000000000000002', 'Edition'),
  ('var000000000000000000003', 'prod00000000000000000003', 'Size'),
  ('var000000000000000000004', 'prod00000000000000000004', 'Color'),
  ('var000000000000000000005', 'prod00000000000000000005', 'Edition'),
  ('var000000000000000000006', 'prod00000000000000000006', 'Type'),
  ('var000000000000000000007', 'prod00000000000000000007', 'Pack'),
  ('var000000000000000000008', 'prod00000000000000000008', 'Handle Length'),
  ('var000000000000000000009', 'prod00000000000000000009', 'Power'),
  ('var000000000000000000010', 'prod00000000000000000010', 'Thickness'),
  ('var000000000000000000011', 'prod00000000000000000011', 'Color'),
  ('var000000000000000000012', 'prod00000000000000000012', 'Capacity');--> statement-breakpoint

INSERT INTO "product_variant_options" (id, variant_id, value, stock, extra_price) VALUES
  ('opt000000000000000000001', 'var000000000000000000001', 'Black', 10, 0),
  ('opt000000000000000000002', 'var000000000000000000001', 'White', 5, 0),

  ('opt000000000000000000003', 'var000000000000000000002', 'Hardcover', 3, 5.00),
  ('opt000000000000000000004', 'var000000000000000000002', 'Paperback', 7, 0),

  ('opt000000000000000000005', 'var000000000000000000003', 'S', 10, 0),
  ('opt000000000000000000006', 'var000000000000000000003', 'M', 8, 0),
  ('opt000000000000000000007', 'var000000000000000000003', 'L', 5, 0),

  ('opt000000000000000000008', 'var000000000000000000004', 'Black', 6, 0),
  ('opt000000000000000000009', 'var000000000000000000004', 'Silver', 4, 0),

  ('opt000000000000000000010', 'var000000000000000000005', 'Standard', 7, 0),
  ('opt000000000000000000011', 'var000000000000000000005', 'Collector', 3, 10.00),

  ('opt000000000000000000012', 'var000000000000000000006', 'Indoor', 5, 0),
  ('opt000000000000000000013', 'var000000000000000000006', 'Outdoor', 5, 0),

  ('opt000000000000000000014', 'var000000000000000000007', 'Single', 10, 0),
  ('opt000000000000000000015', 'var000000000000000000007', 'Double', 5, 3.00),

  ('opt000000000000000000016', 'var000000000000000000008', 'Short', 7, 0),
  ('opt000000000000000000017', 'var000000000000000000008', 'Long', 5, 1.50),

  ('opt000000000000000000018', 'var000000000000000000009', '60W', 6, 0),
  ('opt000000000000000000019', 'var000000000000000000009', '120W', 4, 5.00),

  ('opt000000000000000000020', 'var000000000000000000010', 'Light', 15, 0),
  ('opt000000000000000000021', 'var000000000000000000010', 'Medium', 12, 1.00),

  ('opt000000000000000000022', 'var000000000000000000011', 'Black', 8, 0),
  ('opt000000000000000000023', 'var000000000000000000011', 'White', 6, 0),

  ('opt000000000000000000024', 'var000000000000000000012', '1L', 5, 0),
  ('opt000000000000000000025', 'var000000000000000000012', '2L', 4, 4.00);--> statement-breakpoint
