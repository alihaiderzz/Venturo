import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  try {
    const { priceId, mode = 'subscription', ideaId } = await req.json(); // e.g. 'price_123'
    
    const sessionConfig: any = {
      mode: mode,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    };

    // For boost purchases, add metadata to track which idea is being boosted
    if (mode === 'payment' && ideaId) {
      sessionConfig.mode = 'payment';
      sessionConfig.metadata = {
        ideaId: ideaId,
        type: 'boost'
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
