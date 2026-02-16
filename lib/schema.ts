import { string, z, array, coerce } from "zod";

export const ClothesSchema = z.object({
    name: z.string().min(1, { message: "Name must be at least 6 characters" }),
    description: z.string().min(50, { message: "Description must be at least 50 characters" }),
    quantity: z.number().gt(0, { message: "Please input the quantity" }),
    price: z.coerce.number().gt(0, { message: "Please input the price" }),
    amenities: array(z.string()).nonempty({ message: "Please check the content" }),
})

export const ContactSchema = z.object({
    name: z.string().min(6, {
        message: "Name must be at least 6 characters",
    }),

    email: z.email({ message: "Please enter a valid email" })
        .min(6, { message: "Email at least 6 characters" }),

    subject: z.string().min(6, {
        message: "Subject must be at least 6 characters",
    }),

    message: z
        .string()
        .min(50, { message: "Message must be at least 50 characters" })
        .max(200, { message: "Message maximum 200 characters" }),
});
