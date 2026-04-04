import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth, getRoleFromToken } from "@/shared/hooks/useAuth";
import Login from "@/features/auth/pages/Login";
import AdminLayout from "@/shared/layouts/AdminLayout";
import CarsPage from "@/features/cars/pages/Cars";
import InventoryIndexPage from "@/features/inventory/pages/Index";
import OfferIndexPage from "@/features/offers/pages/Index";
import TestDriveIndexPage from "@/features/test_drives/pages/Index";
import SaleIndexPage from "@/features/sales/pages/Index";
import Dashboard from "@/features/dashboard/pages/DashboardPage";
import UnitDetails from "@/features/cars/components/CarDetails";
import HomePage from "@/features/frontend/pages/HomePage";
import PublicLayout from "@/features/frontend/PublicLayout";
import ContactPage from "@/features/frontend/pages/ContactPage";
import AboutPage from "@/features/frontend/pages/AboutPage";
import { NewArrivalsPage } from "@/features/frontend/pages/NewArrivals";
import PrivacyPolicy from "@/features/frontend/pages/PrivacyPolicy";
import TermsOfService from "@/features/frontend/pages/TermsOfService";
import CarCreate from "@/features/cars/components/CarForm";
import Testimonials from "@/features/frontend/components/Testimonals";
import Blog from "@/features/frontend/pages/Blog";
import NotFound from "@/features/frontend/components/404";
import Accessibility from "@/features/frontend/components/Accessiblity";
import TestDriveManager from "@/features/frontend/pages/TestDriveManager";
import CarMediaUpload from "@/features/cars/components/CarMediaUpload";
import InventoryCreate from "@/features/inventory/components/InventoryForm";
import SaleCreate from "@/features/sales/components/SaleForm";
import OfferCreate from "@/features/offers/components/OfferForm";
import TestDriveCreate from "@/features/test_drives/components/TestDriveForm";
import Offers from "@/features/frontend/pages/Offers";
import InventoryPageContainer from "@/features/frontend/pages/InventoryPage";
import FeaturedInventoryStrip from "@/features/frontend/components/FeaturedInventoryStripe";

interface RoleRouteProps {
  allowedRoles: string[];
}

const RoleProtectedRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;

  const role = getRoleFromToken(token);
  if (!allowedRoles.includes(role!)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="car" element={<CarsPage />} />
            <Route path="car/create" element={<CarCreate />} />
            <Route path="car/:id/edit" element={<CarCreate />} />
            <Route path="car/:id" element={<UnitDetails />} />
            <Route path="inventory/:id/media" element={<CarMediaUpload />} />
            {/* sales */}
            <Route path="sale" element={<SaleIndexPage />} />
            <Route path="sale/create" element={<SaleCreate />} />
            <Route path="sale/:id/edit" element={<SaleCreate />} />
            {/* inventory */}
            <Route path="inventory" element={<InventoryIndexPage />} />
            <Route path="inventory/create" element={<InventoryCreate />} />
            <Route path="inventory/:id/edit" element={<InventoryCreate />} />
            <Route path="inventory/:id" element={<UnitDetails />} />
            {/* offers */}
            <Route path="offer" element={<OfferIndexPage />} />
            <Route path="offer/create" element={<OfferCreate />} />
            <Route path="offer/:id/edit" element={<OfferCreate />} />
            {/* test drives */}
            <Route path="test_drive" element={<TestDriveIndexPage />} />
            <Route path="test_drive/create" element={<TestDriveCreate />} />
            <Route path="test_drive/:id/edit" element={<TestDriveCreate />} />
          </Route>
        </Route>
        {/* frontend */}
        <Route element={<PublicLayout />}>
          <Route path="/inventory" element={<InventoryPageContainer />} />
          <Route path="/inventory/:inventoryId" element={<UnitDetails />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/user-reviews" element={<Testimonials />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/schedule-test-drive" element={<TestDriveManager />} />
          <Route
            path="/featured-inventory"
            element={<FeaturedInventoryStrip />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
