import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// IMPORTANT: this API route must run on the Node runtime, not Edge:
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }
    
    const stripe = new Stripe(secret, { apiVersion: '2024-06-20' });
    
    const { priceId, mode = 'subscription', ideaId } = await req.json();
    
    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
    }

    const sessionConfig: any = {
      mode: mode,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://joinventuro.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://joinventuro.com'}/pricing`,
    };

    // For boost purchases, add metadata to track which idea is being boosted
    if (mode === 'payment' && ideaId) {
      sessionConfig.metadata = {
        ideaId: ideaId,
        type: 'boost'
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
