import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Download,
  FileBarChart,
  FileText,
  Filter,
  Printer,
  RefreshCw,
  Save,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";

import ReportsKPI from "../components/reports/ReportsKPI";
import ReportsOverview from "../components/reports/ReportsOverview";
import ReportsPerformance from "../components/reports/ReportsPerformance";
import ReportsOperationalSummary from "../components/reports/ReportsOperationalSummary";
import ReportsSafety from "../components/reports/ReportsSafety";
import ReportsFinancial from "../components/reports/ReportsFinancial";
import ReportsTable from "../components/reports/ReportsTable";
import ReportDetailsModal from "../components/reports/ReportDetailsModal";

import reportsService from "../services/reportsService";

export type ReportPeriod =
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Annual";

export type ReportCategory =
  | "Operations"
  | "Production"
  | "Processing"
  | "Equipment"
  | "Workforce"
  | "Inventory"
  | "Fuel"
  | "Safety"
  | "Finance"
  | "Sales";

export type ReportStatus =
  | "Ready"
  | "Pending"
  | "Attention Required";

export type MineReport = {
  id: number;
  name: string;
  category: ReportCategory;
  period: ReportPeriod;
  generatedDate: string;
  status: ReportStatus;
  records: number;
  summary: string;
};

type EditReportForm = {
  name: string;
  category: ReportCategory;
  period: ReportPeriod;
  status: ReportStatus;
  records: number;
  summary: string;
};

