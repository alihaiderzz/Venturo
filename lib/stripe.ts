import Stripe from 'stripe';

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Stripe publishable key for client-side
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY!;

// Product IDs for your pricing plans
export const STRIPE_PRODUCTS = {
  VENTURO_PRO_MONTHLY: 'prod_VenturoProMonthly',
  VENTURO_PRO_YEARLY: 'prod_VenturoProYearly',
  INVESTOR_PREMIUM_MONTHLY: 'prod_InvestorPremiumMonthly',
  INVESTOR_PREMIUM_YEARLY: 'prod_InvestorPremiumYearly',
  BOOST_SINGLE: 'prod_BoostSingle',
  BOOST_PACK: 'prod_BoostPack',
};

// Stripe Price IDs
const STRIPE_PRICES = {
  VENTURO_PRO_MONTHLY: process.env.STRIPE_VENTURO_PRO_MONTHLY_PRICE_ID || 'price_1S1crtAdhkHpNGWt55Yd4qze',
  VENTURO_PRO_YEARLY: process.env.STRIPE_VENTURO_PRO_YEARLY_PRICE_ID || 'price_1S1csLAdhkHpNGWt9DocwLth',
  INVESTOR_PREMIUM_MONTHLY: process.env.STRIPE_INVESTOR_PREMIUM_MONTHLY_PRICE_ID || 'price_1S1ct8AdhkHpNGWt0ZpnMNzW',
  INVESTOR_PREMIUM_YEARLY: process.env.STRIPE_INVESTOR_PREMIUM_YEARLY_PRICE_ID || 'price_1S1ctXAdhkHpNGWtF9uqoaSV',
  BOOST_SINGLE: process.env.STRIPE_BOOST_SINGLE_PRICE_ID || 'price_1S1d2xAdhkHpNGWtwjvzRdWg',
  BOOST_PACK: process.env.STRIPE_BOOST_PACK_PRICE_ID || 'price_1S1d7xAdhkHpNGWt4uTqHZCG',
} as const;

// Helper function to get price ID based on plan and billing cycle
export function getPriceId(plan: string, isYearly: boolean): string {
  switch (plan) {
    case 'Venturo Pro':
      return isYearly ? STRIPE_PRICES.VENTURO_PRO_YEARLY : STRIPE_PRICES.VENTURO_PRO_MONTHLY;
    case 'Investor Premium':
      return isYearly ? STRIPE_PRICES.INVESTOR_PREMIUM_YEARLY : STRIPE_PRICES.INVESTOR_PREMIUM_MONTHLY;
    default:
      throw new Error(`Unknown plan: ${plan}`);
  }
}

// Helper function to get boost price ID
export function getBoostPriceId(quantity: number): string {
  return quantity === 4 ? STRIPE_PRICES.BOOST_PACK : STRIPE_PRICES.BOOST_SINGLE;
}
