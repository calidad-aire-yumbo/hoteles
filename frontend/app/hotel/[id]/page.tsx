'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Star,
  MapPin,
  Heart,
  Share2,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Utensils,
  Sparkles,
  ChevronRight,
  Check,
  Calendar,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HotelGallery } from '@/components/hotels/hotel-gallery';
import { HotelReviews } from '@/components/hotels/hotel-reviews';
import { RoomCard } from '@/components/hotels/room-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockHoteles, mockUser, mockCalificaciones } from '@/lib/mock-data';
import type { Habitacion } from '@/lib/types';

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi gratis': <Wifi className="h-5 w-5" />,
  'Piscina': <Waves className="h-5 w-5" />,
  'Spa': <Sparkles className="h-5 w-5" />,
  'Gimnasio': <Dumbbell className="h-5 w-5" />,
  'Restaurante': <Utensils className="h-5 w-5" />,
  'Estacionamiento': <Car className="h-5 w-5" />,
  'Desayuno incluido': <Coffee className="h-5 w-5" />,
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

export default function HotelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const hotelId = params.id as string;

  const hotel = mockHoteles.find((h) => h.id === hotelId);
  const [user] = useState(mockUser);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  const nights = useMemo(() => {
    if (checkIn && checkOut) {
      return differenceInDays(checkOut, checkIn);
    }
    return 1;
  }, [checkIn, checkOut]);

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header user={user} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Hotel no encontrado</h1>
            <Button asChild>
              <Link href="/hoteles">Volver a la búsqueda</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleRoomSelect = (room: Habitacion) => {
    const params = new URLSearchParams();
    params.set('habitacion', room.id);
    if (checkIn) params.set('checkIn', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.set('checkOut', format(checkOut, 'yyyy-MM-dd'));
    router.push(`/reserva/${hotel.id}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/50 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Inicio</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/hoteles" className="hover:text-foreground">Hoteles</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/hoteles?destino=${hotel.ciudad}`} className="hover:text-foreground">
                {hotel.ciudad}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{hotel.nombre}</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: hotel.estrellas }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-rating text-rating" />
                ))}
                <Badge variant="secondary" className="ml-2">Hotel</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {hotel.nombre}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{hotel.direccion}, {hotel.ciudad}</span>
                </div>
                <button className="text-primary hover:underline">Ver en mapa</button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={isFavorite ? 'fill-destructive text-destructive' : ''} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm font-medium">{getRatingLabel(hotel.calificacionPromedio)}</p>
                    <p className="text-xs text-muted-foreground">{hotel.totalResenas} reseñas</p>
                  </div>
                  <div className="bg-primary text-primary-foreground text-lg font-bold px-3 py-2 rounded-lg rounded-bl-none">
                    {hotel.calificacionPromedio.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <HotelGallery images={hotel.imagenes} hotelName={hotel.nombre} />

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="info">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="rooms">Habitaciones</TabsTrigger>
                  <TabsTrigger value="amenities">Servicios</TabsTrigger>
                  <TabsTrigger value="reviews">Reseñas</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Descripción</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {hotel.descripcion}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Servicios destacados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {hotel.amenidades.map((amenidad) => (
                          <div key={amenidad} className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              {amenityIcons[amenidad] || <Check className="h-5 w-5" />}
                            </div>
                            <span className="text-sm">{amenidad}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="rooms" className="mt-6 space-y-4">
                  {hotel.habitaciones.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      nights={nights}
                      onSelect={handleRoomSelect}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="amenities" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {hotel.amenidades.map((amenidad) => (
                          <div key={amenidad} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              {amenityIcons[amenidad] || <Check className="h-5 w-5" />}
                            </div>
                            <span>{amenidad}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <HotelReviews
                    reviews={mockCalificaciones}
                    promedio={hotel.calificacionPromedio}
                    total={hotel.totalResenas}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Booking Widget */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Reservar</span>
                    <Badge className="bg-accent text-accent-foreground">
                      Mejor precio
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start h-auto py-3">
                          <Calendar className="mr-2 h-4 w-4" />
                          <div className="text-left">
                            <p className="text-xs text-muted-foreground">Check-in</p>
                            <p className="font-medium">
                              {checkIn ? format(checkIn, 'dd MMM', { locale: es }) : 'Seleccionar'}
                            </p>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start h-auto py-3">
                          <Calendar className="mr-2 h-4 w-4" />
                          <div className="text-left">
                            <p className="text-xs text-muted-foreground">Check-out</p>
                            <p className="font-medium">
                              {checkOut ? format(checkOut, 'dd MMM', { locale: es }) : 'Seleccionar'}
                            </p>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => date < (checkIn || new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Price Info */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Desde</span>
                      <span className="text-2xl font-bold">{formatPrice(hotel.precioMinimo)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      por noche · impuestos incluidos
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="h-4 w-4" />
                      <span>Cancelación gratuita</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="h-4 w-4" />
                      <span>No necesitas pagar ahora</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="h-4 w-4" />
                      <span>Confirmación inmediata</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" asChild>
                    <a href="#rooms">Ver habitaciones disponibles</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
