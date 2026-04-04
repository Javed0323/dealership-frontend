// components/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Car, Home, Search, ArrowLeft, Compass } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-16">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mb-8 relative">
            <div className="inline-block">
              <div className="text-9xl md:text-[200px] font-bold text-gray-900 leading-none">
                404
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Sorry, we couldn't find the page you're looking for. The page may
            have been moved, deleted, or never existed.
          </p>

          {/* Helpful Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-2 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              to="/inventory"
              className="flex items-center justify-center gap-2 px-2 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              <Search className="w-4 h-4" />
              Browse Inventory
            </Link>
            <Link
              to="/specials"
              className="flex items-center justify-center gap-2 px-2 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              <Compass className="w-4 h-4" />
              View Specials
            </Link>
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 px-2 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
