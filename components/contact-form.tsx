

const ContactForm = () => {
    return (
        <div className="bg-black p-8 rounded-sm shadow-sm">
            <form action="">
                <div className="grid md:grid-cols-2 gap-7 mt-6">
                    <div>
                        <input type="text" name="name" className="bg-transparent p-3 border border-gray-200 rounded-sm w-full font-light" placeholder="Name*" />
                        <div aria-live="polite" aria-atomic="true">
                            <p className="text-sm text-red-600 mt-2">Message</p>
                        </div>
                    </div>
                    <div>
                        <input type="email" name="email" className="bg-transparent p-3 border border-gray-200 rounded-sm w-full font-light" placeholder="Johndoe@sample.com*" />
                        <div aria-live="polite" aria-atomic="true">
                            <p className="text-sm text-red-600 mt-2">Message</p>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <input type="text" name="subject" className="bg-transparent p-3 border border-gray-200 rounded-sm w-full font-light" placeholder="Subject*" />
                        <div aria-live="polite" aria-atomic="true">
                            <p className="text-sm text-red-600 mt-2">Message</p>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <textarea name="message" rows={5} className="bg-transparent p-3 border border-gray-200 rounded-sm w-full 
                        font-light" placeholder="Your Message*" ></textarea>
                        <div aria-live="polite" aria-atomic="true">
                            <p className="text-sm text-red-600 mt-2">Message</p>
                        </div>
                    </div>
                </div>
                <button type="submit" className="px-10 text-center py-4 font-semibold text-white w-full 
                bg-red-600 rounded-sm hover:bg-red-700 cursor-pointer">Send Message</button>
            </form>
        </div>
    )
}

export default ContactForm