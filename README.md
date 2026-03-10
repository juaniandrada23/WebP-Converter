# WebP Converter

Herramienta local para convertir imagenes a formato WebP. Arrastra tus imagenes, elige la calidad y descarga un ZIP con los archivos convertidos.

Soporta JPG, PNG, GIF (animados incluidos), TIFF, BMP, SVG, AVIF y WebP. Hasta 50 archivos de 50 MB cada uno.

## Requisitos

- [Node.js](https://nodejs.org/) v18 o superior

## Instalacion

```bash
git clone https://github.com/juaniandrada23/webp-converter.git
cd webp-converter
npm install
```

## Uso

```bash
npm start
```

Abrir `http://localhost:3000` en el navegador.

Todo corre localmente en tu maquina. El servidor local es necesario porque la libreria de conversion (sharp) es un modulo nativo de Node.js que no puede ejecutarse en el navegador.

## Configuracion

Copia `.env.example` a `.env` para personalizar variables de entorno:

```bash
cp .env.example .env
```

| Variable | Default | Descripcion |
|----------|---------|-------------|
| `PORT`   | `3000`  | Puerto del servidor |

Los demas valores operacionales (limites de subida, tiempos de limpieza, compresion ZIP) se configuran en `config/server.config.js`.

## Como funciona

1. Arrastra imagenes al dropzone (o haz click para seleccionarlas)
2. Elige un preset de calidad: Low, Medium o High
3. Click en "Convert All to WebP"
4. Descarga el ZIP con los archivos convertidos

La conversion muestra progreso en tiempo real via Server-Sent Events (SSE). Los archivos temporales se limpian automaticamente al cerrar la pestania o despues de 30 minutos.

## Estructura del proyecto

```
webp-converter/
  server.js                 Entry point del servidor
  package.json

  config/
    server.config.js        Puerto, directorios, limites, constantes operacionales
    presets.js              Presets de calidad WebP y tipos MIME aceptados

  middleware/
    batch-id.js             Asigna un ID unico a cada grupo de archivos
    security-headers.js     Headers de seguridad (nosniff, deny iframes)
    upload.js               Configuracion de multer (subida de archivos)
    error-handler.js        Manejo centralizado de errores HTTP

  services/
    image-converter.js      Conversion de imagenes con sharp (CMYK, GIFs animados)
    batch-storage.js        Ciclo de vida de batches y auto-limpieza

  routes/
    config.routes.js        GET /api/config (limites para el frontend)
    upload.routes.js        POST /api/upload
    convert.routes.js       POST /api/convert + GET /api/convert-stream (SSE)
    download.routes.js      GET /api/download/:batchId (ZIP)
    cleanup.routes.js       POST /api/cleanup/:batchId

  public/
    index.html              Pagina principal
    style.css               Estilos
    app.js                  Entry point del frontend (importa e inicializa)
    js/
      state.js              Estado global compartido
      dom.js                Referencias cacheadas al DOM
      formatting.js         Utilidades: escape HTML, formato de bytes, progreso
      previews.js           Tarjetas de preview con object URLs
      upload.js             Validacion y subida de archivos
      dropzone.js           Drag & drop, click y teclado
      presets.js            Botones de calidad (low/medium/high)
      conversion.js         Logica de conversion (SSE con fallback a POST)
      results.js            Tabla de resultados y summary cards
      download.js           Descarga ZIP y limpieza al cerrar
```

## Arquitectura

**Backend** — Node.js con Express, organizado en capas:

- **config/** define constantes puras (puerto, directorios, presets)
- **middleware/** procesa requests antes de llegar a las rutas (seguridad, subida, errores)
- **services/** contiene la logica de negocio sin saber nada de HTTP (conversion, storage)
- **routes/** conecta los endpoints HTTP con los services

**Frontend** — Vanilla JS con ES modules nativos del navegador (`type="module"`). Sin bundler, sin build step. El navegador resuelve los imports directamente.

**Comunicacion** — El frontend se comunica con el backend local via fetch y SSE. No hay nada remoto; todo sucede en tu maquina.

## Licencia

[MIT](LICENSE)
