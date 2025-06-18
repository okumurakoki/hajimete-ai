// Mock Stripe service for build compatibility

export class StripeService {
  constructor() {
    // Mock constructor - no actual Stripe initialization
  }

  async createCustomer(userId: string, email: string, name?: string): Promise<any> {
    // Mock customer creation
    return {
      id: 'cus_mock_' + Math.random().toString(36).substr(2, 9),
      email,
      name,
      metadata: { userId }
    }
  }

  async createSubscription(
    userId: string,
    planSlug: string,
    paymentMethodId?: string
  ): Promise<any> {
    // Mock subscription creation
    return {
      id: 'sub_mock_' + Math.random().toString(36).substr(2, 9),
      status: 'active',
      customer: 'cus_mock_' + Math.random().toString(36).substr(2, 9),
      metadata: { userId, planSlug }
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<any> {
    // Mock subscription cancellation
    return {
      id: subscriptionId,
      status: 'canceled'
    }
  }

  async getCustomerByUserId(userId: string): Promise<any> {
    // Mock customer lookup
    return {
      id: 'cus_mock_' + userId,
      metadata: { userId }
    }
  }

  async handleWebhook(event: any): Promise<void> {
    // Mock webhook handling
    console.log('Mock: Handling webhook event', event.type)
  }

  private async syncSubscription(subscription: any): Promise<void> {
    // Mock subscription sync
    console.log('Mock: Syncing subscription', subscription.id)
  }

  private async handleSubscriptionDeleted(subscription: any): Promise<void> {
    // Mock subscription deletion handling
    console.log('Mock: Handling subscription deletion', subscription.id)
  }

  private async handleSuccessfulPayment(invoice: any): Promise<void> {
    // Mock successful payment handling
    console.log('Mock: Handling successful payment', invoice.id)
  }

  private async handleFailedPayment(invoice: any): Promise<void> {
    // Mock failed payment handling
    console.log('Mock: Handling failed payment', invoice.id)
  }

  async getSubscriptionUsage(userId: string): Promise<any> {
    // Mock subscription usage
    return {
      subscription: {
        id: 'sub_mock_' + userId,
        status: 'active',
        plan: 'basic'
      },
      usage: {
        videosWatched: 5,
        seminarsAttended: 2
      }
    }
  }

  async createPortalSession(customerId: string, returnUrl: string): Promise<string> {
    // Mock portal session creation
    return `https://billing.stripe.com/mock-portal-session?return_url=${encodeURIComponent(returnUrl)}`
  }

  private getPlanConfig(planSlug: string) {
    // Mock plan configuration
    const plans = {
      basic: {
        priceId: 'price_mock_basic',
        name: 'ベーシックプラン',
        price: 1650
      },
      premium: {
        priceId: 'price_mock_premium',
        name: 'プレミアムプラン',
        price: 5500
      }
    }

    return plans[planSlug as keyof typeof plans]
  }
}