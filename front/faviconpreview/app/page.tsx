'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

const ICON_SIZES = [
  { size: 192, filename: 'android-chrome-192x192.png', label: 'Android Chrome 192x192' },
  { size: 512, filename: 'android-chrome-512x512.png', label: 'Android Chrome 512x512' },
  { size: 180, filename: 'apple-touch-icon.png', label: 'Apple Touch Icon' },
  { size: 32, filename: 'favicon-32x32.png', label: 'Favicon 32x32' },
  { size: 16, filename: 'favicon-16x16.png', label: 'Favicon 16x16' }
];

export default function Home() {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [previewUrls, setPreviewUrls] = useState<Record<number, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setCrop({
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5,
      });
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      );
      reader.readAsDataURL(file);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5,
    });
  }

  const generateCroppedImage = useCallback(
    async (size: number) => {
      const image = imgRef.current;
      const crop = completedCrop;
      if (!image || !crop) {
        return '';
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return '';
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = size;
      canvas.height = size;

      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        size,
        size,
      );

      return canvas.toDataURL('image/png');
    },
    [completedCrop]
  );

  const updatePreviews = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;

    const newPreviewUrls: Record<number, string> = {};
    
    for (const iconSize of ICON_SIZES) {
      const url = await generateCroppedImage(iconSize.size);
      if (url) {
        newPreviewUrls[iconSize.size] = url;
      }
    }
    
    setPreviewUrls(newPreviewUrls);
  }, [completedCrop, generateCroppedImage]);

  const downloadIcon = useCallback(async (size: number, filename: string) => {
    const url = await generateCroppedImage(size);
    if (!url) return;

    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
  }, [generateCroppedImage]);

  const downloadAllAsZip = useCallback(async () => {
    // Criar um zip com todos os ícones
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    for (const iconSize of ICON_SIZES) {
      const url = await generateCroppedImage(iconSize.size);
      if (url) {
        // Converter data URL para blob
        const response = await fetch(url);
        const blob = await response.blob();
        zip.file(iconSize.filename, blob);
      }
    }

    // Gerar o zip e fazer download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = 'favicon-icons.zip';
    link.click();
    
    // Limpar o URL criado
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }, [generateCroppedImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Favicon Preview Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload uma imagem e veja como ficará como favicon em diferentes tamanhos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload e Crop Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Upload e Crop
            </h2>
            
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
              />
            </div>

            {imgSrc && (
              <div className="space-y-4">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  minWidth={50}
                  minHeight={50}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    className="max-w-full h-auto"
                  />
                </ReactCrop>
                
                <div className="flex gap-2">
                  <button
                    onClick={updatePreviews}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Gerar Previews
                  </button>
                  
                  {Object.keys(previewUrls).length > 0 && (
                    <button
                      onClick={downloadAllAsZip}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Baixar ZIP
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              Previews
            </h2>
            
            {Object.keys(previewUrls).length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Faça upload de uma imagem e clique em "Gerar Previews" para ver os resultados</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ICON_SIZES.map((iconSize) => (
                  <div
                    key={iconSize.size}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center"
                  >
                    <div className="mb-2">
                      {previewUrls[iconSize.size] ? (
                        <img
                          src={previewUrls[iconSize.size]}
                          alt={`Preview ${iconSize.size}x${iconSize.size}`}
                          className="mx-auto border border-gray-200 dark:border-gray-600 rounded"
                          style={{
                            width: iconSize.size > 64 ? 64 : iconSize.size,
                            height: iconSize.size > 64 ? 64 : iconSize.size,
                          }}
                        />
                      ) : (
                        <div 
                          className="mx-auto bg-gray-200 dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500"
                          style={{
                            width: iconSize.size > 64 ? 64 : iconSize.size,
                            height: iconSize.size > 64 ? 64 : iconSize.size,
                          }}
                        />
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {iconSize.size}x{iconSize.size}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {iconSize.label}
                    </p>
                    {previewUrls[iconSize.size] && (
                      <button
                        onClick={() => downloadIcon(iconSize.size, iconSize.filename)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium flex items-center gap-1 mx-auto"
                      >
                        <Download className="w-3 h-3" />
                        Baixar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
