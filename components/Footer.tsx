import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-9">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company Info */}
          <div className="lg:pr-8">
            <Image
              src="/STINQ LOGO CHROME WHITE.png"
              width={100}
              height={25}
              alt="logo"
              className="mb-6"
            />
            <p className="text-gray-400 leading-relaxed">
              Choose Your Best. Your trusted e-commerce platform for quality products and exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="#" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="#" className="hover:text-white transition">Support</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Submission Guidelines</Link></li>
              <li><Link href="#" className="hover:text-white transition">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Stay Updated</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>

            <div className="flex w-full">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full min-w-0 px-4 py-3 bg-gray-800 text-white border border-gray-700 
                 rounded-l-md focus:outline-none focus:border-red-600"
              />
              <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white 
                       rounded-r-md whitespace-nowrap transition">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 Stinq. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;