// Disposable proof only: never bind this Worker to a database containing application data.
export default {
  async fetch(_request, { DB: db }) {
    const run = (sql, ...args) => db.prepare(sql).bind(...args).run();
    const row = (sql, ...args) => db.prepare(sql).bind(...args).first();
    const q = (sql, ...args) => db.prepare(sql).bind(...args);
    try {
      for (const sql of [
        'DROP TABLE IF EXISTS probe_history', 'DROP TABLE IF EXISTS probe_allocations', 'DROP TABLE IF EXISTS probe_redemptions', 'DROP TABLE IF EXISTS probe_orders', 'DROP TABLE IF EXISTS probe_inventory', 'DROP TABLE IF EXISTS probe_coupons', 'DROP TABLE IF EXISTS probe_versions', 'DROP TABLE IF EXISTS probe_guards',
        'CREATE TABLE probe_inventory (id INTEGER PRIMARY KEY, stock INTEGER NOT NULL)',
        'CREATE TABLE probe_coupons (id INTEGER PRIMARY KEY, remaining INTEGER NOT NULL CHECK (remaining >= 0))',
        'CREATE TABLE probe_versions (id INTEGER PRIMARY KEY, version INTEGER NOT NULL)',
        'CREATE TABLE probe_guards (ok INTEGER NOT NULL CHECK (ok = 1))',
        'CREATE TABLE probe_orders (id TEXT PRIMARY KEY)',
        'CREATE TABLE probe_allocations (order_id TEXT PRIMARY KEY, qty INTEGER NOT NULL)',
        'CREATE TABLE probe_redemptions (order_id TEXT PRIMARY KEY)',
        'CREATE TABLE probe_history (order_id TEXT PRIMARY KEY)',
        "CREATE TRIGGER probe_enforce_stock BEFORE INSERT ON probe_allocations WHEN NEW.qty > (SELECT stock FROM probe_inventory WHERE id=1) - COALESCE((SELECT SUM(qty) FROM probe_allocations),0) BEGIN SELECT RAISE(ABORT, 'stock'); END",
        "CREATE TRIGGER probe_enforce_coupon BEFORE INSERT ON probe_redemptions WHEN (SELECT remaining FROM probe_coupons WHERE id=1) <= 0 BEGIN SELECT RAISE(ABORT, 'coupon'); END",
        'CREATE TRIGGER probe_count_coupon AFTER INSERT ON probe_redemptions BEGIN UPDATE probe_coupons SET remaining=remaining-1 WHERE id=1; END',
        'INSERT INTO probe_inventory VALUES (1, 1)', 'INSERT INTO probe_coupons VALUES (1, 1)', 'INSERT INTO probe_versions VALUES (1, 1)',
      ]) await run(sql);
      const buy = (id, coupon = false) => db.batch([
        q('INSERT INTO probe_orders VALUES (?)', id),
        ...(coupon ? [q('INSERT INTO probe_redemptions VALUES (?)', id)] : [q('INSERT INTO probe_allocations VALUES (?, 1)', id)]),
      ]);
      const stock = await Promise.allSettled([buy('stock-a'), buy('stock-b')]);
      const probe_coupons = await Promise.allSettled([buy('coupon-a', true), buy('coupon-b', true)]);
      await run('UPDATE probe_versions SET version=2 WHERE id=1');
      let staleRejected = false;
      try {
        await db.batch([
          q("INSERT INTO probe_orders VALUES ('stale')"),
          q('UPDATE probe_versions SET version=3 WHERE id=1 AND version=1'),
          q('INSERT INTO probe_guards VALUES (changes())'),
        ]);
      } catch { staleRejected = true; }
      let batchRejected = false;
      try {
        await run('UPDATE probe_coupons SET remaining=1 WHERE id=1');
        await db.batch([
          q("INSERT INTO probe_orders VALUES ('rollback')"),
          q("INSERT INTO probe_redemptions VALUES ('rollback')"),
          q("INSERT INTO probe_history VALUES ('rollback')"),
          q("INSERT INTO probe_allocations VALUES ('rollback', 1)"),
        ]);
      } catch { batchRejected = true; }
      const probe_orders = await row('SELECT COUNT(*) AS n FROM probe_orders');
      const probe_allocations = await row('SELECT COUNT(*) AS n FROM probe_allocations');
      const probe_redemptions = await row('SELECT COUNT(*) AS n FROM probe_redemptions');
      const unwanted = await row("SELECT COUNT(*) AS n FROM probe_orders WHERE id IN ('rollback','stale')");
      const remaining = await row('SELECT remaining FROM probe_coupons WHERE id=1');
      const probe_history = await row('SELECT COUNT(*) AS n FROM probe_history');
      const edit = () => db.batch([
        q('UPDATE probe_versions SET version=3 WHERE id=1 AND version=2'),
        q('INSERT INTO probe_guards VALUES (changes())'),
      ]);
      const edits = await Promise.allSettled([edit(), edit()]);
      const results = {
        stock: stock.filter(x => x.status === 'fulfilled').length === 1 && probe_allocations.n === 1,
        coupon: probe_coupons.filter(x => x.status === 'fulfilled').length === 1 && probe_redemptions.n === 1,
        stale: staleRejected,
        competingEdits: edits.filter(x => x.status === 'fulfilled').length === 1,
        rollback: batchRejected && unwanted.n === 0 && probe_orders.n === 2 && probe_redemptions.n === 1 && remaining.remaining === 1 && probe_history.n === 0,
      };
      return Response.json(results, { status: Object.values(results).every(Boolean) ? 200 : 500 });
    } catch (error) {
      return Response.json({ error: String(error) }, { status: 500 });
    }
  },
};
