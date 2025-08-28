# Vercel Environment Variables Setup

## Required Environment Variables

You need to add these environment variables to your Vercel project:

### 1. Go to Vercel Dashboard
- Visit https://vercel.com/dashboard
- Select your Venturo project
- Go to Settings → Environment Variables

### 2. Add These Variables

**Clerk Authentication:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGFzaGluZy1vcnl4LTc4LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_8tM8Ely0httURq6XNZ1JHW49LSpHMWXkjqOcsqSyre
```

**Supabase (Replace with your actual values):**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Stripe (Replace with your actual values):**
```
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

**App URL:**
```
NEXT_PUBLIC_APP_URL=https://joinventuro.com
```

### 3. Environment Selection
- Set all variables to apply to **Production**, **Preview**, and **Development**
- Click "Save" after adding each variable

### 4. Redeploy
- After adding all variables, go to Deployments
- Click "Redeploy" on your latest deployment

## Important Notes

1. **NEXT_PUBLIC_** prefix means the variable is available in the browser
2. Variables without this prefix are server-side only
3. Make sure to use the exact same variable names
4. After adding variables, you must redeploy for them to take effect

## Troubleshooting

If you still get Clerk errors:
1. Check that the Clerk keys are correct
2. Ensure the keys are for the right environment (test/production)
3. Verify the project is connected to the right Clerk application
