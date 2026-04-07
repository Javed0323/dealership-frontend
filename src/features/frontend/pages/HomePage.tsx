import InventoryPage from "../components/CarInventory";
import HeroSection from "../components/HeroSection";
import OffersSection from "./Offers2";
import FeaturedInventoryStrip from "../components/FeaturedInventoryStripe";
import TrustStrip from "../components/TrustStripe";
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <InventoryPage />
      <OffersSection limit={3} />
      <FeaturedInventoryStrip />
      <TrustStrip />
    </>
  );
}
