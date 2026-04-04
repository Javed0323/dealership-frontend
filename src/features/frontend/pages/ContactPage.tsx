// pages/ContactPage.tsx
import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  Calendar,
  Navigation,
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredContact: "email" | "phone";
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredContact: "email",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        preferredContact: "email",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [
        "Sales: (555) 123-4567",
        "Service: (555) 123-4568",
        "Parts: (555) 123-4569",
      ],
      action: "Call Sales",
      href: "tel:+5551234567",
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "Sales: sales@autoelite.com",
        "Service: service@autoelite.com",
        "Support: support@autoelite.com",
      ],
      action: "Send Email",
      href: "mailto:sales@autoelite.com",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Auto Avenue", "Los Angeles, CA 90001", "United States"],
      action: "Get Directions",
      href: "https://maps.google.com/?q=123+Auto+Avenue+Los+Angeles+CA",
    },
    {
      icon: Clock,
      title: "Hours",
      details: [
        "Monday-Friday: 9:00 AM - 8:00 PM",
        "Saturday: 10:00 AM - 6:00 PM",
        "Sunday: 11:00 AM - 5:00 PM",
      ],
      action: null,
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com",
      label: "Facebook",
      color: "hover:bg-[#1877f2]",
    },
    {
      icon: Instagram,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:bg-[#e4405f]",
    },
    {
      icon: Twitter,
      href: "https://twitter.com",
      label: "Twitter",
      color: "hover:bg-[#1da1f2]",
    },
    {
      icon: Youtube,
      href: "https://youtube.com",
      label: "YouTube",
      color: "hover:bg-[#ff0000]",
    },
    {
      icon: MessageCircle,
      href: "https://wa.me/15551234567",
      label: "WhatsApp",
      color: "hover:bg-[#25d366]",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Have questions about our vehicles, financing options, or services?
              Our team is here to help you find the perfect driving experience.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group p-6 bg-gray-50 rounded-md hover:shadow-sm transition-all duration-300 hover:-translate-y-0.2"
                >
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <div className="space-y-1 mb-4">
                    {item.details.map((detail, idx) => (
                      <p
                        key={idx}
                        className="text-sm text-gray-600 leading-relaxed"
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                  {item.action && (
                    <a
                      href={item.href}
                      className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors group/link"
                    >
                      {item.action}
                      <span className="ml-1 group-hover/link:translate-x-1 transition-transform">
                        →
                      </span>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>
              </div>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for contacting us. We'll respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-colors bg-white"
                      >
                        <option value="">Select a subject</option>
                        <option value="sales">Sales Inquiry</option>
                        <option value="service">Service Appointment</option>
                        <option value="financing">Financing Options</option>
                        <option value="test-drive">Schedule Test Drive</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="preferredContact"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={formData.preferredContact === "email"}
                          onChange={handleChange}
                          className="mr-2 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="phone"
                          checked={formData.preferredContact === "phone"}
                          onChange={handleChange}
                          className="mr-2 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">Phone</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-64 bg-gray-200 relative">
                  <iframe
                    title="Dealership Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1x3305.594563568457!2d-118.24674278478624!3d34.05410568060417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    className="grayscale hover:grayscale-0 transition-all duration-300"
                  ></iframe>
                </div>
                <div className="p-5 border-t border-gray-100">
                  <a
                    href="https://maps.google.com/?q=123+Auto+Avenue+Los+Angeles+CA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    <Navigation className="h-4 w-4" />
                    Get Directions to Our Dealership
                  </a>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900 rounded-2xl p-6 text-white">
                <div className="flex items-start gap-4 mb-4">
                  <Calendar className="h-8 w-8 text-gray-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Schedule a Test Drive
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Experience your dream car before making a decision. Book
                      your test drive online.
                    </p>
                    <button className="inline-flex items-center text-sm font-medium text-white border border-white/30 hover:bg-white hover:text-gray-900 px-4 py-2 rounded-lg transition-all">
                      Book Now
                      <span className="ml-2">→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Connect With Us
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Follow us on social media for the latest inventory updates,
                  special offers, and more.
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 bg-gray-100 rounded-xl hover:text-white ${social.color} transition-all duration-300 hover:-translate-y-1`}
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our dealership and
              services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">
                Do I need an appointment for a test drive?
              </h3>
              <p className="text-sm text-gray-600">
                While walk-ins are welcome, we recommend scheduling an
                appointment to ensure your preferred vehicle is available.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">
                What financing options are available?
              </h3>
              <p className="text-sm text-gray-600">
                We offer various financing options through our partner lenders.
                Contact our finance department for personalized assistance.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">
                Do you offer trade-in evaluations?
              </h3>
              <p className="text-sm text-gray-600">
                Yes, we provide free trade-in evaluations. You can get an
                instant online estimate or visit our dealership.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">
                What's your service department hours?
              </h3>
              <p className="text-sm text-gray-600">
                Our service department is open Monday-Friday 8 AM-6 PM and
                Saturday 9 AM-4 PM. Closed Sundays.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
