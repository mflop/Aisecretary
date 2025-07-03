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
    
    // Test direct insert with field_options as null
    const textField: Database['public']['Tables']['client_custom_fields']['Insert'] = {
      company_id: companyData.id,
      field_name: 'Test Text Field',
      field_type: 'text',
      field_options: null,
      is_required: false,
      display_order: 1
    };
    
    const { data: textResult, error: textError } = await supabase
      .from('client_custom_fields')
      .insert(textField)
      .select()
      .single();
    
    if (textError) {
      return NextResponse.json({ 
        error: 'Text field insert error', 
        details: textError 
      }, { status: 500 });
    }
    
    // Test direct insert with field_options as array
    const selectField: Database['public']['Tables']['client_custom_fields']['Insert'] = {
      company_id: companyData.id,
      field_name: 'Test Select Field',
      field_type: 'select',
      field_options: ['Option 1', 'Option 2', 'Option 3'],
      is_required: false,
      display_order: 2
    };
    
    const { data: selectResult, error: selectError } = await supabase
      .from('client_custom_fields')
      .insert(selectField)
      .select()
      .single();
    
    if (selectError) {
      return NextResponse.json({ 
        error: 'Select field insert error', 
        details: selectError,
        textFieldSuccess: true,
        textField: textResult
      }, { status: 500 });
    }
    
    // Test two-step insert for select field
    const twoStepField: Database['public']['Tables']['client_custom_fields']['Insert'] = {
      company_id: companyData.id,
      field_name: 'Two-Step Select Field',
      field_type: 'select',
      is_required: false,
      display_order: 3
    };
    
    const { data: stepOneResult, error: stepOneError } = await supabase
      .from('client_custom_fields')
      .insert(twoStepField)
      .select()
      .single();
    
    if (stepOneError) {
      return NextResponse.json({ 
        error: 'Two-step field step 1 error', 
        details: stepOneError,
        textFieldSuccess: true,
        textField: textResult,
        selectFieldSuccess: true,
        selectField: selectResult
      }, { status: 500 });
    }
    
    // Now update with options
    const { data: stepTwoResult, error: stepTwoError } = await supabase
      .from('client_custom_fields')
      .update({ field_options: ['Option A', 'Option B', 'Option C'] })
      .eq('id', stepOneResult.id)
      .select()
      .single();
    
    if (stepTwoError) {
      return NextResponse.json({ 
        error: 'Two-step field step 2 error', 
        details: stepTwoError,
        textFieldSuccess: true,
        textField: textResult,
        selectFieldSuccess: true,
        selectField: selectResult,
        stepOneSuccess: true,
        stepOneResult: stepOneResult
      }, { status: 500 });
    }
    
    // Return all results
    return NextResponse.json({
      success: true,
      textField: textResult,
      selectField: selectResult,
      twoStepField: stepTwoResult
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 