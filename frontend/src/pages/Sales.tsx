import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  CircleDollarSign,
  FileText,
  Plus,
  RefreshCw,
  ShoppingCart,
  Users,
} from "lucide-react";

import SalesKPI from "../components/sales/SalesKPI";
import SalesOverview from "../components/sales/SalesOverview";
import SalesProductBreakdown from "../components/sales/SalesProductBreakdown";
import SalesTransactions from "../components/sales/SalesTransactions";
import SalesBuyerPerformance from "../components/sales/SalesBuyerPerformance";
import SalesAlerts from "../components/sales/SalesAlerts";
import RecordSaleModal from "../components/sales/RecordSaleModal";

import salesService from "../services/salesService";

export type SaleProduct =
  | "Gold"
  | "Gold Concentrate"
  | "Copper"
  | "Chrome"
  | "Other";

export type SaleStatus = "Completed" | "Pending" | "Overdue";

export type SalesTransaction = {
  id: number;
  reference: string;
  date: string;
  buyer: string;
  product: SaleProduct;
  quantity: number;
  unit: string;
  purity: string;
  amount: number;
  status: SaleStatus;
  paymentMethod: string;
  recordedBy: string;
};

const initialSales: SalesTransaction[] = [
  {
    id: 1,
    reference: "SAL-2026-041",
    date: "05 Sep 2026",
    buyer: "Golden Horizon Refiners",
    product: "Gold",
    quantity: 18.6,
    unit: "g",
    purity: "91.4%",
    amount: 68200,
    status: "Completed",
    paymentMethod: "Bank Transfer",
    recordedBy: "Mine Admin",
  },
  {
    id: 2,
    reference: "SAL-2026-040",
    date: "04 Sep 2026",
    buyer: "Mwamba Gold Buyers",
    product: "Gold Concentrate",
    quantity: 84,
    unit: "kg",
    purity: "68.2%",
    amount: 45100,
    status: "Pending",
    paymentMethod: "Bank Transfer",
    recordedBy: "Mine Admin",
  },
  {
    id: 3,
    reference: "SAL-2026-039",
    date: "03 Sep 2026",
    buyer: "Golden Horizon Refiners",
    product: "Gold",
    quantity: 14.2,
    unit: "g",
    purity: "89.8%",
    amount: 51200,
    status: "Completed",
    paymentMethod: "Bank Transfer",
    recordedBy: "Mine Admin",
  },
  {
    id: 4,
    reference: "SAL-2026-038",
    date: "02 Sep 2026",
    buyer: "Mwamba Gold Buyers",
    product: "Gold Concentrate",
    quantity: 76,
    unit: "kg",
    purity: "65.7%",
    amount: 39800,
    status: "Completed",
    paymentMethod: "Cash",
    recordedBy: "Operations Manager",
  },
  {
    id: 5,
    reference: "SAL-2026-037",
    date: "31 Aug 2026",
    buyer: "Great Dyke Minerals",
    product: "Copper",
    quantity: 1.8,
    unit: "t",
    purity: "72.1%",
    amount: 28600,
    status: "Pending",
    paymentMethod: "Bank Transfer",
    recordedBy: "Mine Admin",
  },
  {
    id: 6,
    reference: "SAL-2026-036",
    date: "30 Aug 2026",
    buyer: "Golden Horizon Refiners",
    product: "Gold",
    quantity: 11.8,
    unit: "g",
    purity: "88.9%",
    amount: 42600,
    status: "Completed",
    paymentMethod: "Bank Transfer",
    recordedBy: "Mine Admin",
  },
  {
    id: 7,
    reference: "SAL-2026-035",
    date: "29 Aug 2026",
    buyer: "Mwamba Gold Buyers",
    product: "Gold Concentrate",
    quantity: 91,
    unit: "kg",
    purity: "70.3%",
    amount: 47400,
    status: "Overdue",
    paymentMethod: "Bank Transfer",
    recordedBy: "Mine Admin",
  },
  {
    id: 8,
    reference: "SAL-2026-034",
    date: "28 Aug 2026",
    buyer: "Great Dyke Minerals",
    product: "Chrome",
    quantity: 4.2,
    unit: "t",
    purity: "61.5%",
    amount: 21900,
    status: "Completed",
    paymentMethod: "Bank Transfer",
    recordedBy: "Operations Manager",
  },
];

