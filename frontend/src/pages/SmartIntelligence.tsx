import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BrainCircuit,
  CircleDollarSign,
  Factory,
  Fuel,
  ShieldCheck,
  Truck,
  Users,
  Trash2,
} from "lucide-react";

import IntelligenceHero from "../components/intelligence/IntelligenceHero";
import IntelligenceKPI from "../components/intelligence/IntelligenceKPI";
import IntelligenceChat from "../components/intelligence/IntelligenceChat";
import IntelligenceInsights from "../components/intelligence/IntelligenceInsights";
import IntelligenceOperationalBrief from "../components/intelligence/IntelligenceOperationalBrief";
import IntelligenceAlerts from "../components/intelligence/IntelligenceAlerts";
import IntelligenceQuickActions from "../components/intelligence/IntelligenceQuickActions";

import {
  getIntelligenceDashboard,
  askSmartMineAI,
  type IntelligenceDashboard,
} from "../services/intelligenceApi";

export type IntelligenceMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type IntelligenceInsight = {
  id: number;
  title: string;
  description: string;
  category:
    | "Production"
    | "Equipment"
    | "Fuel"
    | "Safety"
    | "Inventory"
    | "Finance";
  severity: "Low" | "Medium" | "High";
  recommendation: string;
};

export type MineSnapshot = {
  production: {
    extractedToday: number;
    processedToday: number;
    targetToday: number;
    efficiency: number;
  };

  equipment: {
    total: number;
    available: number;
    utilisation: number;
    downtimeHours: number;
  };

  workforce: {
    total: number;
    present: number;
    attendance: number;
  };

  inventory: {
    items: number;
    stockHealth: number;
    criticalItems: number;
  };

  fuel: {
    consumedToday: number;
    stockLitres: number;
    estimatedCost: number;
  };

  safety: {
    incidentsThisMonth: number;
    nearMisses: number;
    compliance: number;
    openActions: number;
  };

  finance: {
    revenue: number;
    expenses: number;
    operatingResult: number;
  };
};

const emptySnapshot: MineSnapshot = {
  production: {
    extractedToday: 0,
    processedToday: 0,
    targetToday: 0,
    efficiency: 0,
  },

  equipment: {
    total: 0,
    available: 0,
    utilisation: 0,
    downtimeHours: 0,
  },

  workforce: {
    total: 0,
    present: 0,
    attendance: 0,
  },

  inventory: {
    items: 0,
    stockHealth: 0,
    criticalItems: 0,
  },

  fuel: {
    consumedToday: 0,
    stockLitres: 0,
    estimatedCost: 0,
  },

  safety: {
    incidentsThisMonth: 0,
    nearMisses: 0,
    compliance: 0,
    openActions: 0,
  },

  finance: {
    revenue: 0,
    expenses: 0,
    operatingResult: 0,
  },
};

