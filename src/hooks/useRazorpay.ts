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
    console.log('Razorpay Key ID loaded:', razorpayKeyId ? 'Yes (hidden for security)' : 'No');
    if (!razorpayKeyId) {
      alert('Payment configuration missing. Please set VITE_RAZORPAY_KEY_ID.');
      return;
    }

    if (!window.Razorpay) {
      alert('Razorpay SDK failed to load. Please check your connection.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order on backend
      const response = await fetch('https://d2754759-3cbe-4bd8-ad3b-65c5da74d9ad.youbase.app/api/public/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 9900, // 99 INR
          currency: 'INR',
        }),
      });

      let orderData;
      const responseText = await response.text();
      try {
        orderData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse backend response:', responseText);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // 2. Initialize Razorpay with order_id
      const options = {
      key: razorpayKeyId,
      order_id: orderData.id,
      amount: 9900, // Amount is in currency subunits. Default currency is INR. Hence, 9900 refers to 99 INR
      currency: 'INR',
      name: 'Praxo AI',
      description: 'Upgrade to Pro',
      image: '/logo.png',
      handler: async function (response: any) {
        // Payment successful
        try {
          await upgradeToPro();
          alert('Payment successful! You are now a Pro user.');
        } catch (error) {
          console.error('Error upgrading to pro:', error);
          alert('Payment successful but failed to upgrade. Please contact support.');
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        email: userEmail,
      },
      theme: {
        color: '#9333ea', // purple-600
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
      console.error('Razorpay payment failed:', response.error);
      alert(`Payment failed: ${response.error.description || response.error.reason || 'Unknown error'}`);
    });
    rzp.open();
    } catch (error: any) {
      console.error('Payment initialization failed:', error);
      alert(`Failed to initialize payment: ${error.message}`);
      setIsProcessing(false);
    }
  };

  return { handlePayment, isProcessing };
};
