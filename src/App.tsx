import React, { useState } from 'react';
import { DateRangePicker, TrulyHeadlessDateRangePicker, DateRange } from './components/DateRangePicker';
import { ReactAriaDateRangePicker, DateRange as AriaDateRange } from './components/ReactAriaDateRangePicker';
import { RehookifyDateRangePicker, DateRange as RehookifyDateRange } from './components/RehookifyDateRangePicker';

const App: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [headlessDateRange, setHeadlessDateRange] = useState<DateRange | undefined>();
  const [ariaDateRange, setAriaDateRange] = useState<AriaDateRange | null>(null);
  const [rehookifyDateRange, setRehookifyDateRange] = useState<RehookifyDateRange | undefined>();

  return (
    <div className="container">
      <h1>Datepicker Testing Site</h1>
      <p>Ready to test different datepicker libraries!</p>
      
      <div style={{ marginTop: '40px' }}>
        <h2>React Day Picker (Fully Headless Implementation)</h2>
        
        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Implementation Details:</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>Truly headless:</strong> Uses only useCalendar & useSelection hooks for logic</li>
            <li><strong>Native JavaScript dates:</strong> No external date libraries, only built-in Date methods</li>
            <li><strong>Full rendering control:</strong> Every element (days, navigation, grid) is custom rendered</li>
            <li><strong>Two-month view:</strong> Custom grid layout showing current and next month</li>
            <li><strong>Custom day components:</strong> Complete control over day styling and interaction</li>
            <li><strong>Zero default styling:</strong> No CSS imports or overrides needed</li>
          </ul>
          
          <h3 style={{ margin: '16px 0 8px 0', fontSize: '16px' }}>Evaluation Criteria:</h3>
          <p style={{ margin: '0 0 8px 0' }}><strong>Pros:</strong> Ultimate customization, minimal dependencies, native Date API, complete control</p>
          <p style={{ margin: 0 }}><strong>Cons:</strong> More implementation work, manual date formatting, need to handle all edge cases yourself</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Select Date Range (Headless):
          </label>
          <TrulyHeadlessDateRangePicker
            value={headlessDateRange}
            onChange={setHeadlessDateRange}
            placeholder="Choose date range..."
          />
        </div>

        {headlessDateRange && (
          <div style={{
            padding: '12px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <strong>Selected Range:</strong> {' '}
            {headlessDateRange.from && `From: ${headlessDateRange.from.toLocaleDateString()}`}
            {headlessDateRange.to && ` | To: ${headlessDateRange.to.toLocaleDateString()}`}
          </div>
        )}

        <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

        <h2>React Aria (Fully Headless Implementation)</h2>
        
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Implementation Details:</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>React Aria calendar hooks:</strong> Uses useRangeCalendar, useCalendarGrid, useCalendarCell</li>
            <li><strong>React Stately:</strong> useRangeCalendarState for robust calendar state management</li>
            <li><strong>Full accessibility:</strong> ARIA support, keyboard navigation, screen reader friendly</li>
            <li><strong>Native Date bridge:</strong> Converts between native Date and CalendarDate for API compatibility</li>
            <li><strong>Two-month view:</strong> Built-in visibleDuration support for dual calendars</li>
            <li><strong>Native formatting:</strong> Uses toLocaleDateString() for user-facing display</li>
          </ul>
          
          <h3 style={{ margin: '16px 0 8px 0', fontSize: '16px' }}>Evaluation Criteria:</h3>
          <p style={{ margin: '0 0 8px 0' }}><strong>Pros:</strong> Best-in-class accessibility, robust state management, proper React Aria patterns</p>
          <p style={{ margin: 0 }}><strong>Cons:</strong> Requires @internationalized/date bridge, larger bundle size, more complex setup</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Select Date Range (React Aria):
          </label>
          <ReactAriaDateRangePicker
            value={ariaDateRange}
            onChange={setAriaDateRange}
            placeholder="Choose date range..."
          />
        </div>

        {ariaDateRange && (ariaDateRange.start || ariaDateRange.end) && (
          <div style={{
            padding: '12px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <strong>Selected Range:</strong> {' '}
            {ariaDateRange.start && `From: ${ariaDateRange.start.toLocaleDateString()}`}
            {ariaDateRange.end && ` | To: ${ariaDateRange.end.toLocaleDateString()}`}
          </div>
        )}

        <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

        <h2>@rehookify/datepicker (Fully Headless Implementation)</h2>
        
        <div style={{ 
          backgroundColor: '#fefbf3', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Implementation Details:</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>Pure headless hook:</strong> Uses useDatePicker hook for all logic</li>
            <li><strong>Native JavaScript dates:</strong> No external date libraries, only built-in Date methods</li>
            <li><strong>Prop getters pattern:</strong> Provides button props via dayButton, nextMonthButton, etc.</li>
            <li><strong>Range selection:</strong> Built-in range mode with toggle and limit options</li>
            <li><strong>Multiple calendar support:</strong> Two separate calendar instances for dual-month view</li>
            <li><strong>Minimal dependencies:</strong> Clean API with zero external date library dependencies</li>
          </ul>
          
          <h3 style={{ margin: '16px 0 8px 0', fontSize: '16px' }}>Evaluation Criteria:</h3>
          <p style={{ margin: '0 0 8px 0' }}><strong>Pros:</strong> Ultra-lightweight, clean API, native Date API, excellent TypeScript support</p>
          <p style={{ margin: 0 }}><strong>Cons:</strong> Basic date formatting, smaller community, fewer built-in accessibility features</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Select Date Range (Rehookify):
          </label>
          <RehookifyDateRangePicker
            value={rehookifyDateRange}
            onChange={setRehookifyDateRange}
            placeholder="Choose date range..."
          />
        </div>

        {rehookifyDateRange && (rehookifyDateRange.from || rehookifyDateRange.to) && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fefce8',
            border: '1px solid #eab308',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <strong>Selected Range:</strong> {' '}
            {rehookifyDateRange.from && `From: ${rehookifyDateRange.from.toLocaleDateString()}`}
            {rehookifyDateRange.to && ` | To: ${rehookifyDateRange.to.toLocaleDateString()}`}
          </div>
        )}
        
      </div>
    </div>
  );
};

export default App;