"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [formData, setFormData] = useState({
    company: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError(null); // Clear error when user types
    setDebugInfo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDebugInfo(null);
    
    // Basic validation
    if (!formData.company || !formData.email || !formData.password) {
      toast.error("Te rugăm să completezi toate câmpurile obligatorii.");
      setError("Te rugăm să completezi toate câmpurile obligatorii.");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Parolele nu coincid.");
      setError("Parolele nu coincid.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Starting registration process...");
      
      const result = await signUp(
        formData.email,
        formData.password,
        formData.company
      );
      
      console.log("Registration result:", result);
      
      if (result.success && result.user) {
        setIsRegistered(true);
        setRegisteredEmail(formData.email);
        toast.success(result.message || "Cont creat cu succes! Verifică emailul pentru a confirma adresa.");
      } else {
        let errorMessage = "A apărut o eroare la înregistrare.";
        let debugMessage = "";
        
        if (result.error) {
          console.error("Detailed error:", result.error);
          
          if (typeof result.error === 'object' && result.error !== null) {
            // Try to extract the error message
            const errorObj = result.error as any;
            errorMessage = errorObj.message || errorMessage;
            
            // Create debug info
            try {
              debugMessage = JSON.stringify(errorObj, null, 2);
            } catch (e) {
              debugMessage = `Could not stringify error: ${String(errorObj)}`;
            }
            
            // Handle specific Supabase errors
            if (errorMessage.includes("User already registered")) {
              errorMessage = "Acest email este deja înregistrat.";
            } else if (errorMessage.includes("Password should be at least")) {
              errorMessage = "Parola trebuie să aibă cel puțin 6 caractere.";
            } else if (errorMessage.includes("Email not confirmed")) {
              errorMessage = "Te rugăm să confirmi emailul pentru a continua.";
            } else if (errorMessage.includes("companies")) {
              errorMessage = "Eroare la crearea companiei. Verificați consola pentru detalii.";
            }
          } else if (typeof result.error === 'string') {
            errorMessage = result.error;
            debugMessage = result.error;
          }
        }
        
        toast.error(errorMessage);
        setError(errorMessage);
        setDebugInfo(debugMessage);
        console.error("Registration error:", result.error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("A apărut o eroare neașteptată. Te rugăm să încerci din nou.");
      setError("A apărut o eroare neașteptată. Te rugăm să încerci din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Verifică emailul</CardTitle>
            <CardDescription>
              Am trimis un email de confirmare la adresa <strong>{registeredEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-md text-center">
              <p>Te rugăm să verifici căsuța de email și să urmezi link-ul de confirmare pentru a activa contul.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Dacă nu găsești emailul, verifică și în folderul Spam sau Promoții.
              </p>
            </div>
            <Button 
              className="w-full" 
              variant="outline" 
              onClick={() => router.push("/login")}
            >
              Mergi la pagina de autentificare
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Creează un cont</CardTitle>
          <CardDescription>
            Completează formularul de mai jos pentru a crea un cont
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              {debugInfo && (
                <div className="bg-yellow-100 text-yellow-800 text-xs p-2 rounded-md mt-2 overflow-auto max-h-32">
                  <p className="font-semibold">Debug info:</p>
                  <pre>{debugInfo}</pre>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="company">Nume companie</Label>
                <Input 
                  id="company" 
                  placeholder="Compania mea SRL" 
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
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
                <Label htmlFor="password">Parolă</Label>
                <Input 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmă parola</Label>
                <Input 
                  id="confirmPassword" 
                  placeholder="••••••••" 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Se procesează..." : "Înregistrare"}
              </Button>
            </div>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Ai deja un cont?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Autentificare
            </Link>
          </div>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
} 