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
  ChevronRight,
} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "New Inventory", href: "/inventory" },
    { name: "Pre-Owned Inventory", href: "/inventory" },
    { name: "Special Offers", href: "/specials" },
    { name: "Trade-In Value", href: "/trade-in" },
    { name: "Financing", href: "/financing" },
  ];

  const serviceLinks = [
    { name: "Schedule Service", href: "/service" },
    { name: "Service Specials", href: "/specials" },
    { name: "Parts Center", href: "/parts" },
  ];

  const aboutLinks = [
    { name: "About Us", href: "/about" },
    { name: "Customer Reviews", href: "/testimonials" },
    { name: "Blog & News", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Accessibility", href: "/accessibility" }, // Add this
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-white" strokeWidth={1.5} />
              <span className="text-xl font-semibold tracking-tight text-white">
                AutoElite
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted partner in finding the perfect vehicle. Premium
              selection, exceptional service, and transparent pricing.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>123 Auto Avenue, Los Angeles, CA 90001</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="h-4 w-4 shrink-0" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@autoelite.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                  >
                    <ChevronRight className="h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service & Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Service & Support
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                  >
                    <ChevronRight className="h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Social */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              About AutoElite
            </h3>
            <ul className="space-y-3 mb-6">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                  >
                    <ChevronRight className="h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {currentYear} AutoElite. All rights reserved.</p>
            <div className="flex space-x-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
