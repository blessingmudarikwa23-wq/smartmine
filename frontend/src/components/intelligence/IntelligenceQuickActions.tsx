import React from "react";

interface QuickAction {
  label: string;
  prompt: string;
  icon: string;
}

interface IntelligenceQuickActionsProps {
  onAction: (prompt: string) => void;
  disabled?: boolean;
}

const actions: QuickAction[] = [
  {
    label: "Analyse Production",
    prompt:
      "Analyse today's production performance. Compare actual extraction and processing against the target, identify the main performance gaps, and explain what management should do.",
    icon: "📊",
  },
  {
    label: "Check Equipment",
    prompt:
      "Analyse the current equipment situation. Identify equipment availability, utilisation, downtime or maintenance concerns, and explain how these issues may affect production.",
    icon: "⚙️",
  },
  {
    label: "Analyse Fuel",
    prompt:
      "Analyse today's fuel consumption and current fuel stock. Identify any fuel efficiency or supply risks and explain what management should monitor.",
    icon: "⛽",
  },
  {
    label: "Safety Review",
    prompt:
      "Perform a safety review using the current mine data. Identify incidents, near misses, open safety actions, compliance concerns, and the most important safety priorities.",
    icon: "🛡️",
  },
  {
    label: "Financial Health",
    prompt:
      "Analyse the current financial position. Review revenue, expenses and operating result, identify financial risks, and explain what management should focus on.",
    icon: "💰",
  },
  {
    label: "Daily Brief",
    prompt:
      "Prepare a management daily brief for the mine. Review production, equipment, workforce, inventory, fuel, safety and finance. Identify the most important operational risks and give clear recommended actions.",
    icon: "📋",
  },
];

const IntelligenceQuickActions: React.FC<
  IntelligenceQuickActionsProps
> = ({ onAction, disabled = false }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={disabled}
          onClick={() => onAction(action.prompt)}
          className={`flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-left transition-all ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "hover:border-cyan-500/50 hover:bg-slate-800"
          }`}
        >
          <span className="text-xl">{action.icon}</span>

          <span className="text-sm font-medium text-white">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default IntelligenceQuickActions;