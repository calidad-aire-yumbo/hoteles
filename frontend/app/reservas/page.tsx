'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Download,
  MessageSquare,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUser, mockReservas } from '@/lib/mock-data';
import type { Reserva } from '@/lib/types';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

const statusConfig: Record<Reserva['estado'], { label: string; color: string; icon: React.ReactNode }> = {
  confirmada: {
    label: 'Confirmada',
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  pendiente: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: <Clock className="h-4 w-4" />,
  },
  completada: {
    label: 'Completada',
    color: 'bg-blue-100 text-blue-800',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  cancelada: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800',
    icon: <XCircle className="h-4 w-4" />,
  },
};

function ReservaCard({ reserva }: { reserva: Reserva }) {
  const status = statusConfig[reserva.estado];
  const isUpcoming = new Date(reserva.fechaCheckIn) > new Date();
  const canCancel = isUpcoming && reserva.estado === 'confirmada';
  const canReview = reserva.estado === 'completada';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-56 h-40 md:h-auto shrink-0">
            <Image
              src={reserva.hotel?.imagenes[0] || ''}
              alt={reserva.hotel?.nombre || ''}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Badge className={status.color}>
                      {status.icon}
                      <span className="ml-1">{status.label}</span>
                    </Badge>
                    <Link href={`/hotel/${reserva.hotelId}`}>
                      <h3 className="text-lg font-semibold mt-2 hover:text-primary transition-colors">
                        {reserva.hotel?.nombre}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {reserva.hotel?.ciudad}, {reserva.hotel?.pais}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {Array.from({ length: reserva.hotel?.estrellas || 0 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-rating text-rating" />
                    ))}
                  </div>
                </div>

                {/* Room & Dates */}
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-2">{reserva.habitacion?.nombre}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Check-in</p>
                      <p className="font-medium">
                        {format(new Date(reserva.fechaCheckIn), 'EEE, dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Check-out</p>
                      <p className="font-medium">
                        {format(new Date(reserva.fechaCheckOut), 'EEE, dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="md:text-right md:pl-4 md:border-l md:border-border shrink-0">
                <p className="text-sm text-muted-foreground">Precio total</p>
                <p className="text-2xl font-bold">{formatPrice(reserva.precioTotal)}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Reserva #{reserva.id}
                </p>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/reserva/${reserva.hotelId}/${reserva.id}`}>
                      Ver detalles
                    </Link>
                  </Button>
                  
                  {canCancel && (
                    <Button variant="outline" size="sm" className="text-destructive">
                      Cancelar reserva
                    </Button>
                  )}

                  {canReview && (
                    <Button size="sm" asChild>
                      <Link href={`/calificar/${reserva.id}`}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Dejar reseña
                      </Link>
                    </Button>
                  )}

                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Descargar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReservasPage() {
  const [user] = useState(mockUser);
  const reservas = mockReservas;

  const upcoming = reservas.filter(
    (r) => new Date(r.fechaCheckIn) > new Date() && r.estado !== 'cancelada'
  );
  const past = reservas.filter(
    (r) => new Date(r.fechaCheckIn) <= new Date() || r.estado === 'completada'
  );
  const cancelled = reservas.filter((r) => r.estado === 'cancelada');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Mis reservas</h1>
            <p className="text-muted-foreground">
              Gestiona tus reservas actuales y pasadas
            </p>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">
                Próximas ({upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Pasadas ({past.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Canceladas ({cancelled.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcoming.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tienes reservas próximas</h3>
                    <p className="text-muted-foreground mb-4">
                      Explora nuestros destinos y reserva tu próxima estancia
                    </p>
                    <Button asChild>
                      <Link href="/hoteles">Buscar hoteles</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                upcoming.map((reserva) => (
                  <ReservaCard key={reserva.id} reserva={reserva} />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {past.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Sin reservas pasadas</h3>
                    <p className="text-muted-foreground">
                      Aquí aparecerán tus reservas completadas
                    </p>
                  </CardContent>
                </Card>
              ) : (
                past.map((reserva) => (
                  <ReservaCard key={reserva.id} reserva={reserva} />
                ))
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {cancelled.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Sin reservas canceladas</h3>
                    <p className="text-muted-foreground">
                      No tienes reservas canceladas
                    </p>
                  </CardContent>
                </Card>
              ) : (
                cancelled.map((reserva) => (
                  <ReservaCard key={reserva.id} reserva={reserva} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
