export type checkoutData = {
    id: string;
    price: number;
    quantity: number;
    user?: {
        name?: string | null;
        email?: string | null;
        phone?: string | null | undefined;
    } | null;
    clothes?: {
        name: string;
        image: string;
        price: number;
    } | null;
    payments?: {
        id: string;
        method: string | null;
        amount: number;
        status: string;
    }[] | null;
    cartItems?: CartItemData[];
};

export type CartItemData = {
    id: string;
    quantity: number;
    price: number;
    clothes: {
        id: string;
        name: string;
        image: string;
        price: number;
    };
};

