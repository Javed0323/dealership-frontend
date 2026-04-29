// Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const inventoryLinks = [
    { name: "Browse Inventory", href: "/inventory" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Featured Inventory", href: "/featured-inventory" },
    { name: "Special Offers", href: "/offers" },
  ];

  const servicesLinks = [
    { name: "Schedule a Test Drive", href: "/schedule-test-drive" },
    { name: "Customer Reviews", href: "/user-reviews" },
    { name: "Blog & News", href: "/blogs" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Accessibility", href: "/accessibility" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter / X" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400" aria-label="Site footer">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column — spans 2 cols on lg */}
          <div className="lg:col-span-2 space-y-5">
            {/* Logo */}
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-white group"
              aria-label="AutoElite — go to homepage"
            >
              <span className="text-lg font-semibold tracking-tight">
                AutoElite
              </span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Your trusted partner in finding the perfect vehicle — premium
              selection, exceptional service, and transparent pricing.
            </p>

            {/* Contact — structured for SEO / rich snippets */}
            <address className="not-italic space-y-2.5 text-sm text-gray-500">
              <div className="flex items-start gap-3">
                <MapPin
                  className="h-4 w-4 mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span>123 Auto Avenue, Los Angeles, CA 90001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a
                  href="tel:+15551234567"
                  className="hover:text-white transition-colors"
                >
                  (555) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a
                  href="mailto:info@autoelite.com"
                  className="hover:text-white transition-colors"
                >
                  info@autoelite.com
                </a>
              </div>
            </address>

            {/* Social */}
            <div className="flex gap-2 pt-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-2 border border-gray-800 hover:border-gray-600 hover:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Inventory */}
          <nav aria-label="Inventory links">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
              Inventory
            </h3>
            <ul className="space-y-3">
              {inventoryLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services links">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company links">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© {currentYear} AutoElite. All rights reserved.</p>
          <nav
            aria-label="Legal links"
            className="flex flex-wrap gap-x-5 gap-y-1 justify-center"
          >
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