function formatCurrency(value: number): string {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function Reports() {
  const [period, setPeriod] =
    useState<ReportPeriod>("Monthly");

  const [category, setCategory] = useState<
    "All" | ReportCategory
  >("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [reports, setReports] =
    useState<MineReport[]>([]);

  const [selectedReport, setSelectedReport] =
    useState<MineReport | null>(null);

  const [editingReport, setEditingReport] =
    useState<MineReport | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [generating, setGenerating] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [financial, setFinancial] = useState({
    revenue: 482600,
    expenses: 287450,
    profit: 195150,
  });

  const [editForm, setEditForm] =
    useState<EditReportForm>({
      name: "",
      category: "Operations",
      period: "Monthly",
      status: "Ready",
      records: 0,
      summary: "",
    });

  const loadReports = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const data =
        await reportsService.getReports();

      setReports(data);
    } catch (err) {
      console.error(
        "Failed to load reports:",
        err,
      );

      setError(
        "Unable to load reports from the backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async (
    selectedPeriod: ReportPeriod,
  ): Promise<void> => {
    try {
      const dashboard =
        await reportsService.getDashboard(
          selectedPeriod,
        );

      if (dashboard?.financial) {
        setFinancial({
          revenue:
            Number(
              dashboard.financial.revenue,
            ) || 0,
          expenses:
            Number(
              dashboard.financial.expenses,
            ) || 0,
          profit:
            Number(
              dashboard.financial.profit,
            ) || 0,
        });
      }
    } catch (err) {
      console.error(
        "Failed to load reports dashboard:",
        err,
      );
    }
  };

  useEffect(() => {
    void loadReports();
  }, []);

  useEffect(() => {
    void loadDashboard(period);
  }, [period]);

  const filteredReports = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesPeriod =
        report.period === period;

      const matchesCategory =
        category === "All" ||
        report.category === category;

      const matchesSearch =
        !search ||
        report.name
          .toLowerCase()
          .includes(search) ||
        report.category
          .toLowerCase()
          .includes(search) ||
        report.summary
          .toLowerCase()
          .includes(search);

      return (
        matchesPeriod &&
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    reports,
    period,
    category,
    searchTerm,
  ]);

  const reportStats = useMemo(() => {
    const periodReports =
      reports.filter(
        (report) =>
          report.period === period,
      );

    const ready =
      periodReports.filter(
        (report) =>
          report.status === "Ready",
      ).length;

    const attention =
      periodReports.filter(
        (report) =>
          report.status ===
          "Attention Required",
      ).length;

    const pending =
      periodReports.filter(
        (report) =>
          report.status === "Pending",
      ).length;

    const records =
      periodReports.reduce(
        (sum, report) =>
          sum + report.records,
        0,
      );

    return {
      ready,
      attention,
      pending,
      records,
    };
  }, [reports, period]);

  const handleGenerateReport =
    async (): Promise<void> => {
      try {
        setGenerating(true);
        setError("");
        setSuccess("");

        const report =
          await reportsService.generateReport(
            period,
            "Operations",
          );

        setReports((current) => [
          report,
          ...current,
        ]);

        setSelectedReport(report);

        setSuccess(
          "Report generated successfully.",
        );

        await loadDashboard(period);
      } catch (err) {
        console.error(
          "Failed to generate report:",
          err,
        );

        setError(
          "Unable to generate the report. Please check the backend.",
        );
      } finally {
        setGenerating(false);
      }
    };

  const handleRefresh = async (): Promise<void> => {
    setSuccess("");

    await Promise.all([
      loadReports(),
      loadDashboard(period),
    ]);
  };

  const handleEditReport = (
    report: MineReport,
  ): void => {
    setError("");
    setSuccess("");

    setEditingReport(report);

    setEditForm({
      name: report.name,
      category: report.category,
      period: report.period,
      status: report.status,
      records: report.records,
      summary: report.summary,
    });
  };

  const handleEditFormChange = (
    field: keyof EditReportForm,
    value: string | number,
  ): void => {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveEdit =
    async (): Promise<void> => {
      if (!editingReport) {
        return;
      }

      if (!editForm.name.trim()) {
        setError(
          "Report name is required.",
        );
        return;
      }

      if (!editForm.summary.trim()) {
        setError(
          "Report summary is required.",
        );
        return;
      }

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        const updatedReport =
          await reportsService.updateReport(
            editingReport.id,
            {
              name: editForm.name.trim(),
              category: editForm.category,
              period: editForm.period,
              status: editForm.status,
              records:
                Number(editForm.records) || 0,
              summary:
                editForm.summary.trim(),
            },
          );

        setReports((current) =>
          current.map((report) =>
            report.id ===
            updatedReport.id
              ? updatedReport
              : report,
          ),
        );

        if (
          selectedReport?.id ===
          updatedReport.id
        ) {
          setSelectedReport(
            updatedReport,
          );
        }

        setEditingReport(null);

        setSuccess(
          "Report updated successfully.",
        );

        await loadDashboard(
          updatedReport.period,
        );
      } catch (err) {
        console.error(
          "Failed to update report:",
          err,
        );

        setError(
          "Unable to update the report. Please check the backend.",
        );
      } finally {
        setSaving(false);
      }
    };

  const handleDeleteReport = async (
    report: MineReport,
  ): Promise<void> => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${report.name}"?\n\nThis action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(report.id);
      setError("");
      setSuccess("");

      await reportsService.deleteReport(
        report.id,
      );

      setReports((current) =>
        current.filter(
          (item) =>
            item.id !== report.id,
        ),
      );

      if (
        selectedReport?.id ===
        report.id
      ) {
        setSelectedReport(null);
      }

      if (
        editingReport?.id ===
        report.id
      ) {
        setEditingReport(null);
      }

      setSuccess(
        "Report deleted successfully.",
      );

      await loadDashboard(period);
    } catch (err) {
      console.error(
        "Failed to delete report:",
        err,
      );

      setError(
        "Unable to delete the report. Please check the backend.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportReport = (): void => {
    const reportsToExport =
      filteredReports.length > 0
        ? filteredReports
        : reports.filter(
            (report) =>
              report.period === period,
          );

    if (
      reportsToExport.length === 0
    ) {
      setError(
        "There are no reports available to export.",
      );
      return;
    }

    const headers = [
      "Report",
      "Category",
      "Period",
      "Generated",
      "Records",
      "Status",
      "Summary",
    ];

    const escapeCsv = (
      value: string | number,
    ): string => {
      const text = String(value);

      return `"${text.replace(
        /"/g,
        '""',
      )}"`;
    };

    const rows =
      reportsToExport.map(
        (report) =>
          [
            report.name,
            report.category,
            report.period,
            report.generatedDate,
            report.records,
            report.status,
            report.summary,
          ]
            .map(escapeCsv)
            .join(","),
      );

    const csv = [
      headers
        .map(escapeCsv)
        .join(","),
      ...rows,
    ].join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      },
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `smartmine-${period.toLowerCase()}-reports.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handlePrintReport = (): void => {
    window.print();
  };

  return (
    <div className="min-h-full bg-[#f5f7f7] p-4 sm:p-6 lg:p-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* Hero */}
        <section className="overflow-hidden rounded-[24px] bg-[#10251f] text-white shadow-sm print:hidden">
          <div className="flex flex-col gap-6 px-6 py-7 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-8">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
                  <FileBarChart
                    size={21}
                    strokeWidth={2.3}
                  />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d8a83e]">
                  Mine Reporting Centre
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Mine Reports
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
                Analyse mine performance across operations,
                production, equipment, safety, finance and
                sales from weekly to annual reporting periods.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                {loading
                  ? "Refreshing..."
                  : "Refresh Reports"}
              </button>

              <button
                type="button"
                onClick={handleGenerateReport}
                disabled={generating}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    generating
                      ? "animate-spin"
                      : ""
                  }
                />

                {generating
                  ? "Generating..."
                  : "Generate Report"}
              </button>

              <button
                type="button"
                onClick={handleExportReport}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#d8a83e] px-5 py-3 text-sm font-bold text-[#10251f] shadow-lg transition hover:brightness-105"
              >
                <Download size={18} />
                Export Report
              </button>
            </div>
          </div>
        </section>

        {/* Print Header */}
        <div className="hidden print:block">
          <div className="mb-6 border-b border-slate-200 pb-5">
            <h1 className="text-2xl font-bold text-[#10251f]">
              SmartMine — Mine Reports
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Reporting Period: {period}
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 print:hidden">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 transition hover:bg-red-100"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700 print:hidden">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} />
              <span>{success}</span>
            </div>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="rounded-lg p-1 transition hover:bg-emerald-100"
              aria-label="Dismiss success message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Period Selector */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 print:border-0 print:shadow-none">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#10251f] print:hidden">
                <CalendarDays size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#10251f]">
                  Reporting Period
                </p>

                <p className="text-xs text-slate-400">
                  Select the reporting window for the mine.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 print:hidden">
              {(
                [
                  "Weekly",
                  "Monthly",
                  "Quarterly",
                  "Annual",
                ] as ReportPeriod[]
              ).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPeriod(item)}
                  className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
                    period === item
                      ? "bg-[#10251f] text-white shadow-md"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* KPI */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReportsKPI
            title="Reports Ready"
            value={String(reportStats.ready)}
            subtitle={`${period.toLowerCase()} reports`}
            icon={FileText}
            trend="Ready"
            trendLabel="available for review"
            positive
          />

          <ReportsKPI
            title="Records Analysed"
            value={reportStats.records.toLocaleString()}
            subtitle="Operational records"
            icon={BarChart3}
            trend="+8.4%"
            trendLabel="activity captured"
            positive
          />

          <ReportsKPI
            title="Attention Required"
            value={String(reportStats.attention)}
            subtitle="Reports requiring review"
            icon={ShieldCheck}
            trend={
              reportStats.attention > 0
                ? "Review"
                : "Clear"
            }
            trendLabel="management attention"
            warning={
              reportStats.attention > 0
            }
          />

          <ReportsKPI
            title="Pending Reports"
            value={String(reportStats.pending)}
            subtitle="Awaiting completion"
            icon={Truck}
            trend={
              reportStats.pending > 0
                ? "Pending"
                : "Up to date"
            }
            trendLabel="report generation"
            warning={
              reportStats.pending > 0
            }
          />
        </div>

        {/* Main Overview */}
        <ReportsOverview period={period} />

        {/* Performance */}
        <ReportsPerformance period={period} />

        {/* Operational Summary */}
        <ReportsOperationalSummary
          period={period}
        />

        {/* Safety + Financial */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ReportsSafety period={period} />

          <ReportsFinancial
            period={period}
            revenue={financial.revenue}
            expenses={financial.expenses}
            profit={financial.profit}
            formatCurrency={formatCurrency}
          />
        </div>

        {/* Report Library */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm print:border-0 print:shadow-none">
          <div className="border-b border-slate-100 p-5 sm:p-6 print:hidden">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FileText
                    size={20}
                    className="text-[#d8a83e]"
                  />

                  <h2 className="text-lg font-bold text-[#10251f]">
                    Report Library
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  Available {period.toLowerCase()} reports
                  for the mine.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <FileText
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value,
                      )
                    }
                    placeholder="Search reports..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/10 sm:w-64"
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(
                        event.target.value as
                          | "All"
                          | ReportCategory,
                      )
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm font-medium text-slate-600 outline-none focus:border-[#d8a83e] sm:w-48"
                  >
                    <option value="All">
                      All Categories
                    </option>
                    <option value="Operations">
                      Operations
                    </option>
                    <option value="Production">
                      Production
                    </option>
                    <option value="Processing">
                      Processing
                    </option>
                    <option value="Equipment">
                      Equipment
                    </option>
                    <option value="Workforce">
                      Workforce
                    </option>
                    <option value="Inventory">
                      Inventory
                    </option>
                    <option value="Fuel">
                      Fuel
                    </option>
                    <option value="Safety">
                      Safety
                    </option>
                    <option value="Finance">
                      Finance
                    </option>
                    <option value="Sales">
                      Sales
                    </option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handlePrintReport}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#10251f] transition hover:border-[#d8a83e] hover:bg-[#d8a83e]/10"
                >
                  <Printer size={16} />
                  Print
                </button>
              </div>
            </div>
          </div>

          <ReportsTable
            reports={filteredReports}
            onView={setSelectedReport}
            onEdit={handleEditReport}
            onDelete={handleDeleteReport}
          />
        </section>
      </div>

      {/* View Report Modal */}
      <ReportDetailsModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      {/* Edit Report Modal */}
      {editingReport && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
                  <FileBarChart size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#10251f]">
                    Edit Report
                  </h2>

                  <p className="text-xs text-slate-400">
                    Update report information
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingReport(null)
                }
                disabled={saving}
                aria-label="Close edit report"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 p-6">
              {/* Report Name */}
              <div>
                <label
                  htmlFor="report-name"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Report Name
                </label>

                <input
                  id="report-name"
                  type="text"
                  value={editForm.name}
                  onChange={(event) =>
                    handleEditFormChange(
                      "name",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-[#10251f] outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/10"
                />
              </div>

              {/* Category + Period */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="report-category"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Category
                  </label>

                  <select
                    id="report-category"
                    value={editForm.category}
                    onChange={(event) =>
                      handleEditFormChange(
                        "category",
                        event.target.value as ReportCategory,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-[#d8a83e]"
                  >
                    <option value="Operations">
                      Operations
                    </option>
                    <option value="Production">
                      Production
                    </option>
                    <option value="Processing">
                      Processing
                    </option>
                    <option value="Equipment">
                      Equipment
                    </option>
                    <option value="Workforce">
                      Workforce
                    </option>
                    <option value="Inventory">
                      Inventory
                    </option>
                    <option value="Fuel">
                      Fuel
                    </option>
                    <option value="Safety">
                      Safety
                    </option>
                    <option value="Finance">
                      Finance
                    </option>
                    <option value="Sales">
                      Sales
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="report-period"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Period
                  </label>

                  <select
                    id="report-period"
                    value={editForm.period}
                    onChange={(event) =>
                      handleEditFormChange(
                        "period",
                        event.target.value as ReportPeriod,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-[#d8a83e]"
                  >
                    <option value="Weekly">
                      Weekly
                    </option>
                    <option value="Monthly">
                      Monthly
                    </option>
                    <option value="Quarterly">
                      Quarterly
                    </option>
                    <option value="Annual">
                      Annual
                    </option>
                  </select>
                </div>
              </div>

              {/* Status + Records */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="report-status"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Status
                  </label>

                  <select
                    id="report-status"
                    value={editForm.status}
                    onChange={(event) =>
                      handleEditFormChange(
                        "status",
                        event.target.value as ReportStatus,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-[#d8a83e]"
                  >
                    <option value="Ready">
                      Ready
                    </option>
                    <option value="Pending">
                      Pending
                    </option>
                    <option value="Attention Required">
                      Attention Required
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="report-records"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Records
                  </label>

                  <input
                    id="report-records"
                    type="number"
                    min="0"
                    value={editForm.records}
                    onChange={(event) =>
                      handleEditFormChange(
                        "records",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-[#10251f] outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/10"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label
                  htmlFor="report-summary"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Summary
                </label>

                <textarea
                  id="report-summary"
                  rows={5}
                  value={editForm.summary}
                  onChange={(event) =>
                    handleEditFormChange(
                      "summary",
                      event.target.value,
                    )
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-[#10251f] outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/10"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setEditingReport(null)
                  }
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#16352d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save
                    size={16}
                    className={
                      saving
                        ? "animate-pulse"
                        : ""
                    }
                  />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Loading Overlay */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-2xl">
            <RefreshCw
              size={18}
              className="animate-spin text-[#d8a83e]"
            />

            <span className="text-sm font-bold text-[#10251f]">
              Deleting report...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;