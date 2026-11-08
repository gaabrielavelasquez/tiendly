import type { D1Database } from "@cloudflare/workers-types";
import { BusinessError } from "../../identity/domain/access.ts";
import type { StoreRepository } from "../application/stores.ts";
import type { Store } from "../domain/store.ts";

type StoreRow = {
  id: string; slug: string; name: string; sales_phone: string; categories_json: string;
  other_category: string; offer_section_name: string; appearance_json: string; onboarding_json: string;
  plan: Store["plan"]; founder_until: string | null; founder_since: string | null;
  measurement_consent_at: string | null; is_demo: number; version: number; created_at: string; updated_at: string;
};
const fromRow = (r: StoreRow): Store => ({ id: r.id, slug: r.slug, name: r.name, salesPhone: r.sales_phone, categories: JSON.parse(r.categories_json), otherCategory: r.other_category, offerSectionName: r.offer_section_name, appearance: JSON.parse(r.appearance_json), onboarding: JSON.parse(r.onboarding_json), plan: r.plan, founderUntil: r.founder_until, founderSince: r.founder_since, measurementConsentAt: r.measurement_consent_at, isDemo: r.is_demo === 1, version: r.version, createdAt: r.created_at, updatedAt: r.updated_at });

export class D1Stores implements StoreRepository {
  private readonly db: D1Database;
  constructor(db: D1Database) { this.db = db; }
  async findOwned(userId: string): Promise<Store | null> {
    const row = await this.db.prepare('SELECT s.* FROM stores s JOIN memberships m ON m.store_id=s.id WHERE m.user_id=? AND m.role=\'owner\'').bind(userId).first<StoreRow>();
    return row ? fromRow(row) : null;
  }
  async findBySlug(slug: string): Promise<Store | null> {
    const row = await this.db.prepare('SELECT * FROM stores WHERE slug=?').bind(slug).first<StoreRow>();
    return row ? fromRow(row) : null;
  }
  async ownerId(storeId: string): Promise<string | null> {
    return (await this.db.prepare('SELECT user_id FROM memberships WHERE store_id=? AND role=\'owner\'').bind(storeId).first<{ user_id: string }>())?.user_id ?? null;
  }
  async create(s: Store, ownerId: string): Promise<void> {
    try {
      await this.db.batch([
        this.db.prepare('INSERT INTO stores(id,slug,name,sales_phone,categories_json,other_category,offer_section_name,appearance_json,onboarding_json,plan,founder_until,founder_since,measurement_consent_at,is_demo,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(s.id,s.slug,s.name,s.salesPhone,JSON.stringify(s.categories),s.otherCategory,s.offerSectionName,JSON.stringify(s.appearance),JSON.stringify(s.onboarding),s.plan,s.founderUntil,s.founderSince,s.measurementConsentAt,Number(s.isDemo),s.version,s.createdAt,s.updatedAt),
        this.db.prepare("INSERT INTO memberships(store_id,user_id,role,created_at) VALUES(?,?,'owner',?)").bind(s.id,ownerId,s.createdAt),
        this.db.prepare('INSERT INTO payment_settings(store_id) VALUES(?)').bind(s.id),
        this.db.prepare('INSERT INTO delivery_settings(store_id) VALUES(?)').bind(s.id),
        ...["lima", "callao", "provincias"].map((key, position) => this.db.prepare('INSERT INTO delivery_zones(store_id,zone_key,position) VALUES(?,?,?)').bind(s.id,key,position)),
      ]);
    } catch (error) {
      if (String(error).includes('UNIQUE constraint failed')) throw new BusinessError('conflict');
      throw error;
    }
  }
  async rename(id: string, ownerId: string, expectedVersion: number, name: string, now: string): Promise<Store> {
    try {
      const result = await this.db.batch([
        this.db.prepare("UPDATE stores SET name=?,version=version+1,updated_at=? WHERE id=? AND version=? AND EXISTS(SELECT 1 FROM memberships WHERE store_id=stores.id AND user_id=? AND role='owner') RETURNING *").bind(name,now,id,expectedVersion,ownerId),
        this.db.prepare('INSERT INTO write_guards(ok) VALUES(changes())'),
        this.db.prepare('DELETE FROM write_guards'),
      ]);
      return fromRow(result[0].results[0] as StoreRow);
    } catch (error) {
      if (String(error).includes('CHECK constraint failed')) throw new BusinessError('conflict');
      throw error;
    }
  }
}
