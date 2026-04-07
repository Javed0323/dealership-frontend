import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CookieBanner from "@/features/frontend/components/CookieBanner";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import ScrollToTop from "@/shared/components/ScrollToTop";
import { useEffect } from "react";

export default function PublicLayout() {
  const { pathname } = useLocation();

  useAnalytics();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 overflow-auto mt-8">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
      <ScrollToTop threshold={400} position="bottom-right" />
    </div>
  );
}
