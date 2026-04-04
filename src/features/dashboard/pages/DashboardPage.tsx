import { useState, useEffect } from "react";
import { GetDashboardData } from "../api";
import {
  DollarSign,
  Car,
  Users,
  ClipboardList,
  BarChart2,
  CheckCircle,
  ParkingCircle,
} from "lucide-react";
// ─── Types ────────────────────────────────────────────────────────────────────
interface MonthlySale {
  month: number;
  total_sales: number;
  revenue: number;
}

interface DashboardData {
  total_inventories: number;
  available_inventories: number;
  sold_inventories: number;
  total_customers: number;
  total_sales: number;
  total_revenue: number;
  pending_test_drives: number;
  monthly_sales: MonthlySale[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(id);
      } else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return val;
}

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
function Sparkline({
  data,
  color = "#F59E0B",
}: {
  data: number[];
  color?: string;
}) {
  if (!data.length) return null;
  const W = 120,
    H = 36,
    pad = 4;
  const min = Math.min(...data),
    max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (W - pad * 2);
      const y = H - pad - ((v - min) / range) * (H - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const areaClose = `${W - pad},${H - pad} ${pad},${H - pad}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="opacity-60">
      <defs>
        <linearGradient
          id={`g${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`${pts} ${areaClose}`}
        fill={`url(#g${color.replace("#", "")})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ data }: { data: MonthlySale[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxRev = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-1.5 h-40 w-full">
      {data.map((d, i) => {
        const h = (d.revenue / maxRev) * 100;
        const isHov = hovered === i;
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {isHov && (
              <div className="text-[9px] text-amber-300 font-mono whitespace-nowrap bg-zinc-800 px-1.5 py-0.5 rounded">
                {fmt(d.revenue)}
              </div>
            )}
            <div
              className="w-full flex flex-col justify-end"
              style={{ height: "130px" }}
            >
              <div
                className="w-full rounded-t transition-all duration-300"
                style={{
                  height: `${h}%`,
                  background: isHov
                    ? "linear-gradient(to top, #F59E0B, #FCD34D)"
                    : "linear-gradient(to top, #78350F, #D97706)",
                  minHeight: "4px",
                }}
              />
            </div>
            <span className="text-[9px] text-zinc-500 font-mono">
              {MONTH_LABELS[d.month - 1]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ available, sold }: { available: number; sold: number }) {
  const total = available + sold || 1;
  const availPct = available / total;
  const r = 54,
    cx = 64,
    cy = 64;
  const circ = 2 * Math.PI * r;
  const avail_dash = availPct * circ;
  const sold_dash = circ - avail_dash;
  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#27272a"
        strokeWidth="14"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#D97706"
        strokeWidth="14"
        strokeDasharray={`${avail_dash} ${sold_dash}`}
        strokeLinecap="butt"
        transform={`rotate(-90 ${cx} ${cy})`}
        className="transition-all duration-1000"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#3F3F46"
        strokeWidth="14"
        strokeDasharray={`${sold_dash} ${avail_dash}`}
        strokeDashoffset={-avail_dash}
        strokeLinecap="butt"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fill="#F59E0B"
        fontSize="20"
        fontWeight="700"
        fontFamily="monospace"
      >
        {Math.round(availPct * 100)}%
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fill="#71717a"
        fontSize="9"
        fontFamily="monospace"
      >
        AVAILABLE
      </text>
    </svg>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  sparkData?: number[];
  accent?: string;
  icon: React.ReactNode;
  sub?: string;
  delay?: number;
}

function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  sparkData,
  accent = "#F59E0B",
  icon,
  sub,
  delay = 0,
}: StatCardProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const count = useCountUp(visible ? value : 0);
  const displayVal =
    prefix === "$" ? fmt(value) : `${prefix}${count.toLocaleString()}${suffix}`;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between transition-all duration-500 hover:border-zinc-600 hover:shadow-xl group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ${delay}ms, transform 0.5s ${delay}ms`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl leading-none">{icon}</div>
        {sparkData && <Sparkline data={sparkData} color={accent} />}
      </div>
      <div>
        <div
          className="text-3xl font-black tracking-tight text-white font-mono"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {displayVal}
        </div>
        <div className="text-xs text-zinc-400 uppercase tracking-widest mt-1 font-medium">
          {label}
        </div>
        {sub && (
          <div className="text-xs mt-1" style={{ color: accent }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    GetDashboardData()
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const revenueHistory = data?.monthly_sales.map((m) => m.revenue) ?? [];
  const salesHistory = data?.monthly_sales.map((m) => m.total_sales) ?? [];

  return (
    <div
      className="min-h-screen bg-zinc-950 text-white"
      style={{ fontFamily: "'DM Mono', 'Courier New', monospace" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        .brand { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.1em; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #18181b; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
      `}</style>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Title row */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="brand text-5xl text-white">DASHBOARD</h1>
            <p className="text-zinc-500 text-xs mt-1 tracking-widest uppercase">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Updated just now
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/30 p-6 text-red-400 text-sm">
            {error}
          </div>
        ) : data ? (
          <>
            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<DollarSign size={20} />}
                label="Total Revenue"
                value={data.total_revenue}
                prefix="$"
                sparkData={revenueHistory}
                accent="#F59E0B"
                delay={0}
              />
              <StatCard
                icon={<Car size={20} />}
                label="Total Cars"
                value={data.total_inventories}
                sparkData={[data.sold_inventories, data.available_inventories]}
                accent="#60A5FA"
                delay={80}
                sub={`${data.available_inventories} available`}
              />
              <StatCard
                icon={<Users size={20} />}
                label="Customers"
                value={data.total_customers}
                accent="#34D399"
                delay={160}
              />
              <StatCard
                icon={<ClipboardList size={20} />}
                label="Pending Test Drives"
                value={data.pending_test_drives}
                accent="#F87171"
                delay={240}
                sub="Awaiting confirmation"
              />
            </div>

            {/* Secondary KPIs */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard
                icon={<BarChart2 size={20} />}
                label="Total Sales"
                value={data.total_sales}
                sparkData={salesHistory}
                accent="#A78BFA"
                delay={320}
              />
              <StatCard
                icon={<CheckCircle size={20} />}
                label="Cars Sold"
                value={data.sold_inventories}
                accent="#F59E0B"
                delay={380}
              />
              <StatCard
                icon={<ParkingCircle size={20} />}
                label="Cars Available"
                value={data.available_inventories}
                accent="#34D399"
                delay={440}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Revenue Bar Chart */}
              <div
                className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="brand text-2xl text-white">
                      MONTHLY REVENUE
                    </h2>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">
                      Full year breakdown
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-mono text-lg font-bold">
                      {fmt(data.total_revenue)}
                    </div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                      YTD
                    </div>
                  </div>
                </div>
                <BarChart data={data.monthly_sales} />
              </div>

              {/* Inventory Donut */}
              <div
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col items-center justify-center"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
              >
                <h2 className="brand text-2xl text-white mb-1">INVENTORY</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-5">
                  Availability ratio
                </p>
                <DonutChart
                  available={data.available_inventories}
                  sold={data.sold_inventories}
                />
                <div className="flex gap-6 mt-5 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                    <span className="text-zinc-300">
                      Available{" "}
                      <span className="text-amber-400 font-bold">
                        {data.available_inventories}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-zinc-600 inline-block" />
                    <span className="text-zinc-300">
                      Sold{" "}
                      <span className="text-zinc-400 font-bold">
                        {data.sold_inventories}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Sales Table */}
            <div
              className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
            >
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="brand text-2xl text-white">MONTHLY BREAKDOWN</h2>
                <span className="text-xs text-zinc-500 uppercase tracking-widest">
                  {data.monthly_sales.length} months
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                      <th className="px-6 py-3 text-left">Month</th>
                      <th className="px-6 py-3 text-right">Sales</th>
                      <th className="px-6 py-3 text-right">Revenue</th>
                      <th className="px-6 py-3 text-right hidden sm:table-cell">
                        Avg / Sale
                      </th>
                      <th className="px-6 py-3 text-right hidden md:table-cell">
                        Revenue Share
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.monthly_sales.map((m, i) => {
                      const share = (m.revenue / data.total_revenue) * 100;
                      const avg = m.total_sales ? m.revenue / m.total_sales : 0;
                      const maxShare = Math.max(
                        ...data.monthly_sales.map(
                          (x) => (x.revenue / data.total_revenue) * 100,
                        ),
                      );
                      return (
                        <tr
                          key={m.month}
                          className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors"
                          style={{ animationDelay: `${i * 40}ms` }}
                        >
                          <td className="px-6 py-3.5 text-zinc-300 font-medium">
                            {MONTH_LABELS[m.month - 1]}
                          </td>
                          <td className="px-6 py-3.5 text-right text-white font-bold">
                            {m.total_sales}
                          </td>
                          <td className="px-6 py-3.5 text-right text-amber-400 font-bold">
                            {fmt(m.revenue)}
                          </td>
                          <td className="px-6 py-3.5 text-right text-zinc-400 hidden sm:table-cell">
                            {fmt(avg)}
                          </td>
                          <td className="px-6 py-3.5 hidden md:table-cell">
                            <div className="flex items-center gap-2 justify-end">
                              <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{
                                    width: `${(share / maxShare) * 100}%`,
                                    background:
                                      "linear-gradient(to right, #92400e, #F59E0B)",
                                  }}
                                />
                              </div>
                              <span className="text-zinc-500 text-xs w-10 text-right">
                                {share.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-[10px] text-zinc-600 uppercase tracking-widest">
          <span>Velocity Motors © {new Date().getFullYear()}</span>
          <span>Command Center v1.0</span>
        </div>
      </footer>
    </div>
  );
}
