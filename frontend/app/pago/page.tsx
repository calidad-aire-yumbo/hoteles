'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CreditCard,
  Lock,
  Shield,
  Check,
  ChevronRight,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { mockUser, mockHoteles } from '@/lib/mock-data';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function PagoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const total = Number(searchParams.get('total')) || 1500000;
  const hotelId = searchParams.get('hotel') || '1';
  const hotel = mockHoteles.find((h) => h.id === hotelId);

  const [user] = useState(mockUser);
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2500));
      router.push('/pago/confirmacion');
    } catch {
      setError('Error al procesar el pago. Intenta nuevamente.');
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />

      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/reservas" className="hover:text-foreground">Reservas</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Pago</span>
          </nav>
        </div>
      </div>

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <Lock className="h-10 w-10 mx-auto text-primary mb-4" />
            <h1 className="text-3xl font-bold text-foreground">Pago seguro</h1>
            <p className="text-muted-foreground">
              Tu información está protegida con encriptación SSL
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-3">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                  </div>
                )}

                {/* Payment Method Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Método de pago</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="grid grid-cols-1 gap-4">
                        <label
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                            paymentMethod === 'tarjeta'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <RadioGroupItem value="tarjeta" />
                            <div>
                              <p className="font-medium">Tarjeta de crédito o débito</p>
                              <p className="text-sm text-muted-foreground">
                                Visa, Mastercard, American Express
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} height={25} className="h-6 w-auto" />
                            <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" width={40} height={25} className="h-6 w-auto" />
                          </div>
                        </label>

                        <label
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                            paymentMethod === 'pse'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <RadioGroupItem value="pse" />
                            <div>
                              <p className="font-medium">PSE - Débito bancario</p>
                              <p className="text-sm text-muted-foreground">
                                Pago directo desde tu banco
                              </p>
                            </div>
                          </div>
                          <Building2 className="h-8 w-8 text-muted-foreground" />
                        </label>

                        <label
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                            paymentMethod === 'paypal'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <RadioGroupItem value="paypal" />
                            <div>
                              <p className="font-medium">PayPal</p>
                              <p className="text-sm text-muted-foreground">
                                Paga con tu cuenta PayPal
                              </p>
                            </div>
                          </div>
                          <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width={60} height={25} className="h-6 w-auto" />
                        </label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Card Details */}
                {paymentMethod === 'tarjeta' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Datos de la tarjeta
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número de tarjeta</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardData.number}
                          onChange={(e) =>
                            setCardData({ ...cardData, number: formatCardNumber(e.target.value) })
                          }
                          maxLength={19}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                        <Input
                          id="cardName"
                          placeholder="NOMBRE COMPLETO"
                          value={cardData.name}
                          onChange={(e) =>
                            setCardData({ ...cardData, name: e.target.value.toUpperCase() })
                          }
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Fecha de expiración</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/AA"
                            value={cardData.expiry}
                            onChange={(e) =>
                              setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })
                            }
                            maxLength={5}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            type="password"
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={(e) =>
                              setCardData({
                                ...cardData,
                                cvv: e.target.value.replace(/\D/g, '').slice(0, 4),
                              })
                            }
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Procesando pago...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pagar {formatPrice(total)}
                    </>
                  )}
                </Button>

                {/* Security badges */}
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>SSL Seguro</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    <span>PCI DSS Compliant</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Resumen de la orden</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hotel && (
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={hotel.imagenes[0]}
                          alt={hotel.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-2">{hotel.nombre}</p>
                        <p className="text-sm text-muted-foreground">{hotel.ciudad}</p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(Math.round(total / 1.24))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impuestos (19%)</span>
                      <span>{formatPrice(Math.round(total * 0.19 / 1.24))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cargo por servicio</span>
                      <span>{formatPrice(Math.round(total * 0.05 / 1.24))}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg text-sm">
                    <div className="flex items-center gap-2 text-green-700 font-medium mb-1">
                      <Check className="h-4 w-4" />
                      Cancelación gratuita
                    </div>
                    <p className="text-green-600 text-xs">
                      Hasta 24 horas antes del check-in
                    </p>
                  </div>
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

export default function PagoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    }>
      <PagoContent />
    </Suspense>
  );
}
