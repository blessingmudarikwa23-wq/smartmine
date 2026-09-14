import type {
  FinanceTransaction,
} from "../pages/Finance";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://smartmine-backend-wdva.onrender.com"
).replace(/\/+$/, "");

const FINANCE_URL =
  `${API_BASE_URL}/api/v1/finance`;

type FinanceSummary = {
  totalRevenue: number;
  totalExpenses: number;
  netPosition: number;
  pendingAmount: number;
  overdueCount: number;
  transactionCount: number;
};

type FinanceDashboard = {
  summary: FinanceSummary;
  transactions: FinanceTransaction[];
};

type CreateFinanceTransactionData = Omit<
  FinanceTransaction,
  "id" | "reference"
>;

type UpdateFinanceTransactionData =
  Partial<CreateFinanceTransactionData>;

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `${FINANCE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    },
  );

  const responseText = await response.text();

  let responseData: unknown = null;

  try {
    responseData = responseText
      ? JSON.parse(responseText)
      : null;
  } catch {
    responseData = responseText;
  }

  if (!response.ok) {
    let message =
      `Finance API request failed: ${response.status}`;

    if (
      responseData &&
      typeof responseData === "object" &&
      "detail" in responseData
    ) {
      const detail = (
        responseData as {
          detail?: unknown;
        }
      ).detail;

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail)) {
        message = detail
          .map((item) => {
            if (
              item &&
              typeof item === "object" &&
              "msg" in item
            ) {
              return String(
                (
                  item as {
                    msg?: unknown;
                  }
                ).msg,
              );
            }

            return String(item);
          })
          .join(", ");
      }
    }

    throw new Error(message);
  }

  return responseData as T;
}


export async function getFinanceDashboard(): Promise<FinanceDashboard> {
  return request<FinanceDashboard>(
    "/dashboard",
  );
}


export async function getFinanceSummary(): Promise<FinanceSummary> {
  return request<FinanceSummary>(
    "/summary",
  );
}


export async function getFinanceTransactions(
  params: {
    search?: string;
    status?: string;
    type?: string;
    category?: string;
  } = {},
): Promise<FinanceTransaction[]> {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set(
      "search",
      params.search,
    );
  }

  if (params.status) {
    searchParams.set(
      "status",
      params.status,
    );
  }

  if (params.type) {
    searchParams.set(
      "type",
      params.type,
    );
  }

  if (params.category) {
    searchParams.set(
      "category",
      params.category,
    );
  }

  const query =
    searchParams.toString();

  return request<FinanceTransaction[]>(
    query
      ? `/transactions?${query}`
      : "/transactions",
  );
}


export async function getFinanceTransaction(
  id: number,
): Promise<FinanceTransaction> {
  return request<FinanceTransaction>(
    `/transactions/${id}`,
  );
}


export async function createFinanceTransaction(
  data: CreateFinanceTransactionData,
): Promise<FinanceTransaction> {
  return request<FinanceTransaction>(
    "/transactions",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}


export async function updateFinanceTransaction(
  id: number,
  data: UpdateFinanceTransactionData,
): Promise<FinanceTransaction> {
  return request<FinanceTransaction>(
    `/transactions/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}


export async function deleteFinanceTransaction(
  id: number,
): Promise<void> {
  await request<{
    message: string;
    id: number;
  }>(
    `/transactions/${id}`,
    {
      method: "DELETE",
    },
  );
}