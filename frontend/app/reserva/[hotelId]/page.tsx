'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format, differenceInDays, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Star,
  MapPin,
  Calendar,
  Users,
  Check,
  ChevronRight,
  Shield,
  Clock,
  CreditCard,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AvailabilityCalendar } from '@/components/booking/availability-calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { mockHoteles, mockUser, generateMockDisponibilidad } from '@/lib/mock-data';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function ReservaContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const hotelId = params.hotelId as string;
  const habitacionId = searchParams.get('habitacion');
  const initialCheckIn = searchParams.get('checkIn');
  const initialCheckOut = searchParams.get('checkOut');

  const hotel = mockHoteles.find((h) => h.id === hotelId);
  const habitacion = hotel?.habitaciones.find((h) => h.id === habitacionId) || hotel?.habitaciones[0];

  const [user] = useState(mockUser);
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    initialCheckIn ? new Date(initialCheckIn) : addDays(new Date(), 7)
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    initialCheckOut ? new Date(initialCheckOut) : addDays(new Date(), 9)
  );
  const [huespedes, setHuespedes] = useState(2);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    solicitudesEspeciales: '',
  });

  const disponibilidad = useMemo(() => {
    if (!habitacion) return [];
    const now = new Date();
    return generateMockDisponibilidad(habitacion.id, now.getMonth() + 1, now.getFullYear());
  }, [habitacion]);

  const nights = useMemo(() => {
    if (checkIn && checkOut) {
      return differenceInDays(checkOut, checkIn);
    }
    return 2;
  }, [checkIn, checkOut]);

  const pricing = useMemo(() => {
    if (!habitacion) return null;
    const subtotal = habitacion.precio * nights;
    const impuestos = Math.round(subtotal * 0.19);
    const servicios = Math.round(subtotal * 0.05);
    const total = subtotal + impuestos + servicios;
    return { subtotal, impuestos, servicios, total };
  }, [habitacion, nights]);

  if (!hotel || !habitacion) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header user={user} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Reserva no encontrada</h1>
            <Button asChild>
              <Link href="/hoteles">Volver a la búsqueda</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSelectRange = (newCheckIn: Date, newCheckOut: Date) => {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push(`/pago?reserva=new&hotel=${hotelId}&total=${pricing?.total}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />

      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/hotel/${hotel.id}`} className="hover:text-foreground">{hotel.nombre}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Reservar</span>
          </nav>
        </div>
      </div>

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[
              { num: 1, label: 'Fechas' },
              { num: 2, label: 'Datos' },
              { num: 3, label: 'Confirmar' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-medium ${
                    step >= s.num
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span className={`ml-2 ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
                {i < 2 && <ChevronRight className="h-4 w-4 mx-4 text-muted-foreground" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Dates */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Selecciona tus fechas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AvailabilityCalendar
                      disponibilidad={disponibilidad}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onSelectRange={handleSelectRange}
                    />

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Label>Huéspedes:</Label>
                        <select
                          value={huespedes}
                          onChange={(e) => setHuespedes(Number(e.target.value))}
                          className="border border-input rounded-md px-3 py-1"
                        >
                          {Array.from({ length: habitacion.capacidad }).map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i === 0 ? 'huésped' : 'huéspedes'}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button
                        onClick={() => setStep(2)}
                        disabled={!checkIn || !checkOut}
                      >
                        Continuar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Guest Details */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Datos del huésped principal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre *</Label>
                        <Input
                          id="nombre"
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellido">Apellido *</Label>
                        <Input
                          id="apellido"
                          value={formData.apellido}
                          onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono *</Label>
                        <Input
                          id="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="solicitudes">Solicitudes especiales (opcional)</Label>
                      <textarea
                        id="solicitudes"
                        className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background resize-none"
                        placeholder="Ej: Llegamos tarde, habitación en piso alto, etc."
                        value={formData.solicitudesEspeciales}
                        onChange={(e) => setFormData({ ...formData, solicitudesEspeciales: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-between pt-4 border-t border-border">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Atrás
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={!formData.nombre || !formData.apellido || !formData.email || !formData.telefono}
                      >
                        Continuar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        Confirma tu reserva
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Booking Summary */}
                      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground">Check-in</p>
                          <p className="font-medium">{checkIn && format(checkIn, 'EEEE, dd MMMM yyyy', { locale: es })}</p>
                          <p className="text-sm text-muted-foreground">Desde las 15:00</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Check-out</p>
                          <p className="font-medium">{checkOut && format(checkOut, 'EEEE, dd MMMM yyyy', { locale: es })}</p>
                          <p className="text-sm text-muted-foreground">Hasta las 12:00</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Huésped principal</h4>
                        <p>{formData.nombre} {formData.apellido}</p>
                        <p className="text-sm text-muted-foreground">{formData.email}</p>
                        <p className="text-sm text-muted-foreground">{formData.telefono}</p>
                      </div>

                      {/* Policies */}
                      <div className="space-y-3 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <Shield className="h-4 w-4" />
                          <span className="font-medium">Cancelación gratuita hasta 24h antes</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-700">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">Confirmación inmediata</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-700">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-medium">Pago seguro</span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4 border-t border-border">
                        <Button variant="outline" onClick={() => setStep(2)}>
                          Atrás
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Spinner className="mr-2 h-4 w-4" />
                              Procesando...
                            </>
                          ) : (
                            'Continuar al pago'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Sidebar - Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-4">
                  {/* Hotel Info */}
                  <div className="flex gap-4 mb-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
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
                          <Star key={i} className="h-3 w-3 fill-rating text-rating" />
                        ))}
                      </div>
                      <h3 className="font-semibold line-clamp-2">{hotel.nombre}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {hotel.ciudad}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Room Info */}
                  <div className="mb-4">
                    <h4 className="font-medium">{habitacion.nombre}</h4>
                    <p className="text-sm text-muted-foreground">
                      {huespedes} {huespedes === 1 ? 'huésped' : 'huéspedes'} · {nights} {nights === 1 ? 'noche' : 'noches'}
                    </p>
                    {checkIn && checkOut && (
                      <p className="text-sm text-muted-foreground">
                        {format(checkIn, 'dd MMM', { locale: es })} - {format(checkOut, 'dd MMM', { locale: es })}
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Pricing */}
                  {pricing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{formatPrice(habitacion.precio)} x {nights} noches</span>
                        <span>{formatPrice(pricing.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Impuestos (19%)</span>
                        <span>{formatPrice(pricing.impuestos)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cargo por servicio</span>
                        <span>{formatPrice(pricing.servicios)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(pricing.total)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground text-right">
                        Incluye todos los impuestos y cargos
                      </p>
                    </div>
                  )}
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

export default function ReservaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    }>
      <ReservaContent />
    </Suspense>
  );
}
