"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Database } from "@/types/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, X, Save, Trash2 } from "lucide-react";

// Types
type CustomField = Database['public']['Tables']['client_custom_fields']['Row'];
type CustomFieldValue = {
  fieldId: string;
  value: string;
};

export default function NewClientPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Custom fields state
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<CustomFieldValue[]>([]);
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false);
  const [newField, setNewField] = useState<{
    name: string;
    type: "text" | "number" | "date" | "boolean" | "select";
    options: string;
    required: boolean;
  }>({
    name: "",
    type: "text",
    options: "",
    required: false
  });
  
  // CSV mapping state
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<{
    name: string;
    email: string;
    phone: string;
    notes: string;
    [key: string]: string;
  }>({
    name: "_none",
    email: "_none",
    phone: "_none",
    notes: "_none"
  });

  // Fetch custom fields on component mount
  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const supabase = createClientComponentClient<Database>();
        
        // Get the current user
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) return;
        
        // Get the company ID for the current user
        const { data: companyData } = await supabase
          .from('companies')
          .select('id')
          .eq('user_id', authData.user.id)
          .single();
          
        if (!companyData) return;
        
        // Fetch custom fields for this company
        const { data: fields } = await supabase
          .from('client_custom_fields')
          .select('*')
          .eq('company_id', companyData.id)
          .order('display_order', { ascending: true });
          
        if (fields) {
          console.log("Loaded custom fields:", fields);
          setCustomFields(fields);
          
          // Initialize custom field values
          const initialValues = fields.map(field => ({
            fieldId: field.id,
            value: ""
          }));
          setCustomFieldValues(initialValues);
          
          // Update column mapping to include custom fields
          const updatedMapping = { ...columnMapping };
          fields.forEach(field => {
            updatedMapping[field.id] = "_none";
          });
          setColumnMapping(updatedMapping);
        }
      } catch (error) {
        console.error("Error fetching custom fields:", error);
      }
    };
    
    fetchCustomFields();
  }, []);

  const supabase = createClientComponentClient<Database>();

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!firstName.trim() || !lastName.trim()) {
        toast.error("Numele și prenumele sunt obligatorii.");
        setIsLoading(false);
        return;
      }
      
      // Get current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Nu ești autentificat.");
        setIsLoading(false);
        return;
      }
      
      // Get company ID for the current user
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (companyError || !companyData) {
        console.error("Error fetching company:", companyError);
        toast.error("Nu ai o companie asociată.");
        setIsLoading(false);
        return;
      }
      
      // Insert client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          company_id: companyData.id,
          first_name: firstName,
          last_name: lastName,
          email: email || null,
          phone: phone || null,
          notes: notes || null
        })
        .select()
        .single();
      
      if (clientError) {
        console.error("Error adding client:", clientError);
        toast.error("A apărut o eroare la adăugarea clientului.");
        setIsLoading(false);
        return;
      }
      
      // Insert custom field values if any
      if (customFieldValues.length > 0 && clientData) {
        // Define the type explicitly
        type CustomFieldValueInsert = {
          client_id: string;
          field_id: string;
          value: string;
        }
        
        // Create the array with the explicit type
        const customValuesToInsert: CustomFieldValueInsert[] = customFieldValues.map(fieldValue => ({
          client_id: clientData.id,
          field_id: fieldValue.fieldId,
          value: fieldValue.value
        }));
        
        const { error: valuesError } = await supabase
          .from('client_custom_values')
          .insert(customValuesToInsert);
        
        if (valuesError) {
          console.error("Error adding custom field values:", valuesError);
        }
      }
      
      toast.success("Client adăugat cu succes!");
      
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setCustomFieldValues([]);
      
      // Redirect to clients page
      router.push("/dashboard/clients");
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("A apărut o eroare la adăugarea clientului.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomField = async () => {
    try {
      if (!newField.name.trim()) {
        toast.error("Numele câmpului este obligatoriu.");
        return;
      }
      
      // Parse options if type is select
      let fieldOptions = null;
      if (newField.type === 'select' && newField.options.trim()) {
        fieldOptions = newField.options.split(',')
          .map(opt => opt.trim())
          .filter(opt => opt !== '');
        
        // Ensure it's a non-empty array
        if (fieldOptions.length === 0) {
          fieldOptions = null;
        }
      }
      
      // For select type, ensure we have options
      if (newField.type === 'select' && (!fieldOptions || fieldOptions.length === 0)) {
        toast.error("Pentru câmpurile de tip selecție, trebuie să adăugați opțiuni separate prin virgulă.");
        return;
      }
      
      // Show loading toast
      const loadingToast = toast.loading("Se adaugă câmpul personalizat...");
      
      try {
        // Get user ID from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.dismiss(loadingToast);
          toast.error("Nu ești autentificat. Te rugăm să te autentifici din nou.");
          return;
        }
        
        console.log("Sending request with options:", fieldOptions, "and userId:", user.id);
        
        // Use our API endpoint
        const response = await fetch('/api/custom-field', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fieldName: newField.name,
            fieldType: newField.type,
            fieldOptions: fieldOptions, // Already properly formatted as string[]
            isRequired: newField.required,
            userId: user.id // Send the user ID directly
          })
        });
        
        const result = await response.json();
        
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        if (!response.ok) {
          const errorMessage = result.error || 'A apărut o eroare necunoscută';
          const errorDetails = result.details ? JSON.stringify(result.details) : '';
          console.error("API error:", errorMessage, errorDetails);
          toast.error(`Eroare la adăugarea câmpului personalizat: ${errorMessage}`);
          return;
        }
        
        if (!result.success || !result.field) {
          console.error("API returned success=false or missing field:", result);
          toast.error(`Eroare: ${result.error || 'Răspuns invalid de la server'}`);
          return;
        }
        
        // Update local state
        setCustomFields([...customFields, result.field]);
        
        // Update column mapping
        setColumnMapping({
          ...columnMapping,
          [result.field.id]: "_none"
        });
        
        // Reset form and close dialog
        setNewField({
          name: "",
          type: "text",
          options: "",
          required: false
        });
        setShowAddFieldDialog(false);
        
        toast.success("Câmp personalizat adăugat cu succes!");
      } catch (apiError) {
        toast.dismiss(loadingToast);
        console.error("API call error:", apiError);
        toast.error(`Eroare la comunicarea cu serverul: ${apiError instanceof Error ? apiError.message : 'Eroare necunoscută'}`);
      }
    } catch (error) {
      console.error("Error in handleAddCustomField:", error);
      toast.error(`Eroare: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  };

  const handleDeleteCustomField = async (fieldId: string) => {
    try {
      // Delete the field
      const { error } = await supabase
        .from('client_custom_fields')
        .delete()
        .eq('id', fieldId);
      
      if (error) {
        console.error("Error deleting custom field:", error);
        toast.error("A apărut o eroare la ștergerea câmpului personalizat.");
        return;
      }
      
      // Update local state
      setCustomFields(customFields.filter(field => field.id !== fieldId));
      
      // Remove from column mapping
      const updatedMapping = { ...columnMapping };
      delete updatedMapping[fieldId];
      setColumnMapping(updatedMapping);
      
      // Remove any values for this field
      setCustomFieldValues(customFieldValues.filter(value => value.fieldId !== fieldId));
      
      toast.success("Câmp personalizat șters cu succes!");
    } catch (error) {
      console.error("Error deleting custom field:", error);
      toast.error("A apărut o eroare la ștergerea câmpului personalizat.");
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: string) => {
    const existingIndex = customFieldValues.findIndex(item => item.fieldId === fieldId);
    
    if (existingIndex >= 0) {
      const updatedValues = [...customFieldValues];
      updatedValues[existingIndex].value = value;
      setCustomFieldValues(updatedValues);
    } else {
      setCustomFieldValues([...customFieldValues, { fieldId, value }]);
    }
  };

  const renderCustomFieldInput = (field: CustomField) => {
    const value = customFieldValues.find(item => item.fieldId === field.id)?.value || "";
    
    switch (field.field_type) {
      case 'text':
        return (
          <Input
            id={`field-${field.id}`}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            required={field.is_required}
          />
        );
      case 'number':
        return (
          <Input
            id={`field-${field.id}`}
            type="number"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            required={field.is_required}
          />
        );
      case 'date':
        return (
          <Input
            id={`field-${field.id}`}
            type="date"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            required={field.is_required}
          />
        );
      case 'boolean':
        return (
          <Switch
            id={`field-${field.id}`}
            checked={value === 'true'}
            onCheckedChange={(checked: boolean) => handleCustomFieldChange(field.id, checked ? 'true' : 'false')}
          />
        );
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(value) => handleCustomFieldChange(field.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectează o opțiune" />
            </SelectTrigger>
            <SelectContent>
              {field.field_options?.filter(option => option.trim() !== "").map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return <Input />;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      try {
        await parseCSV(await file.text());
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast.error("Eroare la parsarea fișierului CSV. Verifică formatul fișierului.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setCsvFile(file);
      try {
        await parseCSV(await file.text());
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast.error("Eroare la parsarea fișierului CSV. Verifică formatul fișierului.");
      }
    }
  };

  const parseCSV = async (csvText: string): Promise<string[][]> => {
    // Split by newline
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      toast.error("Fișierul CSV este gol.");
      return [];
    }
    
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let inQuotes = false;
      let currentValue = "";
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(currentValue.trim());
          currentValue = "";
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      result.push(currentValue.trim());
      return result;
    };
    
    // Extract headers and data
    const headers = parseCSVLine(lines[0]);
    
    if (headers.length === 0) {
      toast.error("Nu s-au putut identifica coloanele în fișierul CSV.");
      return [];
    }
    
    // Extract preview data
    const previewData = lines.slice(1, 6).map(parseCSVLine);
    
    // Set headers and preview
    setCsvHeaders(headers);
    setCsvPreview(previewData);
    
    // Get current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Nu ești autentificat. Te rugăm să te autentifici din nou.");
      return [];
    }
    
    // Get company ID
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (companyError || !companyData) {
      console.error("Company error:", companyError);
      toast.error("Nu s-a putut găsi compania asociată contului tău.");
      return [];
    }
    
    // Find name column
    let nameColumnIndex = headers.findIndex(h => 
      h.toLowerCase().includes("nume") || h.toLowerCase().includes("name")
    );
    
    if (nameColumnIndex === -1) {
      toast.error("Nu s-a putut identifica coloana pentru numele clientului.");
      return [];
    }
    
    // Find email column
    const emailColumnIndex = headers.findIndex(h => h.toLowerCase().includes("email"));
    
    // Find phone column
    const phoneColumnIndex = headers.findIndex(h => 
      h.toLowerCase().includes("telefon") || h.toLowerCase().includes("phone")
    );
    
    // Find notes column
    const notesColumnIndex = headers.findIndex(h => 
      h.toLowerCase().includes("note") || h.toLowerCase().includes("observ")
    );
    
    // Create a mapping of existing custom fields by name (case insensitive)
    const existingCustomFieldsByName = new Map<string, CustomField>();
    customFields.forEach(field => {
      existingCustomFieldsByName.set(field.field_name.toLowerCase(), field);
    });
    
    // Create custom fields for all other columns
    const loadingToast = toast.loading("Se procesează câmpurile personalizate...");
    const newCustomFields: CustomField[] = [];
    
    // Process all headers except name, email, phone, notes
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const headerLower = header.toLowerCase();
      
      // Skip standard fields
      if (i === nameColumnIndex || i === emailColumnIndex || i === phoneColumnIndex || i === notesColumnIndex) {
        continue;
      }
      
      // Check if a custom field with this name already exists
      const existingField = existingCustomFieldsByName.get(headerLower);
      
      if (!existingField) {
        try {
          // Create a new custom field
          const { data: fieldData, error: fieldError } = await supabase
            .from('client_custom_fields')
            .insert({
              company_id: companyData.id,
              field_name: header,
              field_type: "text",
              is_required: false,
              display_order: customFields.length + newCustomFields.length + 1
            })
            .select()
            .single();
            
          if (fieldError) {
            console.error(`Error creating custom field for ${header}:`, fieldError);
          } else if (fieldData) {
            console.log(`Created new custom field: ${header} (${fieldData.id})`);
            newCustomFields.push(fieldData);
          }
        } catch (error) {
          console.error(`Error creating custom field for ${header}:`, error);
        }
      }
    }
    
    toast.dismiss(loadingToast);
    
    if (newCustomFields.length > 0) {
      toast.success(`S-au creat ${newCustomFields.length} câmpuri personalizate noi.`);
      
      // Update custom fields state with new fields
      setCustomFields([...customFields, ...newCustomFields]);
    }
    
    // Create automatic mapping for all columns
    const initialMapping: {
      name: string;
      email: string;
      phone: string;
      notes: string;
      [key: string]: string;
    } = {
      name: "_none",
      email: "_none",
      phone: "_none",
      notes: "_none"
    };
    
    // Add custom fields to the initial mapping
    [...customFields, ...newCustomFields].forEach(field => {
      initialMapping[field.id] = "_none";
    });
    
    // Debug: Log all headers and custom fields before mapping
    console.log("CSV Headers:", headers);
    console.log("Custom Fields:", [...customFields, ...newCustomFields].map(f => ({ id: f.id, name: f.field_name })));
    
    // Auto-map standard fields
    headers.forEach(header => {
      const lowerHeader = header.toLowerCase().trim();
      
      if (lowerHeader.includes("nume") || lowerHeader.includes("name")) {
        initialMapping.name = header;
      } else if (lowerHeader.includes("email")) {
        initialMapping.email = header;
      } else if (lowerHeader.includes("telefon") || lowerHeader.includes("phone")) {
        initialMapping.phone = header;
      } else if (lowerHeader.includes("note") || lowerHeader.includes("observ")) {
        initialMapping.notes = header;
      }
    });
    
    // Auto-map custom fields
    [...customFields, ...newCustomFields].forEach(field => {
      const fieldNameLower = field.field_name.toLowerCase().trim();
      
      headers.forEach(header => {
        const headerLower = header.toLowerCase().trim();
        
        // Try to match field name with header
        if (
          headerLower === fieldNameLower ||
          headerLower.replace(/[_\s\-\.]/g, '') === fieldNameLower.replace(/[_\s\-\.]/g, '') ||
          headerLower.includes(fieldNameLower) ||
          fieldNameLower.includes(headerLower)
        ) {
          initialMapping[field.id] = header;
        }
      });
    });
    
    // Update the column mapping state with the new mapping
    setColumnMapping(initialMapping);
    
    // Open the mapping dialog
    setShowMappingDialog(true);
    
    // Return the parsed data as a 2D array of strings
    return lines.slice(1).map(parseCSVLine);
  };

  const handleImportCSV = async () => {
    try {
      if (!csvFile) {
        toast.error("Te rugăm să selectezi un fișier CSV.");
        return;
      }
      
      setIsLoading(true);
      
      // Parse CSV data
      const csvText = await csvFile.text();
      const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
      
      if (lines.length <= 1) {
        toast.error("Fișierul CSV nu conține date.");
        setIsLoading(false);
        return;
      }
      
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let inQuotes = false;
        let currentValue = "";
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(currentValue.trim());
            currentValue = "";
          } else {
            currentValue += char;
          }
        }
        
        // Add the last value
        result.push(currentValue.trim());
        return result;
      };
      
      // Extract headers and data
      const headers = parseCSVLine(lines[0]);
      const csvData = lines.slice(1).map(parseCSVLine);
      
      // Get current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Nu ești autentificat. Te rugăm să te autentifici din nou.");
        setIsLoading(false);
        return;
      }
      
      // Get company ID
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (companyError || !companyData) {
        console.error("Company error:", companyError);
        toast.error("Nu s-a putut găsi compania asociată contului tău.");
        setIsLoading(false);
        return;
      }
      
      // Find name column
      let nameColumnIndex = headers.findIndex(h => 
        h.toLowerCase().includes("nume") || h.toLowerCase().includes("name")
      );
      
      if (nameColumnIndex === -1) {
        toast.error("Nu s-a putut identifica coloana pentru numele clientului.");
        setIsLoading(false);
        return;
      }
      
      // Find email column
      const emailColumnIndex = headers.findIndex(h => h.toLowerCase().includes("email"));
      
      // Find phone column
      const phoneColumnIndex = headers.findIndex(h => 
        h.toLowerCase().includes("telefon") || h.toLowerCase().includes("phone")
      );
      
      // Find notes column
      const notesColumnIndex = headers.findIndex(h => 
        h.toLowerCase().includes("note") || h.toLowerCase().includes("observ")
      );
      
      // Create a mapping of custom fields to their column indices
      const customFieldIndices = new Map<string, number>();
      
      // Map custom fields to their column indices
      customFields.forEach(field => {
        const fieldNameLower = field.field_name.toLowerCase().trim();
        
        for (let i = 0; i < headers.length; i++) {
          // Skip standard fields
          if (i === nameColumnIndex || i === emailColumnIndex || i === phoneColumnIndex || i === notesColumnIndex) {
            continue;
          }
          
          const headerLower = headers[i].toLowerCase().trim();
          
          if (
            headerLower === fieldNameLower ||
            headerLower.replace(/[_\s\-\.]/g, '') === fieldNameLower.replace(/[_\s\-\.]/g, '') ||
            headerLower.includes(fieldNameLower) ||
            fieldNameLower.includes(headerLower)
          ) {
            customFieldIndices.set(field.id, i);
            console.log(`Mapped custom field "${field.field_name}" to column "${headers[i]}" (index ${i})`);
            break;
          }
        }
      });
      
      // Show loading toast for import
      const importToast = toast.loading(`Se importă ${csvData.length} clienți...`);
      
      // Process clients in batches to avoid timeouts
      const batchSize = 10;
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < csvData.length; i += batchSize) {
        const batch = csvData.slice(i, i + batchSize).map(row => {
          // Extract name from the name column
          let firstName = "", lastName = "";
          const fullName = row[nameColumnIndex] || "";
          const nameParts = fullName.trim().split(/\s+/);
          if (nameParts.length > 1) {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(" ");
          } else {
            firstName = fullName;
          }
          
          // Map other standard fields
          const email = emailColumnIndex !== -1 ? row[emailColumnIndex] || null : null;
          const phone = phoneColumnIndex !== -1 ? row[phoneColumnIndex] || null : null;
          const notes = notesColumnIndex !== -1 ? row[notesColumnIndex] || null : null;
          
          // Map custom fields
          const customValues: { fieldId: string, value: string }[] = [];
          
          // Process all custom fields
          customFields.forEach(field => {
            const columnIndex = customFieldIndices.get(field.id);
            if (columnIndex !== undefined) {
              const value = row[columnIndex] || "";
              if (value.trim() !== "") {
                customValues.push({
                  fieldId: field.id,
                  value: value.trim()
                });
                console.log(`Row ${i}: Field ${field.field_name} (${field.id}) = "${value.trim()}" (from column index ${columnIndex})`);
              }
            }
          });
          
          return {
            company_id: companyData.id,
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            notes,
            customValues
          };
        });
        
        // Filter out clients with empty names
        const validBatch = batch.filter(client => client.first_name.trim() || client.last_name.trim());
        
        if (validBatch.length === 0) {
          continue;
        }
        
        // Insert clients
        const { data: insertedClients, error: insertError } = await supabase
          .from('clients')
          .insert(validBatch.map(client => ({
            company_id: client.company_id,
            first_name: client.first_name,
            last_name: client.last_name,
            email: client.email,
            phone: client.phone,
            notes: client.notes
          })))
          .select();
        
        if (insertError) {
          console.error("Error inserting clients:", insertError);
          errorCount += validBatch.length;
        } else if (insertedClients) {
          successCount += insertedClients.length;
          
          // Insert custom field values
          const customValuesToInsert: {
            client_id: string;
            field_id: string;
            value: string;
          }[] = [];
          
          for (let j = 0; j < validBatch.length; j++) {
            if (j >= insertedClients.length) break;
            
            const clientId = insertedClients[j].id;
            const clientName = `${validBatch[j].first_name} ${validBatch[j].last_name}`.trim();
                
            validBatch[j].customValues.forEach(customValue => {
              if (customValue.value.trim() !== "") {
                customValuesToInsert.push({
                  client_id: clientId,
                  field_id: customValue.fieldId,
                  value: customValue.value
                });
                
                // Get the field name for better logging
                const fieldName = customFields.find(f => f.id === customValue.fieldId)?.field_name || customValue.fieldId;
                console.log(`Client "${clientName}" (${clientId}): Adding custom value for "${fieldName}" = "${customValue.value}"`);
              }
            });
          }
          
          if (customValuesToInsert.length > 0) {
            console.log(`Inserting ${customValuesToInsert.length} custom field values...`);
            
            const { data: insertedValues, error: valuesError } = await supabase
              .from('client_custom_values')
              .insert(customValuesToInsert);
            
            if (valuesError) {
              console.error("Error inserting custom field values:", valuesError);
              toast.error(`Eroare la adăugarea valorilor pentru câmpurile personalizate: ${valuesError.message}`);
            } else {
              console.log(`Successfully inserted ${customValuesToInsert.length} custom field values`);
            }
          } else {
            console.log("No custom field values to insert");
          }
        }
      }
      
      toast.dismiss(importToast);
      
      if (errorCount > 0) {
        toast.error(`Import finalizat cu erori. ${successCount} clienți importați, ${errorCount} erori.`);
      } else if (successCount > 0) {
        toast.success(`${successCount} clienți importați cu succes!`);
        router.refresh();
      } else {
        toast.error("Nu s-a putut importa niciun client. Verifică fișierul CSV.");
      }
      
      // Reset state
      setCsvFile(null);
      setCsvHeaders([]);
      setCsvPreview([]);
      setShowMappingDialog(false);
    } catch (error) {
      console.error("Error importing CSV:", error);
      toast.error("A apărut o eroare la importarea fișierului CSV.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Adaugă client nou</h2>
          <p className="text-muted-foreground">
            Adaugă un client nou sau importă clienți din CSV
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/clients">
            <Button variant="outline">
              Înapoi la clienți
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="manual">Adaugă manual</TabsTrigger>
          <TabsTrigger value="import">Importă din CSV</TabsTrigger>
          <TabsTrigger value="fields">Câmpuri personalizate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <Card>
            <form onSubmit={handleAddClient}>
              <CardHeader>
                <CardTitle>Informații client</CardTitle>
                <CardDescription>
                  Completează informațiile pentru noul client
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prenume <span className="text-red-500">*</span></Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nume <span className="text-red-500">*</span></Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notițe</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                
                {/* Custom Fields */}
                {customFields.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Câmpuri personalizate</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {customFields.map(field => (
                        <div key={field.id} className="space-y-2">
                          <Label htmlFor={`field-${field.id}`}>
                            {field.field_name}
                            {field.is_required && <span className="text-red-500"> *</span>}
                          </Label>
                          {renderCustomFieldInput(field)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Se adaugă..." : "Adaugă client"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Importă clienți din CSV</CardTitle>
              <CardDescription>
                Încarcă un fișier CSV cu clienții tăi pentru a-i importa în masă
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-gray-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
                  <p className="text-lg font-medium">Trage fișierul CSV aici sau click pentru a-l selecta</p>
                  <p className="text-sm text-muted-foreground">Fișier CSV (max. 10MB)</p>
                </div>
              </div>
              
              {csvFile && (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                      <span className="font-medium">{csvFile.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setCsvFile(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <a
                  href="/car_service_clients.csv"
                  download
                  className="text-sm text-blue-600 hover:underline"
                >
                  Descarcă șablon CSV
                </a>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => csvHeaders.length > 0 ? setShowMappingDialog(true) : handleImportCSV()}
                disabled={!csvFile || isLoading || !columnMapping.name || columnMapping.name === "_none"}
              >
                {isLoading ? "Se importă..." : "Importă clienți"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Câmpuri personalizate</CardTitle>
                  <CardDescription>
                    Gestionează câmpurile personalizate pentru clienții tăi
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddFieldDialog(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adaugă câmp
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {customFields.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p>Nu ai adăugat încă niciun câmp personalizat.</p>
                  <p className="text-sm mt-1">Câmpurile personalizate îți permit să stochezi informații specifice despre clienții tăi.</p>
                  <div className="mt-4">
                    <Button variant="outline" onClick={() => setShowAddFieldDialog(true)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adaugă primul câmp
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {customFields.map(field => (
                    <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">
                          {field.field_name}
                          {field.is_required && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Tip: {field.field_type}
                          {field.field_type === 'select' && field.field_options && (
                            <> (Opțiuni: {field.field_options.join(', ')})</>
                          )}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomField(field.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CSV Column Mapping Dialog */}
      <Dialog open={showMappingDialog} onOpenChange={(open) => {
        if (!isLoading) setShowMappingDialog(open);
      }}>
        <DialogContent className="max-w-full md:max-w-[95vw] lg:max-w-[90vw] h-[90vh] p-0 overflow-hidden flex flex-col">
          {/* Header - Fixed */}
          <div className="p-6 border-b">
            <DialogHeader>
              <DialogTitle className="text-2xl">Mapează coloanele CSV</DialogTitle>
              <DialogDescription className="text-base">
                Te rugăm să asociezi coloanele din fișierul CSV cu câmpurile corespunzătoare.
              </DialogDescription>
              <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm">
                <div className="font-medium text-blue-800">Instrucțiuni:</div>
                <ol className="list-decimal pl-5 mt-1 space-y-1 text-blue-700">
                  <li>Pentru fiecare câmp din aplicație, selectează coloana corespunzătoare din CSV-ul tău</li>
                  <li>Câmpurile marcate cu <span className="text-red-500">*</span> sunt obligatorii</li>
                  <li>Pentru câmpurile pe care nu dorești să le imporți, selectează opțiunea "Ignoră"</li>
                  <li>Verifică datele în tabelul de previzualizare înainte de a importa</li>
                </ol>
              </div>
            </DialogHeader>
          </div>
          
          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client information section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informații client</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name-column" className="flex items-center">
                      Nume complet <span className="text-red-500 ml-1">*</span>
                      <span className="ml-2 text-xs text-gray-500">(obligatoriu)</span>
                    </Label>
                    <Select
                      value={columnMapping.name}
                      onValueChange={(value) => setColumnMapping({...columnMapping, name: value})}
                    >
                      <SelectTrigger id="name-column" className={columnMapping.name === "_none" ? "border-red-300" : ""}>
                        <SelectValue placeholder="Selectează coloana" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">Selectează coloana</SelectItem>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {columnMapping.name === "_none" && (
                      <p className="text-xs text-red-500 mt-1">Acest câmp este obligatoriu</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-column">Email</Label>
                    <Select
                      value={columnMapping.email}
                      onValueChange={(value) => setColumnMapping({...columnMapping, email: value})}
                    >
                      <SelectTrigger id="email-column">
                        <SelectValue placeholder="Selectează coloana" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">Ignoră</SelectItem>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone-column">Telefon</Label>
                    <Select
                      value={columnMapping.phone}
                      onValueChange={(value) => setColumnMapping({...columnMapping, phone: value})}
                    >
                      <SelectTrigger id="phone-column">
                        <SelectValue placeholder="Selectează coloana" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">Ignoră</SelectItem>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes-column">Notițe</Label>
                    <Select
                      value={columnMapping.notes}
                      onValueChange={(value) => setColumnMapping({...columnMapping, notes: value})}
                    >
                      <SelectTrigger id="notes-column">
                        <SelectValue placeholder="Selectează coloana" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">Ignoră</SelectItem>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Custom fields section */}
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                  <h3 className="text-lg font-medium">Câmpuri personalizate</h3>
                  
                  {customFields.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nu ai configurat câmpuri personalizate. Poți adăuga câmpuri în tab-ul "Câmpuri personalizate".</p>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {customFields.map(field => (
                        <div key={field.id} className="space-y-2">
                          <Label htmlFor={`column-${field.id}`} className="flex items-center">
                            {field.field_name}
                            {field.is_required && <span className="text-red-500 ml-1">*</span>}
                            {field.is_required && <span className="ml-2 text-xs text-gray-500">(obligatoriu)</span>}
                          </Label>
                          <Select
                            value={columnMapping[field.id] || "_none"}
                            onValueChange={(value) => setColumnMapping({...columnMapping, [field.id]: value})}
                          >
                            <SelectTrigger id={`column-${field.id}`} className={field.is_required && columnMapping[field.id] === "_none" ? "border-red-300" : ""}>
                              <SelectValue placeholder="Selectează coloana" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="_none">Ignoră</SelectItem>
                              {csvHeaders.map((header) => (
                                <SelectItem key={header} value={header}>
                                  {header}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.is_required && columnMapping[field.id] === "_none" && (
                            <p className="text-xs text-red-500 mt-1">Acest câmp este obligatoriu</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Preview table */}
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium">Previzualizare date</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[300px] overflow-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          {csvHeaders.map((header) => (
                            <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {csvPreview.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-4 py-2 whitespace-normal text-sm">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer - Fixed */}
          <div className="p-6 border-t bg-white sticky bottom-0 mt-auto">
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMappingDialog(false)}>
                Anulează
              </Button>
              <Button 
                onClick={handleImportCSV} 
                disabled={isLoading || !columnMapping.name || columnMapping.name === "_none"}
                className={!columnMapping.name || columnMapping.name === "_none" ? "bg-gray-400 hover:bg-gray-400" : ""}
              >
                {isLoading ? "Se importă..." : "Importă clienți"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Custom Field Dialog */}
      <Dialog open={showAddFieldDialog} onOpenChange={setShowAddFieldDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adaugă câmp personalizat</DialogTitle>
            <DialogDescription>
              Creează un câmp personalizat pentru clienții tăi
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field-name">Nume câmp <span className="text-red-500">*</span></Label>
              <Input
                id="field-name"
                value={newField.name}
                onChange={(e) => setNewField({...newField, name: e.target.value})}
                placeholder="Ex: Marca mașină"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-type">Tip câmp <span className="text-red-500">*</span></Label>
              <Select
                value={newField.type}
                onValueChange={(value: "text" | "number" | "date" | "boolean" | "select") => 
                  setNewField({...newField, type: value})
                }
              >
                <SelectTrigger id="field-type">
                  <SelectValue placeholder="Selectează tipul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Număr</SelectItem>
                  <SelectItem value="date">Dată</SelectItem>
                  <SelectItem value="boolean">Da/Nu</SelectItem>
                  <SelectItem value="select">Selecție</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newField.type === 'select' && (
              <div className="space-y-2">
                <Label htmlFor="field-options">Opțiuni (separate prin virgulă) <span className="text-red-500">*</span></Label>
                <Input
                  id="field-options"
                  value={newField.options}
                  onChange={(e) => setNewField({...newField, options: e.target.value})}
                  placeholder="Ex: Dacia, Volkswagen, BMW"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch
                id="field-required"
                checked={newField.required}
                onCheckedChange={(checked: boolean) => setNewField({...newField, required: checked})}
              />
              <Label htmlFor="field-required">Câmp obligatoriu</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFieldDialog(false)}>
              Anulează
            </Button>
            <Button onClick={handleAddCustomField}>
              Adaugă câmp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 