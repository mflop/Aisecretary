import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Get all clients (for debugging)
    const { data: allClients, error: allClientsError } = await supabase
      .from('clients')
      .select('*');
    
    if (allClientsError) {
      return NextResponse.json({ error: allClientsError.message }, { status: 500 });
    }
    
    // Get current user's company
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', session.user.id)
      .single();
    
    if (companyError) {
      return NextResponse.json({ error: companyError.message }, { status: 500 });
    }
    
    // Get clients for this company
    const { data: companyClients, error: companyClientsError } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', companyData.id);
    
    if (companyClientsError) {
      return NextResponse.json({ error: companyClientsError.message }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      user_id: session.user.id,
      company_id: companyData.id,
      all_clients_count: allClients.length,
      company_clients_count: companyClients.length,
      company_clients: companyClients,
    });
  } catch (error) {
    console.error('Error checking clients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 