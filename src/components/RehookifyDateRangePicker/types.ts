export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface RehookifyDateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}