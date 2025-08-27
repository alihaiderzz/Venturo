import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabaseClient';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const { userId, plan, isYearly, type, boostQuantity, ideaId } = session.metadata;

  if (type === 'subscription') {
    // Update user subscription
    const subscriptionTier = plan === 'Venturo Pro' ? 'pro' : 'investor';
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + (isYearly === 'true' ? 1 : 0));

    await supabase()
      .from('user_profiles')
      .update({
        subscription_tier: subscriptionTier,
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('clerk_user_id', userId);

    console.log(`Subscription updated for user ${userId}: ${subscriptionTier}`);
  } else if (type === 'boost') {
    // Handle boost purchase
    if (ideaId) {
      // Apply boost to specific idea
      await supabase()
        .from('startup_ideas')
        .update({
          is_boosted: true,
          boost_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        })
        .eq('id', ideaId)
        .eq('user_id', userId);
    }

    console.log(`Boost purchased for user ${userId}: ${boostQuantity} boosts`);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  const { userId, plan } = subscription.metadata;
  const status = subscription.status;

  if (status === 'active') {
    const subscriptionTier = plan === 'Venturo Pro' ? 'pro' : 'investor';
    const expiresAt = new Date(subscription.current_period_end * 1000);

    await supabase()
      .from('user_profiles')
      .update({
        subscription_tier: subscriptionTier,
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('clerk_user_id', userId);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  const { userId } = subscription.metadata;

  await supabase()
    .from('user_profiles')
    .update({
      subscription_tier: 'free',
      subscription_expires_at: null,
    })
    .eq('clerk_user_id', userId);
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  // Handle successful recurring payments
  console.log(`Invoice payment succeeded: ${invoice.id}`);
}

async function handleInvoicePaymentFailed(invoice: any) {
  // Handle failed payments
  console.log(`Invoice payment failed: ${invoice.id}`);
}
