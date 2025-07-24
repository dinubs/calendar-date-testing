import React, { useState, useRef, useEffect } from 'react';
import { DayPicker, useDayPicker } from 'react-day-picker';
import { format, addMonths } from 'date-fns';
import { DateRange, DateRangePickerProps } from './types';
import { styles } from './styles';

// Custom Day component - this gives us full control over day rendering
const CustomDay = ({ day, modifiers }: any) => {
  const { select } = useDayPicker();

  const handleClick = () => {
    select?.(day.date, modifiers, new Event('click') as any);
  };

  const getDayStyles = () => {
    const baseStyle = {
      padding: '10px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: '14px',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      color: modifiers?.outside ? '#9ca3af' : '#374151'
    };

    if (modifiers?.today && !modifiers?.selected && !modifiers?.range_start && !modifiers?.range_end) {
      return {
        ...baseStyle,
        backgroundColor: '#fef3c7',
        fontWeight: '600'
      };
    }

    if (modifiers?.range_start || modifiers?.range_end) {
      return {
        ...baseStyle,
        backgroundColor: '#3b82f6',
        color: 'white',
        fontWeight: '600'
      };
    }

    if (modifiers?.range_middle) {
      return {
        ...baseStyle,
        backgroundColor: '#eff6ff',
        color: '#3b82f6'
      };
    }

    return baseStyle;
  };

  return (
    <button
      onClick={handleClick}
      style={getDayStyles()}
      onMouseEnter={(e) => {
        if (!modifiers?.selected && !modifiers?.range_middle && !modifiers?.range_start && !modifiers?.range_end) {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }
      }}
      onMouseLeave={(e) => {
        if (!modifiers?.selected && !modifiers?.range_middle && !modifiers?.range_start && !modifiers?.range_end) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {day?.date?.getDate?.() || ''}
    </button>
  );
};

// Custom Navigation component that actually receives displayMonth
const CustomNavigation = ({ displayMonth }: { displayMonth: Date }) => {
  const { goToMonth, nextMonth, previousMonth, months } = useDayPicker();

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

  // Check if this is the first or last month being displayed
  const isFirstMonth = months && months.length > 0 && displayMonth.getTime() === months[0].date.getTime();
  const isLastMonth = months && months.length > 1 && displayMonth.getTime() === months[months.length - 1].date.getTime();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
      padding: '0 8px',
      height: '40px' // Fixed height to prevent layout shift
    }}>
      {isFirstMonth ? (
        <button
          onClick={() => previousMonth && goToMonth?.(previousMonth)}
          disabled={!previousMonth}
          style={{
            padding: '8px',
            border: 'none',
            background: 'none',
            cursor: previousMonth ? 'pointer' : 'not-allowed',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            opacity: previousMonth ? 1 : 0.3
          }}
        >
          <ChevronLeftIcon />
        </button>
      ) : (
        <div style={{ width: '36px' }}></div> // Spacer for alignment
      )}
      
      <h3 style={{
        margin: 0,
        fontSize: '16px',
        fontWeight: '600',
        flex: 1,
        textAlign: 'center'
      }}>
        {format(displayMonth, 'MMMM yyyy')}
      </h3>
      
      {isLastMonth ? (
        <button
          onClick={() => nextMonth && goToMonth?.(nextMonth)}
          disabled={!nextMonth}
          style={{
            padding: '8px',
            border: 'none',
            background: 'none',
            cursor: nextMonth ? 'pointer' : 'not-allowed',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            opacity: nextMonth ? 1 : 0.3
          }}
        >
          <ChevronRightIcon />
        </button>
      ) : (
        <div style={{ width: '36px' }}></div> // Spacer for alignment
      )}
    </div>
  );
};

// Custom Caption component - this receives displayMonth prop
const CustomCaption = ({ displayMonth }: { displayMonth: Date }) => {
  return <CustomNavigation displayMonth={displayMonth} />;
};

// Custom Weekdays component
const CustomWeekdays = () => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      width: '100%'
    }}>
      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
        <div key={day} style={{
          padding: '8px',
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b7280'
        }}>
          {day}
        </div>
      ))}
    </div>
  );
};

const TrulyHeadlessDateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date range',
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (range: DateRange | undefined) => {
    console.log('handleSelect called with:', range);
    
    if (onChange) {
      onChange(range);
    }
    
    // Only close popover when we have a complete date range (both from and to dates)
    // AND they are different dates (not the same date selected twice)
    if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
      console.log('Closing popover - complete range selected');
      setTimeout(() => setIsOpen(false), 100);
    } else {
      console.log('Keeping popover open - incomplete range');
    }
  };

  const formatDateRange = (range: DateRange | undefined): string => {
    if (!range?.from) return placeholder;
    if (!range.to) return format(range.from, 'MMM dd, yyyy');
    return `${format(range.from, 'MMM dd, yyyy')} - ${format(range.to, 'MMM dd, yyyy')}`;
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
          <div style={{
            ...styles.popover,
            padding: '20px'
          }}>
            <DayPicker
              mode="range"
              numberOfMonths={2}
              selected={value}
              onSelect={handleSelect}
              showOutsideDays
              fixedWeeks
              components={{
                Day: CustomDay,
                Caption: CustomCaption,
                Weekdays: CustomWeekdays,
                Month: ({ children }) => (
                  <div style={{ 
                    minWidth: '280px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {children}
                  </div>
                ),
                MonthGrid: ({ children }) => (
                  <div>
                    {children}
                  </div>
                ),
                Weeks: ({ children }) => (
                  <>
                    {children}
                  </>
                ),
                Week: ({ children }) => (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    width: '100%'
                  }}>
                    {children}
                  </div>
                ),
                Months: ({ children }) => (
                  <div style={{
                    display: 'flex',
                    gap: '32px'
                  }}>
                    {children}
                  </div>
                ),
                Nav: () => null, // We handle navigation in Caption
              }}
              styles={{
                root: { fontSize: '14px' },
                nav: { display: 'none' }, // Hide default nav
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TrulyHeadlessDateRangePicker;