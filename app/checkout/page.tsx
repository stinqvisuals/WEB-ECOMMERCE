import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCartItems } from "@/lib/data";
import CheckoutDetail from "@/components/checkout-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout",
};

const CheckoutPage = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/signin");
    }

    const cartItemsRaw = await getCartItems(session.user.id);

    if (!cartItemsRaw || cartItemsRaw.length === 0) {
        redirect("/cart");
    }

    const cartItems = cartItemsRaw.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        clothes: {
            id: item.clothes.id,
            name: item.clothes.name,
            image: item.clothes.image,
            price: item.clothes.price
        }
    }));

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12">
                <CheckoutDetail
                    cartItems={cartItems}
                    user={session.user}
                />
            </div>
        </div>
    );
};

export default CheckoutPage;

