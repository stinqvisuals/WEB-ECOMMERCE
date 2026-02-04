"use server";

import { prisma } from "@/lib/prisma";
import { ContactSchema, ClothesSchema } from "@/lib/schema";
import { redirect } from "next/navigation";

export const saveClothes = async (image: string, prevState: unknown, formData: FormData) => {
    if (!image) return { message: "Image Is Required." }

    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        quantity: parseInt(formData.get("quantity") as string) || 0,
        price: Number(formData.get("price")),
        amenities: formData.getAll("amenities")
    };

    const validatedFields = ClothesSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors }
    }

    const { name, description, quantity, price, amenities } = validatedFields.data;

    try {
        await prisma.clothes.create({
            data: {
                name,
                description,
                image,
                price,
                quantity,
                ClothesAmenities: {
                    createMany: {
                        data: amenities.map((item) => ({
                            amenitiesId: item
                        }))
                    }
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
    redirect("/admin/clothes");
}

export const ContactMessage = async (prevState: unknown, formData: FormData) => {
    const validatedFields = ContactSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.issues.reduce(
            (acc, issue) => {
                const key = issue.path[0] as string;
                acc[key] = issue.message;
                return acc;
            },
            {} as Record<string, string>
        );

        return { error: fieldErrors };
    }

    const { name, email, subject, message } = validatedFields.data;

    try {
        await prisma.contact.create({
            data: {
                name,
                email,
                subject,
                message
            }
        });
        return { message: "Thanks for contact us." }
    } catch (error) {
        console.log(error);
    }
}