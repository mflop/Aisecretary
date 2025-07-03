import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Șabloane mesaje</h2>
        <p className="text-muted-foreground">
          Generează mesaje personalizate cu ajutorul inteligenței artificiale
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generează un mesaj nou</CardTitle>
            <CardDescription>
              Selectează industria și tipul de mesaj pentru a genera conținut personalizat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industrie</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează industria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salon">Salon de frumusețe</SelectItem>
                    <SelectItem value="dentist">Cabinet stomatologic</SelectItem>
                    <SelectItem value="fitness">Sală de fitness</SelectItem>
                    <SelectItem value="auto">Service auto</SelectItem>
                    <SelectItem value="consultant">Consultant/Freelancer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageType">Tip mesaj</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează tipul de mesaj" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmation">Confirmare programare</SelectItem>
                    <SelectItem value="reminder">Reminder programare</SelectItem>
                    <SelectItem value="thanks">Mulțumire</SelectItem>
                    <SelectItem value="apology">Scuze pentru întârziere</SelectItem>
                    <SelectItem value="promotion">Promoție</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client (opțional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează un client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Client nou</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M12 3v14"></path><path d="m17 8-5-5-5 5"></path><path d="M19 21H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2Z"></path></svg>
                Generează mesaj
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mesaj generat</CardTitle>
            <CardDescription>
              Editează mesajul generat și salvează-l sau trimite-l direct
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Mesajul generat va apărea aici..."
                className="min-h-[200px] resize-none"
              />
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Salvează șablon
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    Trimite pe WhatsApp
                  </Button>
                </div>
                <Button variant="secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>
                  Copiază în clipboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Șabloane salvate</CardTitle>
          <CardDescription>
            Șabloanele tale salvate pentru reutilizare rapidă
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            <p>Nu ai salvat încă niciun șablon.</p>
            <p className="text-sm mt-1">Generează și salvează șabloane pentru a le vedea aici.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 