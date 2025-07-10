
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
    <div className="bg-white shadow-2xl rounded-lg overflow-hidden mx-auto" style={{ width: '297mm', minHeight: '420mm', fontSize: '11px' }}>
      {/* Cover Image Section - Much larger area */}
      {coverImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={coverImage}
            alt="Calendar cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className={`${template.headerBg} ${template.headerText} p-4 text-center`}>
        <h1 className="text-3xl font-bold">{format(currentDate, 'MMMM yyyy')}</h1>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center font-semibold py-2 text-xs border-b-2 border-gray-300">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {calendarDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isCurrentDay = isToday(date);
            const isWeekendDay = isWeekend(date);

            return (
              <div
                key={index}
                className={`
                  border ${template.gridBorder} p-1 relative
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                  ${isCurrentDay ? 'bg-blue-100 border-blue-500' : ''}
                  ${isWeekendDay && weekendsColored && isCurrentMonth ? template.weekendColor : ''}
                `}
                style={{ minHeight: '60px' }}
              >
                <div className="font-semibold text-sm">
                  {format(date, 'd')}
                </div>
                
                {dayEvents.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded text-white ${template.eventColors[event.category]} truncate`}
                      >
                        {event.icon} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Summary Sections */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        <div className="bg-teal-50 p-3 rounded-lg">
          <h3 className="font-bold text-teal-800 mb-2 text-sm">Events & Celebrations</h3>
          <div className="space-y-1">
            {[...eventsByCategory.event, ...eventsByCategory.celebration].map(event => (
              <div key={event.id} className="text-xs flex items-center">
                <span className="text-sm mr-1">{event.icon}</span>
                <span>{format(new Date(event.date), 'MMM d')}: {event.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2 text-sm">Tech Talks & Meetings</h3>
          <div className="space-y-1">
            {eventsByCategory.techtalk.map(event => (
              <div key={event.id} className="text-xs flex items-center">
                <span className="text-sm mr-1">{event.icon}</span>
                <span>{format(new Date(event.date), 'MMM d')}: {event.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 p-3 rounded-lg">
          <h3 className="font-bold text-red-800 mb-2 text-sm">Holidays</h3>
          <div className="space-y-1">
            {eventsByCategory.holiday.map(event => (
              <div key={event.id} className="text-xs flex items-center">
                <span className="text-sm mr-1">{event.icon}</span>
                <span>{format(new Date(event.date), 'MMM d')}: {event.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-pink-50 p-3 rounded-lg">
          <h3 className="font-bold text-pink-800 mb-2 text-sm">Birthdays</h3>
          <div className="space-y-1">
            {eventsByCategory.birthday.map(event => (
              <div key={event.id} className="text-xs flex items-center">
                <span className="text-sm mr-1">{event.icon}</span>
                <span>{format(new Date(event.date), 'MMM d')}: {event.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
