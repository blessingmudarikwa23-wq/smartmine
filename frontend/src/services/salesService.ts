import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8001";

const salesApi = axios.create({
  baseURL: `${API_URL}/api/v1/sales`,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
  },
});

export type CreateSalesTransaction = {
  buyer: string;
  product:
    | "Gold"
    | "Gold Concentrate"
    | "Copper"
    | "Chrome"
    | "Other";
  quantity: number;
  unit: string;
  purity: string;
  amount: number;
  status:
    | "Completed"
    | "Pending"
    | "Overdue";
  paymentMethod: string;
  recordedBy?: string;
};

export type UpdateSalesTransaction =
  Partial<CreateSalesTransaction>;

const mapSale = (sale: any) => ({
  id: Number(sale.id),

  reference:
    sale.reference ??
    "",

  date:
    sale.date ??
    "",

  buyer:
    sale.buyer ??
    "",

  product:
    sale.product ??
    "Other",

  quantity:
    Number(
      sale.quantity ?? 0,
    ),

  unit:
    sale.unit ??
    "",

  purity:
    sale.purity ??
    "Not recorded",

  amount:
    Number(
      sale.amount ?? 0,
    ),

  status:
    sale.status ??
    "Pending",

  paymentMethod:
    sale.paymentMethod ??
    sale.payment_method ??
    "Bank Transfer",

  recordedBy:
    sale.recordedBy ??
    sale.recorded_by ??
    "Mine Admin",
});

export const salesService = {
  // -------------------------------------------------------
  // GET ALL SALES
  // Backend: GET /api/v1/sales
  // -------------------------------------------------------

  async getSales(
    search?: string,
    status?:
      | "Completed"
      | "Pending"
      | "Overdue"
      | "All",
  ) {
    const params: Record<string, string> = {};

    if (
      search &&
      search.trim()
    ) {
      params.search =
        search.trim();
    }

    if (
      status &&
      status !== "All"
    ) {
      params.status =
        status;
    }

    const response =
      await salesApi.get(
        "",
        {
          params,
        },
      );

    const data =
      response.data;

    if (
      Array.isArray(data)
    ) {
      return data.map(
        mapSale,
      );
    }

    return [];
  },

  // -------------------------------------------------------
  // GET ONE SALE
  // Backend: GET /api/v1/sales/{sale_id}
  // -------------------------------------------------------

  async getSale(
    id: number,
  ) {
    const response =
      await salesApi.get(
        `/${id}`,
      );

    return mapSale(
      response.data,
    );
  },

  // -------------------------------------------------------
  // CREATE SALE
  // Backend: POST /api/v1/sales
  // -------------------------------------------------------

  async createSale(
    sale: CreateSalesTransaction,
  ) {
    const response =
      await salesApi.post(
        "",
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

    return mapSale(
      response.data,
    );
  },

  // -------------------------------------------------------
  // UPDATE SALE
  // Backend: PUT /api/v1/sales/{sale_id}
  // -------------------------------------------------------

  async updateSale(
    id: number,
    sale: UpdateSalesTransaction,
  ) {
    const response =
      await salesApi.put(
        `/${id}`,
        sale,
      );

    return mapSale(
      response.data,
    );
  },

  // -------------------------------------------------------
  // DELETE SALE
  // Backend: DELETE /api/v1/sales/{sale_id}
  // -------------------------------------------------------

  async deleteSale(
    id: number,
  ) {
    await salesApi.delete(
      `/${id}`,
    );
  },

  // -------------------------------------------------------
  // DASHBOARD
  // Backend: GET /api/v1/sales/dashboard
  // -------------------------------------------------------

  async getDashboard() {
    const response =
      await salesApi.get(
        "/dashboard",
      );

    return response.data;
  },

  // -------------------------------------------------------
  // SUMMARY
  // Backend: GET /api/v1/sales/summary
  // -------------------------------------------------------

  async getSummary() {
    const response =
      await salesApi.get(
        "/summary",
      );

    return response.data;
  },
};

export default salesService;