export interface DateRange {
  start?: Date;
  end?: Date;
}

export interface ReactAriaDateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}