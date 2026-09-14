const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:8001"
).replace(/\/$/, "");

const SETTINGS_URL = `${API_BASE_URL}/api/v1/settings`;


/* ==========================================================================
   FRONTEND TYPES
   ========================================================================== */

export interface NotificationSettings {
  production: boolean;
  equipment: boolean;
  safety: boolean;
  inventory: boolean;
  finance: boolean;
}

export interface Settings {
  mineName: string;
  location: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  temperatureUnit: string;
  productionUnit: string;
  language: string;
  compactMode: boolean;
  emailAlerts: boolean;
  twoFactor: boolean;
}

export interface SettingsData {
  settings: Settings;
  notifications: NotificationSettings;
}


/* ==========================================================================
   BACKEND TYPES
   ========================================================================== */

interface BackendSettings {
  id: number;
  mineName: string;
  location: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  temperatureUnit: string;
  productionUnit: string;
  language: string;
  compactMode: boolean;
  notifications: NotificationSettings;
  emailAlerts: boolean;
  twoFactor: boolean;
  createdAt: string;
  updatedAt: string;
}


/* ==========================================================================
   SETTINGS UPDATE PAYLOAD
   ========================================================================== */

interface SettingsUpdatePayload {
  mineName: string;
  location: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  temperatureUnit: string;
  productionUnit: string;
  language: string;
  compactMode: boolean;
  notifications: NotificationSettings;
  emailAlerts: boolean;
  twoFactor: boolean;
}


/* ==========================================================================
   API ERROR TYPES
   ========================================================================== */

interface BackendValidationError {
  loc?: Array<string | number>;
  msg?: string;
}

interface BackendErrorResponse {
  detail?: string | BackendValidationError[];
}


/* ==========================================================================
   DEFAULT SETTINGS
   ========================================================================== */

export const defaultSettings: Settings = {
  mineName: "SmartMine Operations",
  location: "South Africa",
  timezone: "Africa/Johannesburg",
  currency: "ZAR",
  dateFormat: "DD/MM/YYYY",
  temperatureUnit: "Celsius",
  productionUnit: "Tonnes",
  language: "English",
  compactMode: false,
  emailAlerts: true,
  twoFactor: false,
};

export const defaultNotifications: NotificationSettings = {
  production: true,
  equipment: true,
  safety: true,
  inventory: true,
  finance: false,
};


/* ==========================================================================
   BACKEND → FRONTEND
   ========================================================================== */

function mapBackendToFrontend(
  data: BackendSettings,
): SettingsData {
  return {
    settings: {
      mineName: data.mineName,
      location: data.location,
      timezone: data.timezone,
      currency: data.currency,
      dateFormat: data.dateFormat,
      temperatureUnit: data.temperatureUnit,
      productionUnit: data.productionUnit,
      language: data.language,
      compactMode: data.compactMode,
      emailAlerts: data.emailAlerts,
      twoFactor: data.twoFactor,
    },

    notifications: {
      production: data.notifications.production,
      equipment: data.notifications.equipment,
      safety: data.notifications.safety,
      inventory: data.notifications.inventory,
      finance: data.notifications.finance,
    },
  };
}


/* ==========================================================================
   FRONTEND → BACKEND
   ========================================================================== */

function mapFrontendToBackend(
  settings: Settings,
  notifications: NotificationSettings,
): SettingsUpdatePayload {
  return {
    mineName: settings.mineName,
    location: settings.location,
    timezone: settings.timezone,
    currency: settings.currency,
    dateFormat: settings.dateFormat,
    temperatureUnit: settings.temperatureUnit,
    productionUnit: settings.productionUnit,
    language: settings.language,
    compactMode: settings.compactMode,

    notifications: {
      production: notifications.production,
      equipment: notifications.equipment,
      safety: notifications.safety,
      inventory: notifications.inventory,
      finance: notifications.finance,
    },

    emailAlerts: settings.emailAlerts,
    twoFactor: settings.twoFactor,
  };
}


/* ==========================================================================
   API RESPONSE HANDLER
   ========================================================================== */

async function handleResponse<T>(
  response: Response,
): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }

  let message =
    `Settings request failed with status ${response.status}.`;

  try {
    const errorData =
      (await response.json()) as BackendErrorResponse;

    if (typeof errorData.detail === "string") {
      message = errorData.detail;
    } else if (Array.isArray(errorData.detail)) {
      message = errorData.detail
        .map((error) => {
          const field =
            error.loc?.join(".") || "field";

          const errorMessage =
            error.msg || "Validation error";

          return `${field}: ${errorMessage}`;
        })
        .join(", ");
    }
  } catch {
    // Keep the default error message.
  }

  throw new Error(message);
}


/* ==========================================================================
   GET SETTINGS
   ========================================================================== */

export async function getSettings(): Promise<SettingsData> {
  const response = await fetch(
    SETTINGS_URL,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const data =
    await handleResponse<BackendSettings>(
      response,
    );

  return mapBackendToFrontend(data);
}


/* ==========================================================================
   UPDATE SETTINGS
   ========================================================================== */

export async function updateSettings(
  settings: Settings,
  notifications: NotificationSettings,
): Promise<SettingsData> {
  const payload =
    mapFrontendToBackend(
      settings,
      notifications,
    );

  const response = await fetch(
    SETTINGS_URL,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data =
    await handleResponse<BackendSettings>(
      response,
    );

  return mapBackendToFrontend(data);
}