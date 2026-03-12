"use client";

import { useTransition, useState } from "react";
import { checkoutData } from "@/types/checkout";

// Midtrans Snap callback result types
interface SnapPaymentResult {
    order_id?: string;
    transaction_id?: string;
    transaction_status?: string;
    gross_amount?: string;
    payment_type?: string;
    signature_key?: string;
    status_code?: string;
    status_message?: string;
}

declare global {
    interface Window {
        snap: {
            pay: (token: string, options?: {
                onSuccess?: (result: SnapPaymentResult) => void;
                onPending?: (result: SnapPaymentResult) => void;
                onError?: (result: SnapPaymentResult) => void;
                onClose?: () => void;
            }) => void;
        }
    }
}

// Function to load Midtrans Snap script dynamically
const loadSnapScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Check if script already loaded
        if (window.snap) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.async = true;

        // Get client key from environment variable
        const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

        if (!clientKey) {
            reject(new Error("Midtrans Client Key is not configured"));
            return;
        }

        script.setAttribute("data-client-key", clientKey);

        script.onload = () => {
            console.log("Midtrans Snap script loaded successfully");
            resolve();
        };

        script.onerror = () => {
            reject(new Error("Failed to load Midtrans Snap script"));
        };

        document.head.appendChild(script);
    });
};

// Check if snap is available
const isSnapLoaded = (): boolean => {
    return typeof window !== "undefined" && !!window.snap;
};

