// app/services/stripe.server.js
import Stripe from 'stripe';

// Initialize Stripe with environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    typescript: false
});

/**
 * Get Stripe instance for server-side usage
 */
export function getStripeServer() {
    return stripe;
}

/**
 * Create a checkout session for subscription upgrades
 */
export async function createSubscriptionCheckout({
    storeId,
    priceId,
    customerEmail,
    returnUrl
}) {
    return await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price: priceId,
            quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${returnUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${returnUrl}/cancel`,
        customer_email: customerEmail,
        metadata: { storeId },
        subscription_data: {
            trial_settings: { end_behavior: { missing_payment_method: 'cancel' } },
            trial_period_days: 7 // Optional free trial
        }
    });
}

/**
 * Handle subscription changes (upgrade/downgrade)
 */
export async function handleSubscriptionChange(subscriptionId, newPriceId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    return await stripe.subscriptions.update(subscriptionId, {
        items: [{
            id: subscription.items.data[0].id,
            price: newPriceId,
        }],
        proration_behavior: 'create_prorations' // Auto-calculate price differences
    });
}

/**
 * Validate Stripe webhook events
 */
export async function constructWebhookEvent(payload, signature) {
    return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
    );
}

/**
 * Get Stripe customer ID for a Shopify store
 */
export async function getOrCreateCustomer(storeId, email) {
    const customers = await stripe.customers.list({
        email,
        limit: 1
    });

    if (customers.data.length > 0) {
        return customers.data[0].id;
    }

    const customer = await stripe.customers.create({
        email,
        metadata: { shopify_store_id: storeId }
    });

    return customer.id;
}

/**
 * Cancel subscription immediately
 */
export async function cancelSubscription(subscriptionId) {
    return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Get all active subscriptions for a store
 */
export async function getActiveSubscriptions(storeId) {
    return await stripe.subscriptions.list({
        status: 'active',
        limit: 1,
        metadata: { storeId }
    });
}

/**
 * Verify payment intent status
 */
export async function verifyPaymentIntent(paymentIntentId) {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Create a billing portal session for self-service management
 */
export async function createBillingPortalSession(customerId, returnUrl) {
    return await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
    });
}