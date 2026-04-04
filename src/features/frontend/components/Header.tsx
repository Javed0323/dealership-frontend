// Header.tsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, Car, Phone } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navigation: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "Inventory", href: "/inventory" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Helper function to determine if link is active
  const isActiveLink = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-18">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 group">
            <Car
              className="h-7 w-7 text-gray-900 transition-transform group-hover:scale-105"
              strokeWidth={1.5}
            />
            <span className="text-xl font-semibold tracking-tight text-gray-900">
              AutoElite
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = isActiveLink(item.href);
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive: navIsActive }) => {
                    const active = navIsActive || isActive;
                    return `relative text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`;
                  }}
                >
                  {({ isActive: navIsActive }) => {
                    const active = navIsActive || isActiveLink(item.href);
                    return (
                      <>
                        {item.name}
                        {/* Active indicator underline */}
                        {active && (
                          <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
                        )}
                      </>
                    );
                  }}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:+5551234567"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Phone className="h-4 w-4 mr-2" />
              (555) 123-4567
            </a>
            <NavLink
              to="/schedule-test-drive"
              className={({ isActive }) => `
                inline-flex items-center px-5 py-2 text-sm font-medium rounded-full transition-all duration-200
                ${
                  isActive
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md"
                }
              `}
            >
              Schedule Test Drive
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="border-t border-gray-100 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = isActiveLink(item.href);
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive: navIsActive }) => {
                    const active = navIsActive || isActive;
                    return `block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`;
                  }}
                >
                  {item.name}
                </NavLink>
              );
            })}

            <div className="pt-4 mt-2 border-t border-gray-100 space-y-3 px-4">
              <a
                href="tel:+5551234567"
                className="flex items-center py-2 text-base font-medium text-gray-600 hover:text-gray-900"
              >
                <Phone className="h-5 w-5 mr-3" />
                (555) 123-4567
              </a>
              <NavLink
                to="/schedule-test-drive"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `
                  inline-flex items-center justify-center w-full px-4 py-3 text-base font-medium rounded-xl transition-colors
                  ${
                    isActive
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }
                `}
              >
                Schedule Test Drive
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
