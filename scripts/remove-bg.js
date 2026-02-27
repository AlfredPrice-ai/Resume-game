import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

async function removeWhiteBackground(inputPath, outputPath) {
    const image = sharp(inputPath);
    const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    
    const pixels = new Uint8Array(data);
    
    // Process each pixel - make white/near-white pixels transparent
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        // Check if pixel is white or near-white (threshold 240)
        if (r > 240 && g > 240 && b > 240) {
            pixels[i + 3] = 0; // Set alpha to 0 (transparent)
        }
    }
    
    await sharp(Buffer.from(pixels), {
        raw: {
            width: info.width,
            height: info.height,
            channels: 4
        }
    })
    .png()
    .toFile(outputPath);
    
    console.log(`Processed: ${outputPath}`);
}

async function main() {
    try {
        await removeWhiteBackground(
            path.join(rootDir, 'punch.png'),
            path.join(rootDir, 'punch.png')
        );
        await removeWhiteBackground(
            path.join(rootDir, 'kick.png'),
            path.join(rootDir, 'kick.png')
        );
        console.log('Background removal complete!');
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
