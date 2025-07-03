import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewInvoicePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Creare factură</h2>
          <p className="text-muted-foreground">
            Completează informațiile pentru a crea o factură nouă
          </p>
        </div>
        <div>
          <Link href="/dashboard/invoices">
            <Button variant="outline">Anulează</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informații factură</CardTitle>
            <CardDescription>
              Completează informațiile de bază ale facturii
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-number">Număr factură</Label>
              <Input id="invoice-number" placeholder="001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice-date">Data emiterii</Label>
              <Input id="invoice-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due-date">Data scadentă</Label>
              <Input id="due-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează un client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client-1">Ion Popescu</SelectItem>
                  <SelectItem value="client-2">Maria Ionescu</SelectItem>
                  <SelectItem value="client-3">George Georgescu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-method">Metodă de plată</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează metoda de plată" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Numerar</SelectItem>
                  <SelectItem value="bank-transfer">Transfer bancar</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Note</Label>
              <Textarea
                id="notes"
                placeholder="Adaugă note sau informații suplimentare"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produse și servicii</CardTitle>
            <CardDescription>
              Adaugă produsele sau serviciile facturate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-2 p-4 border-b">
                <div className="col-span-6">
                  <Label htmlFor="item-name-1">Denumire</Label>
                  <Input id="item-name-1" placeholder="Serviciu / Produs" className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="item-qty-1">Cantitate</Label>
                  <Input id="item-qty-1" type="number" placeholder="1" className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="item-price-1">Preț</Label>
                  <Input id="item-price-1" type="number" placeholder="0.00" className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="item-total-1">Total</Label>
                  <div className="flex items-center mt-1">
                    <span className="text-sm font-medium">100.00 RON</span>
                  </div>
                </div>
              </div>
              <div className="p-2 flex justify-center">
                <Button variant="ghost" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>
                  Adaugă produs
                </Button>
              </div>
            </div>

            <div className="border rounded-md p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Subtotal:</span>
                <span className="font-medium">100.00 RON</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">TVA (19%):</span>
                <span className="font-medium">19.00 RON</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2 mt-2">
                <span className="font-medium">Total:</span>
                <span className="font-bold">119.00 RON</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/invoices">
              <Button variant="outline">Anulează</Button>
            </Link>
            <Button>Creează factură</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 