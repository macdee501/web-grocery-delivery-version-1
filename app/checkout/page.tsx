"use client";

import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Image from 'next/image';
import { getProductImage } from '@/lib/getProductImage';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createPaymentIntent, createOrder } from '@/lib/appwriteFunctions';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
console.log('🔧 Stripe publishable key exists:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Checkout Form Component
function CheckoutForm({ 
  clientSecret, 
  totalAmount, 
  deliveryFee, 
  onSuccess 
}: { 
  clientSecret: string;
  totalAmount: number;
  deliveryFee: number;
  onSuccess: (orderId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuthStore();
  const { items, clearCart } = useCartStore();

  console.log('🎨 CheckoutForm render:', {
    hasStripe: !!stripe,
    hasElements: !!elements,
    clientSecret: clientSecret?.substring(0, 20) + '...',
    isProcessing
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Form submitted');

    if (!stripe) {
      console.error('❌ Stripe not loaded');
      setErrorMessage('Stripe is not loaded yet. Please wait.');
      return;
    }

    if (!elements) {
      console.error('❌ Elements not loaded');
      setErrorMessage('Payment form is not ready. Please wait.');
      return;
    }

    console.log('✅ Stripe and Elements are ready');

    setIsProcessing(true);
    setErrorMessage('');

    try {
      console.log('💳 Confirming payment with Stripe...');
      
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      console.log('💳 Stripe response:', { 
        hasError: !!stripeError, 
        paymentIntentStatus: paymentIntent?.status 
      });

      if (stripeError) {
        console.error('❌ Stripe error:', stripeError);
        setErrorMessage(stripeError.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded:', paymentIntent.id);

        console.log('📦 Creating order...');
        // Call create order function using SDK
        const orderResult = await createOrder(
          paymentIntent.id,
          items,
          user?.$id || '',
          totalAmount + deliveryFee,
          deliveryFee,
          0
        );

        console.log('📦 Order result:', orderResult);

        if (orderResult.success) {
          console.log('✅ Order created:', orderResult.orderId);
          clearCart();
          onSuccess(orderResult.orderId);
        } else {
          throw new Error(orderResult.message || 'Failed to create order');
        }
      }
    } catch (err: any) {
      console.error('❌ Checkout error:', err);
      setErrorMessage(err.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Payment Element */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
        <PaymentElement 
          onReady={() => console.log('✅ PaymentElement ready')}
          onLoadError={(error) => console.error('❌ PaymentElement load error:', error)}
          onChange={(e) => console.log('📝 PaymentElement changed:', e.complete)}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : `Pay R${(totalAmount + deliveryFee).toFixed(2)}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment information is encrypted and secure
      </p>
    </form>
  );
}

// Main Checkout Page
export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore();
  const { user, isAuthenticated, loading: authLoading } = useAuthStore();
  const router = useRouter();
  
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const initializePaymentRef = useRef(false);
  const checkoutCompletedRef = useRef(false);

  
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
  });

  const deliveryFee = 1.00;
  const subtotal = totalPrice();
  const total = subtotal + deliveryFee;

  console.log('🏪 CheckoutPage render:', {
    itemsCount: items.length,
    subtotal,
    total,
    hasClientSecret: !!clientSecret,
    loading,
    error,
    isAuthenticated
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('🔒 Not authenticated, redirecting to login');
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, authLoading, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !checkoutCompletedRef.current) {
      console.log('🛒 Cart empty (not checkout success), redirecting');
      router.push('/cart');
    }
  }, [items, router]);
  

  // Initialize payment intent
  useEffect(() => {
    const initializePayment = async () => {
      if (initializePaymentRef.current) {
        console.log('⏭️ Skipping - already initialized');
        return;
      }
      
      if (!user || items.length === 0) {
        console.log('⏭️ Skipping - no user or empty cart');
        return;
      }

      initializePaymentRef.current = true;
      console.log('🚀 Initializing payment...');

      try {
        setLoading(true);
        setError('');

        console.log('💰 Payment request:', {
          amount: total,
          currency: 'zar',
          subtotal,
          deliveryFee,
          items: items.length,
        });

        const paymentIntent = await createPaymentIntent(
          total,
          `Order for ${user.email} - ${items.length} items`
        );

        console.log('💳 Payment intent response:', paymentIntent);

        if (paymentIntent.success) {
          console.log('✅ Setting client secret:', paymentIntent.clientSecret?.substring(0, 20) + '...');
          setClientSecret(paymentIntent.clientSecret);
          setPaymentIntentId(paymentIntent.paymentIntentId);
        } else {
          throw new Error(paymentIntent.message || 'Failed to initialize payment');
        }
      } catch (err: any) {
        console.error('❌ Payment initialization error:', err);
        setError(err.message || 'Failed to initialize payment');
        initializePaymentRef.current = false;
      } finally {
        setLoading(false);
        console.log('✅ Payment initialization complete');
      }
    };

    initializePayment();
  }, [user, items.length, total, subtotal, deliveryFee]);

  const handlePaymentSuccess = (orderId: string) => {
    console.log('🎉 Payment successful, redirecting to confirmation:', orderId);
    checkoutCompletedRef.current = true;
    router.push(`/order-confirmation/${orderId}`);
  };
  

  if (authLoading || loading) {
    console.log('⏳ Loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Setting up checkout...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('❌ Error state:', error);
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-red-900 mb-4">Payment Error</h1>
            <p className="text-red-700 mb-6">{error}</p>
            <Link
              href="/cart"
              className="inline-block bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-6 py-3 rounded-lg transition"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  console.log('🎨 Rendering checkout form with clientSecret:', !!clientSecret);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-lime-600 hover:text-lime-700 font-medium mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Address</h2>
              {/* ... address form ... */}
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>
              {clientSecret ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">Client Secret: {clientSecret.substring(0, 20)}...</p>
                  <Elements 
                    stripe={stripePromise} 
                    options={{ clientSecret }}
                    key={clientSecret}
                  >
                    <CheckoutForm
                      clientSecret={clientSecret}
                      totalAmount={subtotal}
                      deliveryFee={deliveryFee}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                </>
              ) : (
                <p className="text-gray-600">Loading payment form...</p>
              )}
            </div>
          </div>

          {/* Order Summary - shortened for brevity */}
          <div className="lg:col-span-1">
            {/* ... order summary ... */}
          </div>
        </div>
      </div>
    </div>
  );
}