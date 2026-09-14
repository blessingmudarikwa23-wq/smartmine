import {
  Activity,
  BarChart3,
  Boxes,
  CircleDollarSign,
  Droplets,
  Factory,
  HardHat,
  Hammer,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
  X,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
};

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Mine Operations",
    icon: Hammer,
  },
  {
    label: "Processing",
    icon: Factory,
  },
  {
    label: "Equipment",
    icon: Truck,
  },
  {
    label: "Workforce",
    icon: Users,
  },
  {
    label: "Inventory",
    icon: Boxes,
  },
  {
    label: "Fuel",
    icon: Droplets,
  },
  {
    label: "Safety",
    icon: ShieldCheck,
  },
  {
    label: "Finance",
    icon: CircleDollarSign,
  },
  {
    label: "Sales",
    icon: Package,
  },
  {
    label: "Reports",
    icon: BarChart3,
  },
  {
    label: "Smart Intelligence",
    icon: Activity,
  },
];

function Sidebar({
  isOpen,
  onClose,
  activePage,
  onNavigate,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-[#10251f] text-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* =================================================
            BRAND
        ================================================= */}

        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f] shadow-lg">
              <HardHat
                size={25}
                strokeWidth={2.4}
              />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                SmartMine
              </h1>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                Operations Intelligence
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
            Main Menu
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onNavigate(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-[#d8a83e] text-[#10251f] shadow-md"
                      : "text-white/65 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <Icon
                    size={19}
                    strokeWidth={2}
                  />

                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* =================================================
              SYSTEM
          ================================================= */}

          <div className="my-6 border-t border-white/10" />

          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
            System
          </p>

          <button
            type="button"
            onClick={() => onNavigate("Settings")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
              activePage === "Settings"
                ? "bg-[#d8a83e] text-[#10251f] shadow-md"
                : "text-white/65 hover:bg-white/8 hover:text-white"
            }`}
          >
            <Wrench
              size={19}
              strokeWidth={2}
            />

            <span>Settings</span>
          </button>
        </div>

        {/* =================================================
            USER
        ================================================= */}

        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-white/6 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d8a83e] text-sm font-bold text-[#10251f]">
                BM
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  Mine Admin
                </p>

                <p className="truncate text-xs text-white/45">
                  Operations Manager
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;