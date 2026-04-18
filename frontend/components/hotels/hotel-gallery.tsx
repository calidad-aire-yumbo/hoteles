'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface HotelGalleryProps {
  images: string[];
  hotelName: string;
}

export function HotelGallery({ images, hotelName }: HotelGalleryProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="relative grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden">
        {/* Main Image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer"
          onClick={() => {
            setCurrentIndex(0);
            setShowModal(true);
          }}
        >
          <Image
            src={images[0]}
            alt={`${hotelName} - Imagen principal`}
            fill
            className="object-cover hover:opacity-95 transition-opacity"
            priority
          />
        </div>

        {/* Secondary Images */}
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className={cn(
              'relative cursor-pointer',
              index === 3 && images.length > 5 && 'group'
            )}
            onClick={() => {
              setCurrentIndex(index + 1);
              setShowModal(true);
            }}
          >
            <Image
              src={image}
              alt={`${hotelName} - Imagen ${index + 2}`}
              fill
              className="object-cover hover:opacity-95 transition-opacity"
            />
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-background font-medium">
                  +{images.length - 5} fotos
                </span>
              </div>
            )}
          </div>
        ))}

        {/* View All Button */}
        <Button
          variant="secondary"
          className="absolute bottom-4 right-4 shadow-lg"
          onClick={() => {
            setCurrentIndex(0);
            setShowModal(true);
          }}
        >
          <Grid3X3 className="h-4 w-4 mr-2" />
          Ver todas las fotos
        </Button>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-screen-xl h-[90vh] p-0 bg-background/95 backdrop-blur-sm">
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {images.length}
              </span>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Image Container */}
            <div className="flex-1 relative flex items-center justify-center p-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-10 bg-background/80 hover:bg-background"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <div className="relative w-full h-full max-w-4xl max-h-[70vh]">
                <Image
                  src={images[currentIndex]}
                  alt={`${hotelName} - Imagen ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-10 bg-background/80 hover:bg-background"
                onClick={goToNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Thumbnails */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2 overflow-x-auto justify-center">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'relative w-16 h-16 rounded-md overflow-hidden shrink-0 ring-2 ring-offset-2 transition-all',
                      currentIndex === index
                        ? 'ring-primary'
                        : 'ring-transparent hover:ring-muted-foreground'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
