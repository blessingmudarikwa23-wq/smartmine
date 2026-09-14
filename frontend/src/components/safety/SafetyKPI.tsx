import {
  AlertTriangle,
  HeartPulse,
  ShieldAlert,
  Target,
} from "lucide-react";

type SafetyKPIProps = {
  openIncidents: number;
  highRiskIncidents: number;
  nearMisses: number;
  injuredPersons: number;
};

function SafetyKPI({
  openIncidents,
  highRiskIncidents,
  nearMisses,
  injuredPersons,
}: SafetyKPIProps) {
  const cards = [
    {
      title: "Open Incidents",
      value: openIncidents,
      subtitle: "Require follow-up",
      icon: ShieldAlert,
      badge: "Attention",
      badgeStyle: "bg-amber-50 text-amber-700",
    },
    {
      title: "High-Risk Events",
      value: highRiskIncidents,
      subtitle: "High or critical severity",
      icon: AlertTriangle,
      badge: "Priority",
      badgeStyle: "bg-red-50 text-red-700",
    },
    {
      title: "Near Misses",
      value: nearMisses,
      subtitle: "Reported safety observations",
      icon: Target,
      badge: "Learning",
      badgeStyle: "bg-blue-50 text-blue-700",
    },
    {
      title: "Injured Persons",
      value: injuredPersons,
      subtitle: "Recorded in current data",
      icon: HeartPulse,
      badge: injuredPersons === 0 ? "Clear" : "Review",
      badgeStyle:
        injuredPersons === 0
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10251f]/8 text-[#10251f]">
                <Icon size={21} />
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${card.badgeStyle}`}
              >
                {card.badge}
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              {card.title}
            </p>

            <p className="mt-1 text-3xl font-bold tracking-tight text-[#10251f]">
              {card.value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default SafetyKPI;