import type { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { IconProcessingService } from '../services/IconProcessingService.js';

export class IconController {
  static async uploadIcon(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // Validate the uploaded file
      IconProcessingService.validateImageFile(req.file);

      // Extract app name and short name from request body
      const appName = req.body.name || 'My App';
      const shortName = req.body.short_name || req.body.name || 'App';

      // Process the image and generate different sizes
      const processedIcons = await IconProcessingService.processImage(
        req.file.buffer,
        req.file.originalname
      );

      // Create upload directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      // Save processed icons to disk
      const savedIcons = [];
      for (const icon of processedIcons) {
        const filePath = path.join(uploadDir, icon.filename);
        await fs.writeFile(filePath, icon.buffer);
        savedIcons.push({
          src: `/${icon.filename}`,
          sizes: icon.size,
          type: icon.type
        });
      }

      // Generate manifest response
      const manifest = {
        name: appName,
        short_name: shortName,
        icons: savedIcons.filter(icon => 
          icon.src.includes('android-chrome-192x192') || 
          icon.src.includes('android-chrome-512x512')
        )
      };

      res.status(200).json(manifest);

    } catch (error) {
      console.error('Error processing icon upload:', error);
      
      if (error instanceof Error) {
        res.status(400).json({ 
          error: error.message 
        });
      } else {
        res.status(500).json({ 
          error: 'Internal server error while processing image' 
        });
      }
    }
  }

  static async getUploadedIcon(req: Request, res: Response): Promise<void> {
    try {
      const filename = req.params.filename;
      
      if (!filename) {
        res.status(400).json({ error: 'Filename is required' });
        return;
      }

      const filePath = path.join(process.cwd(), 'uploads', filename);

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      // Set appropriate headers
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache

      // Read and send file
      const fileBuffer = await fs.readFile(filePath);
      res.send(fileBuffer);

    } catch (error) {
      console.error('Error serving icon file:', error);
      res.status(500).json({ error: 'Error serving file' });
    }
  }
}
