// components/Testimonials.tsx
import React, { useState } from "react";
import {
  Star,
  StarHalf,
  ThumbsUp,
  Calendar,
  User,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  vehicle?: string;
  verified: boolean;
  avatar?: string;
  category: "sales" | "service" | "financing" | "general";
}

const Testimonials: React.FC = () => {
  const [filter, setFilter] = useState<
    "all" | "sales" | "service" | "financing" | "general"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const testimonialsPerPage = 6;

  // Sample testimonial data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Michael Thompson",
      location: "Los Angeles, CA",
      rating: 5,
      date: "March 15, 2026",
      title: "Best car buying experience ever!",
      content:
        "I've purchased multiple cars over the years, but this was by far the smoothest experience. The sales team was knowledgeable, transparent, and never pushy. They helped me find the perfect SUV for my family within my budget. Highly recommend!",
      vehicle: "2024 Toyota Highlander",
      verified: true,
      category: "sales",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      location: "Santa Monica, CA",
      rating: 5,
      date: "March 10, 2026",
      title: "Excellent service department",
      content:
        "Took my car in for routine maintenance and was impressed by the professionalism and speed. The service advisor kept me updated throughout the process, and the work was completed ahead of schedule. Fair pricing and great communication.",
      vehicle: "2019 Honda Accord",
      verified: true,
      category: "service",
    },
    {
      id: 3,
      name: "David Chen",
      location: "Burbank, CA",
      rating: 4.5,
      date: "March 5, 2026",
      title: "Great financing options",
      content:
        "The finance team worked hard to get me approved with a competitive rate despite my challenging credit situation. They explained all options clearly and made the process stress-free. Very grateful for their help!",
      vehicle: "2023 Ford Mustang",
      verified: true,
      category: "financing",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      location: "Glendale, CA",
      rating: 5,
      date: "February 28, 2026",
      title: "Fantastic trade-in value",
      content:
        "I was pleasantly surprised by the trade-in offer for my old vehicle. The appraisal was fair and transparent, and they made the entire trade-in process seamless. Will definitely return for my next vehicle purchase.",
      vehicle: "2025 Tesla Model 3",
      verified: true,
      category: "sales",
    },
    {
      id: 5,
      name: "Robert Wilson",
      location: "Pasadena, CA",
      rating: 5,
      date: "February 20, 2026",
      title: "Knowledgeable and patient staff",
      content:
        "As a first-time car buyer, I had many questions and concerns. The team took their time to explain everything, from vehicle features to financing options. Never felt rushed or pressured. Truly exceptional service!",
      vehicle: "2024 Honda Civic",
      verified: true,
      category: "sales",
    },
    {
      id: 6,
      name: "Lisa Martinez",
      location: "Long Beach, CA",
      rating: 4,
      date: "February 15, 2026",
      title: "Quick and efficient service",
      content:
        "Needed an emergency repair and they got me in same day. The repair was completed quickly and correctly. Only minor issue was the waiting area coffee machine was broken, but overall great experience.",
      vehicle: "2020 Toyota Camry",
      verified: true,
      category: "service",
    },
    {
      id: 7,
      name: "James Anderson",
      location: "Anaheim, CA",
      rating: 5,
      date: "February 10, 2026",
      title: "Above and beyond expectations",
      content:
        "The team went above and beyond to deliver my new truck to my home when I couldn't make it to the dealership. They even stayed late to accommodate my schedule. Unbelievable customer service!",
      vehicle: "2025 Ford F-150",
      verified: true,
      category: "sales",
    },
    {
      id: 8,
      name: "Michelle Wong",
      location: "Torrance, CA",
      rating: 5,
      date: "February 5, 2026",
      title: "Transparent and honest dealership",
      content:
        "Refreshing to find a dealership that's actually transparent about pricing. No hidden fees or last-minute surprises. The price I saw online was exactly what I paid. Highly recommend for anyone looking for a hassle-free experience.",
      vehicle: "2024 Hyundai Tucson",
      verified: true,
      category: "sales",
    },
  ];

  // Filter testimonials based on category
  const filteredTestimonials =
    filter === "all"
      ? testimonials
      : testimonials.filter((t) => t.category === filter);

  // Pagination
  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = filteredTestimonials.slice(
    indexOfFirstTestimonial,
    indexOfLastTestimonial,
  );
  const totalPages = Math.ceil(
    filteredTestimonials.length / testimonialsPerPage,
  );

  // Rating stars component
  const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        )}
        {[...Array(5 - Math.ceil(rating))].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-gray-300" />
        ))}
      </div>
    );
  };

  // Average rating calculation
  const averageRating =
    testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;
  const totalReviews = testimonials.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = testimonials.filter(
      (t) => Math.floor(t.rating) === stars,
    ).length;
    return { stars, count, percentage: (count / totalReviews) * 100 };
  });

  // Submit testimonial form component
  const TestimonialForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      location: "",
      rating: 5,
      title: "",
      content: "",
      vehicle: "",
      category: "general" as "sales" | "service" | "financing" | "general",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Here you would typically send this to your backend
      alert(
        "Thank you for your testimonial! It will be reviewed and published soon.",
      );
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">
              Share Your Experience
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (City, State)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Los Angeles, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Summarize your experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sales">Sales</option>
                <option value="service">Service</option>
                <option value="financing">Financing</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Purchased/Serviced (Optional)
              </label>
              <input
                type="text"
                value={formData.vehicle}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2024 Toyota Camry"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                required
                rows={5}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your experience with us..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Submit Testimonial
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              What Our Customers Say
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Real experiences from real customers. We're proud to have helped
              thousands find their perfect vehicle.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {totalReviews}+
              </div>
              <div className="text-gray-600 mt-2">Customer Reviews</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center gap-1">
                <div className="text-4xl font-bold text-blue-600">
                  {averageRating.toFixed(1)}
                </div>
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-gray-600 mt-2">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">98%</div>
              <div className="text-gray-600 mt-2">Would Recommend Us</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rating Distribution
          </h3>
          <div className="space-y-3">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-600">{stars} Stars</div>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-16 text-sm text-gray-600">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {["all", "sales", "service", "financing", "general"].map(
              (category) => (
                <button
                  key={category}
                  onClick={() => {
                    setFilter(category as any);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-2 rounded-full capitalize transition ${
                    filter === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ),
            )}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <ThumbsUp className="w-5 h-5" />
            Write a Review
          </button>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 flex flex-col"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-blue-600 mb-4 opacity-50" />

              {/* Rating */}
              <RatingStars rating={testimonial.rating} />

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                {testimonial.title}
              </h3>

              {/* Content */}
              <p className="text-gray-600 leading-relaxed mb-4 grow">
                "{testimonial.content}"
              </p>

              {/* Vehicle (if applicable) */}
              {testimonial.vehicle && (
                <div className="text-sm text-blue-600 mb-3">
                  🚗 {testimonial.vehicle}
                </div>
              )}

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      {testimonial.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{testimonial.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Testimonial Form Modal */}
      {showForm && <TestimonialForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Testimonials;
