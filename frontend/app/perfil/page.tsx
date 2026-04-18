'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Shield,
  Bell,
  ChevronRight,
  Camera,
  Save,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { mockUser } from '@/lib/mock-data';

export default function PerfilPage() {
  const [user] = useState(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    telefono: user.telefono || '',
    direccion: '',
    ciudad: '',
    pais: 'Colombia',
  });

  const [preferences, setPreferences] = useState({
    emailOffers: true,
    emailBookings: true,
    emailReviews: true,
    smsReminders: false,
    twoFactorAuth: false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Mi perfil</h1>
            <p className="text-muted-foreground">
              Gestiona tu información personal y preferencias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="py-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                          {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <h2 className="mt-4 font-semibold text-lg">
                      {user.nombre} {user.apellido}
                    </h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Miembro desde {new Date(user.createdAt).getFullYear()}
                    </p>
                  </div>

                  <Separator className="my-6" />

                  <nav className="space-y-1">
                    <Link
                      href="/reservas"
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Mis reservas</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/favoritos"
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Favoritos</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/metodos-pago"
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>Métodos de pago</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs defaultValue="personal">
                <TabsList className="mb-6">
                  <TabsTrigger value="personal">Información personal</TabsTrigger>
                  <TabsTrigger value="security">Seguridad</TabsTrigger>
                  <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <Card>
                    <CardHeader>
                      <CardTitle>Información personal</CardTitle>
                      <CardDescription>
                        Actualiza tu información de contacto y datos personales
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombre">Nombre</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="nombre"
                              className="pl-10"
                              value={formData.nombre}
                              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apellido">Apellido</Label>
                          <Input
                            id="apellido"
                            value={formData.apellido}
                            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              className="pl-10"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefono">Teléfono</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="telefono"
                              type="tel"
                              className="pl-10"
                              value={formData.telefono}
                              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="direccion"
                            className="pl-10"
                            placeholder="Calle, número, apartamento"
                            value={formData.direccion}
                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ciudad">Ciudad</Label>
                          <Input
                            id="ciudad"
                            placeholder="Tu ciudad"
                            value={formData.ciudad}
                            onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pais">País</Label>
                          <select
                            id="pais"
                            className="w-full h-10 px-3 border border-input rounded-md bg-background"
                            value={formData.pais}
                            onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                          >
                            <option value="Colombia">Colombia</option>
                            <option value="México">México</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Chile">Chile</option>
                            <option value="Perú">Perú</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Spinner className="mr-2 h-4 w-4" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Guardar cambios
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Seguridad</CardTitle>
                      <CardDescription>
                        Gestiona tu contraseña y opciones de seguridad
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Shield className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">Autenticación de dos factores</p>
                            <p className="text-sm text-muted-foreground">
                              Añade una capa extra de seguridad a tu cuenta
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={preferences.twoFactorAuth}
                          onCheckedChange={(checked) =>
                            setPreferences({ ...preferences, twoFactorAuth: checked })
                          }
                        />
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-4">Cambiar contraseña</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current">Contraseña actual</Label>
                            <Input id="current" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new">Nueva contraseña</Label>
                            <Input id="new" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm">Confirmar contraseña</Label>
                            <Input id="confirm" type="password" />
                          </div>
                          <Button>Actualizar contraseña</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notificaciones</CardTitle>
                      <CardDescription>
                        Configura cómo quieres recibir notificaciones
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Notificaciones por email
                        </h3>

                        {[
                          {
                            key: 'emailOffers',
                            title: 'Ofertas y promociones',
                            desc: 'Recibe las mejores ofertas y descuentos exclusivos',
                          },
                          {
                            key: 'emailBookings',
                            title: 'Confirmaciones de reserva',
                            desc: 'Recibe confirmaciones y recordatorios de tus reservas',
                          },
                          {
                            key: 'emailReviews',
                            title: 'Solicitudes de reseña',
                            desc: 'Te pediremos tu opinión después de cada estancia',
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between p-4 border border-border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                            <Switch
                              checked={preferences[item.key as keyof typeof preferences] as boolean}
                              onCheckedChange={(checked) =>
                                setPreferences({ ...preferences, [item.key]: checked })
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-medium flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Notificaciones SMS
                        </h3>

                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <p className="font-medium">Recordatorios de check-in</p>
                            <p className="text-sm text-muted-foreground">
                              Recibe un SMS el día antes de tu llegada
                            </p>
                          </div>
                          <Switch
                            checked={preferences.smsReminders}
                            onCheckedChange={(checked) =>
                              setPreferences({ ...preferences, smsReminders: checked })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Spinner className="mr-2 h-4 w-4" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Guardar preferencias
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
