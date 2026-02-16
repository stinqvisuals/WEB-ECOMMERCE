"use server";

import { prisma } from "@/lib/prisma";
import { ContactSchema, ClothesSchema } from "@/lib/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";

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
        });
    } catch (error) {
        console.log("Database Error:", error);
        return { message: "Failed to save clothes. Please try again." }
    }
    revalidatePath("/admin/clothes");
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
        console.log("Contact Error:", error);
        return { message: "Something went wrong." }
    }
}

export const deleteClothes = async (id: string, image: string) => {
    try {
        await del(image);
        await prisma.clothes.delete({
            where: { id }
        })
    } catch (error) {
        console.log(error);
    }
    revalidatePath("/admin/clothes");
}

export const updateClothes = async (prevState: unknown, formData: FormData, image: string, clothesId: string,) => {
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
        await prisma.$transaction([
            prisma.clothes.update({
                where: { id: clothesId },
                data: {
                    name,
                    description,
                    image,
                    price,
                    quantity,
                    ClothesAmenities: {
                        deleteMany: {}
                    }
                }
            }),
            prisma.clothesAmenities.createMany({
                data: amenities.map((item) => ({
                    clothesId,
                    amenitiesId: item
                }))
            })
        ])
    } catch (error) {
        console.log("Database Error:", error);
        return { message: "Failed to save clothes. Please try again." }
    }
    revalidatePath("/admin/clothes");
    redirect("/admin/clothes");
}