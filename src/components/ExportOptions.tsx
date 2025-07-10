
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Image, Loader2, Eye } from 'lucide-react';
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
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const getQualityScale = () => {
    switch (quality) {
      case 'high': return 3;
      case 'medium': return 2.5;
      case 'low': return 2;
      default: return 2.5;
    }
  };

  const exportCalendar = async () => {
    if (!calendarRef.current) return;

    setIsExporting(true);
    try {
      const scale = getQualityScale();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(calendarRef.current, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: calendarRef.current.scrollWidth,
        height: calendarRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false
      });

      const fileName = `calendar-${monthName.toLowerCase().replace(' ', '-')}`;

      if (exportFormat === 'pdf') {
        // A3 dimensions in mm - Portrait: 210x297, Landscape: 297x210
        const isPortrait = orientation === 'portrait';
        const pdfWidth = isPortrait ? 210 : 297;
        const pdfHeight = isPortrait ? 297 : 210;
        
        const pdf = new jsPDF({
          orientation: orientation,
          unit: 'mm',
          format: 'a3'
        });

        // Calculate dimensions to fit A3 properly
        const canvasRatio = canvas.width / canvas.height;
        const pdfRatio = pdfWidth / pdfHeight;

        let imgWidth, imgHeight, offsetX = 0, offsetY = 0;

        if (canvasRatio > pdfRatio) {
          imgWidth = pdfWidth - 20; // 10mm margin on each side
          imgHeight = (pdfWidth - 20) / canvasRatio;
          offsetX = 10;
          offsetY = (pdfHeight - imgHeight) / 2;
        } else {
          imgHeight = pdfHeight - 20; // 10mm margin on top/bottom
          imgWidth = (pdfHeight - 20) * canvasRatio;
          offsetY = 10;
          offsetX = (pdfWidth - imgWidth) / 2;
        }

        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          offsetX,
          offsetY,
          imgWidth,
          imgHeight
        );

        pdf.save(`${fileName}.pdf`);
      } else {
        const link = document.createElement('a');
        link.download = `${fileName}.${exportFormat}`;
        link.href = canvas.toDataURL(`image/${exportFormat}`, 0.95);
        link.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again with different settings.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center">
        <Download className="h-4 w-4 mr-2" />
        A3 Export Options
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
          <label className="text-sm font-medium mb-2 block">Orientation</label>
          <Select value={orientation} onValueChange={(value: 'portrait' | 'landscape') => setOrientation(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait">Portrait (210×297mm)</SelectItem>
              <SelectItem value="landscape">Landscape (297×210mm)</SelectItem>
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
              <SelectItem value="high">High (300 DPI)</SelectItem>
              <SelectItem value="medium">Medium (250 DPI)</SelectItem>
              <SelectItem value="low">Low (200 DPI)</SelectItem>
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

        <div className="space-y-3">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-800 mb-1 flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              A3 Print Specifications
            </h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Size: {orientation === 'portrait' ? '210×297mm' : '297×210mm'} ({orientation})</li>
              <li>• Resolution: Up to 300 DPI for crisp printing</li>
              <li>• Margins: 10mm bleed area included</li>
              <li>• Format: Print-ready with proper aspect ratio</li>
            </ul>
          </div>

          {exportFormat === 'pdf' && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                📄 <strong>PDF Export:</strong> Automatically optimized for A3 printing with proper margins and centering. 
                No stretching or distortion.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
