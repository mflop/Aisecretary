import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

export const createClient = () => {
  return createClientComponentClient<Database>();
};

// Helper function to get the current user's company ID
export async function getCurrentCompanyId() {
  const supabase = createClient();
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      console.error("Authentication error:", userError);
      return null;
    }
    
    // Get the company ID for the current user
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', userData.user.id)
      .single();
    
    if (companyError || !companyData) {
      console.error("Error fetching company:", companyError);
      return null;
    }
    
    return companyData.id;
  } catch (error) {
    console.error("Error getting company ID:", error);
    return null;
  }
}

export async function signUp(email: string, password: string, companyName: string) {
  try {
    console.log('Starting registration process via API...');
    
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        companyName,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API error:', data.error);
      return { success: false, error: new Error(data.error) };
    }
    
    console.log('Registration successful:', data);
    
    // Automatically sign in the user after successful registration
    const supabase = createClient();
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Eroare la înregistrare:', error);
    return { success: false, error };
  }
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Eroare la autentificare:', error);
    return { success: false, error };
  }
}

export async function signOut() {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Eroare la deconectare:', error);
    return { success: false, error };
  }
}

export async function getCurrentUser() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Eroare la obținerea utilizatorului curent:', error);
    return null;
  }
} 