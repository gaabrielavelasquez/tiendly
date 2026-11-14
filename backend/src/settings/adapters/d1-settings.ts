import type { D1Database } from '@cloudflare/workers-types';
import type { StoreConfiguration } from '@tiendly/contracts';
export type { StoreConfiguration } from '@tiendly/contracts';
export class D1Settings {
 private readonly db:D1Database;
 constructor(db:D1Database){this.db=db;}
 async read(storeId:string):Promise<StoreConfiguration> {
  const rows=await this.db.batch([
   this.db.prepare('SELECT * FROM payment_settings WHERE store_id=?').bind(storeId),
   this.db.prepare('SELECT * FROM delivery_settings WHERE store_id=?').bind(storeId),
   this.db.prepare('SELECT * FROM delivery_zones WHERE store_id=? ORDER BY position').bind(storeId),
  ]);
  const payment=rows[0].results[0] as {whatsapp_enabled:number;automatic_status:StoreConfiguration['payments']['automaticStatus'];card_enabled:number;yape_enabled:number}|undefined;
  const delivery=rows[1].results[0] as {delivery_enabled:number;free_shipping_enabled:number;free_shipping_threshold_cents:number;pickup_enabled:number;pickup_address:string;pickup_district:string;pickup_hours:string;pickup_note:string}|undefined;
  if(!payment||!delivery)throw new Error('Store configuration is missing');
  const zones=rows[2].results as {zone_key:'lima'|'callao'|'provincias';enabled:number;cost_cents:number|null;delivery_estimate:string}[];
  return {payments:{whatsappEnabled:payment.whatsapp_enabled===1,automaticStatus:payment.automatic_status,cardEnabled:payment.card_enabled===1,yapeEnabled:payment.yape_enabled===1},delivery:{enabled:delivery.delivery_enabled===1,freeShippingEnabled:delivery.free_shipping_enabled===1,freeShippingThresholdCents:delivery.free_shipping_threshold_cents,pickupEnabled:delivery.pickup_enabled===1,pickupAddress:delivery.pickup_address,pickupDistrict:delivery.pickup_district,pickupHours:delivery.pickup_hours,pickupNote:delivery.pickup_note,zones:zones.map(z=>({key:z.zone_key,enabled:z.enabled===1,costCents:z.cost_cents,estimate:z.delivery_estimate}))}};
 }
}
