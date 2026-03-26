console.log("🔥 FINAL RAZORPAY STABLE BUILD");

import { useState } from 'react';
import { useUsageStore } from '../store/usage';

export const useRazorpay = () => {
  const store = useUsageStore();
  const userEmail = store.userEmail;
  const userId = store.userId;

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (onLoginRequired: () => void) => {
    
    // ✅ HARD VALIDATION
    if (!userEmail || !userId || userEmail === 'test@example.com') {
      console.warn("❌ Invalid user:", { userEmail, userId });
      onLoginRequired();
      return;
    }

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    if (!razorpayKeyId || !supabaseUrl) {
      alert('Missing config');
      return;
    }

    if (!window.Razorpay) {
      alert('Razorpay SDK not loaded');
      return;
    }

    setIsProcessing(true);

    try {
      console.log("🔥 Creating order for:", userEmail);

      const orderRes = await fetch(
        `${supabaseUrl}/functions/v1/create-razorpay-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_email: userEmail,
          }),
        }
      );

      const orderData = await orderRes.json();
      console.log("🔥 ORDER RESPONSE:", orderData);

      if (!orderRes.ok || !orderData?.id) {
        throw new Error(orderData?.error || 'Order creation failed');
      }

      const rzp = new window.Razorpay({
        key: razorpayKeyId,
        order_id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Praxo AI',
        description: 'Upgrade to Pro',

        handler: async function (response: any) {
          console.log("🔥 PAYMENT SUCCESS:", response);

          try {
            const currentStore = useUsageStore.getState();

            console.log("🔥 VERIFY PAYLOAD:", {
              order_id: orderData.id,
              payment_id: response.razorpay_payment_id,
              user_email: userEmail,
              user_id: currentStore.userId,
            });

            const verifyRes = await fetch(
              `${supabaseUrl}/functions/v1/verify-payment`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: orderData.id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  user_email: userEmail,
                  user_id: currentStore.userId, // ✅ ALWAYS FRESH
                }),
              }
            );

            const verifyData = await verifyRes.json();
            console.log("🔥 VERIFY RESPONSE:", verifyData);

            if (!verifyRes.ok || !verifyData?.success) {
              throw new Error(verifyData?.error || 'Payment verification failed');
            }

            // ✅ FORCE DB SYNC
            await currentStore.syncWithDb();

            alert("🎉 Payment successful!\nYou are now a Pro user 🚀");

          } catch (err: any) {
            console.error("❌ Verification failed:", err);
            alert(`Payment verification failed: ${err.message}`);
          } finally {
            setIsProcessing(false);
          }
        },

        prefill: {
          email: userEmail,
        },

        theme: {
          color: '#9333ea',
        },

        modal: {
          ondismiss: function () {
            console.log("⚠️ Razorpay closed");
            setIsProcessing(false);
          },
        },
      });

      rzp.open();

    } catch (error: any) {
      console.error("❌ PAYMENT ERROR:", error);
      alert("Payment failed: " + error.message);
      setIsProcessing(false);
    }
  };

  return { handlePayment, isProcessing };
};
