import sharp from 'sharp';
import type { ProcessedIcon, IconManifest } from '../models/Icon.js';
import { ICON_SIZES } from '../models/Icon.js';

export class IconProcessingService {
  static async processImage(buffer: Buffer, originalname: string): Promise<ProcessedIcon[]> {
    const processedIcons: ProcessedIcon[] = [];

    for (const iconConfig of ICON_SIZES) {
      try {
        const processedBuffer = await sharp(buffer)
          .resize(iconConfig.size, iconConfig.size, {
            fit: 'cover',
            position: 'center'
          })
          .png()
          .toBuffer();

        processedIcons.push({
          buffer: processedBuffer,
          filename: iconConfig.filename,
          size: `${iconConfig.size}x${iconConfig.size}`,
          type: 'image/png'
        });
      } catch (error) {
        console.error(`Error processing icon ${iconConfig.filename}:`, error);
        throw new Error(`Failed to process icon ${iconConfig.filename}`);
      }
    }

    return processedIcons;
  }

  static generateManifest(name: string, shortName?: string): IconManifest {
    return {
      name: name || 'App Name',
      short_name: shortName || name || 'App',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    };
  }

  static validateImageFile(file: Express.Multer.File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    return true;
  }
}
