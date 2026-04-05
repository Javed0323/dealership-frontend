// Header.tsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone, CarFront } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
}

const navigation: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Inventory", href: "/inventory" },
  { name: "New Arrivals", href: "/new-arrivals" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b transition-shadow duration-300 ${
        isScrolled ? "border-gray-200 shadow-sm" : "border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <CarFront className="h-6 w-6 text-gray-900" strokeWidth={1.5} />
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              AutoElite
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-gray-900 border-b border-gray-900 pb-0.5"
                      : "text-gray-500 hover:text-gray-900"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+5551234567"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Phone className="h-4 w-4" />
              (555) 123-4567
            </a>
            <NavLink
              to="/schedule-test-drive"
              className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors"
            >
              Schedule Test Drive
            </NavLink>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden border-t border-gray-100 bg-white transition-all duration-250 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 py-3 space-y-0.5">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                `block px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pt-2 pb-5 border-t border-gray-100 space-y-3">
          <a
            href="tel:+5551234567"
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Phone className="h-4 w-4" />
            (555) 123-4567
          </a>
          <NavLink
            to="/schedule-test-drive"
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            Schedule Test Drive
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
