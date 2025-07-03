import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Facturi</h2>
          <p className="text-muted-foreground">
            Creează și gestionează facturile pentru clienții tăi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/invoices/new">
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
              Creează factură
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Toate facturile</CardTitle>
              <CardDescription>
                Vizualizează și gestionează toate facturile emise
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Caută facturi..."
                className="max-w-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Placeholder for empty state */}
          <div className="text-center py-10 text-muted-foreground">
            <p>Nu ai creat încă nicio factură.</p>
            <div className="mt-4">
              <Link href="/dashboard/invoices/new">
                <Button variant="outline">
                  Creează prima factură
                </Button>
              </Link>
            </div>
          </div>

          {/* Table for when there are invoices */}
          {/* 
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Număr</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Serviciu</TableHead>
                <TableHead>Sumă</TableHead>
                <TableHead>Data scadentă</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV-001</TableCell>
                <TableCell>Ion Popescu</TableCell>
                <TableCell>Consultanță</TableCell>
                <TableCell>500 RON</TableCell>
                <TableCell>15.06.2023</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 border-green-200">
                    Plătită
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                    <span className="sr-only">Descarcă</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    <span className="sr-only">Editează</span>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          */}
        </CardContent>
      </Card>
    </div>
  );
} 