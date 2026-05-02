-- ==========================================================
-- 1. SEED USERS: Limited to 24 chars
-- ==========================================================
DO $$
BEGIN
    INSERT INTO "users" ("id", "username", "email", "role", "status", "created_at") VALUES
    (substr(md5('admin'), 1, 24), 'admin_tiesen', 'admin@tiesen.com', 'admin', 'active', now() - interval '30 days'),
    (substr(md5('vendor1'), 1, 24), 'apple_store', 'sales@apple.com', 'vendor_owner', 'active', now() - interval '30 days'),
    (substr(md5('vendor2'), 1, 24), 'samsung_store', 'info@samsung.com', 'vendor_owner', 'active', now() - interval '30 days');

    FOR i IN 1..50 LOOP
        INSERT INTO "users" ("id", "username", "email", "role", "status", "created_at")
        VALUES (
            substr(md5(random()::text), 1, 24), -- Strictly 24 chars
            'cust_' || lower(substr(md5(random()::text), 1, 5)), 
            'user' || i || '@example.com', 
            'user', 
            'active', 
            now() - (random() * interval '7 days')
        );
    END LOOP;
END $$;

-- ==========================================================
-- 2. SEED VENDORS & CATEGORIES
-- ==========================================================
DO $$
DECLARE
    v_cat_id text;
    v_owner_id text := (SELECT id FROM users WHERE role = 'vendor_owner' LIMIT 1);
    -- Array of realistic category names to pick from
    v_cat_names text[] := ARRAY[
        'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 
        'Automotive', 'Books', 'Toys', 'Health', 'Groceries', 
        'Garden', 'Pets', 'Office Supplies', 'Software', 'Jewelry', 
        'Music', 'Movies', 'Handmade', 'Industrial', 'Baby Care'
    ];
BEGIN
    -- Seed 20 Categories with randomized IDs (Max 24 chars)
    FOR i IN 1..20 LOOP
        INSERT INTO "categories" ("id", "name") 
        VALUES (
            substr(md5('cat_' || i), 1, 24), -- Unique ID based on index
            v_cat_names[i]                   -- Pick from name array
        );
    END LOOP;

    -- Seed 20 Vendors linked to an owner
    FOR i IN 1..20 LOOP
        INSERT INTO "vendors" ("id", "owner_id", "name", "status", "created_at")
        VALUES (
            substr('v_' || md5(random()::text), 1, 24), -- ID limited to 24 chars
            v_owner_id,
            'Global Shop ' || upper(substr(md5(random()::text), 1, 4)), 
            CASE WHEN i % 10 = 0 THEN 'pending'::vendor_status ELSE 'approved'::vendor_status END,
            now() - (i * interval '1 day')
        );
    END LOOP;
END $$;

DO $$
DECLARE
    v_owner_id text := (SELECT id FROM users WHERE role = 'vendor_owner' LIMIT 1);
BEGIN
    FOR i IN 1..20 LOOP
        INSERT INTO "vendors" ("id", "owner_id", "name", "status", "created_at")
        VALUES (
            substr(md5(random()::text), 1, 24),
            v_owner_id,
            'Global Shop ' || upper(substr(md5(random()::text), 1, 4)), 
            CASE WHEN i % 10 = 0 THEN 'pending'::vendor_status ELSE 'approved'::vendor_status END,
            now() - (i * interval '1 day')
        );
    END LOOP;
END $$;

-- ==========================================================
-- 3. SEED PRODUCTS & VARIANTS
-- ==========================================================
DO $$
DECLARE
    v_p_id text;
    v_v_id text;
    v_c_id text; -- Variable to hold random category ID
    v_var_color_id text;
    v_var_size_id text;
    v_opt1 int; v_opt2 int; v_opt3 int; v_opt4 int;
