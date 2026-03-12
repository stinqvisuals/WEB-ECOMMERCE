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

// Server action to create test data for dashboard
export async function createTestData() {
    try {
        // Get first user
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log("No users found");
            return;
        }

        // Get first clothes
        const clothes = await prisma.clothes.findFirst();
        if (!clothes) {
            console.log("No clothes found");
            return;
        }

        // Create test cart with payment
        const testCart = await prisma.cart.create({
            data: {
                userId: user.id,
                clothesId: clothes.id,
                price: 150000,
                quantity: 2,
            }
        });

        // Create payment with status "paid"
        await prisma.payment.create({
            data: {
                cartId: testCart.id,
                amount: 300000,
                status: "paid",
                method: "credit_card"
            }
        });

        console.log("Test data created:", testCart);
        revalidatePath("/admin/dashboard");
    } catch (error) {
        console.error("Error creating test data:", error);
    }
}

// Server action to delete test data
export async function deleteTestData() {
    try {
        // Log only - DISABLED delete for data persistence
        console.log("Test data delete called - DISABLED for persistence. All carts safe!");
        revalidatePath("/admin/dashboard");
    } catch (error) {
        console.error("Error in deleteTestData:", error);
    }
}
