-- Users
INSERT INTO "public"."users" ("id", "username", "email", "email_verified", "role", "status") VALUES
('c000000000000000000000u1', 'admin_user', 'admin@example.com', now(), 'admin', 'active'),
('c000000000000000000000u2', 'vendor_owner1', 'owner1@example.com', now(), 'vendor_owner', 'active'),
('c000000000000000000000u3', 'vendor_staff1', 'staff1@example.com', now(), 'vendor_staff', 'active'),
('c000000000000000000000u4', 'customer1', 'customer1@example.com', now(), 'user', 'active');

-- Profiles (matching users)
INSERT INTO "public"."profiles" ("id", "full_name", "gender", "date_of_birth") VALUES
('c000000000000000000000u1', 'Admin Istrator', 'other', '1990-01-01'),
('c000000000000000000000u2', 'Vendor Owner One', 'male', '1985-05-15'),
('c000000000000000000000u3', 'Vendor Staff One', 'female', '1992-11-20'),
('c000000000000000000000u4', 'Customer One', 'male', '1998-07-25');

-- Addresses (for customer1)
INSERT INTO "public"."addresses" ("id", "user_id", "recipient_name", "phone_number", "street", "city", "state", "postal_code", "country") VALUES
('c000000000000000000000a1', 'c000000000000000000000u4', 'Customer One', '555-1234', '123 Main St', 'Anytown', 'CA', '90210', 'USA');

-- Vendors
INSERT INTO "public"."vendors" ("id", "owner_id", "name", "description", "status") VALUES
('c000000000000000000000v1', 'c000000000000000000000u2', 'Tech Gadget Store', 'Selling the latest electronics and gadgets.', 'approved'),
('c000000000000000000000v2', NULL, 'Fashion Outlet', 'Stylish clothing and accessories.', 'pending');

-- Vendor Staffs
INSERT INTO "public"."vendor_staffs" ("vendor_id", "user_id") VALUES
('c000000000000000000000v1', 'c000000000000000000000u3');

-- Categories
INSERT INTO "public"."categories" ("id", "parent_id", "name", "description") VALUES
('c000000000000000000000c1', NULL, 'Electronics', 'All electronic devices and accessories.'),
('c000000000000000000000c2', 'c000000000000000000000c1', 'Smartphones', 'Mobile phones and related items.'),
('c000000000000000000000c3', NULL, 'Apparel', 'Clothing, shoes, and jewelry.');

-- Products (10)
INSERT INTO "public"."products" ("id", "vendor_id", "category_id", "name", "description", "price", "stock", "sold") VALUES
('c00000000000000000000p01', 'c000000000000000000000v1', 'c000000000000000000000c2', 'Smartphone X', 'Sample description for Smartphone X.', 799.99, 50, 10),
('c00000000000000000000p02', 'c000000000000000000000v1', 'c000000000000000000000c1', 'Wireless Headphones', 'Sample description for Wireless Headphones.', 99.99, 100, 20),
('c00000000000000000000p03', 'c000000000000000000000v2', 'c000000000000000000000c3', 'T-Shirt Cotton', 'Sample description for T-Shirt Cotton.', 19.99, 200, 50),
('c00000000000000000000p04', 'c000000000000000000000v1', 'c000000000000000000000c1', 'Laptop Pro', 'Sample description for Laptop Pro.', 1200.0, 30, 5),
('c00000000000000000000p05', 'c000000000000000000000v1', 'c000000000000000000000c1', 'Smart Watch 3', 'Sample description for Smart Watch 3.', 250.0, 75, 15),
('c00000000000000000000p06', 'c000000000000000000000v1', 'c000000000000000000000c1', 'Gaming Mouse', 'Sample description for Gaming Mouse.', 49.99, 150, 30),
('c00000000000000000000p07', 'c000000000000000000000v2', 'c000000000000000000000c3', 'Denim Jeans', 'Sample description for Denim Jeans.', 59.99, 120, 40),
('c00000000000000000000p08', 'c000000000000000000000v2', 'c000000000000000000000c3', 'Summer Dress', 'Sample description for Summer Dress.', 35.0, 180, 60),
('c00000000000000000000p09', 'c000000000000000000000v1', 'c000000000000000000000c1', 'Portable Speaker', 'Sample description for Portable Speaker.', 75.5, 90, 25),
('c00000000000000000000p10', 'c000000000000000000000v1', 'c000000000000000000000c1', 'Power Bank 10K', 'Sample description for Power Bank 10K.', 29.99, 250, 75);

-- Variants (24-char, 'c' prefix)
INSERT INTO "public"."variants" ("id", "name") VALUES
('c000000000000000000000va', 'Color'),
('c000000000000000000000vb', 'Storage');

-- Variant Options (Manual IDs to allow SKU generation: 1000-1003)
INSERT INTO "public"."variant_options" ("variant_id", "value") VALUES
('c000000000000000000000va', 'Black'),
('c000000000000000000000va', 'White'),
('c000000000000000000000vb', '128GB'),
('c000000000000000000000vb', '256GB');

-- Product Variants (SKU derived from joined Variant Option IDs)
INSERT INTO "public"."product_variants" ("id", "product_id", "sku", "price", "stock") VALUES
('c00000000000000000000pv1', 'c00000000000000000000p01', '1000-1002', 819.99, 25),
('c00000000000000000000pv2', 'c00000000000000000000p01', '1001-1003', 899.99, 15);

-- Attributes and Product Attributes
INSERT INTO "public"."attributes" ("id", "name") VALUES
('c00000000000000000000at1', 'Material'),
('c00000000000000000000at2', 'Warranty');
INSERT INTO "public"."product_attributes" ("product_id", "attribute_id", "value") VALUES
('c00000000000000000000p01', 'c00000000000000000000at2', '2 years'),
('c00000000000000000000p03', 'c00000000000000000000at1', 'cotton');

-- Product Images
INSERT INTO "public"."product_images" ("id", "product_id", "url") VALUES
('c00000000000000000000im1', 'c00000000000000000000p01', 'http://example.com/smartphone_x.jpg'),
('c00000000000000000000im2', 'c00000000000000000000p04', 'http://example.com/laptop_pro.jpg');

-- Product Reviews
INSERT INTO "public"."product_reviews" ("id", "product_id", "user_id", "rating", "comment") VALUES
('c00000000000000000000rv1', 'c00000000000000000000p01', 'c000000000000000000000u4', 5, 'Excellent phone, highly recommend!'),
('c00000000000000000000rv2', 'c00000000000000000000p07', 'c000000000000000000000u4', 4, 'Good quality jeans.');
