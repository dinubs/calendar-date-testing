import React, { useState, useRef, useEffect } from 'react';
import { useButton } from 'react-aria';
import { useRangeCalendarState } from 'react-stately';
import { 
  CalendarDate, 
  getLocalTimeZone,
  isToday,
  isSameMonth,
  startOfWeek,
  createCalendar
} from '@internationalized/date';
import { DateRange, ReactAriaDateRangePickerProps } from './types';
import { styles } from './styles';

// Simplified React Aria Date Range Picker Component
const ReactAriaDateRangePicker: React.FC<ReactAriaDateRangePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date range',
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Simplified state management without complex React Aria hooks for now
  const [internalValue, setInternalValue] = useState<DateRange | null>(value || null);

  const handleDateClick = (date: CalendarDate) => {
    console.log('Date clicked:', date);
    
    let newRange: DateRange | null = null;
    
    if (!internalValue?.start) {
      // First date selection
      newRange = { start: date, end: undefined };
    } else if (!internalValue?.end) {
      // Second date selection
      if (date.compare(internalValue.start) >= 0) {
        newRange = { start: internalValue.start, end: date };
      } else {
        newRange = { start: date, end: internalValue.start };
      }
    } else {
      // Reset and start new selection
      newRange = { start: date, end: undefined };
    }
    
    setInternalValue(newRange);
    if (onChange) {
      onChange(newRange);
    }
    
    // Close when complete range is selected
    if (newRange?.start && newRange?.end) {
      console.log('Closing popover - complete range selected');
      setTimeout(() => setIsOpen(false), 100);
    } else {
      console.log('Keeping popover open - incomplete range');
    }
  };

  // Button trigger props
  const { buttonProps } = useButton(
    {
      onPress: () => !disabled && setIsOpen(!isOpen),
      isDisabled: disabled,
    },
    triggerRef
  );

  const formatDateRange = (range: DateRange | null): string => {
    if (!range?.start) return placeholder;
    if (!range.end) return range.start.toDate(getLocalTimeZone()).toLocaleDateString();
    return `${range.start.toDate(getLocalTimeZone()).toLocaleDateString()} - ${range.end.toDate(getLocalTimeZone()).toLocaleDateString()}`;
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

  useEffect(() => {
    setInternalValue(value || null);
  }, [value]);

  // Generate calendar for current month
  const generateCalendar = (monthOffset: number = 0) => {
    const today = new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1 + monthOffset, 1);
    const startOfMonth = today.set({ day: 1 });
    const startDate = startOfWeek(startOfMonth, 'en-US');
    
    const weeks = [];
    let date = startDate;
    
    // Generate 6 weeks
    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        days.push(date);
        date = date.add({ days: 1 });
      }
      weeks.push(days);
    }
    
    return { weeks, monthDate: startOfMonth };
  };

  const renderDay = (date: CalendarDate, monthDate: CalendarDate) => {
    const isOutsideMonth = !isSameMonth(date, monthDate);
    const isTodayDate = isToday(date, getLocalTimeZone());
    const isSelected = internalValue?.start && date.compare(internalValue.start) === 0;
    const isEndSelected = internalValue?.end && date.compare(internalValue.end) === 0;
    const isInRange = internalValue?.start && internalValue?.end && 
      date.compare(internalValue.start) > 0 && date.compare(internalValue.end) < 0;

    let dayStyles = { ...styles.day };

    if (isOutsideMonth) {
      dayStyles = { ...dayStyles, ...styles.dayOutside };
    } else {
      dayStyles = { ...dayStyles, ...styles.dayNormal };
    }

    if (isTodayDate && !isSelected && !isEndSelected) {
      dayStyles = { ...dayStyles, ...styles.dayToday };
    }

    if (isSelected || isEndSelected) {
      dayStyles = { ...dayStyles, ...styles.daySelected };
    } else if (isInRange) {
      dayStyles = { ...dayStyles, ...styles.dayRangeMiddle };
    }

    return (
      <button
        key={date.toString()}
        onClick={() => handleDateClick(date)}
        style={dayStyles}
        onMouseEnter={(e) => {
          if (!isSelected && !isInRange && !isEndSelected) {
            e.currentTarget.style.backgroundColor = styles.dayHover.backgroundColor;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected && !isInRange && !isEndSelected) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {date.day}
      </button>
    );
  };

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

  const [currentMonth, setCurrentMonth] = useState(0);

  const renderMonth = (monthOffset: number) => {
    const { weeks, monthDate } = generateCalendar(currentMonth + monthOffset);
    const isFirstMonth = monthOffset === 0;
    const isLastMonth = monthOffset === 1;

    return (
      <div key={monthOffset} style={styles.month}>
        <div style={styles.monthHeader}>
          {isFirstMonth && (
            <button
              onClick={() => setCurrentMonth(currentMonth - 1)}
              style={{
                ...styles.navButton,
                ...styles.navButtonEnabled
              }}
            >
              <ChevronLeftIcon />
            </button>
          )}
          {!isFirstMonth && <div style={{ width: '36px' }}></div>}
          
          <h3 style={styles.monthTitle}>
            {monthDate.toDate(getLocalTimeZone()).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          
          {isLastMonth && (
            <button
              onClick={() => setCurrentMonth(currentMonth + 1)}
              style={{
                ...styles.navButton,
                ...styles.navButtonEnabled
              }}
            >
              <ChevronRightIcon />
            </button>
          )}
          {!isLastMonth && <div style={{ width: '36px' }}></div>}
        </div>

        <div style={styles.weekdays}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} style={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} style={styles.week}>
            {week.map(date => renderDay(date, monthDate))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div ref={containerRef} style={styles.container} className={className}>
      <button
        {...buttonProps}
        ref={triggerRef}
        style={{
          ...styles.trigger,
          ...(disabled ? styles.triggerDisabled : {})
        }}
      >
        <span>{formatDateRange(internalValue)}</span>
        <ChevronIcon />
      </button>

      {isOpen && (
        <>
          <div style={styles.overlay} />
          <div style={styles.popover}>
            <div style={styles.calendar}>
              {renderMonth(0)}
              {renderMonth(1)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReactAriaDateRangePicker;