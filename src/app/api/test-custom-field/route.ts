import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fieldName, fieldType, fieldOptions, isRequired } = body;
    
    console.log('Received request with body:', body);
    
    // Create Supabase client
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error('User error:', userError);
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 });
    }
    
    // Get company ID for the current user
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', userData.user.id)
      .single();
    
    if (companyError || !companyData) {
      console.error('Company error:', companyError);
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    
    // Get the highest display order
    const { data: orderData } = await supabase
      .from('client_custom_fields')
      .select('display_order')
      .eq('company_id', companyData.id)
      .order('display_order', { ascending: false })
      .limit(1);
    
    const nextOrder = orderData && orderData.length > 0 ? orderData[0].display_order + 1 : 1;
    
    // Validate field type
    if (!['text', 'number', 'date', 'boolean', 'select'].includes(fieldType)) {
      return NextResponse.json({ 
        error: `Invalid field type: ${fieldType}. Must be one of: text, number, date, boolean, select` 
      }, { status: 400 });
    }
    
    // Create field data object with proper typing
    const fieldToInsert: Database['public']['Tables']['client_custom_fields']['Insert'] = {
      company_id: companyData.id,
      field_name: fieldName,
      field_type: fieldType as "text" | "number" | "date" | "boolean" | "select",
      field_options: fieldOptions,
      is_required: isRequired,
      display_order: nextOrder
    };
    
    console.log('Inserting field:', JSON.stringify(fieldToInsert));
    
    // Insert custom field
    const { data: fieldData, error: fieldError } = await supabase
      .from('client_custom_fields')
      .insert(fieldToInsert)
      .select()
      .single();
    
    if (fieldError) {
      console.error('Field error:', fieldError);
      return NextResponse.json({ error: fieldError.message, details: fieldError }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, field: fieldData });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 