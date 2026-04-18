'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Star, ThumbsUp, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Calificacion } from '@/lib/types';

interface HotelReviewsProps {
  reviews: Calificacion[];
  promedio: number;
  total: number;
}

function getRatingLabel(rating: number): string {
  if (rating >= 9) return 'Excepcional';
  if (rating >= 8) return 'Muy bueno';
  if (rating >= 7) return 'Bueno';
  return 'Aceptable';
}

function getRatingDistribution(reviews: Calificacion[]) {
  const distribution = { 10: 0, 9: 0, 8: 0, 7: 0, 6: 0 };
  reviews.forEach((review) => {
    const bucket = Math.floor(review.puntuacion) as keyof typeof distribution;
    if (distribution[bucket] !== undefined) {
      distribution[bucket]++;
    }
  });
  return distribution;
}

export function HotelReviews({ reviews, promedio, total }: HotelReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const distribution = getRatingDistribution(reviews);
  const maxCount = Math.max(...Object.values(distribution));

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground text-2xl font-bold px-3 py-2 rounded-lg rounded-bl-none">
            {promedio.toFixed(1)}
          </div>
          <div>
            <p className="text-lg font-semibold">{getRatingLabel(promedio)}</p>
            <p className="text-sm text-muted-foreground font-normal">
              Basado en {total} reseñas verificadas
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            {Object.entries(distribution)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([rating, count]) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-8 text-sm text-muted-foreground">{rating}+</span>
                  <Progress
                    value={maxCount > 0 ? (count / maxCount) * 100 : 0}
                    className="flex-1 h-2"
                  />
                  <span className="w-8 text-sm text-muted-foreground text-right">{count}</span>
                </div>
              ))}
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Limpieza', score: 9.2 },
              { label: 'Ubicación', score: 9.4 },
              { label: 'Servicio', score: 8.9 },
              { label: 'Confort', score: 9.1 },
              { label: 'Instalaciones', score: 8.8 },
              { label: 'Relación calidad-precio', score: 8.5 },
            ].map((category) => (
              <div key={category.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{category.label}</span>
                  <span className="font-medium">{category.score}</span>
                </div>
                <Progress value={category.score * 10} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="font-semibold">Reseñas de huéspedes</h4>

          {displayedReviews.map((review) => (
            <div key={review.id} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {review.usuario?.nombre?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {review.usuario?.nombre} {review.usuario?.apellido?.charAt(0)}.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(review.createdAt), "MMMM yyyy", { locale: es })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="bg-primary text-primary-foreground text-sm font-bold px-2 py-1 rounded">
                    {review.puntuacion}
                  </div>
                </div>
              </div>

              <h5 className="font-medium mb-2">{review.titulo}</h5>
              <p className="text-sm text-muted-foreground mb-3">{review.comentario}</p>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Útil
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Flag className="h-4 w-4 mr-1" />
                  Reportar
                </Button>
              </div>
            </div>
          ))}

          {reviews.length > 3 && (
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="w-full"
            >
              {showAll ? 'Ver menos reseñas' : `Ver las ${reviews.length} reseñas`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
