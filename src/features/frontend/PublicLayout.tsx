import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CookieBanner from "@/features/frontend/components/CookieBanner";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import ScrollToTop from "@/shared/components/ScrollToTop";

export default function PublicLayout() {
  useAnalytics();
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="p-6 flex-1 overflow-auto mt-8">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
      <ScrollToTop threshold={400} position="bottom-right" />
    </div>
  );
}
