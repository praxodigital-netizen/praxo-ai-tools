console.log("🔥 FINAL RAZORPAY CLEAN BUILD");

import { useState } from 'react';
import { useUsageStore } from '../store/usage';

export const useRazorpay = () => {
  const store = useUsageStore();
  const userEmail = store.userEmail;
  const upgradeToPro = store.upgradeToPro;

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
            amount: 9900,
            currency: 'INR',
            user_email: userEmail, // ✅ FINAL FIX
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

        handler: async function () {
          console.log("🔥 PAYMENT SUCCESS for:", userEmail);

          await upgradeToPro();

          alert("Payment successful 🚀");
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
