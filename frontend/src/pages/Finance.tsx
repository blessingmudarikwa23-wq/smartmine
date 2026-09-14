import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  FileText,
  Plus,
  RefreshCw,
  Wallet,
} from "lucide-react";

import FinanceKPI from "../components/finance/FinanceKPI";
import FinanceOverview from "../components/finance/FinanceOverview";
import FinanceExpenseBreakdown from "../components/finance/FinanceExpenseBreakdown";
import FinanceTransactions from "../components/finance/FinanceTransactions";
import FinanceBudgetStatus from "../components/finance/FinanceBudgetStatus";
import FinanceAlerts from "../components/finance/FinanceAlerts";
import RecordExpenseModal from "../components/finance/RecordExpenseModal";

import {
  createFinanceTransaction,
  deleteFinanceTransaction,
  getFinanceDashboard,
  updateFinanceTransaction,
} from "../services/financeService";


export type TransactionType =
  | "Expense"
  | "Income";


export type ExpenseCategory =
  | "Fuel"
  | "Equipment"
  | "Processing"
  | "Workforce"
  | "Inventory"
  | "Safety"
  | "Transport"
  | "Utilities"
  | "Other";


export type TransactionStatus =
  | "Paid"
  | "Pending"
  | "Overdue";


export type FinanceTransaction = {
  id: number;
  reference: string;
  date: string;
  description: string;
  category: ExpenseCategory;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  supplier: string;
  recordedBy: string;
};


function formatCurrency(value: number) {
  return `R ${value.toLocaleString(
    "en-ZA",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  )}`;
}


