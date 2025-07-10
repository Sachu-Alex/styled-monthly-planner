
import React, { useState } from 'react';
import { CalendarBuilder } from '@/components/CalendarBuilder';
import { Button } from '@/components/ui/button';
import { Calendar, Palette, Download } from 'lucide-react';

const Index = () => {
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return <CalendarBuilder />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Calendar Designer
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create beautiful, personalized monthly calendars with custom templates, 
            events, and A3 print-ready exports
          </p>
          
          <Button 
            onClick={() => setShowBuilder(true)}
            size="lg"
            className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Calendar className="mr-2 h-6 w-6" />
            Start Creating
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiple Templates</h3>
            <p className="text-gray-600">Choose from beautiful pre-designed templates or customize your own style</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Event Management</h3>
            <p className="text-gray-600">Add events, holidays, birthdays, and tech talks with custom colors and icons</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">A3 Print Export</h3>
            <p className="text-gray-600">Export high-quality PDF and PNG files ready for A3 printing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
