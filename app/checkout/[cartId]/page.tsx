import { Metadata } from 'next'
import CheckoutDetail from '@/components/checkout-detail'
import { auth } from '@/auth'
import { getCartItems } from '@/lib/data'
import { redirect } from 'next/navigation'
import type { CartItemData } from '@/types/checkout'

export const metadata: Metadata = {
    title: 'Checkout',
}

type Props = {
    params: Promise<{ cartId: string }>
}

export default async function CheckoutPage({ params }: Props) {
    const { cartId } = await params
    const session = await auth()

    if (!session?.user?.id) {
        redirect('/signin')
    }

    // Always fetch full user cart for multi-item checkout
    const cartItemsRaw = await getCartItems(session.user.id)

    if (!cartItemsRaw || cartItemsRaw.length === 0) {
        redirect('/cart')
    }

    // Format cartItems same as original checkout page
    const cartItems: CartItemData[] = cartItemsRaw.map((item: any) => ({
        id: item.id!,
        quantity: item.quantity!,
        price: item.price!,
        clothes: {
            id: item.clothes.id!,
            name: item.clothes.name!,
            image: item.clothes.image!,
            price: item.clothes.price!
        }
    }))

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12">
                <CheckoutDetail
                    id={cartId}
                    cartItems={cartItems}
                    user={session.user}
                />
            </div>
        </div>
    )
}

