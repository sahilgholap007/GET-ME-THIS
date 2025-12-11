// app/dashboard/payment-success/page.tsx
import { Suspense } from 'react';
import PaymentSuccessClient from '../components/PaymentSuccess';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
