// pages/AboutPage.tsx
import React, { useState } from "react";
import {
  Award,
  Users,
  Car,
  Shield,
  Clock,
  Star,
  TrendingUp,
  Heart,
  ThumbsUp,
  Zap,
  Target,
  Globe,
  ChevronRight,
  Quote,
  Play,
  Pause,
  Calendar,
} from "lucide-react";

// ============================================
// DATA CONFIGURATION - Edit this section only!
// ============================================

interface DealershipData {
  // Basic Information
  name: string;
  founded: number;
  tagline: string;
  description: string;
  mission: string;
  vision: string;

  // Statistics
  stats: {
    yearsOfExperience: number;
    vehiclesSold: string;
    happyCustomers: string;
    awardsWon: number;
  };

  // Values
  coreValues: Array<{
    icon: keyof typeof iconMap;
    title: string;
    description: string;
  }>;

  // Team Members
  team: Array<{
    id: number;
    name: string;
    position: string;
    bio: string;
    imageUrl: string;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
  }>;

  // Milestones
  milestones: Array<{
    year: number;
    title: string;
    description: string;
  }>;

  // Testimonials
  testimonials: Array<{
    id: number;
    name: string;
    position: string;
    vehicle?: string;
    content: string;
    rating: number;
    avatar?: string;
  }>;

  // Why Choose Us
  whyChooseUs: Array<{
    icon: keyof typeof iconMap;
    title: string;
    description: string;
  }>;

  // Awards & Recognition
  awards: Array<{
    year: number;
    title: string;
    organization: string;
  }>;

  // Partners
  partners: Array<{
    name: string;
    logo?: string;
    description: string;
  }>;
}

// Icon mapping for dynamic icons
const iconMap = {
  Award: Award,
  Users: Users,
  Car: Car,
  Shield: Shield,
  Clock: Clock,
  Star: Star,
  TrendingUp: TrendingUp,
  Heart: Heart,
  ThumbsUp: ThumbsUp,
  Zap: Zap,
  Target: Target,
  Globe: Globe,
};

// ============================================
// EDIT YOUR DEALERSHIP DATA HERE
// ============================================

