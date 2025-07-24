export const styles = {
  trigger: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    minWidth: '200px',
    textAlign: 'left' as const,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triggerDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  popover: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: '4px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    zIndex: 1000,
    padding: '16px',
  },
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  container: {
    position: 'relative' as const,
  },
  calendar: {
    '--rdp-cell-size': '40px',
    '--rdp-accent-color': '#3b82f6',
    '--rdp-background-color': '#eff6ff',
    '--rdp-outline': '2px solid var(--rdp-accent-color)',
    '--rdp-outline-selected': '2px solid rgba(0, 0, 0, 0.75)',
  } as React.CSSProperties,
  calendarMonths: {
    display: 'flex',
    gap: '20px',
  },
  chevron: {
    width: '16px',
    height: '16px',
    fill: 'currentColor',
  }
};