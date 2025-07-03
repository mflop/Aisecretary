import Stripe from 'stripe';
import { createServerClient } from '@/lib/supabase/server';

// Initialize Stripe with any API version to avoid type errors
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export const PLANS = {
  FREE: {
    name: 'Gratuit',
    price: 0,
    features: ['20 mesaje AI/lună', 'Import CSV'],
    aiMessagesLimit: 20,
  },
  PRO: {
    name: 'Pro',
    price: 100,
    features: [
      '500 mesaje AI/lună',
      'Sistem de facturare și remindere',
      'Clienți și programări nelimitate',
      'Suport prioritar',
    ],
    aiMessagesLimit: 500,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
  },
};

export const PRICES = {
  PRO: {
    amount: 10000, // 100 RON in bani (cents)
    currency: 'ron',
    interval: 'month',
  },
};

export async function createCheckoutSession(companyId: string, email: string, companyName: string) {
  try {
    // Create customer
    const customer = await stripe.customers.create({
      email,
      name: companyName,
      metadata: {
        companyId,
      },
    });
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: PLANS.PRO.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
      metadata: {
        companyId,
      },
    });
    
    return { success: true, url: session.url };
  } catch (error) {
    console.error('Eroare la crearea sesiunii de checkout:', error);
    return { success: false, error };
  }
}

export async function handleSubscriptionChange(event: any) {
  try {
    const supabase = createServerClient();
    
    // Get subscription details from event
    const subscription = event.data.object;
    const customerId = subscription.customer;
    
    // Get company ID from customer metadata
    const customer = await stripe.customers.retrieve(customerId as string) as Stripe.Customer;
    const companyId = customer.metadata?.companyId;
    
    if (!companyId) {
      throw new Error('Company ID not found in customer metadata');
    }
    
    // Update subscription in database
    await supabase.from('subscriptions').upsert({
      company_id: companyId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan: 'pro',
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      ai_messages_used: 0,
      ai_messages_limit: PLANS.PRO.aiMessagesLimit,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Eroare la actualizarea abonamentului:', error);
    return { success: false, error };
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    await stripe.subscriptions.cancel(subscriptionId);
    return { success: true };
  } catch (error) {
    console.error('Eroare la anularea abonamentului:', error);
    return { success: false, error };
  }
}

export async function incrementAIMessageCount(companyId: string) {
  try {
    const supabase = createServerClient();
    
    // Get current subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('company_id', companyId)
      .single();
    
    if (error) throw error;
    
    // Check if limit is reached
    if (subscription.ai_messages_used >= subscription.ai_messages_limit) {
      return { 
        success: false, 
        error: 'Limita de mesaje AI a fost atinsă. Faceți upgrade la un plan superior pentru a trimite mai multe mesaje.',
        limitReached: true
      };
    }
    
    // Increment message count
    await supabase
      .from('subscriptions')
      .update({ ai_messages_used: subscription.ai_messages_used + 1 })
      .eq('company_id', companyId);
    
    return { 
      success: true, 
      messagesRemaining: subscription.ai_messages_limit - (subscription.ai_messages_used + 1) 
    };
  } catch (error) {
    console.error('Eroare la incrementarea numărului de mesaje AI:', error);
    return { success: false, error };
  }
}

export async function createCustomer({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });

    return customer.id;
  } catch (error) {
    console.error('Eroare la crearea clientului Stripe:', error);
    throw error;
  }
}

export async function getSubscription(subscriptionId: string) {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Eroare la obținerea abonamentului:', error);
    throw error;
  }
}

export async function getCustomerSubscriptions(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    });

    return subscriptions.data;
  } catch (error) {
    console.error('Eroare la obținerea abonamentelor clientului:', error);
    throw error;
  }
}

export default stripe; 