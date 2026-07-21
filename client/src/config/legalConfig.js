export const LEGAL_CONFIG = {
  productName: "CV Kilat",

  // WAJIB DIGANTI SEBELUM WEBSITE DIPUBLIKASIKAN
  operatorName: "[ISI NAMA BADAN USAHA ATAU NAMA PENGELOLA]",
  operatorAddress: "[ISI ALAMAT KORESPONDENSI PENGELOLA]",
  supportEmail: "[ISI EMAIL SUPPORT]",
  privacyEmail: "[ISI EMAIL PRIVASI]",
  country: "Indonesia",

  minimumAge: 18,
  effectiveDate: "20 Juli 2026",
  lastUpdated: "20 Juli 2026",

  termsVersion: "1.0",
  privacyVersion: "1.0",
  cookieVersion: "1.0",
};

export function hasIncompleteLegalConfig() {
  return Object.values({
    operatorName: LEGAL_CONFIG.operatorName,
    operatorAddress: LEGAL_CONFIG.operatorAddress,
    supportEmail: LEGAL_CONFIG.supportEmail,
    privacyEmail: LEGAL_CONFIG.privacyEmail,
  }).some((value) => String(value).includes("[ISI"));
}
