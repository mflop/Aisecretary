import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export async function GET(request: Request) {
  try {
    // Create Supabase client with proper async cookie handling
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Get current user
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
      return NextResponse.json({ error: 'Company not found', details: companyError }, { status: 404 });
    }
    
    // Get all custom fields for debugging
    const { data: fields, error: fieldsError } = await supabase
      .from('client_custom_fields')
      .select('*')
      .eq('company_id', companyData.id);
    
    if (fieldsError) {
      return NextResponse.json({ error: 'Error fetching fields', details: fieldsError }, { status: 500 });
    }
    
    // Get database schema for client_custom_fields
    const { data: schema, error: schemaError } = await supabase
      .rpc('get_table_schema', { table_name: 'client_custom_fields' });
    
    if (schemaError) {
      return NextResponse.json({ 
        error: 'Error fetching schema', 
        details: schemaError,
        fields: fields 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      user: userData.user.id,
      company: companyData.id,
      fields: fields,
      schema: schema
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Test creating a field directly
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fieldName, fieldType, fieldOptions } = body;
    
    // Create Supabase client with proper async cookie handling
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Get current user
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
      return NextResponse.json({ error: 'Company not found', details: companyError }, { status: 404 });
    }
    
    // Test direct SQL insert for field_options
    const { data, error } = await supabase.rpc('create_custom_field', {
      p_company_id: companyData.id,
      p_field_name: fieldName,
      p_field_type: fieldType,
      p_field_options: fieldOptions,
      p_is_required: false
    });
    
    if (error) {
      return NextResponse.json({ 
        error: 'Database error', 
        details: error,
        params: {
          company_id: companyData.id,
          field_name: fieldName,
          field_type: fieldType,
          field_options: fieldOptions
        }
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      result: data
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 