const dealershipData: DealershipData = {
  // Basic Information
  name: "AutoElite",
  founded: 2005,
  tagline: "Driving Excellence Since 2005",
  description:
    "AutoElite is Southern California's premier luxury and performance vehicle dealership. With over 18 years of experience, we've built a reputation for exceptional service, transparent pricing, and an unparalleled selection of premium vehicles. Our commitment to excellence has made us the trusted choice for discerning drivers across the region.",
  mission:
    "To provide an exceptional automotive experience by offering quality vehicles, transparent pricing, and dedicated service that exceeds expectations at every touchpoint.",
  vision:
    "To redefine the car buying experience by setting new standards in customer satisfaction, innovation, and community trust.",

  // Statistics - Update these numbers as your dealership grows
  stats: {
    yearsOfExperience: 19,
    vehiclesSold: "12,500+",
    happyCustomers: "10,000+",
    awardsWon: 47,
  },

  // Core Values - Add, remove, or modify values as needed
  coreValues: [
    {
      icon: "Heart",
      title: "Customer First",
      description:
        "Your satisfaction is our priority. We listen, understand, and deliver solutions tailored to your unique needs.",
    },
    {
      icon: "Shield",
      title: "Transparency",
      description:
        "No hidden fees, no pressure tactics. Honest pricing and clear communication in every interaction.",
    },
    {
      icon: "Zap",
      title: "Innovation",
      description:
        "Embracing technology to streamline your experience, from online shopping to digital paperwork.",
    },
    {
      icon: "Users",
      title: "Community",
      description:
        "Building lasting relationships and giving back to the communities we serve.",
    },
  ],

  // Team Members - Add or remove team members here
  team: [
    {
      id: 1,
      name: "Michael Reynolds",
      position: "Founder & CEO",
      bio: "With over 25 years in the automotive industry, Michael founded AutoElite with a vision to transform the car buying experience.",
      imageUrl:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      socialLinks: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        email: "michael@autoelite.com",
      },
    },
    {
      id: 2,
      name: "Sarah Chen",
      position: "General Manager",
      bio: "Sarah brings 15 years of luxury automotive experience, ensuring every customer receives white-glove service.",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      socialLinks: {
        linkedin: "https://linkedin.com",
        email: "sarah@autoelite.com",
      },
    },
    {
      id: 3,
      name: "David Williams",
      position: "Sales Director",
      bio: "David's passion for cars and customer service makes him the perfect guide for your vehicle journey.",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
      socialLinks: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    {
      id: 4,
      name: "Jessica Martinez",
      position: "Finance Manager",
      bio: "Jessica specializes in creating flexible financing solutions that fit your lifestyle and budget.",
      imageUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
      socialLinks: {
        linkedin: "https://linkedin.com",
        email: "jessica@autoelite.com",
      },
    },
  ],

  // Milestones - Add your dealership's key achievements
  milestones: [
    {
      year: 2005,
      title: "Opening Day",
      description:
        "AutoElite opens its doors with a vision to revolutionize car buying.",
    },
    {
      year: 2010,
      title: "5-Year Anniversary",
      description: "Celebrated 5 years with over 2,500 satisfied customers.",
    },
    {
      year: 2015,
      title: "Expansion",
      description:
        "Opened our state-of-the-art service center and expanded inventory.",
    },
    {
      year: 2020,
      title: "Digital Transformation",
      description: "Launched virtual showroom and online purchasing platform.",
    },
    {
      year: 2023,
      title: "10,000 Customers",
      description: "Reached milestone of 10,000 happy customers served.",
    },
  ],

  // Testimonials - Add customer reviews here
  testimonials: [
    {
      id: 1,
      name: "Robert Thompson",
      position: "Luxury SUV Owner",
      vehicle: "2023 Range Rover Sport",
      content:
        "The team at AutoElite made my car buying experience effortless. From selection to financing, everything was handled with professionalism and care. Highly recommend!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 2,
      name: "Emily Parker",
      position: "First-Time Buyer",
      vehicle: "2024 Tesla Model 3",
      content:
        "As a first-time car buyer, I was nervous. The AutoElite team guided me through every step with patience and expertise. I couldn't be happier with my new car!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 3,
      name: "James Wilson",
      position: "Repeat Customer",
      vehicle: "2022 Porsche Cayenne",
      content:
        "This is my third vehicle from AutoElite, and they consistently deliver exceptional service. Their attention to detail and customer care is unmatched.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    },
  ],

  // Why Choose Us - Add your unique selling points
  whyChooseUs: [
    {
      icon: "Star",
      title: "Premium Selection",
      description:
        "Curated inventory of luxury, performance, and certified pre-owned vehicles.",
    },
    {
      icon: "TrendingUp",
      title: "Best Price Guarantee",
      description: "Competitive pricing with transparent, no-haggle policy.",
    },
    {
      icon: "Clock",
      title: "Flexible Hours",
      description:
        "Open 7 days a week with extended hours for your convenience.",
    },
    {
      icon: "Award",
      title: "Certified Excellence",
      description: "Award-winning service with factory-trained technicians.",
    },
  ],

  // Awards & Recognition - Add awards your dealership has won
  awards: [
    {
      year: 2023,
      title: "Best Luxury Dealership",
      organization: "LA Automotive Awards",
    },
    {
      year: 2022,
      title: "Customer Service Excellence",
      organization: "DealerRater",
    },
    {
      year: 2021,
      title: "Top Workplace",
      organization: "Los Angeles Business Journal",
    },
    {
      year: 2020,
      title: "Innovation in Digital Retailing",
      organization: "AutoTrader",
    },
  ],

  // Partners - Add your business partners
  partners: [
    {
      name: "BMW Financial Services",
      description: "Premium financing solutions",
    },
    {
      name: "Mercedes-Benz Credit",
      description: "Exclusive leasing programs",
    },
    {
      name: "Audi Financial",
      description: "Competitive rates and terms",
    },
    {
      name: "Wells Fargo Auto",
      description: "Nationwide financing network",
    },
  ],
};

// ============================================
// COMPONENT IMPLEMENTATION
// ============================================

const AboutPage: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play testimonials
  React.useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTestimonial(
        (prev) => (prev + 1) % dealershipData.testimonials.length,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, dealershipData.testimonials.length]);

  const nextTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev + 1) % dealershipData.testimonials.length,
    );
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) =>
        (prev - 1 + dealershipData.testimonials.length) %
        dealershipData.testimonials.length,
    );
    setIsAutoPlaying(false);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-wider text-gray-300 mb-4">
              Welcome to {dealershipData.name}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {dealershipData.tagline}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              {dealershipData.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {dealershipData.stats.yearsOfExperience}+
              </div>
              <div className="text-sm text-gray-600">Years of Excellence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {dealershipData.stats.vehiclesSold}
              </div>
              <div className="text-sm text-gray-600">Vehicles Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {dealershipData.stats.happyCustomers}
              </div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {dealershipData.stats.awardsWon}+
              </div>
              <div className="text-sm text-gray-600">Awards Won</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {dealershipData.mission}
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {dealershipData.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at{" "}
              {dealershipData.name}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealershipData.coreValues.map((value, index) => {
              const Icon = iconMap[value.icon];
              return (
                <div
                  key={index}
                  className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose {dealershipData.name}?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              What sets us apart from the competition
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealershipData.whyChooseUs.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-gray-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-gray-600">
              Celebrating {dealershipData.stats.yearsOfExperience} years of
              excellence
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 hidden md:block"></div>
            <div className="space-y-8">
              {dealershipData.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className="md:w-1/2"></div>
                  <div className="md:w-1/2 relative">
                    <div className="bg-gray-50 p-6 rounded-xl ml-0 md:ml-8">
                      <div className="absolute left-0 md:left-auto md:right-full top-6 transform -translate-x-4 md:translate-x-0 hidden md:block">
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="inline-block px-3 py-1 bg-gray-900 text-white text-sm rounded-full mb-3">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real experiences from real customers who found their perfect
              vehicle with us
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gray-800 rounded-2xl p-8 md:p-12">
              <Quote className="absolute top-6 right-6 h-12 w-12 text-gray-700 opacity-50" />

              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="inline h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-lg md:text-xl leading-relaxed mb-6">
                  "{dealershipData.testimonials[activeTestimonial]?.content}"
                </p>
                <div className="flex items-center gap-4 mb-4">
                  {dealershipData.testimonials[activeTestimonial]?.avatar ? (
                    <img
                      src={
                        dealershipData.testimonials[activeTestimonial].avatar
                      }
                      alt={dealershipData.testimonials[activeTestimonial].name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-semibold">
                      {dealershipData.testimonials[activeTestimonial]?.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {dealershipData.testimonials[activeTestimonial]?.position}
                      {dealershipData.testimonials[activeTestimonial]
                        ?.vehicle &&
                        ` • ${dealershipData.testimonials[activeTestimonial].vehicle}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                >
                  {isAutoPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals committed to your automotive journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dealershipData.team.map((member) => (
              <div key={member.id} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{member.position}</p>
                <p className="text-sm text-gray-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Awards & Recognition
            </h2>
            <p className="text-gray-600">
              Proudly recognized for excellence in automotive retail
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealershipData.awards.map((award, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm text-center"
              >
                <Award className="h-8 w-8 text-gray-900 mx-auto mb-3" />
                <div className="text-sm text-gray-500 mb-1">{award.year}</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {award.title}
                </h3>
                <p className="text-sm text-gray-600">{award.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Trusted Partners
            </h2>
            <p className="text-gray-600">
              Collaborating with industry leaders to serve you better
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dealershipData.partners.map((partner, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Car className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {partner.name}
                </h3>
                <p className="text-sm text-gray-600">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Vehicle?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Visit our dealership or contact us to start your automotive journey
            with {dealershipData.name}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/inventory"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              Browse Inventory
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-gray-700 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
