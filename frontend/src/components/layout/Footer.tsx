import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About E-Shop</h3>
            <p className="text-gray-300">
              Your trusted e-commerce destination for quality products and great prices.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/" className="hover:text-white transition">
                  Products
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:text-white transition">
                  Cart
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition">
                  Account
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-300">
              Email: support@eshop.com
              <br />
              Phone: 1-800-ESHOP
            </p>
          </div>
        </div>

        <hr className="border-gray-700" />

        <div className="pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} E-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
