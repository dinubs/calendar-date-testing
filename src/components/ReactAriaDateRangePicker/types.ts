import { DateValue } from '@internationalized/date';

export interface DateRange {
  start?: DateValue;
  end?: DateValue;
}

export interface ReactAriaDateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}