BEGIN
    -- 1. Setup Variants (IDs limited to 24 chars)
    v_var_color_id := substr(md5('color'), 1, 24);
    v_var_size_id := substr(md5('size'), 1, 24);

    INSERT INTO "variants" ("id", "name") VALUES (v_var_color_id, 'color') 
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    
    INSERT INTO "variants" ("id", "name") VALUES (v_var_size_id, 'size') 
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;

    -- 2. Setup Options (Capture Serial IDs for SKU logic)
    INSERT INTO "variant_options" ("variant_id", "value") VALUES (v_var_color_id, 'black') RETURNING id INTO v_opt1;
    INSERT INTO "variant_options" ("variant_id", "value") VALUES (v_var_color_id, 'white') RETURNING id INTO v_opt2;
    INSERT INTO "variant_options" ("variant_id", "value") VALUES (v_var_size_id, 'm') RETURNING id INTO v_opt3;
    INSERT INTO "variant_options" ("variant_id", "value") VALUES (v_var_size_id, 'l') RETURNING id INTO v_opt4;

    -- 3. Loop to create 60 Products
    FOR i IN 1..60 LOOP
        -- Generate random Product ID (24 chars)
        v_p_id := substr(md5(random()::text), 1, 24);
        
        -- Pick a random Approved Vendor
        v_v_id := (SELECT id FROM vendors WHERE status = 'approved' ORDER BY random() LIMIT 1);
        
        -- FIX: Pick a random Category ID (matches foreign key)
        v_c_id := (SELECT id FROM categories ORDER BY random() LIMIT 1);
        
        -- Insert Product
        INSERT INTO "products" ("id", "vendor_id", "category_id", "name", "price", "stock", "created_at")
        VALUES (
            v_p_id, 
            v_v_id, 
            v_c_id, -- Using the dynamic ID here
            'Gadget ' || upper(substr(md5(random()::text), 1, 4)), 
            (100 + random()*500)::numeric(10,2), 
            100, 
            now() - interval '15 days'
        );

        -- 4. Create Product Variants (Cartesian Product SKU Logic)
        -- Format: {last_4_of_prod_id}-{opt_id_1}-{opt_id_2}
        INSERT INTO "product_variants" ("id", "product_id", "sku", "price", "stock") VALUES
        (substr(md5(random()::text), 1, 24), v_p_id, right(v_p_id, 4) || '-' || v_opt1 || '-' || v_opt3, 100, 25),
        (substr(md5(random()::text), 1, 24), v_p_id, right(v_p_id, 4) || '-' || v_opt1 || '-' || v_opt4, 100, 25),
        (substr(md5(random()::text), 1, 24), v_p_id, right(v_p_id, 4) || '-' || v_opt2 || '-' || v_opt3, 100, 25),
        (substr(md5(random()::text), 1, 24), v_p_id, right(v_p_id, 4) || '-' || v_opt2 || '-' || v_opt4, 100, 25);
    END LOOP;
END $$;

-- ==========================================================
-- 4. SEED PAYMENTS & ORDERS
-- ==========================================================
DO $$
DECLARE
    v_u_id text; 
    v_v_id text; 
    v_p_id text;
    v_pay_id text; 
    v_ord_id int;
    v_stts text[] := ARRAY['pending', 'completed', 'cancelled'];
    v_meths text[] := ARRAY['cash_on_delivery', 'bank_transfer'];
BEGIN
    FOR i IN 1..120 LOOP
        -- 1. Get a random user
        v_u_id := (SELECT id FROM users WHERE role = 'user' ORDER BY random() LIMIT 1);
        
        -- 2. Get a random approved vendor who ACTUALLY HAS products
        -- This prevents joining with a vendor that has 0 products (which causes NULL product_id)
        v_v_id := (SELECT vendor_id FROM products GROUP BY vendor_id ORDER BY random() LIMIT 1);
        
        -- 3. Get a random product belonging to that specific vendor
        v_p_id := (SELECT id FROM products WHERE vendor_id = v_v_id ORDER BY random() LIMIT 1);

        -- 4. Safety check: If for some reason no product is found, skip this iteration
        IF v_p_id IS NULL THEN
            CONTINUE;
        END IF;

        -- 5. Create Payment
        v_pay_id := substr(md5(random()::text), 1, 24);
        INSERT INTO "payments" ("id", "method", "amount", "status", "created_at")
        VALUES (
            v_pay_id, 
            v_meths[floor(random()*2+1)]::payment_method, 
            (200 + random()*1000)::numeric(10,2), 
            'success', 
            now() - (i * interval '1.5 hours')
        );

        -- 6. Create Order
        INSERT INTO "orders" ("user_id", "vendor_id", "payment_id", "total_amount", "status", "created_at")
        VALUES (
            v_u_id, 
            v_v_id, 
            v_pay_id, 
            (SELECT amount FROM payments WHERE id = v_pay_id), 
            v_stts[floor(random()*3+1)]::order_status, 
            now() - (i * interval '1.5 hours')
        ) RETURNING id INTO v_ord_id;

        -- 7. Create Order Item (Guaranteed v_p_id is NOT NULL)
        INSERT INTO "order_items" ("id", "order_id", "product_id", "quantity", "unit_price")
        VALUES (
            substr(md5(random()::text), 1, 24), 
            v_ord_id, 
            v_p_id, 
            (1 + floor(random()*3))::int, 
            (SELECT amount/2 FROM payments WHERE id = v_pay_id)
        );
    END LOOP;
END $$;
