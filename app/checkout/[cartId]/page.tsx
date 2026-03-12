import { Metadata } from 'next'
import CheckoutDetail from '@/components/checkout-detail'
import { auth } from '@/auth'
import { getCartById } from '@/lib/data'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Checkout',
}

type Props = {
    params: Promise<{ cartId: string }>
}

export default async function CheckoutPage({ params }: Props) {
    const { cartId } = await params
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    const cart = await getCartById(cartId)

    if (!cart) {
        redirect('/cart')
    }

    const cartItems = [{
        id: cart.id,
        quantity: cart.quantity,
        price: cart.price,
        clothes: cart.clothes
    }];

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
