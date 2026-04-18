'use client';

import { useState } from 'react';
import { Star, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface HotelFiltersProps {
  onFiltersChange: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

interface FilterValues {
  precioMin: number;
  precioMax: number;
  estrellas: number[];
  calificacionMin: number;
  amenidades: string[];
}

const amenidadesOptions = [
  'WiFi gratis',
  'Piscina',
  'Spa',
  'Gimnasio',
  'Restaurante',
  'Bar',
  'Estacionamiento',
  'Desayuno incluido',
  'Playa privada',
  'Aire acondicionado',
  'Servicio a la habitación',
  'Pet friendly',
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function HotelFilters({ onFiltersChange, initialFilters }: HotelFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    precioMin: initialFilters?.precioMin || 0,
    precioMax: initialFilters?.precioMax || 2000000,
    estrellas: initialFilters?.estrellas || [],
    calificacionMin: initialFilters?.calificacionMin || 0,
    amenidades: initialFilters?.amenidades || [],
  });

  const updateFilters = (updates: Partial<FilterValues>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleEstrella = (star: number) => {
    const newEstrellas = filters.estrellas.includes(star)
      ? filters.estrellas.filter((s) => s !== star)
      : [...filters.estrellas, star];
    updateFilters({ estrellas: newEstrellas });
  };

  const toggleAmenidad = (amenidad: string) => {
    const newAmenidades = filters.amenidades.includes(amenidad)
      ? filters.amenidades.filter((a) => a !== amenidad)
      : [...filters.amenidades, amenidad];
    updateFilters({ amenidades: newAmenidades });
  };

  const clearFilters = () => {
    const defaultFilters: FilterValues = {
      precioMin: 0,
      precioMax: 2000000,
      estrellas: [],
      calificacionMin: 0,
      amenidades: [],
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.estrellas.length > 0 ||
    filters.amenidades.length > 0 ||
    filters.precioMin > 0 ||
    filters.precioMax < 2000000 ||
    filters.calificacionMin > 0;

  const FiltersContent = () => (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive">
          <X className="h-4 w-4 mr-1" /> Limpiar filtros
        </Button>
      )}

      <Accordion type="multiple" defaultValue={['precio', 'estrellas', 'calificacion', 'amenidades']}>
        {/* Price Range */}
        <AccordionItem value="precio">
          <AccordionTrigger className="text-sm font-semibold">Precio por noche</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 px-1">
              <Slider
                value={[filters.precioMin, filters.precioMax]}
                min={0}
                max={2000000}
                step={50000}
                onValueChange={([min, max]) => updateFilters({ precioMin: min, precioMax: max })}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatPrice(filters.precioMin)}</span>
                <span>{formatPrice(filters.precioMax)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Star Rating */}
        <AccordionItem value="estrellas">
          <AccordionTrigger className="text-sm font-semibold">Categoría del hotel</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center">
                  <Checkbox
                    id={`star-${star}`}
                    checked={filters.estrellas.includes(star)}
                    onCheckedChange={() => toggleEstrella(star)}
                  />
                  <Label htmlFor={`star-${star}`} className="ml-2 flex items-center cursor-pointer">
                    {Array.from({ length: star }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-rating text-rating" />
                    ))}
                    <span className="ml-1 text-muted-foreground">({star} estrellas)</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Guest Rating */}
        <AccordionItem value="calificacion">
          <AccordionTrigger className="text-sm font-semibold">Calificación de huéspedes</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[
                { min: 9, label: 'Excepcional (9+)' },
                { min: 8, label: 'Muy bueno (8+)' },
                { min: 7, label: 'Bueno (7+)' },
                { min: 6, label: 'Aceptable (6+)' },
              ].map(({ min, label }) => (
                <div key={min} className="flex items-center">
                  <Checkbox
                    id={`rating-${min}`}
                    checked={filters.calificacionMin === min}
                    onCheckedChange={() => updateFilters({ calificacionMin: filters.calificacionMin === min ? 0 : min })}
                  />
                  <Label htmlFor={`rating-${min}`} className="ml-2 cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Amenities */}
        <AccordionItem value="amenidades">
          <AccordionTrigger className="text-sm font-semibold">Servicios</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-2">
              {amenidadesOptions.map((amenidad) => (
                <div key={amenidad} className="flex items-center">
                  <Checkbox
                    id={`amenidad-${amenidad}`}
                    checked={filters.amenidades.includes(amenidad)}
                    onCheckedChange={() => toggleAmenidad(amenidad)}
                  />
                  <Label htmlFor={`amenidad-${amenidad}`} className="ml-2 cursor-pointer text-sm">
                    {amenidad}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 bg-card rounded-lg border border-border p-4">
          <h2 className="font-semibold mb-4">Filtrar por:</h2>
          <FiltersContent />
        </div>
      </aside>

      {/* Mobile Filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {filters.estrellas.length + filters.amenidades.length + (filters.calificacionMin > 0 ? 1 : 0)}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <FiltersContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
