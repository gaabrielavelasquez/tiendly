CREATE TABLE products (
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sku TEXT NOT NULL DEFAULT '',
  categories_json TEXT NOT NULL CHECK(json_valid(categories_json)),
  status TEXT NOT NULL CHECK(status IN ('active','paused')),
  price_cents INTEGER NOT NULL CHECK(price_cents >= 0),
  compare_at_cents INTEGER CHECK(compare_at_cents IS NULL OR compare_at_cents > price_cents),
  offer_from TEXT,
  offer_until TEXT,
  photo_option INTEGER,
  primary_image TEXT,
  photo_groups_json TEXT NOT NULL CHECK(json_valid(photo_groups_json)),
  measurements_mode TEXT NOT NULL CHECK(measurements_mode IN ('inherited','none','custom')),
  measurements_json TEXT CHECK(measurements_json IS NULL OR json_valid(measurements_json)),
  version INTEGER NOT NULL CHECK(version >= 1),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(store_id,id),
  UNIQUE(store_id,slug)
);
CREATE TABLE product_options (
  store_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  position INTEGER NOT NULL CHECK(position BETWEEN 0 AND 2),
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('color','size','other')),
  values_json TEXT NOT NULL CHECK(json_valid(values_json)),
  PRIMARY KEY(store_id,product_id,position),
  FOREIGN KEY(store_id,product_id) REFERENCES products(store_id,id) ON DELETE CASCADE
);
CREATE TABLE product_variants (
  store_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  variant_key TEXT NOT NULL,
  values_json TEXT NOT NULL CHECK(json_valid(values_json)),
  stock INTEGER NOT NULL CHECK(stock >= 0),
  active INTEGER NOT NULL CHECK(active IN (0,1)),
  PRIMARY KEY(store_id,product_id,variant_key),
  FOREIGN KEY(store_id,product_id) REFERENCES products(store_id,id) ON DELETE CASCADE
);
CREATE TABLE product_photos (
  store_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  photo_group TEXT NOT NULL,
  position INTEGER NOT NULL CHECK(position >= 0),
  url TEXT NOT NULL,
  PRIMARY KEY(store_id,product_id,photo_group,position),
  FOREIGN KEY(store_id,product_id) REFERENCES products(store_id,id) ON DELETE CASCADE
);
