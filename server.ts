import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { cache } from 'react';

export const createServerClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
});

export async function getSession() {
  const supabase = createServerClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Eroare la obținerea sesiunii:', error);
    return null;
  }
}

export async function getUserDetails() {
  const supabase = createServerClient();
  const session = await getSession();
  
  if (!session?.user) {
    return null;
  }
  
  try {
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
      
    if (error) throw error;
    
    return {
      user: session.user,
      company
    };
  } catch (error) {
    console.error('Eroare la obținerea detaliilor utilizatorului:', error);
    return null;
  }
}

export async function getSubscription() {
  const supabase = createServerClient();
  const userDetails = await getUserDetails();
  
  if (!userDetails?.company) {
    return null;
  }
  
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('company_id', userDetails.company.id)
      .single();
      
    if (error) throw error;
    
    return subscription;
  } catch (error) {
    console.error('Eroare la obținerea abonamentului:', error);
    return null;
  }
} 