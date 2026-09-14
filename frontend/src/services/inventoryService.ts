import { InventoryItem, InventoryMovement } from "../pages/Inventory";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export type CreateInventoryPayload = Omit<
  InventoryItem,
  "id" | "status" | "lastUpdated" | "icon"
>;

export const inventoryService = {
  async fetchItems(): Promise<InventoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/inventory/items`);
    if (!response.ok) throw new Error("Failed to fetch inventory items");
    return response.json();
  },

  async createItem(payload: CreateInventoryPayload): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/inventory/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to create inventory item");
    return response.json();
  },

  async stockIn(id: number, quantity: number, user = "Mine Admin"): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/inventory/items/${id}/stock-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity, user }),
    });
    if (!response.ok) throw new Error("Failed to execute stock in");
    return response.json();
  },

  async stockOut(id: number, quantity: number, user = "Mine Admin"): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/inventory/items/${id}/stock-out`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity, user }),
    });
    if (!response.ok) throw new Error("Failed to execute stock out");
    return response.json();
  },

  async fetchMovements(): Promise<InventoryMovement[]> {
    const response = await fetch(`${API_BASE_URL}/inventory/movements`);
    if (!response.ok) throw new Error("Failed to fetch movements");
    return response.json();
  },
};

export const inventoryService = {
  // ... existing methods (fetchItems, createItem, stockIn, stockOut, fetchMovements)

  async updateItem(id: number, payload: CreateInventoryPayload): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/inventory/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to update inventory item");
    return response.json();
  },

  async deleteItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/inventory/items/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete inventory item");
  },
};