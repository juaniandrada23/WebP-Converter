const es = {
  meta: {
    title: 'WebP Converter — Convierte imágenes a WebP en línea',
    description: 'Herramienta gratuita para convertir imágenes a formato WebP. Soporta JPG, PNG, GIF, TIFF, BMP, SVG y AVIF.',
    ogTitle: 'WebP Converter — Convierte imágenes a WebP en línea',
    ogDescription: 'Herramienta gratuita para convertir imágenes a WebP. Arrastra, elige calidad y descarga como ZIP.',
  },
  topbar: {
    title: 'WebP Converter',
    subtitle: 'Arrastra tus imágenes, obtén archivos WebP optimizados',
  },
  dropzone: {
    text: 'Arrastra y suelta imágenes aquí',
    hint: 'o haz clic para seleccionar archivos',
    formats: 'JPG, PNG, GIF, TIFF, BMP, SVG, AVIF, WebP &mdash; hasta {{maxMB}} cada uno',
    ariaLabel: 'Subir imágenes — arrastra y suelta o presiona Enter para seleccionar archivos',
  },
  presets: {
    legend: 'Calidad',
    low: 'Baja',
    lowDesc: 'Menor tamaño',
    medium: 'Media',
    mediumDesc: 'Equilibrada',
    high: 'Alta',
    highDesc: 'Mejor calidad',
  },
  convert: {
    button: 'Convertir todo a WebP',
    uploading: 'Subiendo...',
    converting: 'Convirtiendo...',
    convertingFile: 'Convirtiendo: {{file}}',
    convertingAll: 'Convirtiendo todos los archivos...',
  },
  progress: {
    count: '{{current}} / {{total}}',
    done: '¡Listo!',
  },
  summary: {
    filesConverted: 'Archivos convertidos',
    originalSize: 'Tamaño original',
    webpSize: 'Tamaño WebP',
    totalSaved: 'Ahorro total',
  },
  results: {
    file: 'Archivo',
    original: 'Original',
    webp: 'WebP',
    saved: 'Ahorro',
    status: 'Estado',
    statusDone: 'Listo',
    statusError: 'Error',
    conversionFailed: 'Conversión fallida',
    tableCaption: 'Resultados de conversión por archivo',
  },
  download: {
    button: 'Descargar todo como ZIP',
    ariaLabel: 'Descargar todos los archivos convertidos como ZIP',
  },
  footer: {
    text: 'WebP Converter &mdash; herramienta local, nada sale de tu máquina.',
  },
  upload: {
    oversized: '{{count}} archivo(s) superan el límite de {{maxMB}} y fueron removidos.',
    tooMany: 'Máximo {{max}} archivos permitidos. Solo se agregan los primeros {{remaining}}.',
    error: 'Error de subida: {{message}}',
  },
  conversion: {
    error: 'Error de conversión: {{message}}',
  },
  errors: {
    FILE_TOO_LARGE: 'Archivo muy grande. El tamaño máximo es {{maxMB}}.',
    FILE_COUNT_EXCEEDED: 'Demasiados archivos. El máximo es {{max}}.',
    UNSUPPORTED_FORMAT: 'Formato no soportado: {{format}}.',
    BATCH_NOT_FOUND: 'Lote no encontrado.',
    BATCH_ID_REQUIRED: 'Se requiere ID de lote.',
    NO_CONVERTED_FILES: 'No se encontraron archivos convertidos.',
    INTERNAL_ERROR: 'Error interno del servidor.',
  },
  lang: {
    ariaLabel: 'Idioma',
  },
};

export default es;
