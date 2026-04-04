import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Warehouse,
  CarFront,
  BadgeDollarSign,
  CalendarClock,
  Percent,
  X,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  close: () => void;
  siteName: string;
}

export default function Sidebar({ isOpen, close, siteName }: Props) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={close}
        />
      )}

      <aside
        className={`
          fixed lg:static
          inset-y-0 left-0
          w-56 bg-slate-900 text-slate-300
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          transition-transform duration-300 ease-in-out
          z-50 flex flex-col border-r border-slate-800
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <span className="font-bold text-white text-lg tracking-tight">
            {siteName}
          </span>
          <button onClick={close} className="lg:hidden p-1">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5">
          <SidebarItem
            to="/admin/dashboard"
            label="Dashboard"
            icon={<LayoutDashboard size={20} />}
            close={close}
          />
          <SidebarItem
            to="/admin/inventory"
            label="Inventory"
            icon={<Warehouse size={20} />}
            close={close}
          />
          <SidebarItem
            to="/admin/car"
            label="Cars"
            icon={<CarFront size={20} />}
            close={close}
          />
          <SidebarItem
            to="/admin/sale"
            label="Sales"
            icon={<BadgeDollarSign size={20} />}
            close={close}
          />
          <SidebarItem
            to="/admin/test_drive"
            label="Test Drives"
            icon={<CalendarClock size={20} />}
            close={close}
          />
          <SidebarItem
            to="/admin/offer"
            label="Offers"
            icon={<Percent size={20} />}
            close={close}
          />
        </nav>
      </aside>
    </>
  );
}

function SidebarItem({
  to,
  label,
  icon,
  close,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  close: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={close}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
        ${
          isActive
            ? "bg-blue-600 text-white"
            : "hover:bg-slate-800 hover:text-white"
        }
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}
