'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Heart, Wifi, Car, Coffee, Dumbbell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Hotel } from '@/lib/types';

interface HotelCardProps {
  hotel: Hotel;
  variant?: 'default' | 'horizontal';
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi gratis': <Wifi className="h-4 w-4" />,
  'Estacionamiento': <Car className="h-4 w-4" />,
  'Desayuno incluido': <Coffee className="h-4 w-4" />,
  'Gimnasio': <Dumbbell className="h-4 w-4" />,
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getRatingLabel(rating: number): string {
  if (rating >= 9) return 'Excepcional';
  if (rating >= 8) return 'Muy bueno';
  if (rating >= 7) return 'Bueno';
  return 'Aceptable';
}

export function HotelCard({ hotel, variant = 'default', onFavorite, isFavorite }: HotelCardProps) {
  const isHorizontal = variant === 'horizontal';

  return (
    <Card className={cn(
      'group overflow-hidden transition-shadow hover:shadow-lg',
      isHorizontal && 'flex flex-col md:flex-row'
    )}>
      {/* Image */}
      <div className={cn(
        'relative overflow-hidden',
        isHorizontal ? 'md:w-72 h-48 md:h-auto' : 'aspect-[4/3]'
      )}>
        <Image
          src={hotel.imagenes[0]}
          alt={hotel.nombre}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            onFavorite?.(hotel.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/80 hover:bg-card transition-colors"
        >
          <Heart className={cn('h-5 w-5', isFavorite ? 'fill-destructive text-destructive' : 'text-foreground')} />
        </button>
        {hotel.calificacionPromedio >= 9 && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            Top rated
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className={cn('flex-1 p-4', isHorizontal && 'flex flex-col')}>
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: hotel.estrellas }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-rating text-rating" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">Hotel</span>
              </div>
              <Link href={`/hotel/${hotel.id}`}>
                <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                  {hotel.nombre}
                </h3>
              </Link>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <p className="text-xs font-medium">{getRatingLabel(hotel.calificacionPromedio)}</p>
                <p className="text-xs text-muted-foreground">{hotel.totalResenas} reseñas</p>
              </div>
              <div className="bg-primary text-primary-foreground text-sm font-bold px-2 py-1 rounded-lg rounded-bl-none">
                {hotel.calificacionPromedio.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span>{hotel.ciudad}, {hotel.pais}</span>
            <span className="text-primary hover:underline cursor-pointer ml-1">Ver en mapa</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-3">
            {hotel.amenidades.slice(0, 4).map((amenidad) => (
              <span key={amenidad} className="text-xs text-muted-foreground flex items-center gap-1">
                {amenityIcons[amenidad] || null}
                {amenidad}
              </span>
            ))}
          </div>

          {/* Description (horizontal only) */}
          {isHorizontal && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {hotel.descripcion}
            </p>
          )}
        </div>

        {/* Price */}
        <div className={cn(
          'flex items-end justify-between pt-3 border-t border-border',
          isHorizontal && 'mt-auto'
        )}>
          <div>
            <p className="text-xs text-muted-foreground">Desde</p>
            <p className="text-xl font-bold text-foreground">{formatPrice(hotel.precioMinimo)}</p>
            <p className="text-xs text-muted-foreground">por noche</p>
          </div>
          <Button asChild>
            <Link href={`/hotel/${hotel.id}`}>Ver disponibilidad</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
