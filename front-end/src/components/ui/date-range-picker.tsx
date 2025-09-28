'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface DatePickerWithRangeProps {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({ date, onDateChange }: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onDateChange?.(undefined);
      return;
    }

    if (!date?.from || (date.from && date.to)) {
      // Start new range
      onDateChange?.({ from: selectedDate, to: undefined });
    } else if (date.from && !date.to) {
      // Complete range
      if (selectedDate >= date.from) {
        onDateChange?.({ from: date.from, to: selectedDate });
        setIsOpen(false);
      } else {
        onDateChange?.({ from: selectedDate, to: date.from });
        setIsOpen(false);
      }
    }
  };

  const formatDateRange = () => {
    if (!date?.from) return 'Chọn khoảng thời gian';
    if (!date.to) return format(date.from, 'dd/MM/yyyy', { locale: vi });
    return `${format(date.from, 'dd/MM/yyyy', { locale: vi })} - ${format(date.to, 'dd/MM/yyyy', { locale: vi })}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date?.from}
          onSelect={handleSelect}
          numberOfMonths={2}
          locale={vi}
        />
        <div className="p-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onDateChange?.(undefined);
              setIsOpen(false);
            }}
          >
            Xóa
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}