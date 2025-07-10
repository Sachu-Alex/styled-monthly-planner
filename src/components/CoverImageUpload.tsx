
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Image } from 'lucide-react';

interface CoverImageUploadProps {
  coverImage: string | null;
  onImageChange: (image: string | null) => void;
}

export const CoverImageUpload: React.FC<CoverImageUploadProps> = ({
  coverImage,
  onImageChange
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
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
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center">
        <Image className="h-4 w-4 mr-2" />
        Cover Image
      </h3>

      {coverImage ? (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={coverImage}
              alt="Cover preview"
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={() => onImageChange(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
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
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            {isDragActive 
              ? 'Drop your image here...' 
              : 'Drag & drop an image, or click to select'
            }
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG, GIF, WebP up to 10MB
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Use landscape images (16:9 ratio) for best results. 
          The image will appear at the top of your calendar.
        </p>
      </div>
    </Card>
  );
};
