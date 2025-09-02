import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!secret || !webhookSecret) {
      console.error('Missing Stripe environment variables');
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }
    
    const stripe = new Stripe(secret, {
      apiVersion: '2024-06-20',
    });

    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Webhook event received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing completed checkout session:', session.id);

  if (session.metadata?.type === 'boost') {
    // Handle boost purchase
    await handleBoostPurchase(session);
  } else {
    // Handle subscription purchase
    await handleSubscriptionPurchase(session);
  }
}

async function handleBoostPurchase(session: Stripe.Checkout.Session) {
  const ideaId = session.metadata?.ideaId;
  if (!ideaId) {
    console.error('No ideaId found in boost purchase metadata');
    return;
  }

  try {
    // Calculate boost expiry (7 days from now)
    const boostExpiry = new Date();
    boostExpiry.setDate(boostExpiry.getDate() + 7);

    // Update the startup idea with boost information
    const { data, error } = await supabase()
      .from('startup_ideas')
      .update({
        is_boosted: true,
        boosted_until: boostExpiry.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', ideaId)
      .select();

    if (error) {
      console.error('Error updating idea with boost:', error);
    } else {
      console.log('Successfully boosted idea:', ideaId, 'until:', boostExpiry);
    }
  } catch (error) {
    console.error('Error handling boost purchase:', error);
  }
}

async function handleSubscriptionPurchase(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_details?.email;
  if (!customerEmail) {
    console.error('No customer email found in subscription purchase');
    return;
  }

  try {
    // Determine subscription tier based on price ID
    const lineItems = session.line_items?.data;
    if (!lineItems || lineItems.length === 0) {
      console.error('No line items found in subscription purchase');
      return;
    }

    const priceId = lineItems[0].price?.id;
    let subscriptionTier = 'free';

    if (priceId?.includes('pro')) {
      subscriptionTier = 'premium';
    } else if (priceId?.includes('prem')) {
      subscriptionTier = 'investor';
    }

    // Calculate subscription expiry
    const subscriptionExpiry = new Date();
    if (priceId?.includes('yearly')) {
      subscriptionExpiry.setFullYear(subscriptionExpiry.getFullYear() + 1);
    } else {
      subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + 1);
    }

    // Update user profile with subscription information
    const { data, error } = await supabase()
      .from('user_profiles')
      .update({
        subscription_tier: subscriptionTier,
        subscription_expires_at: subscriptionExpiry.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('email', customerEmail)
      .select();

    if (error) {
      console.error('Error updating user profile with subscription:', error);
    } else {
      console.log('Successfully updated subscription for user:', customerEmail, 'tier:', subscriptionTier);
    }
  } catch (error) {
    console.error('Error handling subscription purchase:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Handle subscription updates (renewals, cancellations, etc.)
  console.log('Subscription updated:', subscription.id);
  
  const customerEmail = subscription.customer_details?.email;
  if (!customerEmail) return;

  try {
    const status = subscription.status;
    let subscriptionTier = 'free';

    // Determine tier from price ID
    const priceId = subscription.items.data[0]?.price.id;
    if (priceId?.includes('pro')) {
      subscriptionTier = 'premium';
    } else if (priceId?.includes('prem')) {
      subscriptionTier = 'investor';
    }

    // Calculate new expiry
    const subscriptionExpiry = new Date(subscription.current_period_end * 1000);

    if (status === 'active') {
      // Update subscription
      await supabase()
        .from('user_profiles')
        .update({
          subscription_tier: subscriptionTier,
          subscription_expires_at: subscriptionExpiry.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', customerEmail);
    } else if (status === 'canceled' || status === 'unpaid') {
      // Downgrade to free
      await supabase()
        .from('user_profiles')
        .update({
          subscription_tier: 'free',
          subscription_expires_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('email', customerEmail);
    }
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Handle subscription cancellations
  console.log('Subscription deleted:', subscription.id);
  
  const customerEmail = subscription.customer_details?.email;
  if (!customerEmail) return;

  try {
    // Downgrade to free
    await supabase()
      .from('user_profiles')
      .update({
        subscription_tier: 'free',
        subscription_expires_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('email', customerEmail);
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}
