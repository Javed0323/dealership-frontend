import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        siteName={"Auto Dealer"}
      />

      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col">
        <Header openSidebar={() => setIsOpen(true)} />
        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
