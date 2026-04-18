'use client';

import Image from 'next/image';
import { Users, Wifi, Tv, Wind, Coffee, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Habitacion } from '@/lib/types';

interface RoomCardProps {
  room: Habitacion;
  nights: number;
  onSelect: (room: Habitacion) => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="h-4 w-4" />,
  'TV': <Tv className="h-4 w-4" />,
  'Aire acondicionado': <Wind className="h-4 w-4" />,
  'Minibar': <Coffee className="h-4 w-4" />,
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function RoomCard({ room, nights, onSelect }: RoomCardProps) {
  const totalPrice = room.precio * nights;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0">
          <Image
            src={room.imagenes[0]}
            alt={room.nombre}
            fill
            className="object-cover"
          />
          {!room.disponible && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-base">No disponible</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4 flex flex-col md:flex-row">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Badge variant="secondary" className="mb-2">{room.tipo}</Badge>
                <h3 className="text-lg font-semibold text-foreground">{room.nombre}</h3>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{room.descripcion}</p>

            {/* Capacity */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Users className="h-4 w-4" />
              <span>Hasta {room.capacidad} huéspedes</span>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-3 mb-3">
              {room.amenidades.slice(0, 6).map((amenidad) => (
                <div key={amenidad} className="flex items-center gap-1 text-sm text-muted-foreground">
                  {amenityIcons[amenidad] || <Check className="h-4 w-4" />}
                  <span>{amenidad}</span>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Cancelación gratuita
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Paga en el hotel
              </Badge>
            </div>
          </div>

          {/* Price & Book */}
          <div className="mt-4 md:mt-0 md:ml-6 md:border-l md:pl-6 border-border flex flex-col justify-between text-right shrink-0 md:w-48">
            <div>
              <p className="text-sm text-muted-foreground">
                {nights} {nights === 1 ? 'noche' : 'noches'}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatPrice(totalPrice)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(room.precio)} / noche
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Incluye impuestos y cargos
              </p>
            </div>

            <Button
              onClick={() => onSelect(room)}
              disabled={!room.disponible}
              className="mt-4 w-full"
            >
              {room.disponible ? 'Reservar' : 'No disponible'}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
