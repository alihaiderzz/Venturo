import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getStripeClient, getPriceId, getBoostPriceId } from '@/lib/stripe';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { plan, isYearly, boostQuantity, ideaId } = body;

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase()
      .from('user_profiles')
      .select('email, full_name')
      .eq('clerk_user_id', userId)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Type assertion to fix TypeScript inference issue
    const profile = userProfile as { email: string; full_name: string };

    let session;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joinventuro.com';

    if (plan) {
      // Subscription checkout
      const priceId = getPriceId(plan, isYearly);
      
      session = await getStripeClient().checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pricing`,
        customer_email: profile.email,
        metadata: {
          userId,
          plan,
          isYearly: isYearly.toString(),
          type: 'subscription',
        },
        subscription_data: {
          metadata: {
            userId,
            plan,
            isYearly: isYearly.toString(),
          },
        },
      });
    } else if (boostQuantity) {
      // Boost checkout
      const priceId = getBoostPriceId(boostQuantity);
      
      session = await getStripeClient().checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pricing`,
        customer_email: profile.email,
        metadata: {
          userId,
          boostQuantity: boostQuantity.toString(),
          ideaId: ideaId || '',
          type: 'boost',
        },
      });
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}




