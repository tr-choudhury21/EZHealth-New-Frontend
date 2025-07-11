import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const appointmentId = params.get('appointmentId');
  const amount = params.get('amount');

  const loadRazorpay = async () => {
    try {
      // console.log('Calling create-order API...');
      const paymentAmount = Number(amount);
      const { data } = await axios.post(
        'https://ez-health-server.vercel.app/api/v1/payment/create-order',
        { amount: paymentAmount, appointmentId },
        { withCredentials: true }
      );

      // console.log('Razorpay order:', data.order);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: 'INR',
        name: 'EZHealth',
        description: 'Appointment Payment',
        order_id: data.order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            'https://ez-health-server.vercel.app/api/v1/payment/verify',
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              appointmentId,
            },
            { withCredentials: true }
          );

          // console.log('Razorpay key:', import.meta.env.VITE_RAZORPAY_KEY);
          // console.log('Verify response:', verifyRes.data);

          if (verifyRes.data.success) {
            navigate('/patient/dashboard');
          } else {
            console.error('Payment verification failed');
          }
        },
        theme: { color: '#1D4ED8' },
      };

      console.log('Razorpay options:', options);

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response);
        alert('Payment failed - please try again');
      });
      rzp.open();
    } catch (error) {
      // console.log('loadRazorpay error:', error);
      alert('Payment gateway could not be loaded. Please try again.');
    }
  };

  // useEffect(() => {
  //   loadRazorpay();
  // }, []);

  useEffect(() => {
    if (appointmentId && amount) {
      // console.log('Loading Razorpay from useEffect...');
      loadRazorpay();
    } else {
      console.error('Missing required parameters: appointmentId or amount');
      // You might want to redirect or show an error message here
    }
  }, [appointmentId, amount]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-3xl text-blue-600">
        {appointmentId && amount
          ? 'Redirecting to payment gateway...'
          : 'Missing payment information. Please try again.'}
      </p>
    </div>
  );
};

export default PaymentPage;
