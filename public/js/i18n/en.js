const en = {
  meta: {
    title: 'WebP Converter — Convert Images to WebP Online',
    description: 'Free online tool to convert images to WebP format. Supports JPG, PNG, GIF, TIFF, BMP, SVG, and AVIF.',
    ogTitle: 'WebP Converter — Convert Images to WebP Online',
    ogDescription: 'Free online tool to convert images to WebP format. Drag & drop, choose quality presets, and download as ZIP.',
  },
  topbar: {
    title: 'WebP Converter',
    subtitle: 'Drop your images, get optimized WebP files',
  },
  dropzone: {
    text: 'Drag & drop images here',
    hint: 'or click to select files',
    formats: 'JPG, PNG, GIF, TIFF, BMP, SVG, AVIF, WebP &mdash; up to {{maxMB}} each',
    ariaLabel: 'Upload images — drag and drop or press Enter to select files',
  },
  presets: {
    legend: 'Quality Preset',
    low: 'Low',
    lowDesc: 'Smallest size',
    medium: 'Medium',
    mediumDesc: 'Balanced',
    high: 'High',
    highDesc: 'Best quality',
  },
  convert: {
    button: 'Convert All to WebP',
    uploading: 'Uploading...',
    converting: 'Converting...',
    convertingFile: 'Converting: {{file}}',
    convertingAll: 'Converting all files...',
  },
  progress: {
    count: '{{current}} / {{total}}',
    done: 'Done!',
  },
  summary: {
    filesConverted: 'Files Converted',
    originalSize: 'Original Size',
    webpSize: 'WebP Size',
    totalSaved: 'Total Saved',
  },
  results: {
    file: 'File',
    original: 'Original',
    webp: 'WebP',
    saved: 'Saved',
    status: 'Status',
    statusDone: 'Done',
    statusError: 'Error',
    conversionFailed: 'Conversion failed',
    tableCaption: 'Conversion results per file',
  },
  download: {
    button: 'Download All as ZIP',
    ariaLabel: 'Download all converted files as ZIP',
  },
  footer: {
    text: 'WebP Converter &mdash; local tool, nothing leaves your machine.',
  },
  upload: {
    oversized: '{{count}} file(s) exceed the {{maxMB}} limit and were removed.',
    tooMany: 'Maximum {{max}} files allowed. Only adding the first {{remaining}}.',
    error: 'Upload error: {{message}}',
  },
  conversion: {
    error: 'Conversion error: {{message}}',
  },
  errors: {
    FILE_TOO_LARGE: 'File too large. Maximum size is {{maxMB}}.',
    FILE_COUNT_EXCEEDED: 'Too many files. Maximum is {{max}}.',
    UNSUPPORTED_FORMAT: 'Unsupported format: {{format}}.',
    BATCH_NOT_FOUND: 'Batch not found.',
    BATCH_ID_REQUIRED: 'Batch ID is required.',
    NO_CONVERTED_FILES: 'No converted files found.',
    INTERNAL_ERROR: 'Internal server error.',
  },
  lang: {
    ariaLabel: 'Language',
  },
};

export default en;
