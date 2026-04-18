'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Shield, Clock, ThumbsUp, ChevronRight, TrendingUp } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SearchBox } from '@/components/search/search-box';
import { HotelCard } from '@/components/hotels/hotel-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockDestinos, mockHoteles, mockUser } from '@/lib/mock-data';

const features = [
  {
    icon: Shield,
    title: 'Reserva con confianza',
    description: 'Cancela gratis en la mayoría de hoteles hasta 24h antes de tu llegada',
  },
  {
    icon: ThumbsUp,
    title: 'Mejor precio garantizado',
    description: 'Si encuentras un precio mejor, te devolvemos la diferencia',
  },
  {
    icon: Clock,
    title: 'Soporte 24/7',
    description: 'Estamos aquí para ayudarte en cualquier momento del día',
  },
];

const ofertas = [
  { id: '1', descuento: 25, titulo: 'Escapada de verano', descripcion: 'Ahorra en hoteles de playa' },
  { id: '2', descuento: 15, titulo: 'Negocios inteligentes', descripcion: 'Descuentos en hoteles ejecutivos' },
  { id: '3', descuento: 30, titulo: 'Reserva anticipada', descripcion: 'Planifica con anticipación y ahorra' },
];

export default function HomePage() {
  const [user] = useState(mockUser);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />

      {/* Hero Section */}
      <section className="relative bg-header text-header-foreground">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=600&fit=crop"
            alt="Hotel de lujo"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              Encuentra tu próxima estancia perfecta
            </h1>
            <p className="text-lg md:text-xl text-header-foreground/80">
              Explora ofertas en hoteles, apartamentos y más en todo el mundo
            </p>
          </div>
          <SearchBox className="max-w-5xl" />
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-secondary/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="shrink-0 p-3 rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* Offers Section */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Ofertas especiales</h2>
                <p className="text-muted-foreground">Promociones y descuentos que no querrás perderte</p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/ofertas">
                  Ver todas <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ofertas.map((oferta) => (
                <Card key={oferta.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
                    <Badge className="bg-accent text-accent-foreground mb-3">
                      -{oferta.descuento}%
                    </Badge>
                    <h3 className="text-lg font-semibold mb-1">{oferta.titulo}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{oferta.descripcion}</p>
                    <Button variant="link" className="p-0 h-auto">
                      Ver ofertas <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-12 bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Destinos populares</h2>
                <p className="text-muted-foreground">Los lugares más buscados por nuestros viajeros</p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/destinos">
                  Explorar todos <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {mockDestinos.map((destino) => (
                <Link
                  key={destino.destino}
                  href={`/hoteles?destino=${destino.destino.toLowerCase()}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={destino.imagen}
                        alt={destino.destino}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-foreground">{destino.destino}</h3>
                      <p className="text-sm text-muted-foreground">{destino.hoteles} hoteles</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Hotels */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Tendencias ahora</h2>
                  <p className="text-muted-foreground">Los hoteles más reservados esta semana</p>
                </div>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/hoteles">
                  Ver más <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockHoteles.slice(0, 3).map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        </section>

        {/* Top Rated Hotels */}
        <section className="py-12 bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-rating fill-rating" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Mejor calificados</h2>
                  <p className="text-muted-foreground">Hoteles con las mejores reseñas de huéspedes</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockHoteles
                .sort((a, b) => b.calificacionPromedio - a.calificacionPromedio)
                .slice(0, 3)
                .map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-header text-header-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Recibe ofertas exclusivas en tu correo
            </h2>
            <p className="text-header-foreground/80 mb-6 max-w-2xl mx-auto">
              Suscríbete a nuestro boletín y sé el primero en enterarte de nuestras mejores promociones y descuentos especiales.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 rounded-lg bg-header-foreground/10 border border-header-foreground/20 text-header-foreground placeholder:text-header-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                Suscribirse
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
