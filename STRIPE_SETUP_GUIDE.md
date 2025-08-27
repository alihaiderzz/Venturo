# 🚀 Stripe Integration Setup Guide

## ✅ What's Been Implemented

### 1. **Stripe Configuration** (`lib/stripe.ts`)
- ✅ Stripe SDK initialization with your live keys
- ✅ Product and price ID mappings
- ✅ Helper functions for plan selection

### 2. **API Routes**
- ✅ `/api/create-checkout-session` - Creates Stripe checkout sessions
- ✅ `/api/webhooks/stripe` - Handles payment webhooks

### 3. **Frontend Integration**
- ✅ Updated pricing modals with Stripe checkout
- ✅ Success page for payment completion
- ✅ Loading states and error handling

### 4. **Database Updates**
- ✅ Boost tracking columns in `startup_ideas` table
- ✅ Subscription management in `user_profiles` table

## 🔧 Setup Steps Required

### Step 1: Environment Variables
Create a `.env.local` file in your project root with:

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here

# Webhook Secret (get this from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Base URL for your application
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Step 2: Stripe Dashboard Setup

#### A. Create Products and Prices
In your Stripe Dashboard, create these products:

**Venturo Pro Monthly:**
- Product Name: "Venturo Pro"
- Price: $25.00/month
- Price ID: `price_VenturoProMonthly`

**Venturo Pro Yearly:**
- Product Name: "Venturo Pro (Yearly)"
- Price: $250.00/year
- Price ID: `price_VenturoProYearly`

**Investor Premium Monthly:**
- Product Name: "Investor Premium"
- Price: $80.00/month
- Price ID: `price_InvestorPremiumMonthly`

**Investor Premium Yearly:**
- Product Name: "Investor Premium (Yearly)"
- Price: $800.00/year
- Price ID: `price_InvestorPremiumYearly`

**Boost Single:**
- Product Name: "Listing Boost"
- Price: $30.00 (one-time)
- Price ID: `price_BoostSingle`

**Boost Pack:**
- Product Name: "Listing Boost Pack"
- Price: $100.00 (one-time)
- Price ID: `price_BoostPack`

#### B. Set Up Webhooks
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret and add it to your `.env.local`

### Step 3: Database Migration
Run this SQL in your Supabase SQL editor:

```sql
-- Add boost-related columns to startup_ideas table
ALTER TABLE startup_ideas 
ADD COLUMN IF NOT EXISTS is_boosted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS boost_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for boosted ideas
CREATE INDEX IF NOT EXISTS idx_startup_ideas_boosted 
ON startup_ideas(is_boosted, boost_expires_at) 
WHERE is_boosted = TRUE;

-- Add boost-related columns to user_profiles table if not exists
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS boost_credits INTEGER DEFAULT 0;
```

## 🎯 How It Works

### **Subscription Flow:**
1. User clicks "Upgrade to Pro/Premium" on pricing page
2. Modal shows plan details and pricing
3. User clicks "Pay" button
4. Redirected to Stripe Checkout
5. After payment, redirected to `/success` page
6. Webhook updates user's subscription in database
7. User gets immediate access to premium features

### **Boost Flow:**
1. User clicks "Buy Boost" on pricing page
2. Modal shows boost options (1 or 4 boosts)
3. User selects quantity and clicks "Pay"
4. Redirected to Stripe Checkout
5. After payment, webhook applies boost to listing
6. Listing gets priority placement for 7 days

### **Database Updates:**
- **Subscriptions:** Updates `user_profiles.subscription_tier` and `subscription_expires_at`
- **Boosts:** Updates `startup_ideas.is_boosted` and `boost_expires_at`

## 🔒 Security Features

- ✅ **Webhook signature verification** - Prevents fake webhook calls
- ✅ **User authentication** - Only logged-in users can checkout
- ✅ **Metadata tracking** - Links payments to specific users and plans
- ✅ **Error handling** - Graceful failure with user feedback

## 🚀 Testing

### **Test Mode:**
1. Switch to Stripe test keys for development
2. Use test card numbers from Stripe docs
3. Test webhook delivery with Stripe CLI

### **Live Mode:**
1. Update environment variables with live keys
2. Set up webhook endpoint on live domain
3. Test with real payments

## 📊 Pricing Structure

| Plan | Monthly | Yearly | Features |
|------|---------|--------|----------|
| **Free** | $0 | $0 | 1 listing, basic features |
| **Venturo Pro** | $25 | $250 | 3 listings, priority features |
| **Investor Premium** | $80 | $800 | Unlimited listings, advanced features |
| **Boost** | $30 | N/A | 7-day priority placement |

## 🛠️ Troubleshooting

### **Common Issues:**
1. **Webhook not receiving events** - Check endpoint URL and webhook secret
2. **Payment not updating subscription** - Verify webhook event handling
3. **Checkout not loading** - Check publishable key and domain settings

### **Debug Steps:**
1. Check browser console for errors
2. Verify environment variables are loaded
3. Test webhook endpoint with Stripe CLI
4. Check database for subscription updates

## 📞 Support

If you encounter issues:
1. Check Stripe Dashboard for payment status
2. Verify webhook delivery in Stripe Dashboard
3. Check application logs for errors
4. Contact support with specific error messages

---

**🎉 Your Stripe integration is now ready! Users can upgrade to premium plans and purchase boosts with secure payments.**