function formatCurrency(value: number) {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function Sales() {
  const [sales, setSales] =
    useState<SalesTransaction[]>(initialSales);

  const [isSaleModalOpen, setIsSaleModalOpen] =
    useState(false);

  const [editingSale, setEditingSale] =
    useState<SalesTransaction | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"All" | SaleStatus>("All");

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadSales = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await salesService.getSales();

      setSales(data);
    } catch (err) {
      console.error(
        "Failed to load sales:",
        err,
      );

      setError(
        "Unable to load sales from the backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const totals = useMemo(() => {
    const revenue = sales
      .filter(
        (sale) =>
          sale.status === "Completed",
      )
      .reduce(
        (sum, sale) =>
          sum + sale.amount,
        0,
      );

    const pending = sales
      .filter(
        (sale) =>
          sale.status === "Pending",
      )
      .reduce(
        (sum, sale) =>
          sum + sale.amount,
        0,
      );

    const overdue = sales
      .filter(
        (sale) =>
          sale.status === "Overdue",
      )
      .reduce(
        (sum, sale) =>
          sum + sale.amount,
        0,
      );

    const completedSales =
      sales.filter(
        (sale) =>
          sale.status === "Completed",
      );

    const average =
      completedSales.length > 0
        ? revenue /
          completedSales.length
        : 0;

    const buyers = new Set(
      sales.map(
        (sale) => sale.buyer,
      ),
    );

    return {
      revenue,
      pending,
      overdue,
      average,
      buyers: buyers.size,
    };
  }, [sales]);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      const matchesSearch =
        !search ||
        sale.reference
          .toLowerCase()
          .includes(search) ||
        sale.buyer
          .toLowerCase()
          .includes(search) ||
        sale.product
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        sale.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    sales,
    searchTerm,
    statusFilter,
  ]);

  const handleAddSale = async (
    sale: Omit<
      SalesTransaction,
      | "id"
      | "reference"
      | "date"
      | "recordedBy"
    >,
  ) => {
    try {
      setSaving(true);
      setError("");

      const createdSale =
        await salesService.createSale({
          buyer: sale.buyer,
          product: sale.product,
          quantity: sale.quantity,
          unit: sale.unit,
          purity: sale.purity,
          amount: sale.amount,
          status: sale.status,
          paymentMethod:
            sale.paymentMethod,
          recordedBy:
            "Mine Admin",
        });

      setSales(
        (currentSales) => [
          createdSale,
          ...currentSales,
        ],
      );

      setIsSaleModalOpen(false);
    } catch (err) {
      console.error(
        "Failed to create sale:",
        err,
      );

      setError(
        "Unable to record the sale. Please check the backend.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * EDIT SALE
   */
  const handleEditSale = (
    sale: SalesTransaction,
  ) => {
    setError("");
    setEditingSale(sale);
    setIsSaleModalOpen(true);
  };

  /*
   * DELETE SALE
   */
  const handleDeleteSale = async (
    sale: SalesTransaction,
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${sale.reference}?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await salesService.deleteSale(
        sale.id,
      );

      setSales(
        (currentSales) =>
          currentSales.filter(
            (currentSale) =>
              currentSale.id !==
              sale.id,
          ),
      );
    } catch (err) {
      console.error(
        "Failed to delete sale:",
        err,
      );

      setError(
        "Unable to delete the sale. Please check the backend.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * UPDATE SALE
   */
  const handleUpdateSale = async (
    sale: Omit<
      SalesTransaction,
      | "id"
      | "reference"
      | "date"
      | "recordedBy"
    >,
  ) => {
    if (!editingSale) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedSale =
        await salesService.updateSale(
          editingSale.id,
          {
            buyer: sale.buyer,
            product: sale.product,
            quantity: sale.quantity,
            unit: sale.unit,
            purity: sale.purity,
            amount: sale.amount,
            status: sale.status,
            paymentMethod:
              sale.paymentMethod,
          },
        );

      setSales(
        (currentSales) =>
          currentSales.map(
            (currentSale) =>
              currentSale.id ===
              updatedSale.id
                ? updatedSale
                : currentSale,
          ),
      );

      setEditingSale(null);
      setIsSaleModalOpen(false);
    } catch (err) {
      console.error(
        "Failed to update sale:",
        err,
      );

      setError(
        "Unable to update the sale. Please check the backend.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleModalSubmit = async (
    sale: Omit<
      SalesTransaction,
      | "id"
      | "reference"
      | "date"
      | "recordedBy"
    >,
  ) => {
    if (editingSale) {
      await handleUpdateSale(sale);
    } else {
      await handleAddSale(sale);
    }
  };

  return (
    <div className="min-h-full bg-[#f5f7f7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* Hero */}
        <section className="overflow-hidden rounded-[24px] bg-[#10251f] text-white shadow-sm">
          <div className="flex flex-col gap-6 px-6 py-7 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-8">

            <div>
              <div className="mb-3 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
                  <ShoppingCart
                    size={21}
                    strokeWidth={2.3}
                  />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d8a83e]">
                  Sales & Revenue
                </span>

              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Mine Sales
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
                Track mineral sales, buyers, settlements and
                revenue generated from mine production.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={loadSales}
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
                  : "Refresh Sales"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingSale(null);
                  setIsSaleModalOpen(true);
                }}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#d8a83e] px-5 py-3 text-sm font-bold text-[#10251f] shadow-lg transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={18} />
                Record Sale
              </button>

            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Saving */}
        {saving && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-medium text-blue-700">
            Saving sale to the backend...
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <SalesKPI
            title="Sales Revenue"
            value={formatCurrency(
              totals.revenue,
            )}
            subtitle="Completed sales"
            icon={CircleDollarSign}
            trend="+9.8%"
            trendLabel="vs previous period"
            positive
          />

          <SalesKPI
            title="Pending Settlements"
            value={formatCurrency(
              totals.pending,
            )}
            subtitle="Awaiting payment"
            icon={FileText}
            trend={`${sales.filter(
              (sale) =>
                sale.status ===
                "Pending",
            ).length} sales`}
            trendLabel="pending"
            warning
          />

          <SalesKPI
            title="Average Sale"
            value={formatCurrency(
              totals.average,
            )}
            subtitle="Per completed transaction"
            icon={ArrowDownLeft}
            trend="+5.2%"
            trendLabel="average value"
            positive
          />

          <SalesKPI
            title="Active Buyers"
            value={String(
              totals.buyers,
            )}
            subtitle="Recorded buying accounts"
            icon={Users}
            trend={
              totals.overdue > 0
                ? `${formatCurrency(
                    totals.overdue,
                  )} overdue`
                : "All current"
            }
            trendLabel="settlement status"
            warning={
              totals.overdue > 0
            }
          />

        </div>

        {/* Overview */}
        <SalesOverview
          sales={sales}
        />

        {/* Breakdown + Buyers */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          <SalesProductBreakdown
            sales={sales}
          />

          <SalesBuyerPerformance
            sales={sales}
          />

        </div>

        {/* Alerts */}
        <SalesAlerts
          sales={sales}
        />

        {/* Transactions */}
        <SalesTransactions
          sales={filteredSales}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={
            setSearchTerm
          }
          onStatusChange={
            setStatusFilter
          }
          onEdit={
            handleEditSale
          }
          onDelete={
            handleDeleteSale
          }
        />

      </div>

      <RecordSaleModal
        open={isSaleModalOpen}
        onClose={() => {
          if (!saving) {
            setIsSaleModalOpen(false);
            setEditingSale(null);
          }
        }}
        onSubmit={
          handleModalSubmit
        }
        editingSale={
          editingSale
        }
      />
    </div>
  );
}

export default Sales;