import { useState } from 'react';
import { useUsageStore } from '../store/usage';

export const useRazorpay = () => {
  const { userEmail, upgradeToPro } = useUsageStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (onLoginRequired: () => void) => {
    if (!userEmail) {
      onLoginRequired();
      return;
    }

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    console.log('Razorpay Key:', razorpayKeyId ? 'Loaded' : 'Missing');
    console.log('Supabase URL:', supabaseUrl);

    if (!razorpayKeyId || !supabaseUrl || !supabaseAnonKey) {
      alert('Payment configuration missing. Check environment variables.');
      return;
    }

    if (!window.Razorpay) {
      alert('Razorpay SDK failed to load.');
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
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            amount: 9900,
            currency: 'INR',
          }),
        }
      );

      // 🔥 SAFE RESPONSE HANDLING
      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Invalid JSON response:', responseText);
        throw new Error('Invalid response from server');
      }

      console.log('Order response:', data);

      if (!response.ok || !data?.id) {
        throw new Error(data?.error || 'Order creation failed');
      }

      const options = {
        key: razorpayKeyId,
        order_id: data.id,
        amount: data.amount,
        currency: data.currency,
        name: 'Praxo AI',
        description: 'Upgrade to Pro',
        image: '/logo.png',

        handler: async function () {
          try {
            await upgradeToPro();
            alert('Payment successful! You are now Pro 🚀');
          } catch (error) {
            console.error('Upgrade failed:', error);
            alert('Payment done but upgrade failed. Contact support.');
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
            setIsProcessing(false);
            alert('Payment cancelled.');
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response: any) {
        setIsProcessing(false);
        console.error('Payment failed:', response.error);
        alert(
          `Payment failed: ${
            response.error.description || response.error.reason || 'Unknown error'
          }`
        );
      });

      rzp.open();
    } catch (error: any) {
      console.error('Payment init error:', error);
      alert(`Failed to initialize payment: ${error.message}`);
      setIsProcessing(false);
    }
  };

  return { handlePayment, isProcessing };
};