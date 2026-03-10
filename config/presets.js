const WEBP_PRESETS = {
  low:    { quality: 50, effort: 6, smartSubsample: true, alphaQuality: 50 },
  medium: { quality: 75, effort: 6, smartSubsample: true, alphaQuality: 80 },
  high:   { quality: 85, effort: 6, smartSubsample: true, alphaQuality: 100 },
};

const ALLOWED_MIMES = new Set([
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'image/tiff', 'image/bmp', 'image/svg+xml', 'image/avif',
]);

module.exports = { WEBP_PRESETS, ALLOWED_MIMES };
