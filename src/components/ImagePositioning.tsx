
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Move, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImagePositioningProps {
  coverImage: string | null;
  onImageTransform: (transform: { scale: number; x: number; y: number; rotation: number }) => void;
}

export const ImagePositioning: React.FC<ImagePositioningProps> = ({
  coverImage,
  onImageTransform
}) => {
  const [transform, setTransform] = React.useState({
    scale: 1,
    x: 0,
    y: 0,
    rotation: 0
  });

  const handleTransformChange = (changes: Partial<typeof transform>) => {
    const newTransform = { ...transform, ...changes };
    setTransform(newTransform);
    onImageTransform(newTransform);
  };

  if (!coverImage) return null;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center">
        <Move className="h-4 w-4 mr-2" />
        Image Positioning
      </h3>

      <div className="space-y-4">
        {/* Scale Controls */}
        <div>
          <label className="text-sm font-medium mb-2 block">Zoom</label>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleTransformChange({ scale: Math.max(0.5, transform.scale - 0.1) })}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-sm font-mono px-2">
              {Math.round(transform.scale * 100)}%
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleTransformChange({ scale: Math.min(2, transform.scale + 0.1) })}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Position Controls */}
        <div>
          <label className="text-sm font-medium mb-2 block">Position</label>
          <div className="grid grid-cols-3 gap-1">
            <Button size="sm" variant="outline" onClick={() => handleTransformChange({ x: -10, y: -10 })}>↖</Button>
            <Button size="sm" variant="outline" onClick={() => handleTransformChange({ y: transform.y - 10 })}>↑</Button>
            <Button size="sm" variant="outline" onClick={() => handleTransformChange({ x: 10, y: -10 })}>↗</Button>
            <Button size="sm" variant="outline" onClick={() => handleTransformChange({ x: transform.x - 10 })}>←</Button>
            <Button size="sm" variant="outline" onClick={() => handleTransformChange({ x: 0, y: 0 })}>⌂</Button>
            <Button size="sm" variant="outline" onClick={() => handleTransformChange({ x: transform.x + 10 })}>→</Button>
            <Button size="sm" variant="outline" onClick={() => handleTransformChange({ x: -10, y: 10 })}>↙</Button>
            <Button size="sm" variant="outline" onClick={() => handleTransformChange({ y: transform.y + 10 })}>↓</Button>
            <Button size="sm" variant="outline" onClick={() => handleTransformChange({ x: 10, y: 10 })}>↘</Button>
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleTransformChange({ scale: 1, x: 0, y: 0, rotation: 0 })}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Position
        </Button>
      </div>
    </Card>
  );
};
