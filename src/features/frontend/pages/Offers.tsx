import { useQuery } from "@tanstack/react-query";
import { GetOffers } from "@/features/inventory/api";
import type { Offer } from "@/features/offers/types";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysLeft(endTimestamp: string) {
  const now = Date.now();
  const end = new Date(endTimestamp).getTime();
  const diff = end - now;
  if (diff <= 0) return null;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

function OfferCard({ offer }: { offer: Offer }) {
  const daysLeft = getDaysLeft(offer.end_date);
  const isExpiringSoon = daysLeft !== null && daysLeft <= 5;

  return (
    <div className="offer-card group">
      <div className="offer-discount">
        <span className="discount-number">
          {String(offer.discount_percentage)}
        </span>
        <span className="discount-pct">% OFF</span>
      </div>

      <div className="offer-body">
        <h3 className="offer-title">{String(offer.title)}</h3>
        <p className="offer-desc">{String(offer.description)}</p>
      </div>

      <div className="offer-footer">
        <div className="offer-dates">
          <span className="date-label">Valid</span>
          <span className="date-range">
            {formatDate(offer.start_date)} &mdash; {formatDate(offer.end_date)}
          </span>
        </div>

        {daysLeft !== null && (
          <div
            className={`offer-badge ${isExpiringSoon ? "badge-urgent" : "badge-normal"}`}
          >
            {isExpiringSoon
              ? `${daysLeft}d left`
              : `Ends ${formatDate(offer.end_date)}`}
          </div>
        )}
      </div>
    </div>
  );
}

function OfferSkeleton() {
  return (
    <div className="offer-card skeleton-card">
      <div className="skeleton skeleton-discount" />
      <div className="offer-body">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-desc" />
        <div className="skeleton skeleton-desc short" />
      </div>
      <div className="offer-footer">
        <div className="skeleton skeleton-date" />
      </div>
    </div>
  );
}

export default function Offers() {
  const {
    data: offers,
    isLoading,
    isError,
  } = useQuery<Offer[]>({
    queryKey: ["offers"],
    queryFn: GetOffers,
  });

  const activeOffers = offers?.filter((o) => o.is_active) ?? [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500&display=swap');

        .offers-section {
          font-family: 'Barlow', sans-serif;
          background: #0a0a0a;
          padding: 80px 0;
          min-height: 400px;
        }

        .offers-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .offers-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
          border-bottom: 1px solid #1e1e1e;
          padding-bottom: 24px;
        }

        .offers-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 8px;
        }

        .offers-heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 800;
          color: #f5f5f5;
          line-height: 1;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .offers-count {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #555;
          padding-bottom: 4px;
        }

        .offers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1px;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
        }

        .offer-card {
          background: #111;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
          overflow: hidden;
          transition: background 0.2s ease;
          cursor: default;
        }

        .offer-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #c9a84c;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .offer-card:hover {
          background: #141414;
        }

        .offer-card:hover::before {
          transform: scaleX(1);
        }

        .offer-discount {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .discount-number {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 72px;
          font-weight: 800;
          color: #c9a84c;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .discount-pct {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #c9a84c;
          letter-spacing: 0.05em;
          padding-bottom: 8px;
        }

        .offer-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .offer-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #f0f0f0;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          margin: 0;
        }

        .offer-desc {
          font-size: 14px;
          color: #777;
          line-height: 1.6;
          margin: 0;
        }

        .offer-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid #1e1e1e;
          gap: 12px;
          flex-wrap: wrap;
        }

        .offer-dates {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .date-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #444;
        }

        .date-range {
          font-size: 12px;
          color: #666;
          letter-spacing: 0.02em;
        }

        .offer-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px;
          border: 1px solid;
          white-space: nowrap;
        }

        .badge-urgent {
          color: #e05c5c;
          border-color: #3a1a1a;
          background: #1e0e0e;
        }

        .badge-normal {
          color: #555;
          border-color: #222;
          background: transparent;
        }

        /* Skeleton */
        .skeleton-card {
          pointer-events: none;
        }

        .skeleton {
          background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 2px;
        }

        .skeleton-discount {
          width: 120px;
          height: 72px;
        }

        .skeleton-title {
          width: 70%;
          height: 20px;
        }

        .skeleton-desc {
          width: 100%;
          height: 14px;
        }

        .skeleton-desc.short {
          width: 60%;
        }

        .skeleton-date {
          width: 160px;
          height: 12px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Error / Empty */
        .offers-feedback {
          padding: 80px 32px;
          text-align: center;
          background: #111;
          border: 1px solid #1a1a1a;
        }

        .feedback-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 12px;
        }

        .feedback-message {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #2a2a2a;
          margin: 0;
        }
      `}</style>

      <section className="offers-section">
        <div className="offers-container">
          <div className="offers-header">
            <div>
              <p className="offers-eyebrow">Exclusive Deals</p>
              <h2 className="offers-heading">Current Offers</h2>
            </div>
            {!isLoading && !isError && (
              <span className="offers-count">
                {activeOffers.length} Active{" "}
                {activeOffers.length === 1 ? "Offer" : "Offers"}
              </span>
            )}
          </div>

          {isError ? (
            <div className="offers-feedback">
              <p className="feedback-label">Error</p>
              <p className="feedback-message">
                Could not load offers at this time.
              </p>
            </div>
          ) : isLoading ? (
            <div className="offers-grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <OfferSkeleton key={i} />
              ))}
            </div>
          ) : activeOffers.length === 0 ? (
            <div className="offers-feedback">
              <p className="feedback-label">Nothing here yet</p>
              <p className="feedback-message">
                No active offers available right now.
              </p>
            </div>
          ) : (
            <div className="offers-grid">
              {activeOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
