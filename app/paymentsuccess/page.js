import PaymentSuccess from "@/components/Orders/PaymentSuccess";
import { Suspense } from "react";

export const metadata = {
  title: "Payment Successful - Techworld",
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}
