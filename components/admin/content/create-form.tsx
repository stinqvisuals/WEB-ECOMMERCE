"use client";

import { useRef, useState, useTransition } from "react";
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";
import { saveClothes } from "@/lib/actions";
import Image from "next/image";
import { type PutBlobResult } from "@vercel/blob";
import { Amenities } from "@prisma/client";
import { useActionState } from "react";
import clsx from "clsx";

export default function CreateForm({ amenities }: { amenities: Amenities[] }) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleUpload = () => {
        if (!inputFileRef.current?.files?.[0]) return;

        const file = inputFileRef.current.files[0];
        const formData = new FormData();
        formData.append("file", file);

        startTransition(async () => {
            try {
                const res = await fetch("/api/upload", {
                    method: "PUT",
                    body: formData,
                });

                const data = await res.json();

                if (!res.ok) {
                    setErrorMessage(data.message || "Upload failed");
                    return;
                }

                const blob = data as PutBlobResult;
                setImageUrl(blob.url);
                setErrorMessage("");
            } catch (error) {
                console.error(error);
                setErrorMessage("Upload error");
            }
        });
    };

    const deleteImage = (image: string) => {
        startTransition(async () => {
            try {
                await fetch(`/api/upload/?imageUrl=${image}`, {
                    method: "DELETE",
                });
                setImageUrl(null);
            } catch (error) {
                console.log(error);
            }
        });
    };

    const [state, formAction,] = useActionState(saveClothes.bind(null, imageUrl ?? ""), null);

    return (
        <form action={formAction} className="w-full">
            <div className="grid md:grid-cols-12 gap-6">
                {/* LEFT */}
                <div className="md:col-span-8 bg-black p-6">
                    <input
                        name="name"
                        placeholder="Content Name..."
                        className="w-full mb-4 bg-transparent border border-gray-300 px-4 py-3 rounded-sm text-white"
                    />
                    <div aria-live="polite" aria-atomic="true">
                        <span className="text-sm text-red-600 mt-2">{state?.error?.name}</span>
                    </div>

                    <textarea
                        name="description"
                        rows={8}
                        placeholder="Description..."
                        className="w-full mb-4 bg-transparent border border-gray-300 px-4 py-3 rounded-sm text-white"
                    />
                    <div aria-live="polite" aria-atomic="true">
                        <span className="text-sm text-red-600 mt-2">{state?.error?.description}</span>
                    </div>

                    {amenities.map((item) => (
                        <div className="flex items-center mb-4" key={item.id}>
                            <label className="flex items-center gap-2 text-white">
                                <input type="checkbox" name="amenities" defaultValue={item.id} />
                                {item.name}
                            </label>
                        </div>
                    ))}
                    <div aria-live="polite" aria-atomic="true">
                        <span className="text-sm text-red-600 mt-2">{state?.error?.amenities}</span>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="md:col-span-4 bg-black p-6">
                    <div className="relative w-full h-56 mb-4 border-2 border-dashed border-gray-300 rounded-md overflow-hidden">
                        <input
                            ref={inputFileRef}
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className="hidden"
                        />

                        {imageUrl && (
                            <Image
                                src={imageUrl}
                                alt="Preview"
                                fill
                                className="object-cover pointer-events-none"
                                priority
                            />
                        )}

                        <label
                            htmlFor="image-upload"
                            className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-white text-center px-4
                            ${imageUrl ? "bg-black/40 opacity-0 hover:opacity-100 transition" : ""}
                            `}
                        >
                            {imageUrl ? (
                                <button
                                    type="button"
                                    onClick={() => deleteImage(imageUrl)}
                                    className="absolute right-1 top-1 size-6 flex items-center justify-center rounded-sm hover:bg-red-600"
                                >
                                    <IoTrashOutline className="size-4 text-white" />
                                </button>
                            ) : (
                                <>
                                    <IoCloudUploadOutline className="text-4xl mb-2" />
                                    <p className="font-semibold">Select Image</p>
                                    <p className="text-xs text-gray-300">
                                        PNG, JPG, GIF (Max 4MB)
                                    </p>

                                    {/* PENDING BAR TEPAT DI BAWAH TEKS */}
                                    {isPending && (
                                        <div className="w-full mt-3 h-1 bg-gray-700 overflow-hidden">
                                            <div className="h-full w-1/2 bg-red-600 animate-pulse" />
                                        </div>
                                    )}
                                </>
                            )}

                            {errorMessage && (
                                <p className="text-xs text-red-500 mt-2">{errorMessage}</p>
                            )}
                        </label>
                    </div>

                    <input
                        name="quantity"
                        placeholder="Quantity..."
                        className="w-full mb-4 bg-transparent border border-gray-300 px-4 py-2 rounded-sm text-white"
                    />
                    <div aria-live="polite" aria-atomic="true">
                        <span className="text-sm text-red-600 mt-2">{state?.error?.quantity}</span>
                    </div>

                    <input
                        name="price"
                        placeholder="Price..."
                        className="w-full mb-4 bg-transparent border border-gray-300 px-4 py-2 rounded-sm text-white"
                    />
                    <div aria-live="polite" aria-atomic="true">
                        <span className="text-sm text-red-600 mt-2">{state?.error?.price}</span>
                    </div>
                    {/*General Message*/}
                    {state?.message ? (
                        <div className="mb-4 bg-red-600 p-2">
                            <span className="text-sm text-gray-100 mt-2">{state.message}</span>
                        </div>
                    ) : null}
                    <button
                        type="submit"
                        className={clsx("w-full bg-red-600 hover:bg-red-700 text-white py-3 font-semibold rounded-sm", {
                            "opacity-50 cursor-progress": isPending,
                        })}
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </form>
    );
};