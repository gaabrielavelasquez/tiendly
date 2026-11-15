import { effectivePlan, type Store } from '@tiendly/backend/rules';
import type { StoreConfiguration, StoreView } from '@tiendly/contracts';
import type { ConfigCompra } from '@/features/configuracion/types';
import type { TiendaSesion } from './datos/tienda';
import type { RubroId } from '@/features/onboarding/lib/rubros';

export const CATEGORY_IDS:Record<RubroId,string>={accesorios:'accessories',belleza:'beauty',calzado:'footwear',reposteria:'food',hogar:'home','hecho-a-mano':'handmade',moda:'clothing','segunda-mano':'secondhand',tecnologia:'technology',otro:'other'};
export const frontendCategories=(values:string[])=>Object.entries(CATEGORY_IDS).filter(([,id])=>values.includes(id)).map(([id])=>id as RubroId);
export function frontendStore(store:Store | StoreView,limaDate:string):TiendaSesion {
 const themes={neutral:'neutral',editorial:'editorial',soft:'suave'} as const;
 const accents={theme:'tema',black:'negro',terracotta:'terracota',pink:'rosa',olive:'oliva'} as const;
 return {slug:store.slug,nombre:store.name,celularVentas:store.salesPhone,plan:'effectivePlan' in store ? store.effectivePlan : effectivePlan(store.plan,store.founderUntil,limaDate)==='free'?'free':'pro',creadaEl:store.createdAt,hechos:{pagos:store.onboarding.payments,entregas:store.onboarding.delivery,compartir:store.onboarding.share},nombreOfertas:store.offerSectionName||undefined,logo:store.appearance.logo,apariencia:{tema:themes[store.appearance.theme],acento:accents[store.appearance.accent],logo:store.appearance.logo,portada:store.appearance.cover,bienvenida:store.appearance.welcome,instagram:store.appearance.instagram,horario:store.appearance.hours}};
}
export function frontendConfiguration(config:StoreConfiguration,salesPhone:string):ConfigCompra {
 return {pagos:{whatsapp:{activo:config.payments.whatsappEnabled,celular:salesPhone},cobros:{estado:{inactive:'sin-activar',review:'en-revision',active:'activo'}[config.payments.automaticStatus] as ConfigCompra['pagos']['cobros']['estado'],tarjeta:config.payments.cardEnabled,yape:config.payments.yapeEnabled}},entregas:{delivery:{activo:config.delivery.enabled,zonas:config.delivery.zones.map(z=>({id:z.key,activa:z.enabled,costo:z.costCents===null?'':String(z.costCents/100),plazo:z.estimate})),envioGratis:{activo:config.delivery.freeShippingEnabled,desde:config.delivery.freeShippingThresholdCents===0&&!config.delivery.freeShippingEnabled?'':String(config.delivery.freeShippingThresholdCents/100)}},recojo:{activo:config.delivery.pickupEnabled,direccion:config.delivery.pickupAddress,distrito:config.delivery.pickupDistrict,horario:config.delivery.pickupHours,nota:config.delivery.pickupNote}}};
}
