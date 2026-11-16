-- Índices de listado: el panel y la vitrina consultan por tienda y ordenan por fecha de creación.
-- Sin ellos cada listado recorre la tabla completa del comercio (scan + sort en SQLite).

-- Lista de pedidos del panel: WHERE store_id=? ORDER BY created_at DESC, numero DESC (D1Orders.list).
CREATE INDEX orders_store ON orders(store_id, created_at);

-- Lista de productos de vitrina y panel: WHERE store_id=? ORDER BY created_at DESC, id (D1Catalog.list).
CREATE INDEX products_store ON products(store_id, created_at);
