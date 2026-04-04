import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function PublicLayout() {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="p-6 flex-1 overflow-auto mt-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
