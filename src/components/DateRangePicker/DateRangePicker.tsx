import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { DateRange, DateRangePickerProps } from './types';
import { styles } from './styles';

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date range',
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DateRange | undefined>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);
    if (onChange) {
      onChange(range);
    }
    
    // Close popover when both dates are selected
    if (range?.from && range?.to) {
      setIsOpen(false);
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
        <span>{formatDateRange(selected)}</span>
        <ChevronIcon />
      </button>

      {isOpen && (
        <>
          <div style={styles.overlay} />
          <div style={styles.popover}>
            <DayPicker
              mode="range"
              numberOfMonths={2}
              selected={selected}
              onSelect={handleSelect}
              style={styles.calendar}
              modifiersStyles={{
                selected: {
                  backgroundColor: 'var(--rdp-accent-color)',
                  color: 'white',
                },
                range_start: {
                  backgroundColor: 'var(--rdp-accent-color)',
                  color: 'white',
                },
                range_end: {
                  backgroundColor: 'var(--rdp-accent-color)',
                  color: 'white',
                },
                range_middle: {
                  backgroundColor: 'var(--rdp-background-color)',
                  color: 'var(--rdp-accent-color)',
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;