'use client';

import { useState, useMemo } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Disponibilidad } from '@/lib/types';

interface AvailabilityCalendarProps {
  disponibilidad: Disponibilidad[];
  checkIn?: Date;
  checkOut?: Date;
  onSelectRange: (checkIn: Date, checkOut: Date) => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    notation: 'compact',
    maximumFractionDigits: 0,
  }).format(price);
}

export function AvailabilityCalendar({
  disponibilidad,
  checkIn,
  checkOut,
  onSelectRange,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selecting, setSelecting] = useState<'checkIn' | 'checkOut'>('checkIn');
  const [tempCheckIn, setTempCheckIn] = useState<Date | undefined>(checkIn);
  const [tempCheckOut, setTempCheckOut] = useState<Date | undefined>(checkOut);

  const disponibilidadMap = useMemo(() => {
    const map = new Map<string, Disponibilidad>();
    disponibilidad.forEach((d) => {
      map.set(d.fecha, d);
    });
    return map;
  }, [disponibilidad]);

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const firstDayOfWeek = startOfMonth(currentMonth).getDay();

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayInfo = disponibilidadMap.get(dateStr);
    
    if (!dayInfo?.disponible || isBefore(date, new Date())) return;

    if (selecting === 'checkIn') {
      setTempCheckIn(date);
      setTempCheckOut(undefined);
      setSelecting('checkOut');
    } else {
      if (tempCheckIn && date > tempCheckIn) {
        setTempCheckOut(date);
        onSelectRange(tempCheckIn, date);
        setSelecting('checkIn');
      } else {
        setTempCheckIn(date);
        setTempCheckOut(undefined);
      }
    }
  };

  const isInRange = (date: Date) => {
    if (!tempCheckIn || !tempCheckOut) return false;
    return isWithinInterval(date, { start: tempCheckIn, end: tempCheckOut });
  };

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}
          disabled={isSameMonth(currentMonth, new Date())}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-semibold text-lg capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for first week */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days */}
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayInfo = disponibilidadMap.get(dateStr);
          const isDisabled = !dayInfo?.disponible || isBefore(day, new Date());
          const isSelected = (tempCheckIn && isSameDay(day, tempCheckIn)) || (tempCheckOut && isSameDay(day, tempCheckOut));
          const isRange = isInRange(day);
          const isCheckIn = tempCheckIn && isSameDay(day, tempCheckIn);
          const isCheckOut = tempCheckOut && isSameDay(day, tempCheckOut);

          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(day)}
              disabled={isDisabled}
              className={cn(
                'aspect-square p-1 flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative',
                isDisabled && 'opacity-40 cursor-not-allowed bg-muted/50',
                !isDisabled && 'hover:bg-primary/10 cursor-pointer',
                isRange && 'bg-primary/20',
                isSelected && 'bg-primary text-primary-foreground',
                isCheckIn && 'rounded-r-none',
                isCheckOut && 'rounded-l-none',
                isToday(day) && !isSelected && 'ring-1 ring-primary'
              )}
            >
              <span className={cn('font-medium', isSelected && 'text-primary-foreground')}>
                {format(day, 'd')}
              </span>
              {dayInfo?.disponible && !isSelected && (
                <span className="text-[10px] text-muted-foreground">
                  {formatPrice(dayInfo.precio)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary" />
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary/20" />
          <span>Rango</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-muted" />
          <span>No disponible</span>
        </div>
      </div>

      {/* Selection Info */}
      <div className="p-3 bg-muted/50 rounded-lg text-center">
        <p className="text-sm">
          {selecting === 'checkIn' ? (
            'Selecciona tu fecha de check-in'
          ) : (
            tempCheckIn ? `Check-in: ${format(tempCheckIn, 'dd MMM', { locale: es })} - Selecciona check-out` : 'Selecciona tu fecha de check-in'
          )}
        </p>
      </div>
    </div>
  );
}
