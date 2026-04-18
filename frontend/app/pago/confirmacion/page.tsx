'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CheckCircle,
  Calendar,
  MapPin,
  Download,
  Mail,
  Phone,
  Star,
  Share2,
  Printer,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Confetti from 'react-confetti';
import { mockUser, mockHoteles } from '@/lib/mock-data';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ConfirmacionPage() {
  const [user] = useState(mockUser);
  const [showConfetti, setShowConfetti] = useState(true);
  const hotel = mockHoteles[0];
  const checkIn = addDays(new Date(), 7);
  const checkOut = addDays(new Date(), 9);
  const reservaId = `SB${Date.now().toString().slice(-8)}`;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 0}
          height={typeof window !== 'undefined' ? window.innerHeight : 0}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <Header user={user} />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              ¡Reserva confirmada!
            </h1>
            <p className="text-muted-foreground">
              Hemos enviado los detalles de tu reserva a{' '}
              <span className="font-medium text-foreground">{user.email}</span>
            </p>
          </div>

          {/* Booking Details Card */}
          <Card className="mb-6 overflow-hidden">
            <div className="bg-primary px-6 py-4">
              <div className="flex items-center justify-between text-primary-foreground">
                <div>
                  <p className="text-sm opacity-80">Número de confirmación</p>
                  <p className="text-2xl font-bold tracking-wide">{reservaId}</p>
                </div>
                <Button variant="secondary" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Hotel Info */}
              <div className="flex gap-4 mb-6">
                <div className="relative w-28 h-28 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={hotel.imagenes[0]}
                    alt={hotel.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {Array.from({ length: hotel.estrellas }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-rating text-rating" />
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold">{hotel.nombre}</h2>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {hotel.direccion}, {hotel.ciudad}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Check-in</span>
                  </div>
                  <p className="font-semibold">
                    {format(checkIn, 'EEEE, dd MMMM yyyy', { locale: es })}
                  </p>
                  <p className="text-sm text-muted-foreground">Desde las 15:00</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Check-out</span>
                  </div>
                  <p className="font-semibold">
                    {format(checkOut, 'EEEE, dd MMMM yyyy', { locale: es })}
                  </p>
                  <p className="text-sm text-muted-foreground">Hasta las 12:00</p>
                </div>
              </div>

              {/* Room & Guest */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Habitación</p>
                  <p className="font-medium">{hotel.habitaciones[1].nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Huésped principal</p>
                  <p className="font-medium">{user.nombre} {user.apellido}</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Price Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>2 noches x {formatPrice(hotel.habitaciones[1].precio)}</span>
                  <span>{formatPrice(hotel.habitaciones[1].precio * 2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Impuestos y cargos</span>
                  <span>{formatPrice(Math.round(hotel.habitaciones[1].precio * 2 * 0.24))}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total pagado</span>
                  <span>{formatPrice(Math.round(hotel.habitaciones[1].precio * 2 * 1.24))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hotel Contact */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Información de contacto del hotel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">+57 (5) 665-1234</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">reservas@hotelcaribe.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/reservas">Ver mis reservas</Link>
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            ¿Tienes preguntas?{' '}
            <Link href="/ayuda" className="text-primary hover:underline">
              Visita nuestro centro de ayuda
            </Link>{' '}
            o llámanos al{' '}
            <span className="font-medium text-foreground">01 800 123 4567</span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
