
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarEvent } from '@/components/CalendarBuilder';
import { format } from 'date-fns';
import { Plus, Trash2, Calendar } from 'lucide-react';

interface EventManagerProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onRemoveEvent: (eventId: string) => void;
  selectedMonth: number;
  selectedYear: number;
}

export const EventManager: React.FC<EventManagerProps> = ({
  events,
  onAddEvent,
  onRemoveEvent,
  selectedMonth,
  selectedYear
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    date: '',
    title: '',
    category: 'event' as CalendarEvent['category'],
    color: 'bg-blue-500',
    icon: '📅'
  });

  const categoryIcons = {
    event: '📅',
    holiday: '🎉',
    birthday: '🎂',
    techtalk: '💻',
    celebration: '🎊'
  };

  const categoryColors = {
    event: 'bg-blue-500',
    holiday: 'bg-red-500',
    birthday: 'bg-pink-500',
    techtalk: 'bg-green-500',
    celebration: 'bg-yellow-500'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.date && newEvent.title) {
      onAddEvent({
        ...newEvent,
        color: categoryColors[newEvent.category],
        icon: categoryIcons[newEvent.category]
      });
      setNewEvent({
        date: '',
        title: '',
        category: 'event',
        color: 'bg-blue-500',
        icon: '📅'
      });
      setShowAddForm(false);
    }
  };

  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear;
  });

  return (
    <div className="mt-4 space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Events ({currentMonthEvents.length})
          </h3>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Event
          </Button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded-lg mb-4">
            <Input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
            
            <Input
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
            
            <Select 
              value={newEvent.category} 
              onValueChange={(value: CalendarEvent['category']) => 
                setNewEvent({ 
                  ...newEvent, 
                  category: value,
                  icon: categoryIcons[value],
                  color: categoryColors[value]
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="event">📅 Event</SelectItem>
                <SelectItem value="holiday">🎉 Holiday</SelectItem>
                <SelectItem value="birthday">🎂 Birthday</SelectItem>
                <SelectItem value="techtalk">💻 Tech Talk</SelectItem>
                <SelectItem value="celebration">🎊 Celebration</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex space-x-2">
              <Button type="submit" size="sm" className="flex-1">
                Add Event
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {currentMonthEvents.map(event => (
            <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2 flex-1">
                <span className="text-lg">{event.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{event.title}</div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(event.date), 'MMM d, yyyy')} • {event.category}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveEvent(event.id)}
                className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {currentMonthEvents.length === 0 && (
            <div className="text-center text-gray-500 py-4 text-sm">
              No events for this month
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
