import React, { useState } from 'react';
import { DateRangePicker, TrulyHeadlessDateRangePicker, DateRange } from './components/DateRangePicker';
import { ReactAriaDateRangePicker, DateRange as AriaDateRange } from './components/ReactAriaDateRangePicker';
import { RehookifyDateRangePicker, DateRange as RehookifyDateRange } from './components/RehookifyDateRangePicker';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';

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
            <li><strong>Full rendering control:</strong> Every element (days, navigation, grid) is custom rendered</li>
            <li><strong>Two-month view:</strong> Custom grid layout showing current and next month</li>
            <li><strong>Custom day components:</strong> Complete control over day styling and interaction</li>
            <li><strong>Custom navigation:</strong> Built from scratch with calendar.goToMonth() hooks</li>
            <li><strong>Zero default styling:</strong> No CSS imports or overrides needed</li>
          </ul>
          
          <h3 style={{ margin: '16px 0 8px 0', fontSize: '16px' }}>Evaluation Criteria:</h3>
          <p style={{ margin: '0 0 8px 0' }}><strong>Pros:</strong> Ultimate customization, smaller bundle (no default components), complete control</p>
          <p style={{ margin: 0 }}><strong>Cons:</strong> More implementation work, need to handle all edge cases yourself</p>
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
            <li><strong>React Aria hooks:</strong> Uses useRangeCalendar, useCalendarGrid, useCalendarCell</li>
            <li><strong>Complete accessibility:</strong> Built-in ARIA support, keyboard navigation, screen reader friendly</li>
            <li><strong>Internationalized dates:</strong> Uses @internationalized/date for robust date handling</li>
            <li><strong>Custom rendering:</strong> Full control over calendar grid, cells, and navigation</li>
            <li><strong>State management:</strong> React Stately for robust state handling</li>
            <li><strong>TypeScript first:</strong> Excellent type safety throughout</li>
          </ul>
          
          <h3 style={{ margin: '16px 0 8px 0', fontSize: '16px' }}>Evaluation Criteria:</h3>
          <p style={{ margin: '0 0 8px 0' }}><strong>Pros:</strong> Best-in-class accessibility, robust date handling, excellent TypeScript support</p>
          <p style={{ margin: 0 }}><strong>Cons:</strong> Larger bundle size, more complex API, learning curve for @internationalized/date</p>
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
            {ariaDateRange.start && `From: ${ariaDateRange.start.toDate(getLocalTimeZone()).toLocaleDateString()}`}
            {ariaDateRange.end && ` | To: ${ariaDateRange.end.toDate(getLocalTimeZone()).toLocaleDateString()}`}
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
            <li><strong>Prop getters pattern:</strong> Provides button props via dayButton, nextMonthButton, etc.</li>
            <li><strong>Minimal API:</strong> Simple configuration with powerful features</li>
            <li><strong>Range selection:</strong> Built-in range mode with toggle and limit options</li>
            <li><strong>Multiple calendar support:</strong> Easy two-month view with offsets</li>
            <li><strong>Lightweight:</strong> Small bundle size with no external dependencies</li>
          </ul>
          
          <h3 style={{ margin: '16px 0 8px 0', fontSize: '16px' }}>Evaluation Criteria:</h3>
          <p style={{ margin: '0 0 8px 0' }}><strong>Pros:</strong> Smallest bundle, clean API, excellent TypeScript support, very performant</p>
          <p style={{ margin: 0 }}><strong>Cons:</strong> Less feature-rich than React Aria, smaller community, fewer built-in accessibility features</p>
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