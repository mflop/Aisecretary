"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export function MarketingHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  return (
    <header className="border-b bg-background sticky top-0 z-40 w-full backdrop-blur-sm bg-background/80">
      <div className="container flex h-16 items-center justify-between py-4">
        <div>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">AI Secretary</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <nav className="hidden space-x-6 md:flex">
            <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Funcționalități
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Prețuri
            </Link>
            <Link href="/#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Testimoniale
            </Link>
          </nav>
          
          {isLoading ? (
            <div className="w-24 h-10 bg-muted/30 animate-pulse rounded-md"></div>
          ) : isAuthenticated ? (
            <Link href="/dashboard">
              <Button className="px-4">Dashboard</Button>
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" className="px-4">Autentificare</Button>
              </Link>
              <Link href="/register">
                <Button className="px-4">Înregistrare</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 