const PaymentButton = ({
    checkoutData
}: {
    checkoutData: checkoutData
}) => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [isLoadingSnap, setIsLoadingSnap] = useState(false);

    // Function to get shipping address from form
    const getShippingAddress = (): { address: string; city: string; postalCode: string; phone: string } => {
        const addressEl = document.getElementById("address") as HTMLTextAreaElement | null;
        const cityEl = document.getElementById("city") as HTMLInputElement | null;
        const postalCodeEl = document.getElementById("postalCode") as HTMLInputElement | null;
        const phoneEl = document.getElementById("phone") as HTMLInputElement | null;

        return {
            address: addressEl?.value || "",
            city: cityEl?.value || "",
            postalCode: postalCodeEl?.value || "",
            phone: phoneEl?.value || ""
        };
    };

    const handlePayment = async () => {
        setError(null);

        startTransition(async () => {
            try {
                // Get shipping address from form
                const shipping = getShippingAddress();

                // Validate shipping address
                if (!shipping.address.trim()) {
                    setError("Please enter your shipping address");
                    return;
                }
                if (!shipping.city.trim()) {
                    setError("Please enter your city");
                    return;
                }
                if (!shipping.postalCode.trim()) {
                    setError("Please enter your postal code");
                    return;
                }
                if (!shipping.phone.trim()) {
                    setError("Please enter your phone number");
                    return;
                }

                // First, ensure Snap script is loaded
                if (!isSnapLoaded()) {
                    setIsLoadingSnap(true);
                    console.log("Loading Midtrans Snap script...");
                    await loadSnapScript();
                    setIsLoadingSnap(false);
                    console.log("Midtrans Snap is ready");
                }

                // Merge checkout data with shipping address
                const paymentData = {
                    ...checkoutData,
                    shipping_address: {
                        address: shipping.address,
                        city: shipping.city,
                        postal_code: shipping.postalCode
                    },
                    user: checkoutData.user ? {
                        ...checkoutData.user,
                        phone: shipping.phone || checkoutData.user.phone
                    } : {
                        name: "Guest",
                        email: "guest@example.com",
                        phone: shipping.phone
                    }
                };

                // Call the payment API
                const response = await fetch("/api/payment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(paymentData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Payment API error:", errorData);
                    throw new Error(errorData.error || errorData.details || "Failed to create payment");
                }

                const data = await response.json();
                const token = data.token;
                const redirect_url = data.redirect_url;

                if (token) {
                    // Open Midtrans payment page
                    window.snap.pay(token, {
                        onSuccess: async (result: SnapPaymentResult) => {
                            console.log("=== PAYMENT SUCCESS ===");
                            console.log("Result:", result);
                            console.log("Cart Items to process:", checkoutData.cartItems);

                            // Update payment status in database FIRST - do NOT delete cart
                            try {
                                // Check if multiple cart items
                                const cartItems = checkoutData.cartItems;
                                const totalAmount = checkoutData.price;
                                const primaryCartId = cartItems && cartItems.length > 0 ? cartItems[0].id : checkoutData.id;

                                console.log("Processing payment for:", {
                                    cartItemsCount: cartItems?.length,
                                    totalAmount,
                                    primaryCartId
                                });

                                // For multi-item checkout, update payment for ALL cart items FIRST
                                if (cartItems && cartItems.length > 0) {
                                    console.log("Updating payments for all cart items...");

                                    for (const item of cartItems) {
                                        const itemTotal = item.price * item.quantity;
                                        console.log(`Calling payment notification for item ${item.id}: price=${item.price}, qty=${item.quantity}, total=${itemTotal}`);

                                        const notificationResponse = await fetch("/api/payment/notification", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                order_id: item.id,
                                                transaction_status: "settlement",
                                                status_code: "200",
                                                gross_amount: itemTotal,
                                                signature_key: "demo",
                                                payment_type: result.payment_type || "credit_card"
                                            }),
                                        });

                                        const notificationResult = await notificationResponse.json();
                                        console.log("Payment notification response:", notificationResult);
                                    }
                                    console.log("All payment statuses updated successfully");
                                } else {
                                    // Single item - use original checkoutData.id
                                    console.log("Single item payment update, id:", checkoutData.id);
                                    const updateResponse = await fetch("/api/payment/notification", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            order_id: checkoutData.id,
                                            transaction_status: "settlement",
                                            status_code: "200",
                                            gross_amount: checkoutData.price,
                                            signature_key: "demo",
                                            payment_type: result.payment_type || "credit_card"
                                        }),
                                    });

                                    console.log("Update response:", updateResponse);
                                    if (updateResponse.ok) {
                                        const resultData = await updateResponse.json();
                                        console.log("Payment status updated successfully:", resultData);
                                    }
                                }
                            } catch (updateError) {
                                console.error("Failed to update payment status:", updateError);
                            }

                            // Redirect to success page - DO NOT delete cart, keep data for dashboard
                            setTimeout(() => {
                                window.location.href = `/checkout/${checkoutData.id}`;
                            }, 2000);
                        },
                        onPending: (result: SnapPaymentResult) => {
                            console.log("Payment pending:", result);
                            window.location.href = `/checkout/${checkoutData.id}`;
                        },
                        onError: (result: SnapPaymentResult) => {
                            console.error("Payment error:", result);
                            setError("Payment failed. Please try again.");
                        },
                        onClose: () => {
                            console.log("Customer closed the payment popup");
                        },
                    });
                } else if (redirect_url) {
                    // Fallback: redirect to Midtrans page
                    window.location.href = redirect_url;
                }
            } catch (error: unknown) {
                console.error("Payment error:", error);
                const errorMessage = error instanceof Error ? error.message : "An error occurred. Please try again.";
                setError(errorMessage);
                setIsLoadingSnap(false);
            }
        });
    };

    const isDisabled = isPending || isLoadingSnap;
    const buttonText = isLoadingSnap ? "Loading..." : isPending ? "Processing..." : "Place Order";

    return (
        <div>
            {error && (
                <div className="mb-3 p-3 bg-red-500/20 border border-red-500 rounded-sm text-red-200 text-sm">
                    {error}
                </div>
            )}
            <button
                onClick={handlePayment}
                disabled={isDisabled}
                className={`px-10 py-4 mt-4 text-center text-black w-full bg-white 
                    rounded-sm hover:bg-gray-200 transition cursor-pointer
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {buttonText}
            </button>
        </div>
    );
}

export default PaymentButton;
