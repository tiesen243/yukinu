-- Seed user and profile data
INSERT INTO users (id, username, email, role, status) VALUES 
  ('ckx1q2z8a000001234567890', 'alicia', 'alicia@example.com', 'user', 'active'),
  ('ckx1q2z8a000101234567891', 'robert', 'robert@example.com', 'user', 'active'),
  ('ckx1q2z8a000201234567892', 'caroline', 'caroline@example.com', 'user', 'active'),
  ('ckx1q2z8a000301234567893', 'davidg', 'davidg@example.com', 'user', 'active'),
  ('ckx1q2z8a000401234567894', 'evelyn', 'evelyn@example.com', 'user', 'active'),
  ('ckx1q2z8a000501234567895', 'francis', 'francis@example.com', 'user', 'active'),
  ('ckx1q2z8a000601234567896', 'gracie', 'gracie@example.com', 'user', 'active'),
  ('ckx1q2z8a000701234567897', 'heidik', 'heidik@example.com', 'user', 'active'),
  ('ckx1q2z8a000801234567898', 'ivandr', 'ivandr@example.com', 'user', 'active'),
  ('ckx1q2z8a000901234567899', 'judith', 'judith@example.com', 'user', 'active');

INSERT INTO profiles (id, full_name) VALUES 
  ('ckx1q2z8a000001234567890', 'Alicia Raymond'),
  ('ckx1q2z8a000101234567891', 'Robert Stevenson'),
  ('ckx1q2z8a000201234567892', 'Caroline Fisher'),
  ('ckx1q2z8a000301234567893', 'David Grant'),
  ('ckx1q2z8a000401234567894', 'Evelyn Parker'),
  ('ckx1q2z8a000501234567895', 'Francis Newton'),
  ('ckx1q2z8a000601234567896', 'Gracie Turner'),
  ('ckx1q2z8a000701234567897', 'Heidi Klein'),
  ('ckx1q2z8a000801234567898', 'Ivan Drake'),
  ('ckx1q2z8a000901234567899', 'Judith Garland');

-- Seed categories
INSERT INTO categories (id, name) VALUES
  ('ckx1q2z8a001001234567900', 'Electronics'),
  ('ckx1q2z8a001101234567901', 'Clothing'),
  ('ckx1q2z8a001201234567902', 'Home & Kitchen'),
  ('ckx1q2z8a001301234567903', 'Books'),
  ('ckx1q2z8a001401234567904', 'Toys & Games'),
  ('ckx1q2z8a001501234567905', 'Beauty & Personal Care'),
  ('ckx1q2z8a001601234567906', 'Sports & Outdoors'),
  ('ckx1q2z8a001701234567907', 'Automotive'),
  ('ckx1q2z8a001801234567908', 'Health'),
  ('ckx1q2z8a001901234567909', 'Grocery');
