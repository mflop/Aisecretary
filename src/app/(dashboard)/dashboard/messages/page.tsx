import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mesaje</h2>
          <p className="text-muted-foreground">
            Vizualizează și trimite mesaje către clienții tăi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/templates">
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Creează mesaj nou
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Istoricul mesajelor</CardTitle>
              <CardDescription>
                Vizualizează toate mesajele trimise către clienții tăi
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Caută mesaje..."
                className="max-w-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toate</TabsTrigger>
              <TabsTrigger value="sent">Trimise</TabsTrigger>
              <TabsTrigger value="ai">Generate cu AI</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {/* Empty state */}
              <div className="text-center py-10 text-muted-foreground">
                <p>Nu ai trimis încă niciun mesaj.</p>
                <div className="mt-4">
                  <Link href="/dashboard/templates">
                    <Button variant="outline">
                      Creează primul mesaj
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Messages list - will be shown when there are messages
              <div className="space-y-4">
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Confirmare programare</p>
                        <p className="text-sm text-muted-foreground">Către: Ion Popescu</p>
                      </div>
                      <div className="text-sm text-muted-foreground">Acum 2 ore</div>
                    </div>
                    <p className="mt-2 text-sm">Bună ziua domnule Popescu, vă confirmăm programarea pentru mâine la ora 10:00. Vă așteptăm!</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-3 w-3"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>
                        Copiază
                      </Button>
                      <Button variant="ghost" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-3 w-3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        WhatsApp
                      </Button>
                      <Button variant="ghost" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-3 w-3"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        Salvează
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              */}
            </TabsContent>
            <TabsContent value="sent" className="space-y-4">
              <div className="text-center py-10 text-muted-foreground">
                <p>Nu ai trimis încă niciun mesaj.</p>
              </div>
            </TabsContent>
            <TabsContent value="ai" className="space-y-4">
              <div className="text-center py-10 text-muted-foreground">
                <p>Nu ai generat încă niciun mesaj cu AI.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 