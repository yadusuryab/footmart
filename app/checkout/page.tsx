"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShoppingBag, CheckCircle2, Zap, Truck, ArrowRight } from "lucide-react";
import Image from "next/image";
import { CustomerDetailsForm } from "@/components/checkout/checkout-form";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site-config";
import Link from "next/link";

interface CartItem {
  _id: string;
  productName: string;
  selectedSize: string;
  price: number;
  image?: string;
  imageUrl?: string;
  images?: Array<{ asset: { url: string } }>;
  buyOneGetOne?: boolean;
  freeProduct?: CartItem;
}

type CheckoutStep = "payment" | "details";

const getProductImageUrl = (product: any): string => {
  if (!product) return "/placeholder-image.jpg";
  let url = product.image || product.imageUrl || product.images?.[0]?.asset?.url || product.images?.[0]?.url || "";
  if (!url) return "/placeholder-image.jpg";
  if (url.includes("cloudinary.com")) return url.replace("/upload/", "/upload/w_200,h_200,q_50,f_auto/");
  return url;
};

const BASE_PRICE = 1499;
const COD_CHARGE = 300;

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingMethod, setShippingMethod] = useState<"online" | "cod">("online");
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("payment");
  const [customerDetails, setCustomerDetails] = useState({
    name: "", contact1: "", contact2: "", address: "",
    district: "", state: "", pincode: "", landmark: "", instagramId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(Array.isArray(cart) ? cart : []);
    } catch { setCartItems([]); }
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [currentStep]);

  const mainProduct = cartItems[0];
  const freeProduct = mainProduct?.freeProduct;
  const pair1Extra = Math.max(0, (mainProduct?.price || BASE_PRICE) - BASE_PRICE);
  const pair2Extra = Math.max(0, (freeProduct?.price || BASE_PRICE) - BASE_PRICE);
  const subtotal = BASE_PRICE + pair1Extra + pair2Extra;
  const shippingCharge = shippingMethod === "online" ? 0 : COD_CHARGE;
  const totalAmount = subtotal + shippingCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
    if (formErrors.length > 0) setFormErrors([]);
  };

  const handleWhatsAppOrder = () => {
    setIsLoading(true);
    try {
      const productMessages = cartItems.map((item, idx) => {
        const extra = Math.max(0, (item.price || BASE_PRICE) - BASE_PRICE);
        let msg = `*PAIR ${idx + 1}*\nProduct: ${item.productName?.toUpperCase() || "Unknown"}\nSize: ${item.selectedSize || "N/A"}\nExtra: ₹${extra}\nLink: https://kicksnot.in/p/${item._id}`;
        if (item.buyOneGetOne && item.freeProduct) {
          const fExtra = Math.max(0, (item.freeProduct.price || BASE_PRICE) - BASE_PRICE);
          msg += `\n\n*PAIR ${idx + 2}*\nProduct: ${item.freeProduct.productName?.toUpperCase() || "Unknown"}\nSize: ${item.freeProduct.selectedSize || "N/A"}\nExtra: ₹${fExtra}\nLink: https://kicksnot.in/p/${item.freeProduct._id}`;
        }
        return msg;
      }).join("\n\n");

      const msg = `*2 PAIR SHOES ORDER*\n\n${productMessages}\n\n*CUSTOMER DETAILS*\nName: ${customerDetails.name}\nInstagram: ${customerDetails.instagramId}\nAddress: ${customerDetails.address}\nDistrict: ${customerDetails.district}\nState: ${customerDetails.state}\nPincode: ${customerDetails.pincode}\nLandmark: ${customerDetails.landmark || "N/A"}\nContact No.1: ${customerDetails.contact1}\nContact No.2: ${customerDetails.contact2 || "N/A"}\n\n*ORDER SUMMARY*\nBase Price: ₹${BASE_PRICE}\nPair 1 Extra: ₹${pair1Extra}\nPair 2 Extra: ₹${pair2Extra}\nShipping: ${shippingMethod === "online" ? "FREE (Online Payment)" : `₹${COD_CHARGE} (Cash on Delivery)`}\n*GRAND TOTAL: ₹${totalAmount}*`.trim();

      setTimeout(() => {
        window.open(`https://wa.me/${site.phone}?text=${encodeURIComponent(msg)}`, "_blank");
        localStorage.removeItem("cart");
        setIsLoading(false);
      }, 500);
    } catch {
      setIsLoading(false);
      setFormErrors(["Failed to create order. Please try again."]);
    }
  };

  const ProductImage = ({ product, alt, borderClass }: { product: any; alt: string; borderClass: string }) => (
    <div className={`aspect-square bg-primary/10 rounded-xl overflow-hidden border-2 ${borderClass}`}>
      <Image src={getProductImageUrl(product)} alt={alt} width={200} height={200} quality={50}
        className="w-full h-full object-cover" loading="eager" />
    </div>
  );

  const StepProgress = () => (
    <div className="flex items-center justify-center mb-6">
      {(["payment", "details"] as CheckoutStep[]).map((step, i) => {
        const labels = ["Payment", "Details"];
        const activeIdx = ["payment", "details"].indexOf(currentStep);
        const isDone = activeIdx > i;
        const isActive = currentStep === step;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border border-black transition-colors ${isActive ? "bg-primary text-black" : isDone ? "bg-black text-primary" : "bg-white text-black/40"}`}>
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-xs mt-1 font-bold uppercase tracking-wide">{labels[i]}</span>
            </div>
            {i < 1 && <div className={`w-12 h-1 mx-2 rounded-full transition-colors ${isDone || isActive ? "bg-primary" : "bg-black/10"}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );

  if (!cartItems.length || !mainProduct) {
    return (
      <main className="container mx-auto px-4 max-w-md min-h-screen flex items-center justify-center">
        <Card className="w-full text-center border-2 border-black rounded-2xl">
          <CardContent className="pt-6">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 border border-black">
              <ShoppingBag className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-xl font-black mb-2">{!cartItems.length ? "Your cart is empty" : "Invalid Cart"}</h2>
            <p className="text-muted-foreground mb-6">{!cartItems.length ? "Add some stylish shoes to get started!" : "Your cart contains invalid items."}</p>
            <Button onClick={() => { localStorage.removeItem("cart"); router.push("/"); }} className="w-full rounded-full font-black border border-black bg-primary text-black hover:bg-primary/90">
              {!cartItems.length ? "Continue Shopping" : "Start Over"}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 max-w-2xl min-h-screen pb-24">
      <div className="py-4">
        <StepProgress />

        {formErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4 border border-black rounded-xl">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">{formErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </AlertDescription>
          </Alert>
        )}

        {currentStep === "payment" ? (
          <Card className="border-2 border-black rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-lg gap-2 font-black">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Select Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label className="text-sm font-black uppercase tracking-wide mb-3 block">Your Selected Pairs</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <ProductImage product={mainProduct} alt={mainProduct.productName || "Main Product"} borderClass="border-black" />
                    <div className="mt-2 text-center">
                      <p className="text-sm font-bold">{mainProduct.productName || "Product"}</p>
                      <p className="text-xs text-muted-foreground">Size: {mainProduct.selectedSize || "N/A"}</p>
                      <Badge className="mt-1 bg-black text-primary font-black rounded-full">1st Pair</Badge>
                    </div>
                  </div>
                  {freeProduct && (
                    <div className="flex-1">
                      <ProductImage product={freeProduct} alt={freeProduct.productName || "Free Product"} borderClass="border-primary" />
                      <div className="mt-2 text-center">
                        <p className="text-sm font-bold">{freeProduct.productName || "Free Product"}</p>
                        <p className="text-xs text-muted-foreground">Size: {freeProduct.selectedSize || "N/A"}</p>
                        <Badge className="mt-1 bg-primary text-black border border-black font-black rounded-full">2nd Pair Free</Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <RadioGroup
                value={shippingMethod}
                onValueChange={(v: "online" | "cod") => setShippingMethod(v)}
                className="space-y-3"
              >
                <div
                  className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                    shippingMethod === "online" ? "border-black bg-primary" : "border-black/20 hover:border-black/50"
                  }`}
                  onClick={() => setShippingMethod("online")}
                >
                  <RadioGroupItem value="online" id="online" className="mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <Label htmlFor="online" className="font-black cursor-pointer">Online Payment</Label>
                      <Badge className="bg-black text-primary text-xs px-2 py-0.5 rounded-full font-bold">Free shipping</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs font-bold">
                        <Zap className="h-3 w-3" /> Save ₹{COD_CHARGE} instantly
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium">
                        <Truck className="h-3 w-3" /> Fast delivery (5–8 days)
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                    shippingMethod === "cod" ? "border-black bg-primary" : "border-black/20 hover:border-black/50"
                  }`}
                  onClick={() => setShippingMethod("cod")}
                >
                  <RadioGroupItem value="cod" id="cod" className="mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <Label htmlFor="cod" className="font-black cursor-pointer">Cash on Delivery</Label>
                      <Badge className="text-black border border-black bg-primary/30 text-xs px-2 py-0.5 rounded-full font-bold">+₹{COD_CHARGE} extra</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Pay when you receive · Choose online to save ₹{COD_CHARGE}
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <Button
                onClick={() => setCurrentStep("details")}
                className="w-full h-12 text-lg font-black mt-6 flex items-center gap-2 rounded-full border border-black bg-primary text-black hover:bg-primary/90"
                size="lg"
              >
                Continue to Details <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-black rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-black">
                <CheckCircle2 className="h-5 w-5 text-primary" /> Delivery Information
              </CardTitle>
              <CardDescription>Enter your details for order delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerDetailsForm customerDetails={customerDetails} handleInputChange={handleInputChange} />
            </CardContent>
          </Card>
        )}
{shippingMethod === "cod" && (
  <div className="flex items-start gap-2 rounded-xl border border-black/15 bg-primary/10 px-3 py-2.5 mt-2">
    <Truck className="h-4 w-4 mt-0.5 shrink-0 text-black/70" />
    <p className="text-xs text-black/70 leading-relaxed">
      ₹{COD_CHARGE} is collected as an advance payment for COD orders. 
    </p>
  </div>
)}
        <Card className="mt-6 border-2 border-black rounded-2xl">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium"><span>Base Price (2 Pairs)</span><span>₹{BASE_PRICE}</span></div>
              {pair1Extra > 0 && <div className="flex justify-between text-sm text-muted-foreground ml-4"><span>Extra – Pair 1</span><span>+₹{pair1Extra}</span></div>}
              {pair2Extra > 0 && <div className="flex justify-between text-sm text-muted-foreground ml-4"><span>Extra – Pair 2</span><span>+₹{pair2Extra}</span></div>}
              <div className="flex justify-between text-sm font-medium">
                <span>Shipping</span>
                {shippingMethod === "online"
                  ? <span className="text-black font-black bg-primary px-2 py-0.5 rounded-full border border-black">FREE SHIPPING</span>
                  : <span>₹{COD_CHARGE}</span>}
              </div>
              <div className="border-t border-black/10 pt-3 flex justify-between font-black text-lg">
                <span>Total Amount</span><span>₹{totalAmount}</span>
              </div>
              {shippingMethod === "cod" && (
                <p className="text-xs text-center font-bold">Switch to Online Payment to save ₹{COD_CHARGE}</p>
              )}
              <div className="border-t border-black/10 pt-3 text-xs text-muted-foreground">
                By placing this order, you agree to the <Link href="/T&C" className="text-black font-bold underline">Terms and Conditions</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {currentStep === "details" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black p-4">
          <div className="container mx-auto px-4 max-w-2xl">
            <Button
              onClick={handleWhatsAppOrder}
              disabled={isLoading}
              className="w-full h-12 text-lg font-black flex items-center gap-2 rounded-full border border-black bg-primary text-black hover:bg-primary/90"
              size="lg"
            >
              {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Preparing Order...</> : `Order via WhatsApp – ₹${totalAmount}`}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">You'll be redirected to WhatsApp to confirm</p>
          </div>
        </div>
      )}
    </main>
  );
}