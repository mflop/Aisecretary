import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

// Create a Supabase client with the service role key
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const { email, password, companyName } = await request.json();
    
    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Email, password, and company name are required' },
        { status: 400 }
      );
    }

    // 1. Create user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Set to false to require email confirmation
      user_metadata: {
        company_name: companyName,
        language: 'ro', // Default language for emails
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData?.user) {
      return NextResponse.json(
        { error: 'Nu s-a putut crea utilizatorul' },
        { status: 500 }
      );
    }

    // 2. Create company using the service role (bypasses RLS)
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from('companies')
      .insert([{ 
        name: companyName, 
        user_id: authData.user.id,
        email: email // Store the email in the companies table
      }])
      .select()
      .single();

    if (companyError) {
      console.error('Company creation error:', companyError);
      return NextResponse.json({ error: companyError.message }, { status: 500 });
    }

    // 3. Update user with company_id
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      authData.user.id,
      {
        user_metadata: {
          ...authData.user.user_metadata,
          company_id: companyData.id,
        },
      }
    );

    if (updateError) {
      console.error('User update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      user: authData.user,
      company: companyData,
      message: 'Contul a fost creat. Verifică emailul pentru a confirma adresa.'
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'A apărut o eroare la înregistrare' },
      { status: 500 }
    );
  }
} 