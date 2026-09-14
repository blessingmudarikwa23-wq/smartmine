import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock3,
  Droplets,
  Factory,
  Fuel as FuelIcon,
  HardHat,
  Hammer,
  RefreshCw,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import MineOperations from "./pages/MineOperations";
import Processing from "./pages/Processing";
import Equipment from "./pages/Equipment";
import Workforce from "./pages/Workforce";
import Inventory from "./pages/Inventory";
import Fuel from "./pages/Fuel";
import Safety from "./pages/Safety";
import Finance from "./pages/Finance";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import SmartIntelligence from "./pages/SmartIntelligence";
import Settings from "./pages/Settings";

import dashboardApi, {
  type DashboardActivity,
  type DashboardEquipment,
  type DashboardResponse,
  type DashboardTrend,
} from "./services/dashboardApi";

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [refreshing, setRefreshing] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadDashboard = useCallback(
    async (isRefresh: boolean = false): Promise<void> => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const data =
          await dashboardApi.getDashboard();

        setDashboard(data);
      } catch (err: unknown) {
        console.error(
          "Failed to load dashboard:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard data.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const handleRefresh = async (): Promise<void> => {
    await loadDashboard(true);
  };

  const summary = dashboard?.summary;
  const production = dashboard?.production;
  const activities =
    dashboard?.activities ?? [];
  const equipment =
    dashboard?.equipment ?? [];
  const operationalHealth =
    dashboard?.operational_health;

  /* =========================================================
     KPI DATA
  ========================================================= */

  const stats = useMemo(() => {
    const materialProcessed =
      summary?.total_processed ?? null;

    const productionOutput =
      summary?.total_output ?? null;

    const materialChange =
      summary?.kpis?.find(
        (kpi) =>
          kpi.title === "Material Processed",
      );

    return [
      {
        title: "Material Processed",
        value:
          materialProcessed !== null
            ? materialProcessed.toLocaleString()
            : "—",
        unit: "tonnes",
        change:
          materialChange?.change ?? null,
        trend:
          materialChange?.trend ??
          ("neutral" as DashboardTrend),
        icon: Factory,
        description:
          materialChange?.description ??
          "current operating period",
      },
      {
        title: "Production Output",
        value:
          productionOutput !== null
            ? productionOutput.toLocaleString()
            : "—",
        unit: "tonnes",
        change: null,
        trend:
          "neutral" as DashboardTrend,
        icon: BarChart3,
        description:
          "current production",
      },
      {
        title: "Equipment Availability",
        value:
          operationalHealth?.equipment_availability !==
            null &&
          operationalHealth?.equipment_availability !==
            undefined
            ? operationalHealth.equipment_availability
            : "—",
        unit:
          operationalHealth?.equipment_availability !==
            null &&
          operationalHealth?.equipment_availability !==
            undefined
            ? "%"
            : "",
        change: null,
        trend:
          "neutral" as DashboardTrend,
        icon: Truck,
        description:
          operationalHealth?.equipment_availability !==
            null &&
          operationalHealth?.equipment_availability !==
            undefined
            ? "operational availability"
            : "Equipment module not yet connected",
      },
      {
        title: "Fuel Consumption",
        value: "—",
        unit: "",
        change: null,
        trend:
          "neutral" as DashboardTrend,
        icon: Droplets,
        description:
          "Fuel module not yet connected",
      },
    ];
  }, [summary, operationalHealth]);

  /* =========================================================
     PRODUCTION CHART
  ========================================================= */

  const chartPoints =
    production?.chart ?? [];

  const chartPath = useMemo(() => {
    if (!chartPoints.length) {
      return "";
    }

    const width = 800;
    const height = 220;
    const padding = 5;

    const values = chartPoints.map(
      (point) => point.processed,
    );

    const maxValue =
      Math.max(...values, 1);

    const points = chartPoints.map(
      (point, index) => {
        const x =
          chartPoints.length === 1
            ? width / 2
            : (index /
                (chartPoints.length - 1)) *
                (width - padding * 2) +
              padding;

        const y =
          height -
          padding -
          (point.processed / maxValue) *
            (height - padding * 2);

        return {
          x,
          y,
        };
      },
    );

    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }

    let path =
      `M ${points[0].x} ${points[0].y}`;

    for (
      let index = 1;
      index < points.length;
      index += 1
    ) {
      const previous =
        points[index - 1];

      const current =
        points[index];

      const controlX =
        (previous.x + current.x) / 2;

      path +=
        ` C ${controlX} ${previous.y}, ` +
        `${controlX} ${current.y}, ` +
        `${current.x} ${current.y}`;
    }

    return path;
  }, [chartPoints]);

  const chartFillPath = useMemo(() => {
    if (
      !chartPath ||
      !chartPoints.length
    ) {
      return "";
    }

    const width = 800;
    const height = 220;

    return (
      `${chartPath} ` +
      `L ${width} ${height} ` +
      `L 0 ${height} Z`
    );
  }, [chartPath, chartPoints]);

  const chartLabels = useMemo(() => {
    if (!chartPoints.length) {
      return [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
      ];
    }

    return chartPoints.map(
      (point) => {
        const chartDate =
          new Date(
            `${point.date}T00:00:00`,
          );

        return chartDate.toLocaleDateString(
          "en-ZA",
          {
            weekday: "short",
          },
        );
      },
    );
  }, [chartPoints]);

  /* =========================================================
     EQUIPMENT
  ========================================================= */

  const getEquipmentIcon = (
    name: string,
  ) => {
    const normalizedName =
      name.toLowerCase();

    if (
      normalizedName.includes(
        "crusher",
      )
    ) {
      return Hammer;
    }

    if (
      normalizedName.includes("mill")
    ) {
      return Factory;
    }

    if (
      normalizedName.includes(
        "generator",
      ) ||
      normalizedName.includes("fuel")
    ) {
      return FuelIcon;
    }

    if (
      normalizedName.includes(
        "loader",
      ) ||
      normalizedName.includes("truck")
    ) {
      return Truck;
    }

    return Wrench;
  };

  /* =========================================================
     ACTIVITY ICON
  ========================================================= */

  const getActivityIcon = (
    activity: DashboardActivity,
  ) => {
    const category =
      activity.category.toLowerCase();

    if (
      category.includes("production")
    ) {
      return Factory;
    }

    if (
      category.includes("issue")
    ) {
      return Wrench;
    }

    if (
      category.includes("fuel")
    ) {
      return Droplets;
    }

    if (
      category.includes("safety")
    ) {
      return ShieldCheck;
    }

    return Activity;
  };

  /* =========================================================
     OPERATIONAL MESSAGE
  ========================================================= */

  const operationalMessage = useMemo(() => {
    if (!summary) {
      return {
        title: "Loading operations",
        description:
          "Retrieving the latest mining operations data.",
      };
    }

    if (summary.active_issues > 0) {
      return {
        title:
          "Operational issues require attention",
        description:
          `${summary.active_issues} active operational issue${
            summary.active_issues === 1
              ? ""
              : "s"
          } currently recorded. Continue monitoring production and operational performance.`,
      };
    }

    if (
      summary.production_target > 0
    ) {
      if (
        summary.target_achievement >=
        100
      ) {
        return {
          title:
            "Production target achieved",
          description:
            "Current production has reached or exceeded the configured production target.",
        };
      }

      return {
        title:
          "Operations are progressing",
        description:
          "Production data is being tracked against the current target. Continue monitoring production performance and operational activity.",
      };
    }

    return {
      title:
        "Operations are active",
      description:
        "Production and operational activity are being monitored from the SmartMine command centre.",
    };
  }, [summary]);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">

      {/* HERO / PAGE INTRO */}

      <section className="overflow-hidden rounded-3xl bg-[#10251f] shadow-lg">

        <div className="relative px-6 py-7 sm:px-8 sm:py-9">

          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#d8a83e]/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

            <div className="max-w-3xl">

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d8a83e] text-[#10251f] shadow-lg">

                  <HardHat
                    size={25}
                    strokeWidth={2.4}
                  />

                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d8a83e]">
                    Mining Operations Intelligence
                  </p>

                  <p className="mt-0.5 text-xs text-white/45">
                    Daily operational command centre
                  </p>

                </div>

              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Good Day, Mine Admin.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
                Monitor production, processing,
                equipment, workforce, fuel and
                operational performance from one
                central workspace.
              </p>

            </div>

            {/* HERO ACTIONS */}

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">

              <button
                type="button"
                onClick={() =>
                  void handleRefresh()
                }
                disabled={
                  refreshing ||
                  loading
                }
                aria-label="Refresh dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <RefreshCw
                  size={17}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}

              </button>

              {/* Operational Status */}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">

                    <Activity
                      size={20}
                    />

                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                      Mine Status
                    </p>

                    <div className="mt-1 flex items-center gap-2">

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          dashboard?.mine_status
                            .status ===
                          "Operations Active"
                            ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"
                            : "bg-amber-400"
                        }`}
                      />

                      <span className="text-sm font-semibold text-white">

                        {loading
                          ? "Loading..."
                          : dashboard
                              ?.mine_status
                              .status ??
                            "Operations Standby"}

                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* LOADING / ERROR */}

      {error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-5">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-bold text-red-800">
                Dashboard data could not be loaded
              </p>

              <p className="mt-1 text-xs text-red-600">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                void loadDashboard(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Retry"}

            </button>

          </div>

        </section>
      )}

      {/* KPI CARDS */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10251f]/[0.07] text-[#10251f]">

                  <Icon
                    size={21}
                    strokeWidth={2}
                  />

                </div>

                {stat.change && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      stat.trend === "up"
                        ? "bg-emerald-50 text-emerald-700"
                        : stat.trend === "down"
                          ? "bg-red-50 text-red-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >

                    {stat.trend ===
                      "up" && (
                      <ArrowUpRight
                        size={13}
                      />
                    )}

                    {stat.trend ===
                      "down" && (
                      <ArrowDownRight
                        size={13}
                      />
                    )}

                    {stat.change}

                  </span>
                )}

              </div>

              <div className="mt-5">

                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <div className="mt-1 flex items-baseline gap-2">

                  <p className="text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </p>

                  <span className="text-sm font-medium text-slate-400">
                    {stat.unit}
                  </span>

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {stat.description}
                </p>

              </div>

            </article>
          );
        })}

      </section>

      {/* MAIN ANALYTICS AREA */}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.8fr)]">

        {/* Production Overview */}

        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#10251f]">
                Production
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Production Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Daily material processing and
                production performance.
              </p>

            </div>

            <button
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              View Report
            </button>

          </div>

          <div className="p-5 sm:p-6">

            <div className="relative h-[260px] overflow-hidden rounded-2xl bg-[#f8faf9] p-5">

              <div className="absolute inset-x-5 top-5 flex justify-between text-[10px] font-medium text-slate-400">
                <span>300t</span>
                <span>250t</span>
                <span>200t</span>
                <span>150t</span>
                <span>100t</span>
              </div>

              <div className="absolute inset-x-5 bottom-12 top-12 flex flex-col justify-between">

                <div className="border-t border-dashed border-slate-200" />
                <div className="border-t border-dashed border-slate-200" />
                <div className="border-t border-dashed border-slate-200" />
                <div className="border-t border-dashed border-slate-200" />
                <div className="border-t border-dashed border-slate-200" />

              </div>

              {chartPath ? (
                <svg
                  viewBox="0 0 800 220"
                  preserveAspectRatio="none"
                  className="absolute inset-x-5 bottom-10 top-12 h-[190px] w-[calc(100%-40px)]"
                  role="img"
                  aria-label="Production performance chart"
                >

                  <defs>

                    <linearGradient
                      id="productionFill"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#10251f"
                        stopOpacity="0.18"
                      />

                      <stop
                        offset="100%"
                        stopColor="#10251f"
                        stopOpacity="0"
                      />

                    </linearGradient>

                  </defs>

                  <path
                    d={chartFillPath}
                    fill="url(#productionFill)"
                  />

                  <path
                    d={chartPath}
                    fill="none"
                    stroke="#10251f"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                </svg>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">

                  <p className="text-sm font-medium text-slate-400">
                    No production data available
                  </p>

                </div>
              )}

              <div className="absolute inset-x-5 bottom-3 flex justify-between text-[10px] font-medium text-slate-400">

                {chartLabels.map(
                  (
                    label,
                    index,
                  ) => (
                    <span
                      key={`${label}-${index}`}
                    >
                      {label}
                    </span>
                  ),
                )}

              </div>

            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs text-slate-400">
                  Target
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {production
                    ? `${production.target.toLocaleString()}t`
                    : "—"}
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs text-slate-400">
                  Actual
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {production
                    ? `${production.actual.toLocaleString()}t`
                    : "—"}
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs text-slate-400">
                  Achievement
                </p>

                <p className="mt-1 text-lg font-bold text-emerald-700">
                  {production
                    ? `${production.achievement}%`
                    : "—"}
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs text-slate-400">
                  Remaining
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {production
                    ? `${production.remaining.toLocaleString()}t`
                    : "—"}
                </p>

              </div>

            </div>

          </div>

        </article>

        {/* Equipment */}

        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5 sm:p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#10251f]">
                  Equipment
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Equipment Status
                </h2>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f]/[0.07] text-[#10251f]">
                <Truck size={20} />
              </div>

            </div>

          </div>

          <div className="divide-y divide-slate-100">

            {equipment.length > 0 ? (
              equipment.map(
                (
                  item: DashboardEquipment,
                ) => {
                  const Icon =
                    getEquipmentIcon(
                      item.name,
                    );

                  const isOperational =
                    item.status ===
                    "Operational";

                  return (
                    <div
                      key={item.name}
                      className="p-5 transition hover:bg-slate-50"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <Icon size={19} />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center justify-between gap-3">

                            <p className="truncate text-sm font-semibold text-slate-800">
                              {item.name}
                            </p>

                            <span
                              className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                                isOperational
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {item.status}
                            </span>

                          </div>

                          <p className="mt-1 text-xs text-slate-400">
                            {item.type}
                          </p>

                          <div className="mt-3 flex items-center gap-3">

                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">

                              <div
                                className="h-full rounded-full bg-[#10251f]"
                                style={{
                                  width: `${Math.min(
                                    Math.max(
                                      item.utilization,
                                      0,
                                    ),
                                    100,
                                  )}%`,
                                }}
                              />

                            </div>

                            <span className="text-xs font-semibold text-slate-500">
                              {item.utilization}%
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                },
              )
            ) : (
              <div className="p-6">

                <div className="rounded-2xl bg-slate-50 p-6 text-center">

                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#10251f]/[0.07] text-[#10251f]">
                    <Truck size={20} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    Equipment data not available yet
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    The Equipment module will
                    populate this section once it
                    is connected to the Dashboard.
                  </p>

                </div>

              </div>
            )}

          </div>

        </article>

      </section>

      {/* QUICK ACTIONS */}

      <section>

        <div className="mb-4">

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#10251f]">
            Operations
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Capture important operational
            information quickly.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[
            {
              title: "Record Production",
              description:
                "Capture today's production output",
              icon: Factory,
            },
            {
              title: "Equipment Check",
              description:
                "Update equipment condition",
              icon: Wrench,
            },
            {
              title: "Record Fuel",
              description:
                "Capture fuel consumption",
              icon: Droplets,
            },
            {
              title: "Safety Incident",
              description:
                "Report an operational incident",
              icon: ShieldCheck,
            },
          ].map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                type="button"
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#d8a83e]/60 hover:shadow-md"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10251f]/[0.07] text-[#10251f] transition group-hover:bg-[#d8a83e]">
                    <Icon size={20} />
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="text-slate-300 transition group-hover:text-[#10251f]"
                  />

                </div>

                <h3 className="mt-5 text-sm font-bold text-slate-900">
                  {action.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {action.description}
                </p>

              </button>
            );
          })}

        </div>

      </section>

      {/* BOTTOM SECTION */}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_0.75fr]">

        {/* Recent Activity */}

        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#10251f]">
                Activity
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Recent Operations
              </h2>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Clock3 size={19} />
            </div>

          </div>

          <div className="divide-y divide-slate-100">

            {activities.length > 0 ? (
              activities.map(
                (
                  activity: DashboardActivity,
                  index: number,
                ) => {
                  const Icon =
                    getActivityIcon(
                      activity,
                    );

                  return (
                    <div
                      key={`${activity.title}-${index}`}
                      className="flex gap-4 p-5 transition hover:bg-slate-50 sm:p-6"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10251f]/[0.07] text-[#10251f]">
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">

                          <p className="text-sm font-semibold text-slate-800">
                            {activity.title}
                          </p>

                          <span className="text-xs text-slate-400">
                            {activity.time}
                          </span>

                        </div>

                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          {activity.description}
                        </p>

                      </div>

                    </div>
                  );
                },
              )
            ) : (
              <div className="p-6">

                <div className="rounded-2xl bg-slate-50 p-6 text-center">

                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#10251f]/[0.07] text-[#10251f]">
                    <Clock3 size={20} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    No recent operations
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    New production and operational
                    activity will appear here.
                  </p>

                </div>

              </div>
            )}

          </div>

        </article>

        {/* Daily Operational Summary */}

        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5 sm:p-6">

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#10251f]">
              Daily Summary
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Operational Health
            </h2>

          </div>

          <div className="space-y-5 p-5 sm:p-6">

            {/* Production Target */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-slate-600">
                  Production Target
                </span>

                <span className="text-sm font-bold text-slate-900">
                  {operationalHealth
                    ? `${operationalHealth.production_target}%`
                    : "—"}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-[#10251f]"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        operationalHealth?.production_target ??
                          0,
                        0,
                      ),
                      100,
                    )}%`,
                  }}
                />

              </div>

            </div>

            {/* Equipment Availability */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-slate-600">
                  Equipment Availability
                </span>

                <span className="text-sm font-bold text-slate-900">
                  {operationalHealth?.equipment_availability !==
                    null &&
                  operationalHealth?.equipment_availability !==
                    undefined
                    ? `${operationalHealth.equipment_availability}%`
                    : "—"}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                {operationalHealth?.equipment_availability !==
                  null &&
                operationalHealth?.equipment_availability !==
                  undefined ? (
                  <div
                    className="h-full rounded-full bg-[#d8a83e]"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          operationalHealth.equipment_availability,
                          0,
                        ),
                        100,
                      )}%`,
                    }}
                  />
                ) : (
                  <div
                    className="h-full rounded-full bg-slate-200"
                    style={{
                      width: "0%",
                    }}
                  />
                )}

              </div>

              {operationalHealth?.equipment_availability ===
                null && (
                <p className="mt-1 text-[10px] text-slate-400">
                  Equipment module not yet connected
                </p>
              )}

            </div>

            {/* Safety Compliance */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-slate-600">
                  Safety Compliance
                </span>

                <span className="text-sm font-bold text-slate-900">
                  {operationalHealth?.safety_compliance !==
                    null &&
                  operationalHealth?.safety_compliance !==
                    undefined
                    ? `${operationalHealth.safety_compliance}%`
                    : "—"}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                {operationalHealth?.safety_compliance !==
                  null &&
                operationalHealth?.safety_compliance !==
                  undefined ? (
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          operationalHealth.safety_compliance,
                          0,
                        ),
                        100,
                      )}%`,
                    }}
                  />
                ) : (
                  <div
                    className="h-full rounded-full bg-slate-200"
                    style={{
                      width: "0%",
                    }}
                  />
                )}

              </div>

              {operationalHealth?.safety_compliance ===
                null && (
                <p className="mt-1 text-[10px] text-slate-400">
                  Safety module not yet connected
                </p>
              )}

            </div>

            {/* Workforce Attendance */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-slate-600">
                  Workforce Attendance
                </span>

                <span className="text-sm font-bold text-slate-900">
                  {operationalHealth?.workforce_attendance !==
                    null &&
                  operationalHealth?.workforce_attendance !==
                    undefined
                    ? `${operationalHealth.workforce_attendance}%`
                    : "—"}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                {operationalHealth?.workforce_attendance !==
                  null &&
                operationalHealth?.workforce_attendance !==
                  undefined ? (
                  <div
                    className="h-full rounded-full bg-[#10251f]"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          operationalHealth.workforce_attendance,
                          0,
                        ),
                        100,
                      )}%`,
                    }}
                  />
                ) : (
                  <div
                    className="h-full rounded-full bg-slate-200"
                    style={{
                      width: "0%",
                    }}
                  />
                )}

              </div>

              {operationalHealth?.workforce_attendance ===
                null && (
                <p className="mt-1 text-[10px] text-slate-400">
                  Workforce module not yet connected
                </p>
              )}

            </div>

            {/* Operational Message */}

            <div className="mt-6 rounded-2xl bg-[#10251f] p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
                  <Activity size={19} />
                </div>

                <div>

                  <p className="text-sm font-bold text-white">
                    {operationalMessage.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/50">
                    {operationalMessage.description}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </article>

      </section>

      {/* FOOTER */}

      <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row sm:items-center">

        <p>
          SmartMine Operations Intelligence
        </p>

        <p>
          Daily mining operations command centre
        </p>

      </footer>

    </div>
  );
}

/* =========================================================
   MAIN APPLICATION
========================================================= */

function App() {
  const [sidebarOpen, setSidebarOpen] =
    useState<boolean>(false);

  const [activePage, setActivePage] =
    useState<string>("Dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "Mine Operations":
        return <MineOperations />;

      case "Processing":
        return <Processing />;

      case "Equipment":
        return <Equipment />;

      case "Workforce":
        return <Workforce />;

      case "Inventory":
        return <Inventory />;

      case "Fuel":
        return <Fuel />;

      case "Safety":
        return <Safety />;

      case "Finance":
        return <Finance />;

      case "Sales":
        return <Sales />;

      case "Reports":
        return <Reports />;

      case "Smart Intelligence":
        return <SmartIntelligence />;

      case "Settings":
        return <Settings />;

      case "Dashboard":
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f8]">

      {/* SIDEBAR */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
        activePage={activePage}
        onNavigate={(page: string) => {
          setActivePage(page);
          setSidebarOpen(false);
        }}
      />

      {/* MAIN APPLICATION */}

      <main className="min-h-screen lg:pl-[270px]">

        {/* HEADER */}

        <Header
          pageTitle={activePage}
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        {/* PAGE CONTENT */}

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {renderPage()}
        </div>

      </main>

    </div>
  );
}

export default App;