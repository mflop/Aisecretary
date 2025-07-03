import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Setări</h2>
        <p className="text-muted-foreground">
          Gestionează setările contului și companiei tale
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="company">Companie</TabsTrigger>
          <TabsTrigger value="subscription">Abonament</TabsTrigger>
          <TabsTrigger value="notifications">Notificări</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informații profil</CardTitle>
              <CardDescription>
                Actualizează informațiile tale personale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nume</Label>
                <Input id="name" placeholder="Numele tău" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nume@exemplu.ro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" placeholder="07XX XXX XXX" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvează modificările</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Schimbă parola</CardTitle>
              <CardDescription>
                Actualizează parola contului tău
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Parola actuală</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Parola nouă</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmă parola nouă</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Actualizează parola</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informații companie</CardTitle>
              <CardDescription>
                Actualizează informațiile companiei tale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nume companie</Label>
                <Input id="company-name" placeholder="Numele companiei" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Adresă</Label>
                <Input id="company-address" placeholder="Adresa companiei" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-cui">CUI</Label>
                <Input id="company-cui" placeholder="Codul unic de înregistrare" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-reg">Nr. Registrul Comerțului</Label>
                <Input id="company-reg" placeholder="J12/123/2023" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvează modificările</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abonament curent</CardTitle>
              <CardDescription>
                Planul tău curent este <strong>Gratuit</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Plan Gratuit</p>
                    <p className="text-sm text-muted-foreground">0 RON / lună</p>
                  </div>
                  <div className="text-sm text-muted-foreground">Plan curent</div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-sm">20 mesaje AI / lună</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-sm">Import CSV</span>
                  </div>
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Plan Pro</p>
                    <p className="text-sm text-muted-foreground">100 RON / lună</p>
                  </div>
                  <Button>Upgrade</Button>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-sm">500 mesaje AI / lună</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-sm">Sistem de facturare și remindere</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-sm">Clienți și programări nelimitate</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-sm">Suport prioritar</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferințe notificări</CardTitle>
              <CardDescription>
                Gestionează preferințele tale de notificare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Remindere programări</p>
                  <p className="text-sm text-muted-foreground">Primește notificări pentru programările viitoare</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">Dezactivează</Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mesaje noi</p>
                  <p className="text-sm text-muted-foreground">Primește notificări când primești mesaje noi</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">Dezactivează</Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Actualizări sistem</p>
                  <p className="text-sm text-muted-foreground">Primește notificări despre actualizările sistemului</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">Dezactivează</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvează preferințele</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 