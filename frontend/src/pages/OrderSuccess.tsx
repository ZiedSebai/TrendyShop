import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { checkoutService } from "@/services/checkout.service";
import { toast } from "sonner";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentIntentId) {
        setIsLoading(false);
        return;
      }

      try {
        const status = await checkoutService.getPaymentStatus(paymentIntentId);
        setPaymentStatus(status);
      } catch (error) {
        toast.error("Failed to verify payment");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [paymentIntentId]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Verifying payment...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container max-w-2xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Order Confirmed!</h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
            </div>

            {paymentStatus && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>Your payment was processed successfully</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize">{paymentStatus.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-medium">
                      ${paymentStatus.amount.toFixed(2)} {paymentStatus.currency.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment ID</span>
                    <span className="font-mono text-xs">{paymentIntentId}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-secondary">
              <CardContent className="py-8">
                <div className="flex items-center justify-center space-x-3 text-muted-foreground">
                  <Package className="w-5 h-5" />
                  <p>
                    You will receive an order confirmation email with tracking details shortly.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
              <Link to="/account">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
