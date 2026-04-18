'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grid3X3, List, ArrowUpDown } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SearchBox } from '@/components/search/search-box';
import { HotelCard } from '@/components/hotels/hotel-card';
import { HotelFilters } from '@/components/hotels/hotel-filters';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { mockHoteles, mockUser } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

function HotelesContent() {
  const searchParams = useSearchParams();
  const destino = searchParams.get('destino') || '';
  
  const [user] = useState(mockUser);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('recommended');
  const [filters, setFilters] = useState({
    precioMin: 0,
    precioMax: 2000000,
    estrellas: [] as number[],
    calificacionMin: 0,
    amenidades: [] as string[],
  });

  const filteredHotels = useMemo(() => {
    let hotels = [...mockHoteles];

    // Filter by destination
    if (destino) {
      hotels = hotels.filter((h) =>
        h.ciudad.toLowerCase().includes(destino.toLowerCase()) ||
        h.nombre.toLowerCase().includes(destino.toLowerCase())
      );
    }

    // Filter by price
    hotels = hotels.filter(
      (h) => h.precioMinimo >= filters.precioMin && h.precioMinimo <= filters.precioMax
    );

    // Filter by stars
    if (filters.estrellas.length > 0) {
      hotels = hotels.filter((h) => filters.estrellas.includes(h.estrellas));
    }

    // Filter by rating
    if (filters.calificacionMin > 0) {
      hotels = hotels.filter((h) => h.calificacionPromedio >= filters.calificacionMin);
    }

    // Filter by amenities
    if (filters.amenidades.length > 0) {
      hotels = hotels.filter((h) =>
        filters.amenidades.every((amenidad) => h.amenidades.includes(amenidad))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        hotels.sort((a, b) => a.precioMinimo - b.precioMinimo);
        break;
      case 'price-high':
        hotels.sort((a, b) => b.precioMinimo - a.precioMinimo);
        break;
      case 'rating':
        hotels.sort((a, b) => b.calificacionPromedio - a.calificacionPromedio);
        break;
      case 'stars':
        hotels.sort((a, b) => b.estrellas - a.estrellas);
        break;
      default:
        // recommended - mix of rating and reviews
        hotels.sort((a, b) => (b.calificacionPromedio * b.totalResenas) - (a.calificacionPromedio * a.totalResenas));
    }

    return hotels;
  }, [destino, filters, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />

      {/* Search Header */}
      <section className="bg-header py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SearchBox variant="compact" initialValues={{ destino }} />
        </div>
      </section>

      <main className="flex-1 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {destino ? `Hoteles en ${destino}` : 'Todos los hoteles'}
              </h1>
              <p className="text-muted-foreground">
                {filteredHotels.length} alojamientos encontrados
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filters Button - rendered inside HotelFilters */}
              <HotelFilters onFiltersChange={setFilters} initialFilters={filters} />

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recomendados</SelectItem>
                  <SelectItem value="price-low">Menor precio</SelectItem>
                  <SelectItem value="price-high">Mayor precio</SelectItem>
                  <SelectItem value="rating">Mejor calificación</SelectItem>
                  <SelectItem value="stars">Más estrellas</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex border border-border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={cn('rounded-r-none', viewMode === 'grid' && 'bg-muted')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={cn('rounded-l-none', viewMode === 'list' && 'bg-muted')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <HotelFilters onFiltersChange={setFilters} initialFilters={filters} />

            {/* Hotels Grid/List */}
            <div className="flex-1">
              {filteredHotels.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl font-medium text-foreground mb-2">
                    No se encontraron hoteles
                  </p>
                  <p className="text-muted-foreground">
                    Intenta modificar tus filtros o buscar en otro destino
                  </p>
                </div>
              ) : (
                <div
                  className={cn(
                    'gap-6',
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                      : 'flex flex-col'
                  )}
                >
                  {filteredHotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      variant={viewMode === 'list' ? 'horizontal' : 'default'}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function HotelesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    }>
      <HotelesContent />
    </Suspense>
  );
}
