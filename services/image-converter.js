const sharp = require('sharp');

async function convertFile(inputPath, outputPath, webpOpts) {
  const metadata = await sharp(inputPath, { animated: true }).metadata();

  let pipeline = sharp(inputPath, { animated: true });

  if (metadata.space === 'cmyk') {
    pipeline = pipeline.toColorspace('srgb');
  }

  if (metadata.pages && metadata.pages > 1) {
    pipeline = pipeline.webp({ ...webpOpts, loop: metadata.loop || 0 });
  } else {
    pipeline = pipeline.webp(webpOpts);
  }

  await pipeline.toFile(outputPath);
}

module.exports = { convertFile };
