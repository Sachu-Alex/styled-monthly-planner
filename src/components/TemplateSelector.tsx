
import React from 'react';
import { Card } from '@/components/ui/card';
import { CalendarTemplate } from '@/components/CalendarBuilder';
import { Palette } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: CalendarTemplate;
  onTemplateChange: (template: CalendarTemplate) => void;
}

const templates: CalendarTemplate[] = [
  {
    id: 'modern',
    name: 'Modern Clean',
    headerBg: 'bg-gradient-to-r from-blue-600 to-purple-600',
    headerText: 'text-white',
    gridBorder: 'border-gray-200',
    weekendColor: 'text-red-500',
    eventColors: {
      event: 'bg-blue-500',
      holiday: 'bg-red-500',
      birthday: 'bg-pink-500',
      techtalk: 'bg-green-500',
      celebration: 'bg-yellow-500'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal Black',
    headerBg: 'bg-black',
    headerText: 'text-white',
    gridBorder: 'border-gray-300',
    weekendColor: 'text-gray-600',
    eventColors: {
      event: 'bg-gray-700',
      holiday: 'bg-red-600',
      birthday: 'bg-purple-600',
      techtalk: 'bg-green-600',
      celebration: 'bg-orange-500'
    }
  },
  {
    id: 'colorful',
    name: 'Colorful Bright',
    headerBg: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
    headerText: 'text-white',
    gridBorder: 'border-pink-200',
    weekendColor: 'text-pink-600',
    eventColors: {
      event: 'bg-blue-400',
      holiday: 'bg-red-400',
      birthday: 'bg-pink-400',
      techtalk: 'bg-green-400',
      celebration: 'bg-yellow-400'
    }
  },
  {
    id: 'professional',
    name: 'Professional Navy',
    headerBg: 'bg-gradient-to-r from-slate-800 to-slate-600',
    headerText: 'text-white',
    gridBorder: 'border-slate-300',
    weekendColor: 'text-slate-600',
    eventColors: {
      event: 'bg-slate-600',
      holiday: 'bg-red-700',
      birthday: 'bg-rose-600',
      techtalk: 'bg-emerald-600',
      celebration: 'bg-amber-600'
    }
  },
  {
    id: 'pastel',
    name: 'Soft Pastel',
    headerBg: 'bg-gradient-to-r from-purple-300 to-pink-300',
    headerText: 'text-purple-900',
    gridBorder: 'border-purple-200',
    weekendColor: 'text-purple-500',
    eventColors: {
      event: 'bg-blue-300',
      holiday: 'bg-red-300',
      birthday: 'bg-pink-300',
      techtalk: 'bg-green-300',
      celebration: 'bg-yellow-300'
    }
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center">
        <Palette className="h-4 w-4 mr-2" />
        Templates
      </h3>
      
      <div className="space-y-3">
        {templates.map(template => (
          <div
            key={template.id}
            className={`
              p-3 rounded-lg border-2 cursor-pointer transition-all
              ${selectedTemplate.id === template.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => onTemplateChange(template)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{template.name}</span>
              {selectedTemplate.id === template.id && (
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              )}
            </div>
            
            {/* Template Preview */}
            <div className="mt-2">
              <div className={`${template.headerBg} ${template.headerText} p-2 rounded text-xs text-center font-bold`}>
                {template.name}
              </div>
              <div className="grid grid-cols-7 gap-px mt-1 bg-gray-200 p-1 rounded">
                {[...Array(14)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square bg-white text-xs flex items-center justify-center ${template.gridBorder}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
