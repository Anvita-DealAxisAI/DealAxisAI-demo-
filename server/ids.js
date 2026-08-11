/** Prefixed dev IDs — see db/seed.sql header. */
export const USER_AJAY = 'U00001';
export const ACCOUNT_SYNOVUS = 'A00001';
export const ACCOUNT_JACK_HENRY = 'A0011';
export const SUB_AJAY_SYNOVUS = 'S00001';

/** Opportunity id for rank N → O00001, O00002, … */
export function opportunityId(rank) {
  return `O${String(rank).padStart(5, '0')}`;
}
