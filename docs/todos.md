# Todos

## 1. User Management

- [x] User registration (username, email, password)
- [x] User login/logout
- [ ] Email verification (`emailVerified`)
- [ ] Profile management (`profiles`)
- [ ] Roles & permissions (`user_role`: admin, user)
- [ ] Account status management (`user_status`: active, inactive, banned)
- [x] Login with third-party providers (Google, Facebook, etc.)

## 2. Address Management

- [ ] Add new shipping address
- [ ] Edit existing address
- [ ] Delete address
- [ ] Set default address (`isDefault`)
- [ ] List all addresses per user

## 3. Product Catalog

- [ ] Product management (`products`)
- [ ] Product variants (`product_variants`)
- [ ] Product images (`product_images`)
- [ ] Category management (`categories`)
- [ ] Product reviews (`reviews`)
- [ ] List products by category, vendor, status

## 4. Vendor / Marketplace

- [ ] Vendor management (`vendors`)
- [ ] Vendor user management (`vendor_users`)
- [ ] Vendor collections (`vendor_collections`)
- [ ] Vendor collection items (`vendor_collection_items`)
- [ ] Link products to vendor and collections

## 5. Wishlist / Favorites

- [ ] Add product to wishlist (`wishlist_items`)
- [ ] Remove product from wishlist
- [ ] List wishlist items per user

## 6. Order Management

- [ ] Create order (`orders`)
  - [ ] Multiple items per order (`order_items`)
  - [ ] Link to user and shipping address
- [ ] Track order status (`order_status`: new, pending, paid, shipped, completed, cancelled, refunded)
- [ ] Calculate total amount

## 7. Payment

- [ ] Payment for orders (`payments`)
- [ ] Support multiple payment methods (`payment_method`: COD, Credit Card, PayPal, Bank Transfer)
- [ ] Track payment status (`payment_status`: pending, success, failed, refunded)
- [ ] Store transaction ID and amount
- [ ] Timestamp of payment

## 8. Shipping / Delivery Tracking

- [ ] Shipping information (`shippings`)
- [ ] Carrier, tracking number
- [ ] Track shippedAt and deliveredAt
- [ ] Shipping status (`shipping_status`: pending, shipped, in_transit, delivered, failed)

## 9. Multi-Vendor Features

- [ ] Vendor onboarding & verification (registration, approval, KYC)
- [ ] Vendor dashboard (sales analytics, reports, notifications)
- [ ] Dispute & support system (order disputes, support tickets)
- [ ] Product moderation (admin approval, content flagging)
- [ ] Tax management (per vendor/location, automated calculation)
- [ ] Bulk operations (bulk product upload, price/stock updates)
- [ ] Vendor performance & ratings (metrics, reviews)
- [ ] Marketing tools (discounts/coupons, featured vendors/products, banners)
