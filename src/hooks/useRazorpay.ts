console.log("🔥 FINAL RAZORPAY CLEAN BUILD");

import { useState } from 'react';
import { useUsageStore } from '../store/usage';

export const useRazorpay = () => {
  const store = useUsageStore();
  const userEmail = store.userEmail;

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (onLoginRequired: () => void) => {

    // ✅ EXTRA SAFETY CHECK
    if (!userEmail || userEmail === 'test@example.com') {
      console.warn("❌ Invalid email:", userEmail);
      onLoginRequired();
      return;
    }

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    console.log("🔥 USING SUPABASE DIRECT CALL");
    console.log("🔥 FRONTEND EMAIL:", userEmail);
    console.log("Supabase URL:", supabaseUrl);

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
      const response = await fetch(
        `${supabaseUrl}/functions/v1/create-razorpay-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_email: userEmail, // ✅ backend controls price now
          }),
        }
      );

      const data = await response.json();

      console.log("🔥 SUPABASE RESPONSE:", data);

      if (!response.ok || !data?.id) {
        throw new Error(data?.error || "Order creation failed");
      }

      const rzp = new window.Razorpay({
        key: razorpayKeyId,
        order_id: data.id,
        amount: data.amount,
        currency: data.currency,
        name: 'Praxo AI',
        description: 'Upgrade to Pro',

        // ✅ FIXED SUCCESS HANDLER
        handler: async function (response: any) {
          console.log("🔥 PAYMENT SUCCESS:", response);

          try {
            // ✅ Verify payment
            await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: data.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_email: userEmail,
              }),
            });

            // ✅ FORCE SYNC FROM DB (IMPORTANT)
            const store = useUsageStore.getState();
            await store.syncWithDb();

            // ✅ SUCCESS POPUP
            alert("🎉 Payment successful!\nYou are now a Pro user 🚀");

          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment verification failed");
          }

          setIsProcessing(false);
        },

        prefill: {
          email: userEmail,
        },

        theme: {
          color: '#9333ea',
        },

        modal: {
          ondismiss: function () {
            console.log("⚠️ Payment popup closed");
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
