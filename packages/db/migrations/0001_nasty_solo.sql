-- ==========================================================
-- 1. SEED USERS: Limited to 24 chars
-- ==========================================================
DO $$
BEGIN
    INSERT INTO "users" ("id", "username", "email", "role", "status", "created_at") VALUES
    (substr(md5('vendor1'), 1, 24), 'apple_store', 'sales@apple.com', 'vendor_owner', 'active', now() - interval '30 days'),
    (substr(md5('vendor2'), 1, 24), 'samsung_store', 'info@samsung.com', 'vendor_owner', 'active', now() - interval '30 days'),
    (substr(md5('vendor3'), 1, 24), 'nike_store', 'marketing@nike.com', 'vendor_owner', 'active', now() - interval '30 days'),
    (substr(md5('vendor4'), 1, 24), 'adidas_store', 'business@adidas.com', 'vendor_owner', 'active', now() - interval '30 days'),
    (substr(md5('vendor5'), 1, 24), 'sony_store', 'contact@sony.com', 'vendor_owner', 'active', now() - interval '30 days');

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
    v_counter int := 1;
    v_cat_names text[] := ARRAY[
        'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 
        'Automotive', 'Books', 'Toys', 'Health', 'Groceries', 
        'Garden', 'Pets', 'Office Supplies', 'Software', 'Jewelry', 
        'Music', 'Movies', 'Handmade', 'Industrial', 'Baby Care'
    ];
    owner_record RECORD;
BEGIN
    -- Seed 20 Categories with randomized IDs (Max 24 chars)
    FOR i IN 1..20 LOOP
        INSERT INTO "categories" ("id", "name") 
        VALUES (
            substr(md5(random()::text), 1, 24), -- Unique ID based on index
            v_cat_names[i]                   -- Pick from name array
        );
    END LOOP;

    -- Seed Vendors: Each vendor must have a unique owner (vendor_owner role)
    FOR owner_record IN (SELECT id FROM users WHERE role = 'vendor_owner') LOOP
        INSERT INTO "vendors" ("id", "owner_id", "name", "status", "created_at")
        VALUES (
            substr(md5(random()::text), 1, 24), 
            owner_record.id, -- Unique owner for this vendor
            'Global Shop ' || upper(substr(md5(random()::text), 1, 4)), 
            CASE WHEN v_counter % 10 = 0 THEN 'pending'::vendor_status ELSE 'approved'::vendor_status END,
            now() - (v_counter * interval '1 day')
        );
        
        v_counter := v_counter + 1;
        
        -- Optional: Stop after 20 vendors if you have more owners than needed
        EXIT WHEN v_counter > 20; 
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
-- 4. SEED PAYMENTS & ORDERS (Fixed Duplicate Product Issue)
-- ==========================================================
DO $$
DECLARE
    v_u_id text; 
    v_v_id text; 
    v_p_id text;
    v_pay_id text; 
    v_ord_id int;
    v_total_order_amount numeric;
    v_stts text[] := ARRAY['pending', 'completed', 'cancelled'];
    v_meths text[] := ARRAY['cash_on_delivery', 'bank_transfer'];
    -- Variable to store already picked products for the current order
    v_picked_p_ids text[]; 
BEGIN
    FOR i IN 1..50 LOOP
        v_picked_p_ids := ARRAY[]::text[]; -- Reset picked products for new order
        
        v_u_id := (SELECT id FROM users WHERE role = 'user' ORDER BY random() LIMIT 1);
        v_v_id := (SELECT vendor_id FROM products GROUP BY vendor_id HAVING count(*) >= 2 ORDER BY random() LIMIT 1);
        
        v_total_order_amount := (300 + random()*1500)::numeric(10,2);

        -- Create Payment
        v_pay_id := substr('pay_' || md5(random()::text), 1, 24);
        INSERT INTO "payments" ("id", "method", "amount", "status", "created_at")
        VALUES (
            v_pay_id, 
            v_meths[floor(random()*2+1)]::payment_method, 
            v_total_order_amount, 
            'success', 
            now() - (i * interval '3 hours')
        );

        -- Create Order
        INSERT INTO "orders" ("user_id", "vendor_id", "payment_id", "total_amount", "status", "created_at")
        VALUES (
            v_u_id, v_v_id, v_pay_id, v_total_order_amount, 
            v_stts[floor(random()*3+1)]::order_status, 
            now() - (i * interval '3 hours')
        ) RETURNING id INTO v_ord_id;

        -- Inner loop: Create 2 UNIQUE items per order
        FOR j IN 1..2 LOOP
            -- Pick a product that hasn't been picked for THIS order yet
            v_p_id := (
                SELECT id FROM products 
                WHERE vendor_id = v_v_id 
                AND id != ALL(v_picked_p_ids) -- Logic: not in already picked list
                ORDER BY random() 
                LIMIT 1
            );

            IF v_p_id IS NOT NULL THEN
                v_picked_p_ids := array_append(v_picked_p_ids, v_p_id); -- Track picked product

                INSERT INTO "order_items" ("id", "order_id", "product_id", "quantity", "unit_price")
                VALUES (
                    substr('oi_' || md5(random()::text), 1, 24), 
                    v_ord_id, 
                    v_p_id, 
                    (1 + floor(random()*2))::int, 
                    (v_total_order_amount / 2)::numeric(10,2)
                );
            END IF;
        END LOOP;
    END LOOP;
END $$;
