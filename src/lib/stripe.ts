import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
})

export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100)
}

export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100
}

export interface CreatePaymentIntentParams {
  amount: number
  currency?: string
  metadata?: Record<string, string>
  description?: string
}

export const createPaymentIntent = async ({
  amount,
  currency = 'jpy',
  metadata = {},
  description,
}: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent> => {
  return await stripe.paymentIntents.create({
    amount: formatAmountForStripe(amount),
    currency,
    metadata,
    description,
    automatic_payment_methods: {
      enabled: true,
    },
  })
}

export const retrievePaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}

export const updatePaymentIntent = async (
  paymentIntentId: string,
  params: Stripe.PaymentIntentUpdateParams
): Promise<Stripe.PaymentIntent> => {
  return await stripe.paymentIntents.update(paymentIntentId, params)
}

export const confirmPaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  return await stripe.paymentIntents.confirm(paymentIntentId)
}

export interface CreateCustomerParams {
  email: string
  name?: string
  metadata?: Record<string, string>
}

export const createCustomer = async ({
  email,
  name,
  metadata = {},
}: CreateCustomerParams): Promise<Stripe.Customer> => {
  return await stripe.customers.create({
    email,
    name,
    metadata,
  })
}

export const retrieveCustomer = async (
  customerId: string
): Promise<Stripe.Customer> => {
  return await stripe.customers.retrieve(customerId) as Stripe.Customer
}

export const createCheckoutSession = async (params: {
  customerId?: string
  customerEmail?: string
  lineItems: Array<{
    price_data: {
      currency: string
      product_data: {
        name: string
        description?: string
      }
      unit_amount: number
    }
    quantity: number
  }>
  mode: 'payment' | 'subscription'
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}): Promise<Stripe.Checkout.Session> => {
  return await stripe.checkout.sessions.create({
    customer: params.customerId,
    customer_email: params.customerEmail,
    line_items: params.lineItems,
    mode: params.mode,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    shipping_address_collection: undefined,
    allow_promotion_codes: true,
  })
}