function SmartIntelligence() {
  const [mineSnapshot, setMineSnapshot] =
    useState<MineSnapshot>(emptySnapshot);

  const [insights, setInsights] =
    useState<IntelligenceInsight[]>([]);

  const [intelligenceScore, setIntelligenceScore] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const [messages, setMessages] =
    useState<IntelligenceMessage[]>([
      {
        id: 1,
        role: "assistant",
        content:
          "Good day. I’m SmartMine Intelligence. I can analyse your live mine operations, production, equipment, fuel, inventory, workforce, safety and finance data. Ask me what is happening, what is going wrong, or what management should do next.",
        timestamp: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        ),
      },
    ]);

  const [isThinking, setIsThinking] =
    useState(false);

  const [activeFocus, setActiveFocus] =
    useState("Overall Mine");

  // =========================================================
  // LOAD LIVE INTELLIGENCE DATA
  // =========================================================

  const loadIntelligence = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const dashboard: IntelligenceDashboard =
        await getIntelligenceDashboard();

      setMineSnapshot(
        dashboard.snapshot as MineSnapshot,
      );

      setInsights(
        dashboard.insights as IntelligenceInsight[],
      );

      setIntelligenceScore(
        dashboard.intelligenceScore,
      );
    } catch (error) {
      console.error(
        "Failed to load SmartMine Intelligence:",
        error,
      );

      setLoadError(
        "Unable to load live mine intelligence data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIntelligence();
  }, []);

  // =========================================================
  // MESSAGE HANDLING
  // =========================================================

  const handleMessageAdded = (
    message: IntelligenceMessage,
  ) => {
    setMessages((current) => [
      ...current,
      message,
    ]);
  };

  // =========================================================
  // CLEAR AI CHAT
  // =========================================================

  const handleClearChat = () => {
    if (isThinking) {
      return;
    }

    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content:
          "Good day. I’m SmartMine Intelligence. I can analyse your live mine operations, production, equipment, fuel, inventory, workforce, safety and finance data. Ask me what is happening, what is going wrong, or what management should do next.",
        timestamp: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        ),
      },
    ]);
  };

  // =========================================================
  // QUICK ACTION HANDLING
  // =========================================================

  const handleQuickAction = async (
    prompt: string,
  ) => {
    if (isThinking) {
      return;
    }

    const timestamp =
      new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      );

    // -------------------------------------------------------
    // ADD USER MESSAGE
    // -------------------------------------------------------

    const userMessage: IntelligenceMessage = {
      id: Date.now(),
      role: "user",
      content: prompt,
      timestamp,
    };

    handleMessageAdded(userMessage);

    // -------------------------------------------------------
    // START AI THINKING
    // -------------------------------------------------------

    setIsThinking(true);

    try {
      // -----------------------------------------------------
      // SEND QUICK ACTION TO LIVE INTELLIGENCE API
      // -----------------------------------------------------

      const response =
        await askSmartMineAI(
          prompt,
          mineSnapshot,
        );

      // -----------------------------------------------------
      // ADD AI RESPONSE
      // -----------------------------------------------------

      const assistantMessage:
        IntelligenceMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.answer,
        timestamp:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          ),
      };

      handleMessageAdded(
        assistantMessage,
      );
    } catch (error) {
      console.error(
        "Quick intelligence action failed:",
        error,
      );

      // -----------------------------------------------------
      // SHOW ERROR INSIDE CHAT
      // -----------------------------------------------------

      const errorMessage:
        IntelligenceMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "SmartMine Intelligence could not analyse the current mine data. Please check that the backend is running and try again.",
        timestamp:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          ),
      };

      handleMessageAdded(
        errorMessage,
      );
    } finally {
      setIsThinking(false);
    }
  };

  // =========================================================
  // LIVE KPI STATUS
  // =========================================================

  const productionWarning =
    mineSnapshot.production.targetToday > 0 &&
    mineSnapshot.production.efficiency < 90;

  const equipmentPositive =
    mineSnapshot.equipment.utilisation >= 70;

  const safetyPositive =
    mineSnapshot.safety.compliance >= 80;

  const productionTrend =
    isLoading ? "Loading" : "Live";

  const equipmentTrend =
    isLoading ? "Loading" : "Live";

  const safetyTrend =
    isLoading ? "Loading" : "Live";

  const scoreTrend =
    isLoading ? "Loading" : "Live";

  // =========================================================
  // SUMMARY CARDS
  // =========================================================

  const summaryItems = useMemo(
    () => [
      {
        label: "Production",
        value: `${mineSnapshot.production.extractedToday} t`,
        icon: Factory,
      },

      {
        label: "Fuel Used Today",
        value: `${mineSnapshot.fuel.consumedToday} L`,
        icon: Fuel,
      },

      {
        label: "Workforce Present",
        value: `${mineSnapshot.workforce.present}/${mineSnapshot.workforce.total}`,
        icon: Users,
      },

      {
        label: "Operating Result",
        value: `R ${mineSnapshot.finance.operatingResult.toLocaleString()}`,
        icon: CircleDollarSign,
      },
    ],
    [mineSnapshot],
  );

  return (
    <div className="min-h-full bg-[#f5f7f7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* ===================================================
            HERO
        =================================================== */}

        <IntelligenceHero
          intelligenceScore={intelligenceScore}
          activeFocus={activeFocus}
          onFocusChange={setActiveFocus}
        />

        {/* ===================================================
            LIVE DATA STATUS
        =================================================== */}

        {loadError && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {loadError}
          </div>
        )}

        {/* ===================================================
            KPI CARDS
        =================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <IntelligenceKPI
            title="Intelligence Score"
            value={`${intelligenceScore}%`}
            subtitle="Live operational health"
            icon={BrainCircuit}
            trend={scoreTrend}
            positive={intelligenceScore >= 75}
          />

          <IntelligenceKPI
            title="Production Health"
            value={`${mineSnapshot.production.efficiency}%`}
            subtitle="Live target achievement"
            icon={Factory}
            trend={productionTrend}
            warning={productionWarning}
          />

          <IntelligenceKPI
            title="Equipment Health"
            value={`${mineSnapshot.equipment.utilisation}%`}
            subtitle="Live utilisation"
            icon={Truck}
            trend={equipmentTrend}
            positive={equipmentPositive}
          />

          <IntelligenceKPI
            title="Safety Health"
            value={`${mineSnapshot.safety.compliance}%`}
            subtitle="Live compliance"
            icon={ShieldCheck}
            trend={safetyTrend}
            positive={safetyPositive}
          />

        </div>

        {/* ===================================================
            AI + OPERATIONAL BRIEF
        =================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.85fr)]">

          <div className="space-y-3">

            {/* =================================================
                AI CHAT HEADER / CONTROLS
            ================================================= */}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

              <div>
                <p className="text-sm font-bold text-[#10251f]">
                  SmartMine AI Assistant
                </p>

                <p className="text-xs text-slate-400">
                  Live operational intelligence
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearChat}
                disabled={
                  isThinking ||
                  messages.length <= 1
                }
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                title="Clear AI chat"
              >
                <Trash2 size={15} />

                <span>
                  Clear Chat
                </span>
              </button>

            </div>

            <IntelligenceChat
              messages={messages}
              snapshot={mineSnapshot}
              isThinking={isThinking}
              setIsThinking={setIsThinking}
              onMessageAdded={handleMessageAdded}
            />

          </div>

          <div className="space-y-6">

            <IntelligenceOperationalBrief
              snapshot={mineSnapshot}
            />

            <IntelligenceAlerts
              insights={insights}
            />

          </div>
        </div>

        {/* ===================================================
            LIVE INSIGHTS
        =================================================== */}

        <IntelligenceInsights
          insights={insights}
          activeFocus={activeFocus}
        />

        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}

        <IntelligenceQuickActions
          onAction={handleQuickAction}
          disabled={isThinking}
        />

        {/* ===================================================
            LIVE SUMMARY CARDS
        =================================================== */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {summaryItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      {item.label}
                    </p>

                    <p className="mt-2 text-xl font-bold text-[#10251f]">
                      {item.value}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#10251f]">
                    <Icon size={19} />
                  </div>

                </div>
              </div>
            );
          })}

        </section>

      </div>
    </div>
  );
}

export default SmartIntelligence;