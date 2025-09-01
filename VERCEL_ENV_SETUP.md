# Vercel Environment Variables Setup Guide

## Required Environment Variables for Vercel Deployment

### 1. Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 2. Supabase Database
```
NEXT_PUBLIC_SUPABASE_URL=https://zlipnchvojatozzvoqmv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Stripe Payment Processing
```
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

### 4. Stripe Price IDs (Real IDs)
```
STRIPE_VENTURO_PRO_MONTHLY_PRICE_ID=price_1S1crtAdhkHpNGWt55Yd4qze
STRIPE_VENTURO_PRO_YEARLY_PRICE_ID=price_1S1csLAdhkHpNGWt9DocwLth
STRIPE_INVESTOR_PREMIUM_MONTHLY_PRICE_ID=price_1S1ct8AdhkHpNGWt0ZpnMNzW
STRIPE_INVESTOR_PREMIUM_YEARLY_PRICE_ID=price_1S1ctXAdhkHpNGWtF9uqoaSV
STRIPE_BOOST_SINGLE_PRICE_ID=price_1S1d2xAdhkHpNGWtwjvzRdWg
STRIPE_BOOST_PACK_PRICE_ID=price_1S1d7xAdhkHpNGWt4uTqHZCG
```

### 5. Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://joinventuro.com
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your Venturo project
3. Go to "Settings" tab
4. Click on "Environment Variables"
5. Add each variable above with the correct values
6. Make sure to select "Production", "Preview", and "Development" environments
7. Click "Save"

## Stripe Webhook Setup

1. In your Stripe Dashboard, go to "Developers" > "Webhooks"
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://joinventuro.com/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add it as `STRIPE_WEBHOOK_SECRET`

## Important Notes

- All Stripe price IDs are now configured with real values
- The payment system should work immediately after deployment
- Make sure all environment variables are set before deploying
- Test the payment flow after deployment to ensure everything works

## Troubleshooting

If you encounter payment errors:
1. Check that all Stripe environment variables are set correctly
2. Verify the webhook endpoint is accessible
3. Check Vercel function logs for any API errors
4. Ensure the Stripe publishable key matches your domain
