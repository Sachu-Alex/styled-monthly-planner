
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Image, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportOptionsProps {
  calendarRef: React.RefObject<HTMLDivElement>;
  monthName: string;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  calendarRef,
  monthName
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'png' | 'jpg'>('pdf');
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  const getQualityScale = () => {
    switch (quality) {
      case 'high': return 2.5; // Reduced for better performance
      case 'medium': return 2;
      case 'low': return 1.5;
      default: return 2;
    }
  };

  const exportCalendar = async () => {
    if (!calendarRef.current) return;

    setIsExporting(true);
    try {
      const scale = getQualityScale();
      
      // Wait a bit for any pending renders
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(calendarRef.current, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: calendarRef.current.scrollWidth,
        height: calendarRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      const fileName = `calendar-${monthName.toLowerCase().replace(' ', '-')}`;

      if (exportFormat === 'pdf') {
        // A3 dimensions: 297mm x 420mm
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [297, 420] // width x height in mm
        });

        // Calculate dimensions to fit A3 without stretching
        const pdfWidth = 297;
        const pdfHeight = 420;
        const canvasRatio = canvas.width / canvas.height;
        const pdfRatio = pdfWidth / pdfHeight;

        let imgWidth, imgHeight, offsetX = 0, offsetY = 0;

        if (canvasRatio > pdfRatio) {
          // Canvas is wider than PDF ratio - fit to width
          imgWidth = pdfWidth;
          imgHeight = pdfWidth / canvasRatio;
          offsetY = (pdfHeight - imgHeight) / 2;
        } else {
          // Canvas is taller than PDF ratio - fit to height
          imgHeight = pdfHeight;
          imgWidth = pdfHeight * canvasRatio;
          offsetX = (pdfWidth - imgWidth) / 2;
        }

        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.92),
          'JPEG',
          offsetX,
          offsetY,
          imgWidth,
          imgHeight
        );

        pdf.save(`${fileName}.pdf`);
      } else {
        // Export as image
        const link = document.createElement('a');
        link.download = `${fileName}.${exportFormat}`;
        link.href = canvas.toDataURL(`image/${exportFormat}`, 0.92);
        link.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center">
        <Download className="h-4 w-4 mr-2" />
        Export Options
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Format</label>
          <Select value={exportFormat} onValueChange={(value: 'pdf' | 'png' | 'jpg') => setExportFormat(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF (Print Ready)
                </div>
              </SelectItem>
              <SelectItem value="png">
                <div className="flex items-center">
                  <Image className="h-4 w-4 mr-2" />
                  PNG (High Quality)
                </div>
              </SelectItem>
              <SelectItem value="jpg">
                <div className="flex items-center">
                  <Image className="h-4 w-4 mr-2" />
                  JPG (Smaller Size)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Quality</label>
          <Select value={quality} onValueChange={(value: 'high' | 'medium' | 'low') => setQuality(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High (250 DPI)</SelectItem>
              <SelectItem value="medium">Medium (200 DPI)</SelectItem>
              <SelectItem value="low">Low (150 DPI)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={exportCalendar}
          disabled={isExporting}
          className="w-full"
          size="lg"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export {exportFormat.toUpperCase()}
            </>
          )}
        </Button>

        <div className="p-3 bg-green-50 rounded-lg">
          <h4 className="text-sm font-semibold text-green-800 mb-1">A3 Print Specifications</h4>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• Size: 297mm × 420mm (11.7" × 16.5")</li>
            <li>• Resolution: Up to 250 DPI for optimal file size</li>
            <li>• Format: Print-ready PDF or high-res image</li>
            <li>• Orientation: Portrait</li>
          </ul>
        </div>

        {exportFormat === 'pdf' && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              📄 <strong>PDF Export:</strong> Automatically fits to A3 size without stretching. 
              Maintains proper aspect ratio with centered positioning.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
