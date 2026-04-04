import {
  ShieldCheck,
  BadgeCheck,
  Headphones,
  FileText,
  Wrench,
  Banknote,
} from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: BadgeCheck,
    title: "Certified Vehicles",
    description:
      "Every car passes a rigorous multi-point inspection before listing.",
  },
  {
    icon: FileText,
    title: "Clear Documentation",
    description:
      "Full ownership history, service records, and clean titles guaranteed.",
  },
  {
    icon: Banknote,
    title: "Flexible Financing",
    description:
      "Competitive rates tailored to your budget with fast approvals.",
  },
  {
    icon: Wrench,
    title: "Post-Sale Support",
    description: "Dedicated service team available after every purchase.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty Included",
    description:
      "All vehicles come with a standard warranty for peace of mind.",
  },
  {
    icon: Headphones,
    title: "Expert Guidance",
    description: "Our advisors help you find the right car, not just any car.",
  },
];

interface TrustStripProps {
  className?: string;
}

export default function TrustStrip({ className = "" }: TrustStripProps) {
  return (
    <section
      className={`border-y border-gray-200 bg-gray-50 py-12 ${className}`}
    >
      <div className="mb-8 text-center">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-1.5">
          Why Choose Us
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 leading-none">
          The Difference
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-gray-200 border border-gray-200">
        {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group flex flex-col items-start gap-3 p-5 bg-gray-50 hover:bg-white transition-colors duration-200 cursor-default"
          >
            <div className="p-2 border border-gray-200 bg-white group-hover:border-gray-900 transition-colors duration-200">
              <Icon className="w-4 h-4 text-gray-700" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold text-gray-900 leading-snug">
                {title}
              </p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
