export interface IconManifest {
  name: string;
  short_name: string;
  icons: IconEntry[];
}

export interface IconEntry {
  src: string;
  sizes: string;
  type: string;
}

export interface ProcessedIcon {
  buffer: Buffer;
  filename: string;
  size: string;
  type: string;
}

export const ICON_SIZES = [
  { size: 192, filename: 'android-chrome-192x192.png' },
  { size: 512, filename: 'android-chrome-512x512.png' },
  { size: 180, filename: 'apple-touch-icon.png' },
  { size: 32, filename: 'favicon-32x32.png' },
  { size: 16, filename: 'favicon-16x16.png' }
];
