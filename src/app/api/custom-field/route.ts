import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fieldName, fieldType, fieldOptions, isRequired } = body;
    
    console.log('Request body:', body);
    
    if (!fieldName) {
      return NextResponse.json({ error: 'Field name is required' }, { status: 400 });
    }
    
    // Create a Supabase client with proper async cookie handling
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      return NextResponse.json({ error: 'Authentication error', details: userError }, { status: 401 });
    }
    
    // Get company ID for the current user
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', userData.user.id)
      .single();
    
    if (companyError || !companyData) {
      console.error("Company not found:", companyError);
      return NextResponse.json({ error: 'Company not found', details: companyError }, { status: 404 });
    }
    
    // Get the highest display order
    const { data: orderData, error: orderError } = await supabase
      .from('client_custom_fields')
      .select('display_order')
      .eq('company_id', companyData.id)
      .order('display_order', { ascending: false })
      .limit(1);
    
    if (orderError) {
      console.error("Error fetching display order:", orderError);
    }
    
    const nextOrder = orderData && orderData.length > 0 ? orderData[0].display_order + 1 : 1;
    
    // Validate field type
    if (!['text', 'number', 'date', 'boolean', 'select'].includes(fieldType)) {
      return NextResponse.json({ 
        error: `Invalid field type: ${fieldType}. Must be one of: text, number, date, boolean, select` 
      }, { status: 400 });
    }
    
    // Process field options for select type
    let processedFieldOptions = null;
    if (fieldType === 'select') {
      // Handle both array and string formats
      if (Array.isArray(fieldOptions)) {
        processedFieldOptions = fieldOptions.length > 0 ? fieldOptions : null;
      } else if (typeof fieldOptions === 'string' && fieldOptions.trim()) {
        processedFieldOptions = fieldOptions.split(',').map(opt => opt.trim()).filter(opt => opt !== '');
        if (processedFieldOptions.length === 0) {
          processedFieldOptions = null;
        }
      }
      
      // Validate that we have options for select type
      if (!processedFieldOptions || processedFieldOptions.length === 0) {
        return NextResponse.json({ 
          error: 'Select field type requires at least one option' 
        }, { status: 400 });
      }
    }
    
    // Prepare field data object with explicit typing for field_options
    const fieldToInsert = {
      company_id: companyData.id,
      field_name: fieldName,
      field_type: fieldType as "text" | "number" | "date" | "boolean" | "select",
      field_options: processedFieldOptions,
      is_required: Boolean(isRequired),
      display_order: nextOrder
    };
    
    console.log('Inserting field:', fieldToInsert);
    
    try {
      // Insert the field
      const { data: fieldData, error: fieldError } = await supabase
        .from('client_custom_fields')
        .insert(fieldToInsert)
        .select()
        .single();
      
      if (fieldError) {
        console.error('Database error:', fieldError);
        return NextResponse.json({ 
          error: 'Database error occurred', 
          details: fieldError
        }, { status: 500 });
      }
      
      if (!fieldData) {
        console.error('No field data returned after insert');
        return NextResponse.json({ 
          error: 'No data returned after insert', 
        }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, field: fieldData });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return NextResponse.json({ 
        error: 'Database operation failed', 
        details: dbError instanceof Error ? dbError.message : String(dbError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 