"use client";
import { useActionState } from "react";
import { ContactMessage } from "@/lib/actions";
import clsx from "clsx";

const ContactForm = () => {
    const [state, formAction, isPending] = useActionState(ContactMessage, null)
    return (
        <div className="bg-black p-8 rounded-sm shadow-sm">
            {state?.message ? (
                <div className="p-4 mb-4 text-sm text-gray-800 rounded-lg bg-green-50" role="alert">
                    <div className="font-medium">{state.message}</div>
                </div>
            ) : null}
            <form action={formAction}>
                <div className="grid md:grid-cols-2 gap-7 mt-6">
                    <div>
                        <input type="text" name="name" className="bg-transparent p-3 border border-gray-200 rounded-sm w-full font-light" placeholder="Name*" />
                        <div aria-live="polite" aria-atomic="true">
                            <p className="text-sm text-red-600 mt-2">{state?.error?.name}</p>
                        </div>
                    </div>
                    <div>
                        <input type="email" name="email" className="bg-transparent p-3 border border-gray-200 rounded-sm w-full font-light" placeholder="Johndoe@sample.com*" />
                        <div aria-live="polite" aria-atomic="true">
                            <p className="text-sm text-red-600 mt-2">{state?.error?.email}</p>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <input type="text" name="subject" className="bg-transparent p-3 border border-gray-200 rounded-sm w-full font-light" placeholder="Subject*" />
                        <div aria-live="polite" aria-atomic="true">
                            <p className="text-sm text-red-600 mt-2">{state?.error?.subject}</p>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <textarea name="message" rows={5} className="bg-transparent p-3 border border-gray-200 rounded-sm w-full 
                        font-light" placeholder="Your Message*"></textarea>
                        <div aria-live="polite" aria-atomic="true">
                            <p className="text-sm text-red-600 mt-2 mb-2">{state?.error?.message}</p>
                        </div>
                    </div>
                </div>
                <button type="submit" className={clsx("px-10 text-center py-4 font-semibold text-white w-full bg-red-600 rounded-sm hover:bg-red-700 cursor-pointer",
                    {
                        "opacity-50 cursor-progress animate-pulse": isPending,
                    })}
                    disabled={isPending}>{isPending ? "Loading..." : "Send Message"}</button>
            </form>
        </div>
    );
};

export default ContactForm;