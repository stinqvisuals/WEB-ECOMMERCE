import { NextResponse } from "next/server";
import { checkoutData } from "@/types/checkout";
import { prisma } from "@/lib/prisma";

export const POST = async (request: Request) => {
    let data: checkoutData;

    try {
        const rawBody = await request.text();

        if (!rawBody || rawBody === '') {
            return NextResponse.json({
                error: "Invalid request: empty body",
                details: "No data received from client"
            }, { status: 400 });
        }

        data = JSON.parse(rawBody);
    } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return NextResponse.json({
            error: "Invalid request: invalid JSON",
            details: "Failed to parse request body"
        }, { status: 400 });
    }

    // Validate required data
    if (!data.id) {
        return NextResponse.json({
            error: "Invalid request: missing ID",
            details: "Order ID is required"
        }, { status: 400 });
    }

    // Get Midtrans credentials from environment
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    if (!serverKey || !clientKey) {
        console.error("Missing Midtrans credentials");
        return NextResponse.json({
            error: "Midtrans not configured",
            details: "Server key or client key is missing in environment variables"
        }, { status: 500 });
    }

    // Calculate gross amount
    const price = Number(data.price) || 0;
    const quantity = Number(data.quantity) || 1;

    // Generate a unique order ID by appending timestamp to avoid "order_id already used" errors
    // This allows users to retry payments if the previous attempt failed
    const timestamp = Date.now();
    const orderId = `${data.id}-${timestamp}`;

    // Prepare item details - handle multiple cart items or single item
    let itemDetails;

    if (data.cartItems && data.cartItems.length > 0) {
        // Multiple items from cart
        itemDetails = data.cartItems.map((item: any) => ({
            id: String(item.clothes?.id || item.id),
            name: String(item.clothes?.name || "Product").substring(0, 50),
            price: Number(item.price),
            quantity: Number(item.quantity),
        }));
    } else if (data.clothes) {
        // Single item
        itemDetails = [
            {
                id: String(data.id),
                name: String(data.clothes.name).substring(0, 50),
                price: Number(data.clothes.price),
                quantity: Number(quantity),
            }
        ];
    } else {
        // Fallback
        itemDetails = [
            {
                id: String(data.id),
                name: "Product",
                price: Number(price),
                quantity: Number(quantity),
            }
        ];
    }

    // Recalculate gross amount from item details to ensure accuracy
    const grossAmount = itemDetails.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Get shipping address if available
    const shippingAddress = (data as any).shipping_address;

    // Build customer details with shipping address for Midtrans
    const customerDetails: any = {
        first_name: String(data.user?.name || "Guest"),
        email: String(data.user?.email || "guest@example.com"),
        phone: String(data.user?.phone || ""),
    };

    // Add shipping address if provided
    if (shippingAddress) {
        customerDetails.shipping_address = {
            address: String(shippingAddress.address || ""),
            city: String(shippingAddress.city || ""),
            postal_code: String(shippingAddress.postal_code || ""),
            country: "Indonesia"
        };
        // Also set as billing address
        customerDetails.billing_address = customerDetails.shipping_address;
    }

    const parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: grossAmount,
        },
        credit_card: {
            secure: true,
        },
        customer_details: customerDetails,
        item_details: itemDetails
    };

    console.log("Customer details:", JSON.stringify(customerDetails, null, 2));

    console.log("Creating Midtrans transaction...");
    console.log("Order ID:", orderId);
    console.log("Gross Amount:", grossAmount);

    try {
        const midtransUrl = "https://app.sandbox.midtrans.com/snap/v1/transactions";

        // Create Basic Auth header
        const authHeader = Buffer.from(serverKey + ':').toString('base64');

        const response = await fetch(midtransUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authHeader}`,
            },
            body: JSON.stringify(parameter),
        });

        const responseData = await response.json();

        console.log("Response status:", response.status);

        if (!response.ok) {
            console.error("Midtrans error:", JSON.stringify(responseData));
            return NextResponse.json({
                error: responseData.error_messages?.join(', ') || "Payment initialization failed",
                details: JSON.stringify(responseData),
            }, { status: 500 });
        }

        console.log("Payment token created successfully!");
        console.log("Token:", responseData.token);

        // Note: Payment record will be created in the webhook when payment notification is received
        // This avoids issues with foreign key constraints

        // Return the token
        return NextResponse.json({
            token: responseData.token,
            redirect_url: responseData.redirect_url
        });

    } catch (error: unknown) {
        console.error("=== MIDTRANS ERROR ===");
        console.error("Full error:", error);

        let errorMessage = "Payment initialization failed";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json({
            error: errorMessage,
            details: "Please check your Midtrans configuration"
        }, { status: 500 });
    }
}
