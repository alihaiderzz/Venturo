import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe, getPriceId, getBoostPriceId } from '@/lib/stripe';
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
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('email, full_name')
      .eq('clerk_user_id', userId)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    let session;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (plan) {
      // Subscription checkout
      const priceId = getPriceId(plan, isYearly);
      
      session = await stripe.checkout.sessions.create({
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
        customer_email: userProfile.email,
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
      
      session = await stripe.checkout.sessions.create({
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
        customer_email: userProfile.email,
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




