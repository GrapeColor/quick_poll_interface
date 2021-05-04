export const APP_LISTEN_PORT
  = Number(process.env['APP_LISTEN_PORT'])
    || Number(process.env['PORT'])
    || 443;

export const FAMILY_PASS_PHRASE = process.env['FAMILY_PASS_PHRASE'] || '';

export const STATUS_UPDATE_SPAN = 300000;  // Millisecond
