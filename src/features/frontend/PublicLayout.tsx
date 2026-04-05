import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CookieBanner from "@/features/frontend/components/CookieBanner";
import { useAnalytics } from "@/shared/hooks/useAnalytics";

export default function PublicLayout() {
  useAnalytics(); // ← one line, gates GA4 behind consent
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="p-6 flex-1 overflow-auto mt-10">
        <Outlet />
      </main>
      <Footer />
      {/* import CookieBanner from "./CookieBanner"; // inside the layout JSX, after{" "} */}
      <Footer />
      <CookieBanner />
    </div>
  );
}
