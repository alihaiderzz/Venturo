import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// IMPORTANT: this API route must run on the Node runtime, not Edge:
export const runtime = 'nodejs';

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  // Fail fast at module load if missing
  throw new Error('Missing STRIPE_SECRET_KEY in env');
}
const stripe = new Stripe(secret, { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  try {
    const { priceId, mode = 'subscription', ideaId } = await req.json();
    
    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
    }

    const sessionConfig: any = {
      mode: mode,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
