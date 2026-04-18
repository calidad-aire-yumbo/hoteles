'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, MapPin, Calendar, Users, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface SearchBoxProps {
  className?: string;
  variant?: 'hero' | 'compact';
  initialValues?: {
    destino?: string;
    checkIn?: Date;
    checkOut?: Date;
    huespedes?: number;
    habitaciones?: number;
  };
}

export function SearchBox({ className, variant = 'hero', initialValues }: SearchBoxProps) {
  const router = useRouter();
  const [destino, setDestino] = useState(initialValues?.destino || '');
  const [checkIn, setCheckIn] = useState<Date | undefined>(initialValues?.checkIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(initialValues?.checkOut);
  const [huespedes, setHuespedes] = useState(initialValues?.huespedes || 2);
  const [habitaciones, setHabitaciones] = useState(initialValues?.habitaciones || 1);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destino) params.set('destino', destino);
    if (checkIn) params.set('checkIn', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.set('checkOut', format(checkOut, 'yyyy-MM-dd'));
    params.set('huespedes', huespedes.toString());
    params.set('habitaciones', habitaciones.toString());
    
    router.push(`/hoteles?${params.toString()}`);
  };

  const isHero = variant === 'hero';

  return (
    <div className={cn(
      'bg-accent rounded-lg p-1',
      isHero ? 'shadow-lg' : 'shadow-sm',
      className
    )}>
      <div className={cn(
        'bg-card rounded-md',
        isHero 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-0'
          : 'flex flex-wrap gap-2 p-2'
      )}>
        {/* Destination */}
        <div className={cn(
          'relative flex items-center',
          isHero && 'border-b md:border-b-0 md:border-r border-border'
        )}>
          <MapPin className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="¿A dónde vas?"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className={cn(
              'border-0 pl-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent',
              isHero ? 'h-16 text-base' : 'h-10'
            )}
          />
        </div>

        {/* Dates */}
        <div className={cn(
          'flex',
          isHero && 'border-b md:border-b-0 md:border-r border-border'
        )}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'flex-1 justify-start rounded-none border-r border-border',
                  isHero ? 'h-16 px-4' : 'h-10 px-3'
                )}
              >
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Check-in</p>
                  <p className={cn('font-medium', !checkIn && 'text-muted-foreground')}>
                    {checkIn ? format(checkIn, 'dd MMM', { locale: es }) : 'Fecha'}
                  </p>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'flex-1 justify-start rounded-none',
                  isHero ? 'h-16 px-4' : 'h-10 px-3'
                )}
              >
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Check-out</p>
                  <p className={cn('font-medium', !checkOut && 'text-muted-foreground')}>
                    {checkOut ? format(checkOut, 'dd MMM', { locale: es }) : 'Fecha'}
                  </p>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => date < (checkIn || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className={cn(
          isHero && 'border-b lg:border-b-0 lg:border-r border-border'
        )}>
          <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start rounded-none',
                  isHero ? 'h-16 px-4' : 'h-10 px-3'
                )}
              >
                <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Huéspedes</p>
                  <p className="font-medium">
                    {huespedes} huéspedes · {habitaciones} hab.
                  </p>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Huéspedes</p>
                    <p className="text-sm text-muted-foreground">Número de personas</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setHuespedes(Math.max(1, huespedes - 1))}
                      disabled={huespedes <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{huespedes}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setHuespedes(Math.min(10, huespedes + 1))}
                      disabled={huespedes >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Habitaciones</p>
                    <p className="text-sm text-muted-foreground">Número de habitaciones</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setHabitaciones(Math.max(1, habitaciones - 1))}
                      disabled={habitaciones <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{habitaciones}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setHabitaciones(Math.min(5, habitaciones + 1))}
                      disabled={habitaciones >= 5}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button className="w-full" onClick={() => setGuestsOpen(false)}>
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className={cn(
            'bg-primary hover:bg-primary/90 text-primary-foreground',
            isHero ? 'h-16 px-8 rounded-l-none' : 'h-10 px-6'
          )}
        >
          <Search className="h-5 w-5 mr-2" />
          Buscar
        </Button>
      </div>
    </div>
  );
}
