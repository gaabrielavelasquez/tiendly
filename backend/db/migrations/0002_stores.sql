CREATE TABLE stores (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE CHECK(length(slug) BETWEEN 1 AND 40),
  name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 120),
  sales_phone TEXT NOT NULL,
  categories_json TEXT NOT NULL CHECK(json_valid(categories_json)),
  other_category TEXT NOT NULL DEFAULT '',
  offer_section_name TEXT NOT NULL DEFAULT '' CHECK(length(offer_section_name) <= 20),
  appearance_json TEXT NOT NULL CHECK(json_valid(appearance_json)),
  onboarding_json TEXT NOT NULL CHECK(json_valid(onboarding_json)),
  plan TEXT NOT NULL DEFAULT 'free' CHECK(plan IN ('free','founder','pro')),
  founder_until TEXT,
  founder_since TEXT,
  measurement_consent_at TEXT,
  is_demo INTEGER NOT NULL DEFAULT 0 CHECK(is_demo IN (0,1)),
  version INTEGER NOT NULL DEFAULT 1 CHECK(version >= 1),
  last_order_number INTEGER NOT NULL DEFAULT 1000 CHECK(last_order_number >= 1000),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE memberships (
  store_id TEXT PRIMARY KEY NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL UNIQUE REFERENCES user(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role = 'owner'),
  created_at TEXT NOT NULL
);
CREATE TABLE payment_settings (
  store_id TEXT PRIMARY KEY NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  whatsapp_enabled INTEGER NOT NULL DEFAULT 1 CHECK(whatsapp_enabled IN (0,1)),
  automatic_status TEXT NOT NULL DEFAULT 'inactive' CHECK(automatic_status IN ('inactive','review','active')),
  card_enabled INTEGER NOT NULL DEFAULT 0 CHECK(card_enabled IN (0,1)),
  yape_enabled INTEGER NOT NULL DEFAULT 0 CHECK(yape_enabled IN (0,1)),
  account_json TEXT CHECK(account_json IS NULL OR json_valid(account_json)),
  version INTEGER NOT NULL DEFAULT 1 CHECK(version >= 1)
);
CREATE TABLE delivery_settings (
  store_id TEXT PRIMARY KEY NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  delivery_enabled INTEGER NOT NULL DEFAULT 0 CHECK(delivery_enabled IN (0,1)),
  free_shipping_enabled INTEGER NOT NULL DEFAULT 0 CHECK(free_shipping_enabled IN (0,1)),
  free_shipping_threshold_cents INTEGER NOT NULL DEFAULT 0 CHECK(free_shipping_threshold_cents >= 0),
  pickup_enabled INTEGER NOT NULL DEFAULT 0 CHECK(pickup_enabled IN (0,1)),
  pickup_address TEXT NOT NULL DEFAULT '',
  pickup_district TEXT NOT NULL DEFAULT '',
  pickup_hours TEXT NOT NULL DEFAULT '',
  pickup_note TEXT NOT NULL DEFAULT '',
  version INTEGER NOT NULL DEFAULT 1 CHECK(version >= 1)
);
CREATE TABLE delivery_zones (
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  zone_key TEXT NOT NULL CHECK(zone_key IN ('lima','callao','provincias')),
  enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)),
  cost_cents INTEGER CHECK(cost_cents IS NULL OR cost_cents >= 0),
  delivery_estimate TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL CHECK(position BETWEEN 0 AND 2),
  PRIMARY KEY(store_id, zone_key),
  UNIQUE(store_id, position)
);
-- UPDATE ... WHERE version=? returning zero rows does not abort a D1 batch.
-- Commands update one aggregate then insert changes() into this constraint.
-- The check forces a statement failure and therefore rolls back the batch.
CREATE TABLE write_guards (ok INTEGER NOT NULL CHECK(ok = 1));
