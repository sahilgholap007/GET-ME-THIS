import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa"

const FooterComponent = () => {
  return (
    <footer className="bg-black text-white pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 text-left mb-16">
          {/* Column 1: Logo & About */}
          <div className="flex flex-col items-start">
            <h1 className="text-xl sm:text-2xl font-monument-regular mb-4 sm:mb-6 tracking-widest">GETMETHIS<sup className="text-lg sm:text-xl md:text-lg lg:text-lg align-super">®</sup></h1>

            <p className="text-gray-400 leading-relaxed font-sf-pro-display-thin-italic tracking-wide max-w-xs mb-6 text-sm sm:text-base">
              Making global products accessible for everyone in India. Your personal shopping assistant for worldwide delivery.
            </p>
            <div className="flex gap-3 sm:gap-4 mb-6 justify-start">
              <a
                href="#"
                className="bg-gray-800 hover:bg-white hover:text-black p-2 sm:p-3 transition-all duration-300 border border-gray-700 hover:border-white group"
                aria-label="Facebook"
              >
                <FaFacebookF className="group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-white hover:text-black p-2 sm:p-3 transition-all duration-300 border border-gray-700 hover:border-white group"
                aria-label="Twitter"
              >
                <FaTwitter className="group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-white hover:text-black p-2 sm:p-3 transition-all duration-300 border border-gray-700 hover:border-white group"
                aria-label="Instagram"
              >
                <FaInstagram className="group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-white hover:text-black p-2 sm:p-3 transition-all duration-300 border border-gray-700 hover:border-white group"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
            <div className="text-gray-400 text-sm font-sf-pro-display-thin-italic space-y-2 tracking-wide text-left">
              <p>support@getmethis.com</p>
              <p>+91 98765 43210</p>
              <p className="text-xs">Available 24/7 for assistance</p>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-base sm:text-lg font-sf-pro-display-medium mb-4 sm:mb-6 tracking-widest uppercase">Services</h3>

            <ul className="space-y-4 text-gray-400 ">
              <li>
                <a href="/user-dashboard/personal-shopper" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Personal Shopper
                </a>
              </li>
              <li>
                <a href="/user-dashboard/global-shopping" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Global Shopping
                </a>
              </li>
              <li>
                <a href="/user-dashboard/cost-calculator" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Cost Calculator
                </a>
              </li>
              <li>
                <a href="/user-dashboard/choose-carrier" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Choose Carrier
                </a>
              </li>
              <li>
                <a href="/user-dashboard/shipments" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Track Shipments
                </a>
              </li>
              <li>
                <a href="/user-dashboard/address-book" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Global Addresses
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Account & Support */}
          <div>
            <h3 className="text-base sm:text-lg font-sf-pro-display-medium mb-4 sm:mb-6 tracking-widest uppercase">Account & Support</h3>

            <ul className="space-y-4 text-gray-400 font-sf-pro-display-regular">
              <li>
                <a href="/login" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Sign Up
                </a>
              </li>
              <li>
                <a href="/user-dashboard/my-account" className="hover:text-white transition-colors duration-300 tracking-wide">
                  My Account
                </a>
              </li>
              <li>
                <a href="/user-dashboard/billing" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Billing
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-white transition-colors duration-300 tracking-wide">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Information */}
          <div>
            <h3 className="text-base sm:text-lg font-sf-pro-display-medium mb-4 sm:mb-6 tracking-widest uppercase">Legal & Info</h3>

            <ul className="space-y-4 text-gray-400 font-sf-pro-display-regular">
              <li>
                <a href="/information/terms" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/information/privacy-policy" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/information/refunds" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="/information/restricted-items" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Restricted Items
                </a>
              </li>
              <li>
                <a href="/user-dashboard/compliance" className="hover:text-white transition-colors duration-300 tracking-wide">
                  Compliance
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-white transition-colors duration-300 tracking-wide">
                  About GetMeThis
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
          <p className="text-gray-500 text-sm font-sf-pro-display-thin-italic tracking-widest">
            © {new Date().getFullYear()} GETMETHIS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent
