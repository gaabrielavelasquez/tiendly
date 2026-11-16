import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DISTRICT_ZONES, zoneOfDistrict, type ShippingZone } from '@tiendly/contracts';
import { zoneOfDistrict as zoneOfDistrictDesdeOrder } from '../src/orders/domain/order.ts';

const distritosDe = (zona: ShippingZone) => Object.entries(DISTRICT_ZONES).filter(([, z]) => z === zona).map(([d]) => d);

// La geografía de envío (decisión 0009) vive solo en @tiendly/contracts: este test clava los distritos
// y el re-export de order.ts, para que ninguna copia local vuelva a divergir del contrato.
test('shipping geography is pinned to contracts and order.ts only re-exports it', () => {
  assert.equal(distritosDe('lima').length, 15);
  assert.equal(distritosDe('callao').length, 4);
  assert.equal(distritosDe('provincias').length, 6);
  assert.deepEqual(distritosDe('lima'), ["Barranco", "Breña", "Chorrillos", "Jesús María", "La Molina", "La Victoria", "Lince", "Magdalena del Mar", "Miraflores", "Pueblo Libre", "San Borja", "San Isidro", "San Miguel", "Santiago de Surco", "Surquillo"]);
  assert.deepEqual(distritosDe('callao'), ["Callao", "Bellavista", "La Perla", "Ventanilla"]);
  assert.deepEqual(distritosDe('provincias'), ["Cayma", "Yanahuara", "Cayaltí", "Trujillo", "Cusco", "Piura"]);
  assert.equal(zoneOfDistrict('Miraflores'), 'lima');
  assert.equal(zoneOfDistrict('Iquitos'), null);
  // El re-export es la misma función, no otra copia.
  assert.equal(zoneOfDistrictDesdeOrder, zoneOfDistrict);
  assert.equal(zoneOfDistrictDesdeOrder('Ventanilla'), 'callao');
  assert.equal(zoneOfDistrictDesdeOrder('Trujillo'), 'provincias');
  assert.equal(zoneOfDistrictDesdeOrder('Iquitos'), null);
});
