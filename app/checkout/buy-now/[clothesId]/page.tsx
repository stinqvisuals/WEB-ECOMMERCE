import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getClothesDetailById } from '@/lib/data'
import CheckoutDetail from '@/components/checkout-detail'
import { CartItemData } from '@/types/checkout'
export const metadata: Metadata = {
    title: 'Buy Now - Checkout',
}

type Props = {
    params: Promise<{ clothesId: string }>
}

export default async function BuyNowCheckoutPage({ params }: Props) {
    const { clothesId } = await params
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    const clothes = await getClothesDetailById(clothesId)

    if (!clothes) {
        redirect('/clothes')
    }

    const cartItems: CartItemData[] = [{
        id: `virtual-${clothesId}`, // Virtual ID, no DB
        quantity: 1,
        price: clothes.price,
        clothes: {
            id: clothes.id,
            name: clothes.name,
            image: clothes.image ?? '/placeholder.jpg', // Fallback if null
            price: clothes.price
        }
    }]

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12">
                <CheckoutDetail
                    id={null as any} // No real cart ID
                    cartItems={cartItems}
                    user={session.user}
                />
            </div>
        </div>
    )
}

