-- Pedidos de la vitrina (plan-backend §4.3). Precios y montos en céntimos enteros.
-- El stock base vive en product_variants; stock_allocations es el inventario de hoy, fila por fila:
-- disponible = stock − vendidos − reservas vigentes. Una reserva vencida se libera sola al calcular.

-- Intento de checkout: reserva el número TL-#### al llegar al paso Pago. Idempotente por token,
-- así reintentar no quema otro número. El número puede quedar sin pedido: hoy se pierde, como antes.
CREATE TABLE checkout_attempts (
  token TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL CHECK(numero >= 1001),
  created_at TEXT NOT NULL,
  used_at TEXT,
  UNIQUE(store_id, numero)
);
CREATE INDEX attempts_store ON checkout_attempts(store_id, created_at);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL CHECK(numero >= 1001),
  receipt_token TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  customer_name TEXT NOT NULL CHECK(length(customer_name) BETWEEN 3 AND 120),
  customer_phone TEXT NOT NULL CHECK(length(customer_phone) BETWEEN 9 AND 15),
  units INTEGER NOT NULL CHECK(units > 0 AND units <= 999),
  subtotal_cents INTEGER NOT NULL CHECK(subtotal_cents > 0),
  discount_cents INTEGER NOT NULL DEFAULT 0 CHECK(discount_cents >= 0),
  shipping_cents INTEGER CHECK(shipping_cents IS NULL OR shipping_cents >= 0),
  shipping_pending INTEGER NOT NULL DEFAULT 0 CHECK(shipping_pending IN (0,1)),
  total_cents INTEGER NOT NULL CHECK(total_cents > 0),
  coupon_code TEXT,
  payment_status TEXT NOT NULL CHECK(payment_status IN ('pending','paid','canceled')),
  payment_method TEXT NOT NULL CHECK(payment_method IN ('card','yape','whatsapp')),
  reserve_until TEXT,
  delivery_method TEXT NOT NULL CHECK(delivery_method IN ('delivery','pickup','coordinate')),
  delivery_status TEXT NOT NULL CHECK(delivery_status IN ('to-ship','shipped','delivered')),
  district TEXT,
  address TEXT,
  reference TEXT,
  pickup_json TEXT CHECK(pickup_json IS NULL OR json_valid(pickup_json)),
  paid_at TEXT,
  shipped_at TEXT,
  delivered_at TEXT,
  canceled_at TEXT,
  cancellation TEXT CHECK(cancellation IS NULL OR cancellation IN ('store','expired-reservation')),
  note TEXT,
  version INTEGER NOT NULL DEFAULT 1 CHECK(version >= 1),
  UNIQUE(store_id, numero),
  CHECK((delivery_method = 'delivery') = (district IS NOT NULL AND address IS NOT NULL)),
  CHECK(payment_status != 'pending' OR reserve_until IS NOT NULL),
  CHECK(payment_status != 'paid' OR paid_at IS NOT NULL),
  CHECK(payment_status != 'canceled' OR canceled_at IS NOT NULL),
  CHECK(cancellation IS NULL OR payment_status = 'canceled'),
  CHECK(delivery_status != 'shipped' OR shipped_at IS NOT NULL),
  CHECK(delivery_status != 'delivered' OR delivered_at IS NOT NULL),
  CHECK(shipping_pending = 0 OR (shipping_cents IS NULL AND delivery_method = 'coordinate')),
  CHECK(delivery_method != 'pickup' OR shipping_cents = 0)
);

-- Copia de cómo era cada producto al comprar: si se borra o renombra, el pedido no cambia.
CREATE TABLE order_items (
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT,
  variant_key TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  variant_text TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL CHECK(quantity > 0 AND quantity <= 999),
  unit_price_cents INTEGER NOT NULL CHECK(unit_price_cents > 0),
  photo_url TEXT,
  position INTEGER NOT NULL CHECK(position >= 0),
  PRIMARY KEY(order_id, position)
);

-- Lo que cada pedido consume del stock (decisiones 0010 y 0028). Al borrar el producto se libera.
-- Guard de sobrevenda: la inserción solo ocurre si el disponible alcanza (write_guards + changes()).
CREATE TABLE stock_allocations (
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  store_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  variant_key TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  kind TEXT NOT NULL CHECK(kind IN ('sold','reserved')),
  expires_at TEXT,
  created_at TEXT NOT NULL,
  PRIMARY KEY(order_id, product_id, variant_key),
  FOREIGN KEY(store_id, product_id, variant_key)
    REFERENCES product_variants(store_id, product_id, variant_key) ON DELETE CASCADE,
  CHECK(kind != 'reserved' OR expires_at IS NOT NULL)
);
CREATE INDEX allocations_stock ON stock_allocations(store_id, product_id, variant_key);

-- Pagos simulados. Desmarcar no borra: el pago pasa a voided y queda la marca (pagosDesmarcados).
CREATE TABLE order_payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK(method IN ('card','yape','whatsapp')),
  amount_cents INTEGER NOT NULL CHECK(amount_cents > 0),
  status TEXT NOT NULL CHECK(status IN ('confirmed','voided')),
  created_at TEXT NOT NULL,
  created_by TEXT NOT NULL,
  voided_at TEXT,
  note TEXT
);
CREATE INDEX payments_order ON order_payments(order_id, created_at);

-- Historial y auditoría de cada comando del panel; también habilita "Deshacer" sin confianza en el navegador.
CREATE TABLE order_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  happened_at TEXT NOT NULL,
  actor TEXT NOT NULL,
  detail_json TEXT CHECK(detail_json IS NULL OR json_valid(detail_json))
);
CREATE INDEX events_order ON order_events(order_id, id);
