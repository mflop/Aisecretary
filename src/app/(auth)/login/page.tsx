"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Te rugăm să completezi toate câmpurile.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signIn(
        formData.email,
        formData.password
      );
      
      if (result.success && result.user) {
        toast.success("Autentificare reușită!");
        router.push("/dashboard");
      } else {
        toast.error(typeof result.error === 'object' && result.error !== null 
          ? (result.error as any).message || "Autentificare eșuată. Verifică email-ul și parola."
          : "Autentificare eșuată. Verifică email-ul și parola.");
      }
    } catch (error) {
      console.error("Eroare la autentificare:", error);
      toast.error("A apărut o eroare la autentificare.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Autentificare</CardTitle>
          <CardDescription>
            Introdu datele tale pentru a te conecta la contul tău
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  placeholder="nume@exemplu.ro" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Parolă</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Ai uitat parola?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Se procesează..." : "Autentificare"}
              </Button>
            </div>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Nu ai un cont?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Înregistrează-te
            </Link>
          </div>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
} 