function Finance() {
  const [
    transactions,
    setTransactions,
  ] = useState<FinanceTransaction[]>([]);

  const [
    isExpenseModalOpen,
    setIsExpenseModalOpen,
  ] = useState(false);

  const [
    editingTransaction,
    setEditingTransaction,
  ] = useState<FinanceTransaction | null>(
    null,
  );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    "All" | TransactionStatus
  >("All");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);


  const loadFinance = async (
    showRefresh = false,
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const dashboard =
        await getFinanceDashboard();

      setTransactions(
        dashboard.transactions,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Finance data.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    void loadFinance();
  }, []);


  const totals = useMemo(() => {
    const income = transactions
      .filter(
        (transaction) =>
          transaction.type === "Income",
      )
      .reduce(
        (sum, transaction) =>
          sum + transaction.amount,
        0,
      );

    const expenses = transactions
      .filter(
        (transaction) =>
          transaction.type === "Expense",
      )
      .reduce(
        (sum, transaction) =>
          sum + transaction.amount,
        0,
      );

    const pending = transactions
      .filter(
        (transaction) =>
          transaction.type === "Expense" &&
          transaction.status === "Pending",
      )
      .reduce(
        (sum, transaction) =>
          sum + transaction.amount,
        0,
      );

    const overdue =
      transactions.filter(
        (transaction) =>
          transaction.status === "Overdue",
      ).length;

    return {
      income,
      expenses,
      net: income - expenses,
      pending,
      overdue,
    };
  }, [transactions]);


  const filteredTransactions =
    useMemo(() => {
      return transactions.filter(
        (transaction) => {
          const search =
            searchTerm.toLowerCase();

          const matchesSearch =
            transaction.reference
              .toLowerCase()
              .includes(search) ||
            transaction.description
              .toLowerCase()
              .includes(search) ||
            transaction.supplier
              .toLowerCase()
              .includes(search);

          const matchesStatus =
            statusFilter === "All" ||
            transaction.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      transactions,
      searchTerm,
      statusFilter,
    ]);


  const openCreateExpense = () => {
    setEditingTransaction(null);
    setIsExpenseModalOpen(true);
  };


  const openEditTransaction = (
    transaction: FinanceTransaction,
  ) => {
    setEditingTransaction(
      transaction,
    );
    setIsExpenseModalOpen(true);
  };


  const handleSaveExpense = async (
    expense: Omit<
      FinanceTransaction,
      "id" |
        "reference" |
        "type" |
        "date" |
        "recordedBy"
    >,
  ) => {
    try {
      setSubmitting(true);
      setError(null);

      if (editingTransaction) {
        const updated =
          await updateFinanceTransaction(
            editingTransaction.id,
            {
              ...expense,
              type: editingTransaction.type,
              date: editingTransaction.date,
              recordedBy:
                editingTransaction.recordedBy,
            },
          );

        setTransactions(
          (current) =>
            current.map(
              (transaction) =>
                transaction.id ===
                updated.id
                  ? updated
                  : transaction,
            ),
        );
      } else {
        const created =
          await createFinanceTransaction(
            {
              ...expense,
              type: "Expense",
              date: new Date().toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                },
              ),
              recordedBy: "Mine Admin",
            },
          );

        setTransactions(
          (current) => [
            created,
            ...current,
          ],
        );
      }

      setIsExpenseModalOpen(false);
      setEditingTransaction(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save finance transaction.",
      );
    } finally {
      setSubmitting(false);
    }
  };


  const handleDeleteTransaction =
    async (id: number) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this finance transaction?",
        );

      if (!confirmed) {
        return;
      }

      try {
        setError(null);

        await deleteFinanceTransaction(
          id,
        );

        setTransactions(
          (current) =>
            current.filter(
              (transaction) =>
                transaction.id !== id,
            ),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete transaction.",
        );
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
                  <CircleDollarSign
                    size={21}
                    strokeWidth={2.3}
                  />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d8a83e]">
                  Financial Control
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Mine Finance
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
                Monitor mine revenue, operating expenses, cash commitments and financial performance from one operational view.
              </p>
            </div>


            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() =>
                  void loadFinance(true)
                }
                disabled={refreshing}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                  : "Refresh Finance"}
              </button>


              <button
                type="button"
                onClick={
                  openCreateExpense
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#d8a83e] px-5 py-3 text-sm font-bold text-[#10251f] shadow-lg transition hover:brightness-105"
              >
                <Plus size={18} />
                Record Expense
              </button>

            </div>
          </div>
        </section>


        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}


        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <FinanceKPI
            title="Revenue"
            value={formatCurrency(
              totals.income,
            )}
            subtitle="Recorded mine income"
            icon={ArrowDownLeft}
            trend="+8.4%"
            trendLabel="vs previous period"
            positive
          />

          <FinanceKPI
            title="Operating Expenses"
            value={formatCurrency(
              totals.expenses,
            )}
            subtitle="Recorded operating costs"
            icon={ArrowUpRight}
            trend="+4.7%"
            trendLabel="spend movement"
          />

          <FinanceKPI
            title="Net Position"
            value={formatCurrency(
              totals.net,
            )}
            subtitle="Revenue less expenses"
            icon={Wallet}
            trend={
              totals.net >= 0
                ? "Positive"
                : "Negative"
            }
            trendLabel="current position"
            positive={
              totals.net >= 0
            }
          />

          <FinanceKPI
            title="Outstanding"
            value={formatCurrency(
              totals.pending,
            )}
            subtitle="Pending supplier payments"
            icon={FileText}
            trend={`${totals.overdue} overdue`}
            trendLabel="requires attention"
            warning
          />

        </div>


        {/* Overview */}
        <FinanceOverview
          income={totals.income}
          expenses={totals.expenses}
        />


        {/* Breakdown + Budget */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <FinanceExpenseBreakdown
            transactions={transactions}
          />

          <FinanceBudgetStatus
            transactions={transactions}
          />
        </div>


        {/* Alerts */}
        <FinanceAlerts
          transactions={transactions}
        />


        {/* Transactions */}
        <FinanceTransactions
          transactions={
            filteredTransactions
          }
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={
            setSearchTerm
          }
          onStatusChange={
            setStatusFilter
          }
          onEdit={
            openEditTransaction
          }
          onDelete={
            handleDeleteTransaction
          }
          loading={loading}
        />

      </div>


      <RecordExpenseModal
        open={isExpenseModalOpen}
        onClose={() => {
          if (!submitting) {
            setIsExpenseModalOpen(
              false,
            );
            setEditingTransaction(
              null,
            );
          }
        }}
        onSubmit={
          handleSaveExpense
        }
        initialTransaction={
          editingTransaction
        }
        submitting={submitting}
      />

    </div>
  );
}


export default Finance;