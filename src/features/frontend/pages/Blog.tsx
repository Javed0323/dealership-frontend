// components/Blog.tsx
import React, { useState } from "react";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorTitle: string;
  date: string;
  category: string;
  readTime: number;
  imageUrl: string;
}

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // 3 detailed, engaging blog posts
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title:
        "Electric Vehicles vs. Gas Cars: The Complete 2026 Cost Comparison",
      excerpt:
        "Is switching to electric really worth it? We break down the true 5-year cost of ownership including purchase price, fuel, maintenance, and resale value.",
      content: `
        <p class="mb-4">The automotive landscape is changing faster than ever, and the debate between electric vehicles (EVs) and traditional gasoline-powered cars has never been more relevant. With gas prices fluctuating and EV technology improving rapidly, many buyers are asking the same question: Which one actually saves me more money?</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Upfront Cost: The Sticker Price Reality</h3>
        <p class="mb-4">The average new gas-powered vehicle in 2026 costs around $48,000, while the average EV comes in at $55,000. That $7,000 difference gives many buyers pause. However, federal tax credits of up to $7,500 for qualifying EVs narrow this gap significantly. Some states add another $2,000-$5,000 in incentives, potentially making EVs cheaper upfront than comparable gas models.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Fuel Savings: Where EVs Really Shine</h3>
        <p class="mb-4">Over 15,000 miles per year, the average gas vehicle costs $2,100 in fuel at $3.50 per gallon with 25 mpg. The same distance in an EV costs just $550 in electricity at $0.15 per kWh. That's $1,550 in annual savings. Over 5 years, you're looking at nearly $8,000 less spent on "fuel" alone.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Maintenance: Fewer Moving Parts, Fewer Problems</h3>
        <p class="mb-4">Gas engines require oil changes, transmission fluid, spark plugs, belts, and more. EVs have about 20 moving parts compared to over 2,000 in a gas engine. Over 5 years, gas vehicle maintenance averages $4,600, while EV maintenance averages just $1,800. No oil changes, no emissions tests, and regenerative braking means brake pads last twice as long.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Resale Value: The Depreciation Factor</h3>
        <p class="mb-4">Historically, EVs depreciated faster than gas cars. That's changing. Today, premium EVs like Tesla hold value exceptionally well, while mainstream EVs are now matching or beating their gas counterparts in 3-year residual value. However, the rapid pace of battery technology advancement means newer models may make older EVs feel dated more quickly.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">The 5-Year Total Cost: What the Numbers Actually Say</h3>
        <p class="mb-4">Let's run the numbers for a mid-size SUV comparison:</p>
        <ul class="list-disc list-inside mb-4 text-gray-700 space-y-1 ml-4">
          <li><strong>Gas SUV:</strong> $45,000 purchase + $10,500 fuel + $4,600 maintenance - $18,000 resale = $42,100 total 5-year cost</li>
          <li><strong>Electric SUV:</strong> $52,000 purchase + $2,750 fuel + $1,800 maintenance - $20,000 resale = $36,550 total 5-year cost</li>
        </ul>
        <p class="mb-4">The EV saves roughly $5,550 over 5 years, or $1,110 annually. Factor in tax credits, and the gap widens to nearly $13,000 in favor of the EV.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">The Hidden Factors: Charging, Convenience, and Lifestyle</h3>
        <p class="mb-4">Cost isn't everything. Consider: Do you have home charging capability? EVs are most convenient when you can charge overnight. How often do you take long road trips? A gas car still wins for cross-country travel without planning. What's your climate? Cold weather reduces EV range by 20-30%.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Our Honest Verdict</h3>
        <p class="mb-4">For most homeowners with a second car, an EV makes strong financial sense today. The math favors EVs for anyone driving more than 10,000 miles annually. However, if you're a renter without charging access, take frequent long trips, or live in extreme cold climates, a modern hybrid might be your smarter bet.</p>
        
        <p class="mb-4 font-medium text-blue-600">Visit us at Auto Elite Motors to test drive both EVs and gas models. Our no-pressure team will help you compare real-world costs based on your specific driving habits.</p>
      `,
      author: "Michael Chen",
      authorTitle: "Senior Automotive Analyst",
      date: "March 25, 2026",
      category: "Electric Vehicles",
      readTime: 8,
      imageUrl:
        "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&h=500&fit=crop",
    },
    {
      id: 2,
      title: "7 Red Flags When Buying a Used Car: A Mechanic's Insider Guide",
      excerpt:
        "Don't get stuck with someone else's problem. Our master mechanic reveals the hidden warning signs most buyers completely miss.",
      content: `
        <p class="mb-4">After 20 years inspecting used cars, I've seen every trick in the book. Here are the red flags I tell my own family to watch for—things the average buyer walks right past.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Fresh Paint in Odd Places</h3>
        <p class="mb-4">Look closely at the gaps between panels. Overspray on rubber seals, mismatched door jambs, or paint that feels rough to the touch suggests accident repair. A clean Carfax is meaningless if the owner paid cash for repairs to avoid the record. Bring a magnet—if it doesn't stick firmly to quarter panels and doors, you're looking at body filler from prior damage.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">2. The "Warmed Up" Engine Trick</h3>
        <p class="mb-4">Show up early for your appointment. If the engine is already warm when you arrive, that's a major red flag. Cold starts reveal problems: rough idle, knocking sounds, smoke from exhaust, or difficulty starting. Dealers who warm up cars beforehand are hiding something. Always test drive a used car from a cold start.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Mismatched Tire Brands</h3>
        <p class="mb-4">Four different tire brands suggest the owner was cutting corners on maintenance. Check tread depth—uneven wear indicates alignment issues or neglected suspension. Run your hand across the brake rotors; deep grooves mean expensive repairs coming soon. Look at the condition of the spare tire too—if it's missing or damaged, it tells you about the previous owner's attention to detail.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Dashboard Warning Lights That "Just Came On"</h3>
        <p class="mb-4">Turn the key to "on" without starting the engine. All warning lights should illuminate—that's the bulb check. If certain lights don't come on, someone may have removed bulbs or covered them with electrical tape. The "check engine" light should come on briefly, then go out after starting. If it stays on or flashes, walk away.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Sloppy Fluids and Strange Smells</h3>
        <p class="mb-4">Open the hood. Check the oil—it should be amber or brown, not black sludge. Pull the transmission dipstick; fluid should be pinkish-red, not brown with a burnt smell. Coolant should be bright green, orange, or pink, not rusty brown. Sweet smells indicate coolant leaks. Musty interior smells suggest water damage or hidden leaks.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">6. The Test Drive Checklist</h3>
        <p class="mb-4">Drive with the radio off. Windows down, then up. Feel for vibrations at highway speeds. Brake firmly from 50 mph—does it pull to one side? Make tight turns in both directions; clicking sounds mean CV joint problems. Let the steering wheel go straight on a flat road—if the car drifts, alignment is off. Listen for whining from the transmission or grinding from wheel bearings.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">7. VIN Tampering and Title Issues</h3>
        <p class="mb-4">Check that the VIN on the dashboard matches the door jamb sticker, engine bay, and title. If the windshield VIN has scratches around it or looks recently replaced, be suspicious. Run your own vehicle history report—don't rely on the dealer's. Look for salvage titles, rebuilt status, or "odometer rollback" warnings. If the seller says "clean title" but it's actually branded, that's fraud.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">The Bottom Line</h3>
        <p class="mb-4">A thorough used car inspection takes 20-30 minutes and can save you thousands. If a seller won't let you cold start it, take it to your mechanic, or seems evasive about service records, that's the biggest red flag of all—walk away.</p>
        
        <p class="mb-4 font-medium text-blue-600">At Auto Elite Motors, every used car goes through a 150-point inspection before it hits our lot. We provide complete service records, vehicle history reports, and a 7-day money-back guarantee. Come see the difference honest transparency makes.</p>
      `,
      author: "Robert Martinez",
      authorTitle: "Master Technician, 20+ Years Experience",
      date: "March 18, 2026",
      category: "Used Cars",
      readTime: 7,
      imageUrl:
        "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1200&h=600&fit=crop",
    },
    {
      id: 3,
      title: "Car Financing Decoded: How to Save Thousands on Your Auto Loan",
      excerpt:
        "Interest rates, loan terms, and dealer financing vs. credit unions—our finance director reveals insider strategies to pay less for your next car.",
      content: `
        <p class="mb-4">Most buyers focus so hard on negotiating the car price that they lose thousands on the financing. Here's how to approach your next auto loan like a pro.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Get Pre-Approved Before You Set Foot in a Dealership</h3>
        <p class="mb-4">This is the single most powerful move you can make. Walk in with a pre-approval from your bank or credit union. Now dealer financing isn't your only option—it's competing for your business. Credit unions typically offer the lowest rates, often 1-2% below traditional banks. In 2026, excellent credit scores (740+) qualify for rates between 4.5-6.5% on new cars and 6-8% on used cars.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">The 20/4/10 Rule: A Smart Framework</h3>
        <p class="mb-4">Financial experts recommend putting at least 20% down, financing for no more than 4 years (48 months), and keeping total monthly vehicle costs (payment + insurance + gas) under 10% of your gross monthly income. Example: $60,000 salary means $500/month total vehicle costs. A $25,000 car with 20% down ($5,000) financed at 6% for 48 months gives a $470 payment—right on target.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Watch Out for These Dealer Financing Tactics</h3>
        <p class="mb-4"><strong>The Four-Square Method:</strong> Dealers often use a worksheet dividing into trade-in, price, down payment, and monthly payment. They move numbers between squares to confuse you. Focus only on the OUT-THE-DOOR price, not monthly payment.<br/><br/>
        <strong>Payment Packing:</strong> "I can get your payment to $450/month!" They may extend your loan term to 72 or 84 months to lower payments while hiding that you're paying thousands more in interest.<br/><br/>
        <strong>Rate Markup:</strong> Dealers can legally add up to 2.5% to your approved interest rate as profit. Your pre-approval prevents this entirely.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Loan Term: The Hidden Danger of Long Loans</h3>
        <p class="mb-4">A $30,000 loan at 7% interest:<br/>
        • 48 months: $718/month, $4,477 total interest<br/>
        • 72 months: $512/month, $6,863 total interest<br/>
        • 84 months: $452/month, $7,996 total interest<br/>
        That "lower payment" adds $3,519 in extra interest. Worse, you'll be upside down (owing more than the car's worth) for years, making it nearly impossible to trade or sell without bringing cash to the table.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Lease vs. Buy: The Honest Breakdown</h3>
        <p class="mb-4"><strong>Leasing makes sense if:</strong> You want a new car every 2-3 years, drive less than 12,000 miles annually, prefer lower monthly payments, and always want warranty coverage.<br/><br/>
        <strong>Buying makes sense if:</strong> You keep cars 5+ years, drive above average miles, want to build equity, and dislike mileage restrictions. Buying almost always wins financially long-term, but leasing offers lower commitment and payments.<br/><br/>
        <strong>Pro tip:</strong> Never put money down on a lease. If the car is totaled, your down payment disappears.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">GAP Insurance: Actually Worth It?</h3>
        <p class="mb-4">If you're putting less than 20% down or financing beyond 60 months, GAP insurance is essential. It covers the difference between what you owe and the car's actual value if totaled. Dealers often charge $800-1,000 for GAP. Your auto insurance company typically offers it for $30-60/year. Always buy GAP through insurance, not the dealer.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">The Prepayment Trap</h3>
        <p class="mb-4">Some loans include prepayment penalties—fees for paying off early. Always ask: "Is this loan simple interest with no prepayment penalty?" If the answer isn't an immediate yes, walk away.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Our Finance Team's Promise</h3>
        <p class="mb-4">At Auto Elite Motors, our finance team works for you, not the bank. We show you rates from multiple lenders, don't mark up approved rates, and explain every document before you sign. Walk in with your pre-approval, and we'll beat it if possible—or shake your hand and congratulate you on getting a great rate elsewhere.</p>
        
        <p class="mb-4 font-medium text-blue-600">Ready to explore your financing options? Our team offers no-obligation credit reviews and pre-approvals in under 30 minutes. Stop by or apply online today.</p>
      `,
      author: "Jennifer Walsh",
      authorTitle: "Finance Director, 15 Years Experience",
      date: "March 12, 2026",
      category: "Financing",
      readTime: 9,
      imageUrl:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Auto Insights & Expert Advice
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Practical guides and honest advice from our team of automotive
            experts.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer flex flex-col"
              onClick={() => setSelectedPost(post)}
            >
              {/* Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime} min read
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3 grow">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author.split(" ")[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                  </div>
                  <button className="text-blue-600 font-medium text-sm flex items-center gap-1 group">
                    Read{" "}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
              <div>
                <span className="text-sm text-blue-600 font-medium">
                  {selectedPost.category}
                </span>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedPost.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 lg:p-8">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-64 lg:h-96 object-cover rounded-lg mb-6"
              />

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-4 border-b border-gray-200">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedPost.author}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600 text-sm">
                  {selectedPost.authorTitle}
                </span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedPost.date}
                </span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedPost.readTime} min read
                </span>
              </div>

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
