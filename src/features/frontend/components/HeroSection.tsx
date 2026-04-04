// features/home/components/HeroSection.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface HeroSlide {
  image: string;
  tagline: string;
  sub: string;
}

interface HeroSectionProps {
  slides?: HeroSlide[];
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1800&q=80",
    tagline: "Drive What\nMoves You.",
    sub: "Curated pre-owned and new vehicles, personally inspected and ready to go.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1800&q=80",
    tagline: "Precision.\nPerformance.\nPrestige.",
    sub: "From sport coupes to family SUVs — every car on our lot tells a story.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1800&q=80",
    tagline: "Your Next Car\nStarts Here.",
    sub: "Transparent pricing, no hidden fees, and a team that puts you first.",
  },
];

export default function HeroSection({
  slides = DEFAULT_SLIDES,
}: HeroSectionProps) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  const goTo = (idx: number) => {
    if (idx === current || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  };

  const slide = slides[current];

  return (
    <section className="relative w-full h-[92vh] min-h-150 max-h-225 overflow-hidden bg-neutral-950">
      {/* Background image */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${animating ? "opacity-0" : "opacity-100"}`}
      >
        <img src={slide.image} alt="" className="w-full h-full object-cover" />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Slide counter line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
        <div
          key={current}
          className="h-full bg-white/60 origin-left"
          style={{ animation: "progress 6s linear forwards" }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-8 flex flex-col justify-end pb-16">
        <div
          className={`transition-all duration-500 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
        >
          {/* Slide index */}
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mb-6 font-medium">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </p>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-light text-white leading-[1.05] tracking-tight mb-6 whitespace-pre-line"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {slide.tagline}
          </h1>

          {/* Subline */}
          <p className="text-base text-white/60 max-w-md leading-relaxed mb-10">
            {slide.sub}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate("/inventory")}
              className="h-12 px-8 bg-white text-neutral-900 text-[11px] font-medium uppercase tracking-[0.12em] hover:bg-neutral-100 transition-colors"
            >
              Browse inventory
            </button>
            <button
              onClick={() => navigate("/schedule-test-drive")}
              className="h-12 px-8 border border-white/30 text-white text-[11px] font-medium uppercase tracking-[0.12em] hover:bg-white/10 transition-colors"
            >
              Book a test drive
            </button>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-16 right-8 flex flex-col gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-0.5 transition-all duration-300 ${
                i === current
                  ? "h-8 bg-white"
                  : "h-4 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom meta strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex divide-x divide-white/10">
            {[
              { value: "500+", label: "Vehicles in stock" },
              { value: "12 Yrs", label: "In business" },
              { value: "4.9★", label: "Customer rating" },
              { value: "100%", label: "Inspected & certified" },
            ].map(({ value, label }) => (
              <div key={label} className="flex-1 py-4 px-6 first:pl-0">
                <p className="text-white text-sm font-medium">{value}</p>
                <p className="text-white/40 text-[11px] uppercase tracking-widest mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}
