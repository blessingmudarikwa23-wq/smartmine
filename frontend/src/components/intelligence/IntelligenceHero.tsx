import {
  BrainCircuit,
  ChevronDown,
  CircleCheck,
  Sparkles,
} from "lucide-react";

type IntelligenceHeroProps = {
  intelligenceScore: number;
  activeFocus: string;
  onFocusChange: (focus: string) => void;
};

function IntelligenceHero({
  intelligenceScore,
  activeFocus,
  onFocusChange,
}: IntelligenceHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[26px] bg-[#10251f] text-white shadow-sm">
      <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#d8a83e]/10 blur-3xl" />

      <div className="absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-emerald-400/5 blur-3xl" />

      <div className="relative flex flex-col gap-8 px-6 py-7 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-9">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f] shadow-lg">
              <BrainCircuit size={23} strokeWidth={2.2} />
            </div>

            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d8a83e]">
              <Sparkles size={14} />
              Smart Intelligence
            </span>

            <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold text-emerald-300">
              <CircleCheck size={12} />
              AI ONLINE
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Mine Intelligence Centre
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
            Ask questions, investigate operational problems,
            uncover risks and turn mine data into practical
            management decisions.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <select
                value={activeFocus}
                onChange={(event) =>
                  onFocusChange(event.target.value)
                }
                className="h-11 appearance-none rounded-xl border border-white/10 bg-white/5 pl-4 pr-10 text-sm font-semibold text-white outline-none transition focus:border-[#d8a83e]"
              >
                <option
                  value="Overall Mine"
                  className="text-[#10251f]"
                >
                  Overall Mine
                </option>

                <option
                  value="Production"
                  className="text-[#10251f]"
                >
                  Production
                </option>

                <option
                  value="Equipment"
                  className="text-[#10251f]"
                >
                  Equipment
                </option>

                <option
                  value="Fuel"
                  className="text-[#10251f]"
                >
                  Fuel
                </option>

                <option
                  value="Safety"
                  className="text-[#10251f]"
                >
                  Safety
                </option>

                <option
                  value="Inventory"
                  className="text-[#10251f]"
                >
                  Inventory
                </option>

                <option
                  value="Finance"
                  className="text-[#10251f]"
                >
                  Finance
                </option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:min-w-[230px]">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
            Operational Health
          </p>

          <div className="mt-3 flex items-end justify-between">
            <span className="text-5xl font-bold tracking-tight">
              {intelligenceScore}%
            </span>

            <span className="mb-1 text-xs font-bold text-emerald-300">
              Healthy
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#d8a83e] transition-all duration-700"
              style={{
                width: `${intelligenceScore}%`,
              }}
            />
          </div>

          <p className="mt-3 text-[11px] leading-5 text-white/40">
            Calculated from production, equipment,
            workforce, inventory and safety indicators.
          </p>
        </div>
      </div>
    </section>
  );
}

export default IntelligenceHero;