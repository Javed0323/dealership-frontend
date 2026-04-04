// components/Specials.tsx
import React, { useState } from "react";
import {
  Tag,
  Calendar,
  Gift,
  Car,
  Wrench,
  CreditCard,
  ChevronRight,
  Clock,
} from "lucide-react";

interface Special {
  id: number;
  title: string;
  description: string;
  type: "vehicle" | "service" | "financing";
  discount: string;
  validUntil: string;
  imageUrl: string;
  terms?: string;
  featured?: boolean;
}

const Specials: React.FC = () => {
  const [selectedType, setSelectedType] = useState<
    "all" | "vehicle" | "service" | "financing"
  >("all");

  const specials: Special[] = [
    {
      id: 1,
      title: "Spring Clearance Event",
      description:
        "Up to $5,000 off select 2025 models. All remaining inventory must go!",
      type: "vehicle",
      discount: "Save $5,000",
      validUntil: "April 30, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=500&fit=crop",
      featured: true,
      terms: "Excludes specialty vehicles. See dealer for details.",
    },
    {
      id: 2,
      title: "0% APR Financing",
      description:
        "Qualified buyers get 0% APR for 60 months on all new electric vehicles.",
      type: "financing",
      discount: "0% APR for 60 months",
      validUntil: "May 15, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop",
      featured: true,
      terms:
        "Well-qualified buyers only. 0% APR for 60 months at $16.67 per month per $1,000 financed.",
    },
    {
      id: 3,
      title: "Oil Change Special",
      description:
        "Full synthetic oil change + multi-point inspection. Includes tire rotation.",
      type: "service",
      discount: "$49.95",
      validUntil: "June 30, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&h=500&fit=crop",
      terms:
        "Most vehicles. Additional charges may apply for synthetic blend or diesel.",
    },
    {
      id: 4,
      title: "Trade-In Bonus",
      description:
        "Get an extra $1,000 on your trade when you purchase any new vehicle.",
      type: "vehicle",
      discount: "+$1,000 Trade Bonus",
      validUntil: "April 25, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop",
      terms: "Trade-in vehicle must be 2010 or newer. Some restrictions apply.",
    },
    {
      id: 5,
      title: "Military & First Responder Appreciation",
      description:
        "Active duty military, veterans, and first responders save an additional $500.",
      type: "financing",
      discount: "$500 Bonus",
      validUntil: "December 31, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&h=500&fit=crop",
      featured: true,
      terms: "Valid ID required. Cannot combine with other offers.",
    },
    {
      id: 6,
      title: "Brake Service Special",
      description:
        "Complete brake pad replacement + rotor resurfacing. Free brake inspection.",
      type: "service",
      discount: "$199.95",
      validUntil: "May 31, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1486262715007-ee61f2a2bd3a?w=800&h=500&fit=crop",
      terms: "Per axle. Most vehicles. Additional parts may be extra.",
    },
  ];

  const filteredSpecials =
    selectedType === "all"
      ? specials
      : specials.filter((special) => special.type === selectedType);

  const featuredSpecials = filteredSpecials.filter(
    (special) => special.featured,
  );
  const regularSpecials = filteredSpecials.filter(
    (special) => !special.featured,
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vehicle":
        return <Car className="w-5 h-5" />;
      case "service":
        return <Wrench className="w-5 h-5" />;
      case "financing":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Tag className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "vehicle":
        return "bg-blue-100 text-blue-700";
      case "service":
        return "bg-green-100 text-green-700";
      case "financing":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Current Specials & Promotions
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Limited-time offers to help you save on your next vehicle,
              service, or financing.
            </p>
          </div>
        </div>
      </div>

      {/* Type Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          {[
            {
              id: "all",
              label: "All Offers",
              icon: <Tag className="w-4 h-4" />,
            },
            {
              id: "vehicle",
              label: "Vehicle Specials",
              icon: <Car className="w-4 h-4" />,
            },
            {
              id: "service",
              label: "Service Specials",
              icon: <Wrench className="w-4 h-4" />,
            },
            {
              id: "financing",
              label: "Financing Offers",
              icon: <CreditCard className="w-4 h-4" />,
            },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id as any)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition ${
                selectedType === type.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {type.icon}
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Specials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Specials */}
        {featuredSpecials.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Offers
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredSpecials.map((special) => (
                <div
                  key={special.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-48 md:h-full">
                      <img
                        src={special.imageUrl}
                        alt={special.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${getTypeColor(special.type)}`}
                        >
                          {getTypeIcon(special.type)}
                          <span className="capitalize">{special.type}</span>
                        </span>
                        {special.featured && (
                          <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-2 py-1 rounded-full flex items-center gap-1">
                            <Gift className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {special.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {special.description}
                      </p>
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                          {special.discount}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Expires: {special.validUntil}
                        </span>
                      </div>
                      {special.terms && (
                        <p className="text-xs text-gray-400 mt-2">
                          {special.terms}
                        </p>
                      )}
                      <button className="mt-4 text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition">
                        Learn More <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Specials */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedType === "all"
              ? "All Offers"
              : selectedType === "vehicle"
                ? "Vehicle Specials"
                : selectedType === "service"
                  ? "Service Specials"
                  : "Financing Offers"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularSpecials.map((special) => (
              <div
                key={special.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={special.imageUrl}
                    alt={special.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col grow">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${getTypeColor(special.type)}`}
                    >
                      {getTypeIcon(special.type)}
                      <span className="capitalize">{special.type}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {special.validUntil}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {special.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {special.description}
                  </p>

                  <div className="mb-3">
                    <span className="text-xl font-bold text-blue-600">
                      {special.discount}
                    </span>
                  </div>

                  {special.terms && (
                    <p className="text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
                      {special.terms}
                    </p>
                  )}

                  <button className="mt-3 text-blue-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition">
                    View Details <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredSpecials.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              No specials available in this category.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            All offers are subject to availability and may be changed or
            discontinued at any time. See dealer for complete details and
            restrictions. Offers cannot be combined unless specified.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Specials;
