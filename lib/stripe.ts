import Stripe from 'stripe';

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
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

// Price IDs for your pricing plans
// TODO: Replace these with your actual Stripe price IDs
export const STRIPE_PRICES = {
  VENTURO_PRO_MONTHLY: 'price_VenturoProMonthly', // Replace with actual price ID
  VENTURO_PRO_YEARLY: 'price_VenturoProYearly', // Replace with actual price ID
  INVESTOR_PREMIUM_MONTHLY: 'price_InvestorPremiumMonthly', // Replace with actual price ID
  INVESTOR_PREMIUM_YEARLY: 'price_InvestorPremiumYearly', // Replace with actual price ID
  BOOST_SINGLE: 'price_BoostSingle', // Replace with actual price ID
  BOOST_PACK: 'price_BoostPack', // Replace with actual price ID
};

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
