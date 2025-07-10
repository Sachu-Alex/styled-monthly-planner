
import React, { useState, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameMonth } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarGrid } from '@/components/CalendarGrid';
import { EventManager } from '@/components/EventManager';
import { TemplateSelector } from '@/components/TemplateSelector';
import { CoverImageUpload } from '@/components/CoverImageUpload';
import { ExportOptions } from '@/components/ExportOptions';
import { ArrowLeft, Settings, Download, Image, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  category: 'event' | 'holiday' | 'birthday' | 'techtalk' | 'celebration';
  color: string;
  icon?: string;
}

export interface CalendarTemplate {
  id: string;
  name: string;
  headerBg: string;
  headerText: string;
  gridBorder: string;
  weekendColor: string;
  eventColors: Record<string, string>;
}

export const CalendarBuilder: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDay, setStartDay] = useState<0 | 1>(0); // 0 = Sunday, 1 = Monday
  const [weekendsColored, setWeekendsColored] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<CalendarTemplate>({
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
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('calendar');
  const calendarRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date(selectedYear, selectedMonth);
  const monthName = format(currentDate, 'MMMM yyyy');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i - 5);

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = { ...event, id: Math.random().toString(36).substr(2, 9) };
    setEvents(prev => [...prev, newEvent]);
  };

  const removeEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => window.location.reload()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Calendar Designer</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={month} value={index.toString()}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r h-screen overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 m-4">
              <TabsTrigger value="calendar" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Setup
              </TabsTrigger>
              <TabsTrigger value="template" className="text-xs">
                <Palette className="h-3 w-3 mr-1" />
                Style
              </TabsTrigger>
              <TabsTrigger value="image" className="text-xs">
                <Image className="h-3 w-3 mr-1" />
                Cover
              </TabsTrigger>
              <TabsTrigger value="export" className="text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export
              </TabsTrigger>
            </TabsList>

            <div className="px-4 pb-4">
              <TabsContent value="calendar" className="mt-0">
                <Card className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Day</label>
                    <Select value={startDay.toString()} onValueChange={(value) => setStartDay(parseInt(value) as 0 | 1)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sunday</SelectItem>
                        <SelectItem value="1">Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="weekends"
                      checked={weekendsColored}
                      onChange={(e) => setWeekendsColored(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="weekends" className="text-sm">Color weekends</label>
                  </div>
                </Card>
                
                <EventManager
                  events={events}
                  onAddEvent={addEvent}
                  onRemoveEvent={removeEvent}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              </TabsContent>

              <TabsContent value="template" className="mt-0">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={setSelectedTemplate}
                />
              </TabsContent>

              <TabsContent value="image" className="mt-0">
                <CoverImageUpload
                  coverImage={coverImage}
                  onImageChange={setCoverImage}
                />
              </TabsContent>

              <TabsContent value="export" className="mt-0">
                <ExportOptions calendarRef={calendarRef} monthName={monthName} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Main Calendar Area */}
        <div className="flex-1 p-8">
          <div ref={calendarRef} className="max-w-4xl mx-auto">
            <CalendarGrid
              month={selectedMonth}
              year={selectedYear}
              startDay={startDay}
              weekendsColored={weekendsColored}
              template={selectedTemplate}
              events={events}
              coverImage={coverImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
