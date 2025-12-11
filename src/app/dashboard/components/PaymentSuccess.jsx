// app/dashboard/payment-success/PaymentSuccessClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import axiosInstance from "../../utils/axiosInstance";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react'

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("token");

  const [status, setStatus] = useState("processing");
  const [error, setError] = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [details, setDetails] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  console.log(details)
  const formatAmount = (value, currency) => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(String(value).replace(/[^0-9.-]+/g, ''));
    if (Number.isNaN(num)) return String(value);
    try {
      if (currency) {
        // Try to format with Intl if currency looks like an ISO code
        return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(num);
      }
    } catch (e) {
      // fallback to number formatting
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  const formatDateTime = (isoString) => {
    if (!isoString) return '-'
    try {
      const dt = new Date(isoString)
      return dt.toLocaleString()
    } catch (e) {
      return isoString
    }
  }
  useEffect(() => {
    const captureOrder = async () => {
      if (!orderId) {
        setError("Missing order ID from PayPal.");
        setStatus("error");
        return;
      }
      try {
        const response = await axiosInstance.post("/api/v1/payments/orders/capture/", {
          orderID: orderId,
        });
        if (response.data.status === "success" || response.data.status === "completed") {
          setStatus("success");
          setDetails(response.data);
          if (response.data.invoice_id) {
            setInvoiceUrl(`/api/v1/payments/invoices/${response.data.invoice_id}/`);
          } else if (response.data.order_id) {
            setInvoiceUrl(`/api/v1/payments/invoices/${response.data.order_id}/`);
          }
        } else {
          setStatus("error");
          setError("Order capture failed.");
        }
      } catch (err) {
        console.error("PayPal capture error:", err);
        setStatus("error");
        setError("Server error while capturing payment.");
      }
    };
    captureOrder();
  }, [orderId]);

  // Keyboard navigation for image popup
  useEffect(() => {
    if (!showImagePopup) return
    const handleKeyDown = (e) => {
      const images = details.order_details?.images || details.images || []
      if (e.key === 'Escape') setShowImagePopup(false)
      if (e.key === 'ArrowRight') setCurrentImageIndex((prev) => (prev + 1) % images.length)
      if (e.key === 'ArrowLeft') setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showImagePopup, details])

  if (status === "processing") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-gray-500" />
          <p className="text-center mt-4 text-lg text-gray-700">Processing your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 bg-gradient-to-b from-gray-50 to-white px-4">
      {status === "success" ? (
        <Card className="max-w-xl w-full">
          <CardHeader className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-green-50 p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-md">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Payment successful</CardTitle>
            <p className="text-muted-foreground text-sm" role="status" aria-live="polite">
              {details?.message || "Thank you! Your payment was completed and your order is being processed."}
            </p>
          </CardHeader>

          <CardContent className="px-6 pt-4">
            {details ? (
              <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-sm">{details.order_id ?? '-'}</span>
                </div>
                {/* Product name */}
                {(details.order_details?.product_name || details.product_name) && (
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground">Product</div>
                    <div className="text-sm font-monument-regular text-black">{details.order_details?.product_name || details.product_name}</div>
                  </div>
                )}
                {/* Images thumbnails */}
                {(details.order_details?.images || details.images) && ((details.order_details?.images || details.images).length > 0) && (
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-2">Product images</div>
                    <div className="flex gap-2 flex-wrap">
                      {(details.order_details?.images || details.images).slice(0, 4).map((img, idx) => (
                        <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 relative cursor-pointer" onClick={() => { setCurrentImageIndex(idx); setShowImagePopup(true) }}>
                          <img src={img} alt={`product ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {((details.order_details?.images || details.images).length > 4) && (
                        <div className="w-20 h-20 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-600 cursor-pointer" onClick={() => { setCurrentImageIndex(4); setShowImagePopup(true) }}>
                          +{(details.order_details?.images || details.images).length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Payer info */}
                {(details.payer?.name || details.payer?.email) && (
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    <div className="text-xs text-muted-foreground">Payer</div>
                    <div className="text-sm text-gray-900">
                      {details.payer?.name?.given_name || ''} {details.payer?.name?.surname || ''}
                      {details.payer?.email && (
                        <div className="text-xs text-gray-600">{details.payer.email}</div>
                      )}
                    </div>
                  </div>
                )}
                {details.invoice_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice ID</span>
                    <span className="font-mono text-sm">{details.invoice_id}</span>
                  </div>
                )}
                {(details?.total_paid || details?.amount) && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-mono text-sm">
                      {formatAmount(
                        // try capture_amount.value first, then total_paid then amount
                        details.capture_amount?.value ?? details.total_paid ?? details.amount,
                        details.capture_amount?.currency_code ?? details.user_currency ?? details.currency
                      )}
                    </span>
                  </div>
                )}
                {/* Transaction / capture info rows */}
                {details.transaction_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction</span>
                    <span className="font-mono text-sm">{details.transaction_id}</span>
                  </div>
                )}
                {details.capture_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capture ID</span>
                    <span className="font-mono text-sm">{details.capture_id}</span>
                  </div>
                )}
                {details.capture_status && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capture Status</span>
                    <span className="font-mono text-sm">{details.capture_status}</span>
                  </div>
                )}
                {details.capture_time && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Captured at</span>
                    <span className="font-mono text-sm">{formatDateTime(details.capture_time)}</span>
                  </div>
                )}
                {details.wallet_transaction_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wallet Tx ID</span>
                    <span className="font-mono text-sm">{details.wallet_transaction_id}</span>
                  </div>
                )}
                {(details?.capture_amount?.value || details?.total_paid || details?.amount) && (
                  <div className="mt-3 bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Total Paid</div>
                    <div className="text-lg font-monument-regular text-gray-900">
                      {formatAmount(details.capture_amount?.value ?? details.total_paid ?? details.amount, details.capture_amount?.currency_code ?? details.user_currency ?? details.currency)}
                    </div>
                  </div>
                )}
                {(details.order_details?.price_breakdown_local || details.order_details?.price_breakdown_usd || details.price_breakdown_local || details.price_breakdown_usd) && (
                  <div className="mt-2">
                    <button onClick={() => setShowPriceBreakdown(true)} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-md transition-colors">View price breakdown</button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">We couldn't load payment details — please check your dashboard for your order.</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-2 px-6">
            {invoiceUrl ? (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2" /> View invoice
                </a>
              </Button>
            ) : null}

            <Button asChild className="w-full sm:w-auto">
              <Link href="/user-dashboard/personal-shopper">Back to my requests</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="max-w-xl w-full">
          <Alert variant="destructive">
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>{error || "An error occurred processing your payment. Please try again or contact support."}</AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2">
            <Button asChild variant="outline">
              <Link href="/user-dashboard/personal-shopper">Back to my requests</Link>
            </Button>
          </div>
        </div>
      )}
      {/* Image Carousel Modal */}
      {showImagePopup && (details.order_details?.images || details.images) && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowImagePopup(false)} className="absolute top-4 right-4 z-10 rounded-full p-2 sm:p-3 transition-all duration-200 bg-black/30 text-white">
              <X className="w-5 h-5" />
            </button>
            {(details.order_details?.images || details.images).length > 1 && (
              <>
                <button onClick={() => setCurrentImageIndex((prev) => (prev - 1 + (details.order_details?.images || details.images).length) % (details.order_details?.images || details.images).length)} className="absolute left-2 z-10 rounded-full p-2 sm:p-3 transition-all duration-200 bg-black/30 text-white top-1/2 -translate-y-1/2">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % (details.order_details?.images || details.images).length)} className="absolute right-2 z-10 rounded-full p-2 sm:p-3 transition-all duration-200 bg-black/30 text-white top-1/2 -translate-y-1/2">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="rounded-2xl overflow-hidden flex items-center justify-center bg-black/20 p-6">
              <img src={(details.order_details?.images || details.images)[currentImageIndex]} className="max-w-[90vw] max-h-[70vh] object-contain rounded-2xl" />
            </div>
            {(details.order_details?.images || details.images).length > 1 && (
              <div className="mt-3 flex gap-2 justify-center max-w-full overflow-x-auto px-2">
                {(details.order_details?.images || details.images).map((img, idx) => (
                  <div key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-16 h-12 overflow-hidden rounded-md border ${idx === currentImageIndex ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100 cursor-pointer'}`}>
                    <img src={img} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setShowImagePopup(false)} />
        </div>
      )}

      {/* Price Breakdown Modal */}
      {showPriceBreakdown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-monument-regular text-black tracking-wider uppercase">Price Breakdown</h3>
              <button onClick={() => setShowPriceBreakdown(false)} className="text-gray-400 hover:text-black p-1"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-monument-regular text-black tracking-wider uppercase mb-2">Product: {details.order_details?.product_name || details.product_name}</h4>
                <div className="text-xs text-black">Quantity: {details.order_details?.quantity ?? 1}</div>
              </div>

              <div className="space-y-3">
                {(() => {
                  const breakdown = details.order_details?.price_breakdown_local || details.order_details?.price_breakdown_usd || details.price_breakdown_local || details.price_breakdown_usd
                  const currencyLabel = details.order_details?.currency || details.order_details?.final_paid_price_local ? (details.order_details?.currency || 'LOCAL') : 'USD'
                  if (breakdown) {
                    return (
                      <>
                        {Object.entries(breakdown).map(([k, v]) => (
                          <div className="flex justify-between items-center py-2 border-b border-gray-200" key={k}>
                            <span className="text-sm font-monument-regular text-black tracking-wider uppercase">{k.replace(/_/g, ' ')}</span>
                            <span className="text-sm font-geist-normal text-black">{v} {currencyLabel}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center py-3 bg-blue-50 px-3 rounded-lg border-2 border-blue-200">
                          <span className="text-base font-monument-regular text-blue-800 tracking-wider uppercase">Total Cost</span>
                          <span className="text-lg font-monument-regular text-blue-800">{details.order_details?.final_paid_price_local ?? details.order_details?.final_paid_price_usd ?? details.order_details?.price_breakdown_local?.total_cost_local ?? details.order_details?.price_breakdown_usd?.total_cost_usd}</span>
                        </div>
                      </>
                    )
                  }
                  return <div className="text-sm text-gray-600">Price breakdown not available</div>
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PaymentSuccessClient() {
  return (
    <Suspense fallback={<p className="text-center mt-20 text-xl text-gray-700">Loading payment details...</p>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

export default PaymentSuccessClient;
