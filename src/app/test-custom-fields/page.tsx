"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function TestCustomFieldsPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [newField, setNewField] = useState<{
    name: string;
    type: "text" | "number" | "date" | "boolean" | "select";
    options: string;
    required: boolean;
  }>({
    name: "Test Field",
    type: "text",
    options: "",
    required: false
  });
  
  const handleTestDebugApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/debug-db');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };
  
  const handleTestAddField = async () => {
    setLoading(true);
    setError(null);
    try {
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
      
      console.log("Sending field data:", {
        fieldName: newField.name,
        fieldType: newField.type,
        fieldOptions: fieldOptions,
        isRequired: newField.required
      });
      
      const response = await fetch('/api/test-custom-field', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldName: newField.name,
          fieldType: newField.type,
          fieldOptions: fieldOptions,
          isRequired: newField.required
        }),
      });
      
      const data = await response.json();
      setResult(data);
      
      if (!response.ok) {
        setError(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Test Custom Fields</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Debug API</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleTestDebugApi} 
              disabled={loading}
            >
              {loading ? "Loading..." : "Run Debug API"}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Add Custom Field</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field-name">Field Name</Label>
              <Input
                id="field-name"
                value={newField.name}
                onChange={(e) => setNewField({...newField, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="field-type">Field Type</Label>
              <Select
                value={newField.type}
                onValueChange={(value: "text" | "number" | "date" | "boolean" | "select") => 
                  setNewField({...newField, type: value})
                }
              >
                <SelectTrigger id="field-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newField.type === 'select' && (
              <div className="space-y-2">
                <Label htmlFor="field-options">Options (comma separated)</Label>
                <Input
                  id="field-options"
                  value={newField.options}
                  onChange={(e) => setNewField({...newField, options: e.target.value})}
                  placeholder="Option 1, Option 2, Option 3"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch
                id="field-required"
                checked={newField.required}
                onCheckedChange={(checked: boolean) => setNewField({...newField, required: checked})}
              />
              <Label htmlFor="field-required">Required</Label>
            </div>
            
            <Button 
              onClick={handleTestAddField} 
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Field"}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          <h3 className="font-bold mb-2">Error:</h3>
          <pre className="whitespace-pre-wrap text-sm">{error}</pre>
        </div>
      )}
      
      {result && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="p-4 bg-gray-50 border border-gray-200 rounded-md overflow-auto max-h-96 text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 