import React, { useState, useRef, useEffect } from 'react';
import { useDatePicker } from '@rehookify/datepicker';
import { format, isValid } from 'date-fns';
import { DateRange, RehookifyDateRangePickerProps } from './types';
import { styles } from './styles';

const RehookifyDateRangePicker: React.FC<RehookifyDateRangePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date range',
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Add offsetDate state for calendar navigation
  const [offsetDate, setOffsetDate] = useState<Date>(new Date());

  // Create selected dates array from value prop
  const selectedDates = React.useMemo(() => {
    const dates: Date[] = [];
    if (value?.from) dates.push(value.from);
    if (value?.to) dates.push(value.to);
    return dates;
  }, [value]);

  // Create a second offset date for the next month
  const secondMonthDate = React.useMemo(() => {
    const nextMonth = new Date(offsetDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  }, [offsetDate]);

  // First month calendar
  const firstCalendar = useDatePicker({
    selectedDates,
    onDatesChange: (dates: Date[]) => {
      console.log('Rehookify dates changed:', dates);
      
      if (!onChange) return;
      
      if (dates.length === 0) {
        onChange(undefined);
      } else if (dates.length === 1) {
        onChange({ from: dates[0], to: undefined });
      } else if (dates.length >= 2) {
        const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
        onChange({ from: sortedDates[0], to: sortedDates[1] });
        
        // Close when range is complete
        setTimeout(() => setIsOpen(false), 100);
      }
    },
    offsetDate,
    onOffsetChange: setOffsetDate,
    dates: {
      mode: 'range',
      toggle: true,
      limit: 2
    }
  });

  // Second month calendar
  const secondCalendar = useDatePicker({
    selectedDates,
    onDatesChange: (dates: Date[]) => {
      // Same handler as first calendar
      console.log('Rehookify dates changed (second):', dates);
      
      if (!onChange) return;
      
      if (dates.length === 0) {
        onChange(undefined);
      } else if (dates.length === 1) {
        onChange({ from: dates[0], to: undefined });
      } else if (dates.length >= 2) {
        const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
        onChange({ from: sortedDates[0], to: sortedDates[1] });
        
        // Close when range is complete
        setTimeout(() => setIsOpen(false), 100);
      }
    },
    offsetDate: secondMonthDate,
    onOffsetChange: (date: Date) => {
      // Update the main offset date when second calendar changes
      const prevMonth = new Date(date);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setOffsetDate(prevMonth);
    },
    dates: {
      mode: 'range',
      toggle: true,
      limit: 2
    }
  });

  // Get calendars and navigation from first calendar
  const { data: { weekDays, calendars }, propGetters: { dayButton, addOffset, subtractOffset } } = firstCalendar;
  const { data: { calendars: secondCalendars }, propGetters: { dayButton: secondDayButton } } = secondCalendar;

  // Debug logging
  console.log('Rehookify calendar data:', { 
    firstCalendarsCount: calendars?.length, 
    secondCalendarsCount: secondCalendars?.length,
    calendars, 
    secondCalendars,
    weekDays, 
    offsetDate,
    secondMonthDate
  });

  const formatDateRange = (range: DateRange | undefined): string => {
    try {
      if (!range?.from) return placeholder;
      
      const fromStr = isValid(range.from) ? format(range.from, 'MMM dd, yyyy') : 'Invalid Date';
      
      if (!range.to) return fromStr;
      
      const toStr = isValid(range.to) ? format(range.to, 'MMM dd, yyyy') : 'Invalid Date';
      
      return `${fromStr} - ${toStr}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return placeholder;
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const ChevronIcon = () => (
    <svg style={styles.chevron} viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ChevronLeftIcon = () => (
    <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  );

  // Simple fallback if no calendars available
  if ((!calendars || calendars.length === 0) && (!secondCalendars || secondCalendars.length === 0)) {
    return (
      <div ref={containerRef} style={styles.container} className={className}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          style={{
            ...styles.trigger,
            ...(disabled ? styles.triggerDisabled : {})
          }}
          disabled={disabled}
        >
          <span>{formatDateRange(value)}</span>
          <ChevronIcon />
        </button>

        {isOpen && (
          <>
            <div style={styles.overlay} />
            <div style={styles.popover}>
              <div style={{ padding: '40px', textAlign: 'center' }}>
                Loading calendar...
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} style={styles.container} className={className}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          ...styles.trigger,
          ...(disabled ? styles.triggerDisabled : {})
        }}
        disabled={disabled}
      >
        <span>{formatDateRange(value)}</span>
        <ChevronIcon />
      </button>

      {isOpen && (
        <>
          <div style={styles.overlay} />
          <div style={styles.popover}>
            <div style={styles.calendar}>
              {/* First Calendar */}
              {calendars && calendars.length > 0 && (
                <div style={styles.month}>
                  {/* Month Header with left navigation */}
                  <div style={styles.monthHeader}>
                    <button
                      {...subtractOffset({ months: 1 })}
                      style={{
                        ...styles.navButton,
                        ...styles.navButtonEnabled
                      }}
                    >
                      <ChevronLeftIcon />
                    </button>
                    
                    <h3 style={styles.monthTitle}>
                      {calendars[0]?.month && calendars[0]?.year ? 
                        `${calendars[0].month} ${calendars[0].year}` : 'Loading...'
                      }
                    </h3>
                    
                    <div style={{ width: '36px' }} />
                  </div>

                  {/* Weekdays */}
                  <div style={styles.weekdays}>
                    {weekDays && weekDays.length > 0 ? weekDays.map((day, idx) => (
                      <div key={idx} style={styles.weekday}>
                        {day}
                      </div>
                    )) : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, idx) => (
                      <div key={idx} style={styles.weekday}>
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '2px',
                    width: '100%'
                  }}>
                    {calendars[0]?.days?.map((day: any, idx: number) => (
                      <button
                        key={day?.$date?.toDateString() || `day-first-${idx}`}
                        {...(dayButton ? dayButton(day) : {})}
                        style={{
                          ...styles.day,
                          ...(day?.inCurrentMonth === false ? styles.dayOutside : styles.dayNormal),
                          ...(day?.isToday ? styles.dayToday : {}),
                          ...(day?.selected ? styles.daySelected : {}),
                          ...(day?.inRange ? styles.dayRangeMiddle : {})
                        }}
                      >
                        {day?.day || ''}
                      </button>
                    )) || (
                      <div style={{ gridColumn: 'span 7', textAlign: 'center', padding: '20px' }}>
                        No days available
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Second Calendar */}
              {secondCalendars && secondCalendars.length > 0 && (
                <div style={styles.month}>
                  {/* Month Header with right navigation */}
                  <div style={styles.monthHeader}>
                    <div style={{ width: '36px' }} />
                    
                    <h3 style={styles.monthTitle}>
                      {secondCalendars[0]?.month && secondCalendars[0]?.year ? 
                        `${secondCalendars[0].month} ${secondCalendars[0].year}` : 'Loading...'
                      }
                    </h3>
                    
                    <button
                      {...addOffset({ months: 1 })}
                      style={{
                        ...styles.navButton,
                        ...styles.navButtonEnabled
                      }}
                    >
                      <ChevronRightIcon />
                    </button>
                  </div>

                  {/* Weekdays */}
                  <div style={styles.weekdays}>
                    {weekDays && weekDays.length > 0 ? weekDays.map((day, idx) => (
                      <div key={idx} style={styles.weekday}>
                        {day}
                      </div>
                    )) : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, idx) => (
                      <div key={idx} style={styles.weekday}>
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '2px',
                    width: '100%'
                  }}>
                    {secondCalendars[0]?.days?.map((day: any, idx: number) => (
                      <button
                        key={day?.$date?.toDateString() || `day-second-${idx}`}
                        {...(secondDayButton ? secondDayButton(day) : {})}
                        style={{
                          ...styles.day,
                          ...(day?.inCurrentMonth === false ? styles.dayOutside : styles.dayNormal),
                          ...(day?.isToday ? styles.dayToday : {}),
                          ...(day?.selected ? styles.daySelected : {}),
                          ...(day?.inRange ? styles.dayRangeMiddle : {})
                        }}
                      >
                        {day?.day || ''}
                      </button>
                    )) || (
                      <div style={{ gridColumn: 'span 7', textAlign: 'center', padding: '20px' }}>
                        No days available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RehookifyDateRangePicker;