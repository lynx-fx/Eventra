import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0c] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl font-bold text-white">
                Eventra
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your premier destination for securing tickets to the most happening concerts, sports matches, and theater shows.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all">
                <FaYoutube />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Discover Nepal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Kathmandu Concerts</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Pokhara Events</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Thamel Nightlife</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Music Festivals</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Cultural Shows</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Sell Tickets</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for early access to tickets.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-[#1c1c1e] border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-full focus:outline-none focus:border-purple-600 transition-colors" />
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
          <p>&copy; {new Date().getFullYear()} Eventra Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;