"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

type Client = Database['public']['Tables']['clients']['Row'];
type CustomField = Database['public']['Tables']['client_custom_fields']['Row'];

type ClientWithCustomValues = Client & {
  customValues?: Record<string, string>;
};

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientWithCustomValues[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [apiCheckResult, setApiCheckResult] = useState<any>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Force a refresh when the page is focused
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      // Get the current user
      const { data: authData } = await supabase.auth.getUser();
      console.log("Current user:", authData?.user);
      
      if (!authData?.user) {
        console.error("No authenticated user found");
        setIsLoading(false);
        return;
      }
      
      // Get the company ID for the current user
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', authData.user.id)
        .single();
      
      console.log("Company data:", companyData);
      console.log("Company error:", companyError);
      
      if (companyError || !companyData) {
        console.error("Error fetching company:", companyError);
        setIsLoading(false);
        return;
      }
      
      // Fetch custom fields for this company
      const { data: customFieldsData, error: customFieldsError } = await supabase
        .from('client_custom_fields')
        .select('*')
        .eq('company_id', companyData.id)
        .order('display_order', { ascending: true });
        
      if (customFieldsError) {
        console.error("Error fetching custom fields:", customFieldsError);
      } else {
        setCustomFields(customFieldsData || []);
      }
      
      // Fetch clients for this company
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("company_id", companyData.id)
        .order("created_at", { ascending: false });
      
      console.log("Clients data:", data);
      console.log("Clients error:", error);
      
      if (error) {
        console.error("Error fetching clients:", error);
        setIsLoading(false);
        return;
      }
      
      const clientsWithCustomValues: ClientWithCustomValues[] = data || [];
      
      // Fetch custom field values for all clients
      if (data && data.length > 0 && customFieldsData && customFieldsData.length > 0) {
        const clientIds = data.map(client => client.id);
        
        const { data: customValuesData, error: customValuesError } = await supabase
          .from('client_custom_values')
          .select('*')
          .in('client_id', clientIds);
          
        if (customValuesError) {
          console.error("Error fetching custom field values:", customValuesError);
        } else if (customValuesData) {
          // Create a map of client ID to custom values
          const customValuesByClient: Record<string, Record<string, string>> = {};
          
          customValuesData.forEach(value => {
            if (!customValuesByClient[value.client_id]) {
              customValuesByClient[value.client_id] = {};
            }
            customValuesByClient[value.client_id][value.field_id] = value.value;
          });
          
          // Add custom values to clients
          clientsWithCustomValues.forEach(client => {
            client.customValues = customValuesByClient[client.id] || {};
          });
        }
      }
      
      setClients(clientsWithCustomValues);
      setIsLoading(false);
      // Clear selections when data is refreshed
      setSelectedClients([]);
    };
    
    fetchClients();
  }, [refreshKey]);
  
  const checkClientsApi = async () => {
    try {
      const response = await fetch('/api/check-clients');
      const data = await response.json();
      console.log('API check result:', data);
      setApiCheckResult(data);
    } catch (error) {
      console.error('Error checking clients API:', error);
    }
  };
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => {
    if (!searchTerm) return true;
    
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    const email = client.email?.toLowerCase() || "";
    const phone = client.phone?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || email.includes(search) || phone.includes(search);
  });

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(filteredClients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  // Handle individual client selection
  const handleSelectClient = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  };

  // Delete selected clients
  const deleteSelectedClients = async () => {
    if (selectedClients.length === 0) return;
    
    setIsDeleting(true);
    const supabase = createClient();
    
    try {
      // First try to delete custom field values for these clients
      const { error: customValuesError } = await supabase
        .from('client_custom_values')
        .delete()
        .in('client_id', selectedClients);
      
      if (customValuesError) {
        console.error("Error deleting custom field values:", customValuesError);
        // Log error but continue with client deletion - don't return early
      }
      
      // Then delete the clients
      const { error: clientsError } = await supabase
        .from('clients')
        .delete()
        .in('id', selectedClients);
      
      if (clientsError) {
        console.error("Error deleting clients:", clientsError);
        toast.error("Eroare la ștergerea clienților");
      } else {
        toast.success(`${selectedClients.length} ${selectedClients.length === 1 ? 'client șters' : 'clienți șterși'} cu succes`);
        setSelectedClients([]);
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error("A apărut o eroare la ștergerea clienților");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Delete a single client
  const handleDeleteClient = (clientId: string) => {
    setSelectedClients([clientId]);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clienți</h2>
          <p className="text-muted-foreground">
            Gestionează și vizualizează toți clienții tăi
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedClients.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Șterge {selectedClients.length === 1 ? 'clientul selectat' : `${selectedClients.length} clienți`}
            </Button>
          )}
          <Link href="/dashboard/clients/new">
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="16" x2="22" y1="11" y2="11"></line></svg>
              Adaugă client
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Toți clienții</CardTitle>
              <CardDescription>
                Vizualizează și gestionează toți clienții companiei tale
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setRefreshKey(prev => prev + 1)}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}>
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                </svg>
                <span className="sr-only">Reîmprospătează</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkClientsApi}
              >
                Verifică API
              </Button>
              <Input
                placeholder="Caută clienți..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>Se încarcă...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {searchTerm ? (
                <p>Nu s-au găsit clienți care să corespundă căutării.</p>
              ) : (
                <>
                  <p>Nu ai adăugat încă niciun client.</p>
                  <div className="mt-4">
                    <Link href="/dashboard/clients/new">
                      <Button variant="outline">
                        Adaugă primul client
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Debug info */}
                  {apiCheckResult && (
                    <div className="mt-8 p-4 border rounded bg-gray-50 text-left text-xs">
                      <h3 className="font-bold mb-2">Debug Info:</h3>
                      <pre className="whitespace-pre-wrap overflow-auto max-h-80">
                        {JSON.stringify(apiCheckResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={filteredClients.length > 0 && selectedClients.length === filteredClients.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Nume</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Email</TableHead>
                  {/* Display custom field headers */}
                  {customFields.map(field => (
                    <TableHead key={field.id}>{field.field_name}</TableHead>
                  ))}
                  <TableHead>Notițe</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={(checked) => handleSelectClient(client.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{client.first_name} {client.last_name}</TableCell>
                    <TableCell>{client.phone || "-"}</TableCell>
                    <TableCell>{client.email || "-"}</TableCell>
                    {/* Display custom field values */}
                    {customFields.map(field => (
                      <TableCell key={field.id}>
                        {client.customValues && client.customValues[field.id] ? client.customValues[field.id] : "-"}
                      </TableCell>
                    ))}
                    <TableCell>{client.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        <span className="sr-only">Mesaje</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                        <span className="sr-only">Factură</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        <span className="sr-only">Editează</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Șterge</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ești sigur că vrei să ștergi {selectedClients.length === 1 ? 'acest client' : 'acești clienți'}?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune nu poate fi anulată. {selectedClients.length === 1 ? 'Clientul va fi șters' : `${selectedClients.length} clienți vor fi șterși`} permanent 
              din baza de date împreună cu toate informațiile asociate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Anulează</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                deleteSelectedClients();
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Se șterge...' : 'Șterge'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 