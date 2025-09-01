# Vercel Deployment Guide for Venturo

## 🚀 Quick Deploy to Vercel

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "UI improvements and Stripe fixes"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

## 🔧 Environment Variables Setup

Add these environment variables in your Vercel project settings:

### Required Environment Variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key_here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://joinventuro.com
NEXT_PUBLIC_BASE_URL=https://joinventuro.com

# Stripe Price IDs (Real IDs - Replace with your actual Stripe price IDs)
STRIPE_VENTURO_PRO_MONTHLY_PRICE_ID=price_1S1crtAdhkHpNGWt55Yd4qze
STRIPE_VENTURO_PRO_YEARLY_PRICE_ID=price_1S1csLAdhkHpNGWt9DocwLth
STRIPE_INVESTOR_PREMIUM_MONTHLY_PRICE_ID=price_1S1ct8AdhkHpNGWt0ZpnMNzW
STRIPE_INVESTOR_PREMIUM_YEARLY_PRICE_ID=price_1S1ctXAdhkHpNGWtF9uqoaSV
STRIPE_BOOST_SINGLE_PRICE_ID=price_1S1d2xAdhkHpNGWtwjvzRdWg
STRIPE_BOOST_PACK_PRICE_ID=price_1S1d7xAdhkHpNGWt4uTqHZCG
```

## 🔑 Stripe Setup Instructions

### 1. Create Products and Prices in Stripe Dashboard:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Products → Add Product
3. Create these products:
   - **Venturo Pro Monthly** ($25/month)
   - **Venturo Pro Yearly** ($250/year)
   - **Investor Premium Monthly** ($80/month)
   - **Investor Premium Yearly** ($800/year)
   - **Boost Single** ($10/one-time)
   - **Boost Pack** ($30/one-time for 4 boosts)

### 2. Get Price IDs:
1. After creating each product, copy the Price ID (starts with `price_`)
2. Replace the placeholder values in the environment variables above

### 3. Set up Webhook:
1. In Stripe Dashboard, go to Developers → Webhooks
2. Add endpoint: `https://joinventuro.com/api/webhooks/stripe`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook secret and add it to `STRIPE_WEBHOOK_SECRET`

## 🌐 Domain Setup

1. **Custom Domain**: Point `joinventuro.com` to your Vercel deployment
2. **SSL**: Vercel automatically provides SSL certificates

## ✅ Post-Deployment Checklist

- [ ] All environment variables are set in Vercel
- [ ] Stripe products and prices are created
- [ ] Stripe webhook is configured
- [ ] Custom domain is pointing to Vercel
- [ ] Test the payment flow
- [ ] Test user registration and profile creation
- [ ] Test idea upload functionality
- [ ] Test idea browsing and filtering

## 🐛 Troubleshooting

### Payment Issues:
- Ensure all Stripe price IDs are correct
- Check webhook endpoint is accessible
- Verify Stripe keys are from the correct environment (live/test)

### Authentication Issues:
- Verify Clerk keys are correct
- Check Clerk webhook configuration

### Database Issues:
- Ensure Supabase service role key has proper permissions
- Check RLS policies are configured correctly

## 📞 Support

If you encounter any issues during deployment, check:
1. Vercel build logs for errors
2. Browser console for client-side errors
3. Vercel function logs for API errors
