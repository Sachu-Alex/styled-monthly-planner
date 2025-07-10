
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Image, Crop, Move } from 'lucide-react';

interface CoverImageUploadProps {
  coverImage: string | null;
  onImageChange: (image: string | null) => void;
}

export const CoverImageUpload: React.FC<CoverImageUploadProps> = ({
  coverImage,
  onImageChange
}) => {
  const [objectFit, setObjectFit] = useState<'cover' | 'contain' | 'fill'>('cover');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024
  });

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center">
        <Image className="h-4 w-4 mr-2" />
        Cover Image
      </h3>

      {coverImage ? (
        <div className="space-y-4">
          {/* Image Preview with aspect ratio controls */}
          <div className="relative">
            <div 
              className="w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200"
              style={{ aspectRatio: '16/9', height: '120px' }}
            >
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-full transition-all duration-200"
                style={{ 
                  objectFit: objectFit,
                  objectPosition: 'center'
                }}
              />
            </div>
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => onImageChange(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Image Fit Controls */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center">
              <Crop className="h-3 w-3 mr-1" />
              Image Fit
            </label>
            <Select value={objectFit} onValueChange={(value: 'cover' | 'contain' | 'fill') => setObjectFit(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover (Crop to fit)</SelectItem>
                <SelectItem value="contain">Contain (Show full image)</SelectItem>
                <SelectItem value="fill">Fill (Stretch to fit)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Replace Image Button */}
          <Button
            variant="outline"
            className="w-full"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Upload className="h-4 w-4 mr-2" />
            Change Image
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            ${isDragActive 
              ? 'border-blue-400 bg-blue-50 scale-105' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 font-medium">
                {isDragActive 
                  ? 'Drop your image here...' 
                  : 'Drag & drop an image, or click to select'
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, GIF, WebP • Max 10MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Tips */}
      <div className="mt-4 space-y-2">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <strong>Best Results:</strong> Use landscape images with 16:9 aspect ratio (1920×1080px or higher). 
            The image will appear at the top of your calendar with a subtle gradient overlay.
          </p>
        </div>
        
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-800">
            🎨 <strong>Print Tip:</strong> High-resolution images (300 DPI) work best for A3 printing. 
            Avoid images with important details near edges as they may be cropped.
          </p>
        </div>
      </div>
    </Card>
  );
};
