
import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  isToday, 
  isSameMonth,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { CalendarEvent, CalendarTemplate } from '@/components/CalendarBuilder';

interface CalendarGridProps {
  month: number;
  year: number;
  startDay: 0 | 1;
  weekendsColored: boolean;
  template: CalendarTemplate;
  events: CalendarEvent[];
  coverImage: string | null;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  month,
  year,
  startDay,
  weekendsColored,
  template,
  events,
  coverImage
}) => {
  const currentDate = new Date(year, month);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get the calendar grid including partial weeks
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: startDay });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: startDay });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = startDay === 0 
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  const isWeekend = (date: Date) => {
    const day = getDay(date);
    return startDay === 0 ? (day === 0 || day === 6) : (day === 0 || day === 6);
  };

  const isSunday = (date: Date) => {
    const day = getDay(date);
    return day === 0;
  };

  const isSaturday = (date: Date) => {
    const day = getDay(date);
    return day === 6;
  };

  const monthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === month && eventDate.getFullYear() === year;
  });

  const eventsByCategory = {
    event: monthEvents.filter(e => e.category === 'event'),
    holiday: monthEvents.filter(e => e.category === 'holiday'),
    birthday: monthEvents.filter(e => e.category === 'birthday'),
    techtalk: monthEvents.filter(e => e.category === 'techtalk'),
    celebration: monthEvents.filter(e => e.category === 'celebration')
  };

  return (
    <div className="bg-white shadow-lg overflow-hidden mx-auto print:shadow-none" 
         style={{ 
           width: '210mm', 
           height: '297mm', 
           fontSize: '8px',
           fontFamily: 'Arial, sans-serif'
         }}>
      
      {/* Cover Image Section with natural aspect ratio */}
      {coverImage && (
        <div className="relative h-20 overflow-hidden">
          <img
            src={coverImage}
            alt="Calendar cover"
            className="w-full h-full object-cover"
            style={{ aspectRatio: '16/9' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      )}

      {/* Month Title - Centered and distinct */}
      <div className={`${template.headerBg} ${template.headerText} py-3 text-center relative`}>
        <h1 className="text-xl font-bold tracking-wide">
          {format(currentDate, 'MMMM yyyy').toUpperCase()}
        </h1>
      </div>

      {/* Calendar Grid Section */}
      <div className="p-2 flex-1">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-px mb-1 bg-gray-300">
          {weekDays.map((day, index) => (
            <div key={day} className="bg-gray-100 text-center font-bold py-1 text-xs border-b-2 border-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-300 mb-3">
          {calendarDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isCurrentDay = isToday(date);
            const isWeekendDay = isWeekend(date);
            const isSun = isSunday(date);
            const isSat = isSaturday(date);

            return (
              <div
                key={index}
                className={`
                  bg-white p-1 relative border
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                  ${isCurrentDay ? 'bg-blue-100 border-blue-500' : 'border-gray-200'}
                  ${isSun && weekendsColored && isCurrentMonth ? 'text-red-600 bg-red-50' : ''}
                  ${isSat && weekendsColored && isCurrentMonth ? 'text-blue-600 bg-blue-50' : ''}
                `}
                style={{ minHeight: '32mm', height: '32mm' }}
              >
                <div className="font-bold text-xs mb-1">
                  {format(date, 'd')}
                </div>
                
                {/* Event labels - stackable with max 2-3 visible */}
                {dayEvents.length > 0 && (
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded text-white ${template.eventColors[event.category]} truncate leading-tight`}
                        style={{ fontSize: '6px', lineHeight: '1.2' }}
                      >
                        {event.icon} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-600 font-semibold" style={{ fontSize: '5px' }}>
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Summary Section - Three column layout with pastel cards */}
      <div className="px-2 pb-2">
        <div className="grid grid-cols-3 gap-1 mb-2">
          {/* Events & Celebrations */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-2 rounded-lg border border-teal-200">
            <h3 className="font-bold text-teal-800 mb-1 text-xs">Events & Celebrations</h3>
            <div className="space-y-0.5">
              {[...eventsByCategory.event, ...eventsByCategory.celebration].slice(0, 4).map(event => (
                <div key={event.id} className="text-xs flex items-center leading-tight" style={{ fontSize: '7px' }}>
                  <span className="mr-1 text-sm">{event.icon}</span>
                  <span className="text-teal-700">
                    {format(new Date(event.date), 'MMM dd')} – {event.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Talks */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-1 text-xs">Tech Talks</h3>
            <div className="space-y-0.5">
              {eventsByCategory.techtalk.slice(0, 4).map(event => (
                <div key={event.id} className="text-xs flex items-center leading-tight" style={{ fontSize: '7px' }}>
                  <span className="mr-1 text-sm">{event.icon}</span>
                  <span className="text-blue-700">
                    {format(new Date(event.date), 'MMM dd')} – {event.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Holidays & Birthdays */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-2 rounded-lg border border-pink-200">
            <h3 className="font-bold text-pink-800 mb-1 text-xs">Holidays & Birthdays</h3>
            <div className="space-y-0.5">
              {[...eventsByCategory.holiday, ...eventsByCategory.birthday].slice(0, 4).map(event => (
                <div key={event.id} className="text-xs flex items-center leading-tight" style={{ fontSize: '7px' }}>
                  <span className="mr-1 text-sm">{event.icon}</span>
                  <span className="text-pink-700">
                    {format(new Date(event.date), 'MMM dd')} – {event.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
