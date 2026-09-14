import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

type HeaderProps = {
  pageTitle: string;
  onMenuClick: () => void;
};

function Header({
  pageTitle,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Left Section */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile Menu */}
          <button
            type="button"
            aria-label="Open navigation"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div className="min-w-0">
            <p className="hidden text-xs font-medium text-slate-400 sm:block">
              Zimbabwe Mining Operations
            </p>

            <h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
              {pageTitle}
            </h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 sm:flex"
          >
            <Search size={19} />
          </button>

          {/* Notification */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Divider */}
          <div className="hidden h-9 w-px bg-slate-200 sm:block" />

          {/* User Information */}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">
              Mine Admin
            </p>

            <p className="text-xs text-slate-400">
              Operations Manager
            </p>
          </div>

          {/* Avatar */}
          <button
            type="button"
            aria-label="Open user profile"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#10251f] text-xs font-bold text-white transition hover:ring-2 hover:ring-[#d8a83e] hover:ring-offset-2"
          >
            BM
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;