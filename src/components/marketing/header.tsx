"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient, signOut } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function MarketingHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Check if we're in the dashboard
  const isDashboard = pathname?.startsWith('/dashboard') || false;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        
        // If we're in the dashboard, we're definitely authenticated
        if (isDashboard) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth status:", error);
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [isDashboard]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const { success, error } = await signOut();
      
      if (success) {
        // Force clear any local storage or cookies
        if (typeof window !== 'undefined') {
          localStorage.clear();
          // Clear cookies by setting them to expire
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
        }
        
        setIsAuthenticated(false);
        toast?.success?.("Ai fost deconectat cu succes!");
        router.push("/");
        router.refresh();
      } else {
        console.error("Eroare la deconectare:", error);
        toast?.error?.("A apărut o eroare la deconectare.");
      }
    } catch (error) {
      console.error("Eroare la deconectare:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Don't render the marketing header in the dashboard
  if (isDashboard) {
    return null;
  }

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
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button className="px-4">Dashboard</Button>
              </Link>
              <Button 
                variant="outline" 
                className="px-4" 
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? "Se procesează..." : "Ieșire"}
              </Button>
            </div>
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