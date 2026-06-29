/**
 * Public data-access barrel.
 *
 * Import storefront data from here:
 *   import { getProducts, getCollections } from '@lib/api'
 *
 * Under the hood this delegates to `catalog.ts`, which wraps the PrestaShop
 * webservice with a static mock fallback.
 */
export * from './catalog';
export { isPrestashopConfigured } from './prestashop';
export * from './types';
