import React, { useState, useRef, useEffect } from 'react';
import { useButton, useRangeCalendar, useCalendarGrid, useCalendarCell } from 'react-aria';
import { useRangeCalendarState } from 'react-stately';
import { 
  CalendarDate, 
  createCalendar,
  getLocalTimeZone,
  today,
  CalendarDateTime
} from '@internationalized/date';
import { DateRange, ReactAriaDateRangePickerProps } from './types';
import { styles } from './styles';

// Convert native Date to CalendarDate
const dateToCalendarDate = (date: Date): CalendarDate => {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

// Convert CalendarDate to native Date
const calendarDateToDate = (calendarDate: CalendarDate): Date => {
  return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
};

// Native JavaScript date formatting
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const formatMonth = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
};

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

  // Convert native Date range to CalendarDate range for React Aria
  const calendarValue = React.useMemo(() => {
    if (!value?.start && !value?.end) return null;
    return {
      start: value?.start ? dateToCalendarDate(value.start) : undefined,
      end: value?.end ? dateToCalendarDate(value.end) : undefined
    };
  }, [value]);

  // Calendar state using React Stately
  const state = useRangeCalendarState({
    value: calendarValue,
    onChange: (range) => {
      console.log('React Aria range changed:', range);
      
      if (!onChange) return;
      
      let newRange: DateRange | null = null;
      
      if (range?.start || range?.end) {
        newRange = {
          start: range?.start ? calendarDateToDate(range.start) : undefined,
          end: range?.end ? calendarDateToDate(range.end) : undefined
        };
      }
      
      onChange(newRange);
      
      // Close when complete range is selected
      if (newRange?.start && newRange?.end) {
        console.log('Closing popover - complete range selected');
        setTimeout(() => setIsOpen(false), 100);
      }
    },
    createCalendar,
    locale: 'en-US',
    visibleDuration: { months: 2 }
  });

  // Calendar hook for the container
  const { calendarProps, title } = useRangeCalendar({}, state);

  // Button trigger props
  const { buttonProps } = useButton(
    {
      onPress: () => !disabled && setIsOpen(!isOpen),
      isDisabled: disabled,
    },
    triggerRef
  );

  const formatDateRange = (range: DateRange | null): string => {
    try {
      if (!range?.start) return placeholder;
      
      const startStr = formatDate(range.start);
      if (!range.end) return startStr;
      
      const endStr = formatDate(range.end);
      return `${startStr} - ${endStr}`;
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

  useEffect(() => {
    // Sync external value changes with internal state
    if (value !== undefined) {
      // This will trigger state.setValue via the state hook
    }
  }, [value]);

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

  // Render a single calendar month
  const renderCalendar = (monthIndex: number) => {
    const monthState = state.calendars[monthIndex];
    if (!monthState) return null;

    const { gridProps, headerProps, weekDays } = useCalendarGrid({
      weekdayStyle: 'short'
    }, monthState);

    const isFirstMonth = monthIndex === 0;
    const isLastMonth = monthIndex === state.calendars.length - 1;

    return (
      <div key={monthIndex} style={styles.month}>
        {/* Month Header */}
        <div style={styles.monthHeader}>
          {isFirstMonth && (
            <button
              onClick={() => state.focusPreviousPage()}
              disabled={!state.isPreviousVisibleRangeValid()}
              style={{
                ...styles.navButton,
                ...(state.isPreviousVisibleRangeValid() ? styles.navButtonEnabled : styles.navButtonDisabled)
              }}
            >
              <ChevronLeftIcon />
            </button>
          )}
          {!isFirstMonth && <div style={{ width: '36px' }} />}
          
          <h3 style={styles.monthTitle} {...headerProps}>
            {formatMonth(calendarDateToDate(monthState.visibleRange.start))}
          </h3>
          
          {isLastMonth && (
            <button
              onClick={() => state.focusNextPage()}
              disabled={!state.isNextVisibleRangeValid()}
              style={{
                ...styles.navButton,
                ...(state.isNextVisibleRangeValid() ? styles.navButtonEnabled : styles.navButtonDisabled)
              }}
            >
              <ChevronRightIcon />
            </button>
          )}
          {!isLastMonth && <div style={{ width: '36px' }} />}
        </div>

        {/* Weekdays */}
        <div style={styles.weekdays}>
          {weekDays.map((day, idx) => (
            <div key={idx} style={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <table {...gridProps} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[...Array(6).keys()].map((weekIndex) => (
              <tr key={weekIndex} style={{ display: 'contents' }}>
                {monthState.getDatesInWeek(weekIndex).map((date, dayIndex) => {
                  if (!date) {
                    return (
                      <td key={dayIndex} style={{ width: '40px', height: '40px' }} />
                    );
                  }

                  return (
                    <CalendarCell
                      key={date.toString()}
                      state={state}
                      date={date}
                      currentMonth={monthState.visibleRange.start}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
        <span>{formatDateRange(value)}</span>
        <ChevronIcon />
      </button>

      {isOpen && (
        <>
          <div style={styles.overlay} />
          <div style={styles.popover}>
            <div {...calendarProps} style={styles.calendar}>
              {state.calendars.map((_, index) => renderCalendar(index))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Calendar Cell Component using useCalendarCell
interface CalendarCellProps {
  state: any;
  date: CalendarDate;
  currentMonth: CalendarDate;
}

const CalendarCell: React.FC<CalendarCellProps> = ({ state, date, currentMonth }) => {
  const ref = useRef<HTMLTableCellElement>(null);
  const { cellProps, buttonProps, isPressed, isSelected, isDisabled, formattedDate } = useCalendarCell(
    { date },
    state,
    ref
  );

  const isOutsideMonth = date.month !== currentMonth.month;
  const isToday = date.compare(today(getLocalTimeZone())) === 0;
  const isRangeStart = state.highlightedRange?.start && date.compare(state.highlightedRange.start) === 0;
  const isRangeEnd = state.highlightedRange?.end && date.compare(state.highlightedRange.end) === 0;
  const isInRange = state.highlightedRange && 
    state.highlightedRange.start && 
    state.highlightedRange.end &&
    date.compare(state.highlightedRange.start) > 0 && 
    date.compare(state.highlightedRange.end) < 0;

  let dayStyles = { ...styles.day };

  if (isOutsideMonth) {
    dayStyles = { ...dayStyles, ...styles.dayOutside };
  } else {
    dayStyles = { ...dayStyles, ...styles.dayNormal };
  }

  if (isToday && !isSelected && !isRangeStart && !isRangeEnd) {
    dayStyles = { ...dayStyles, ...styles.dayToday };
  }

  if (isRangeStart || isRangeEnd || isSelected) {
    dayStyles = { ...dayStyles, ...styles.daySelected };
  } else if (isInRange) {
    dayStyles = { ...dayStyles, ...styles.dayRangeMiddle };
  }

  if (isPressed) {
    dayStyles = { ...dayStyles, opacity: 0.8 };
  }

  return (
    <td {...cellProps} ref={ref} style={{ padding: '2px' }}>
      <button
        {...buttonProps}
        disabled={isDisabled}
        style={dayStyles}
        onMouseEnter={(e) => {
          if (!isSelected && !isInRange && !isRangeStart && !isRangeEnd) {
            e.currentTarget.style.backgroundColor = styles.dayHover.backgroundColor;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected && !isInRange && !isRangeStart && !isRangeEnd) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {formattedDate}
      </button>
    </td>
  );
};

export default ReactAriaDateRangePicker;