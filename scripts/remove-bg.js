import sharp from 'sharp';
import fs from 'fs';

const punchUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sheet1_sprite_22-UJ9ktjqSZ6sVWUTYkkwZZXjzTiEpEa.png';
const kickUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sheet1_sprite_21-aJvVqlB82Tlquk5vQinXCNag8q5ank.png';

async function removeWhiteBackground(imageUrl, outputPath) {
    // Fetch image from URL
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);
    
    const image = sharp(inputBuffer);
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
    
    const outputBuffer = await sharp(Buffer.from(pixels), {
        raw: {
            width: info.width,
            height: info.height,
            channels: 4
        }
    })
    .png()
    .toBuffer();
    
    fs.writeFileSync(outputPath, outputBuffer);
    console.log(`Processed: ${outputPath}`);
}

async function main() {
    try {
        await removeWhiteBackground(punchUrl, './punch_transparent.png');
        await removeWhiteBackground(kickUrl, './kick_transparent.png');
        console.log('Background removal complete!');
        console.log('Files saved to current directory');
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
