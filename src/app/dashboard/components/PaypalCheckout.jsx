
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axiosInstance from "../../utils/axiosInstance";
import { useState } from "react";

// Props: packageId (optional), invoiceId (optional), onSuccess (optional)
function PaypalCheckout({ packageId, invoiceId, onSuccess }) {
  const [error, setError] = useState("");
console.log("PayPal createOrder response", response.data);

  return (
    <PayPalScriptProvider options={{ 'client-id': 'Ab1r2E0-IhUITIM126oldeTGhdhfAoLhxn93ur1loGxZsQRXzXOXI6YAMP9lW6DVFGHoh23kSiRMPQxB', currency: 'USD' }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={async () => {
          let payload = {};
          if (packageId) payload.package_id = packageId;
          if (invoiceId) payload.invoice_id = invoiceId;
          const response = await axiosInstance.post("/api/v1/payments/orders/create/", payload);
          return response.data.orderID || response.data.order_id;
        }}
        
        onApprove={async (data) => {
          try {
            const res = await axiosInstance.post("/api/v1/payments/orders/capture/", {
              orderID: data.orderID,
            });
            if (res.data.status === "success" || res.data.status === "completed") {
              onSuccess && onSuccess(res.data);
              window.location.href = `/dashboard/payment-success?order_id=${data.orderID}`;
            } else {
              setError("Order capture failed.");
            }
          } catch (err) {
            setError("Server error while capturing payment.");
          }
        }}
        onError={(err) => setError("PayPal error: " + err.message)}
      />
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </PayPalScriptProvider>
  );
  
}

export default PaypalCheckout
