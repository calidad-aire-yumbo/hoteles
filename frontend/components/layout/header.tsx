'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Menu, 
  X, 
  User, 
  Heart, 
  Calendar, 
  LogOut, 
  ChevronDown,
  Building2,
  HelpCircle,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  user?: { nombre: string; email: string } | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-header text-header-foreground sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary-foreground" />
            <span className="text-xl font-bold tracking-tight">StayBook</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-header-foreground hover:bg-header-foreground/10">
                  <Globe className="h-4 w-4 mr-1" />
                  COP
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>COP - Peso Colombiano</DropdownMenuItem>
                <DropdownMenuItem>USD - Dólar</DropdownMenuItem>
                <DropdownMenuItem>EUR - Euro</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" className="text-header-foreground hover:bg-header-foreground/10" asChild>
              <Link href="/ayuda">
                <HelpCircle className="h-4 w-4 mr-1" />
                Ayuda
              </Link>
            </Button>

            {user ? (
              <>
                <Button variant="ghost" className="text-header-foreground hover:bg-header-foreground/10" asChild>
                  <Link href="/favoritos">
                    <Heart className="h-4 w-4" />
                  </Link>
                </Button>

                <Button variant="ghost" className="text-header-foreground hover:bg-header-foreground/10" asChild>
                  <Link href="/reservas">
                    <Calendar className="h-4 w-4 mr-1" />
                    Mis reservas
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-header-foreground hover:bg-header-foreground/10">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                        {user.nombre.charAt(0)}
                      </div>
                      <span className="ml-2">{user.nombre}</span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Mi perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/reservas" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Mis reservas
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favoritos" className="flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        Favoritos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-header-foreground hover:bg-header-foreground/10" asChild>
                  <Link href="/auth/registro">Registrarse</Link>
                </Button>
                <Button className="bg-primary-foreground text-header hover:bg-primary-foreground/90" asChild>
                  <Link href="/auth/login">Iniciar sesión</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-header-foreground/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-header-foreground/20">
            <nav className="flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/perfil" className="px-4 py-2 hover:bg-header-foreground/10 rounded-md flex items-center gap-2">
                    <User className="h-4 w-4" /> Mi perfil
                  </Link>
                  <Link href="/reservas" className="px-4 py-2 hover:bg-header-foreground/10 rounded-md flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Mis reservas
                  </Link>
                  <Link href="/favoritos" className="px-4 py-2 hover:bg-header-foreground/10 rounded-md flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Favoritos
                  </Link>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 hover:bg-header-foreground/10 rounded-md flex items-center gap-2 text-destructive w-full text-left"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="px-4 py-2 hover:bg-header-foreground/10 rounded-md">
                    Iniciar sesión
                  </Link>
                  <Link href="/auth/registro" className="px-4 py-2 hover:bg-header-foreground/10 rounded-md">
                    Registrarse
                  </Link>
                </>
              )}
              <Link href="/ayuda" className="px-4 py-2 hover:bg-header-foreground/10 rounded-md flex items-center gap-2">
                <HelpCircle className="h-4 w-4" /> Ayuda
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
