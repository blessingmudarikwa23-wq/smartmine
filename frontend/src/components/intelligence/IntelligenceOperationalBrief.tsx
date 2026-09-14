import {
  ArrowUpRight,
  CircleDollarSign,
  Factory,
  ShieldCheck,
  Truck,
} from "lucide-react";

import type {
  MineSnapshot,
} from "../../pages/SmartIntelligence";

type IntelligenceOperationalBriefProps = {
  snapshot: MineSnapshot;
};

function IntelligenceOperationalBrief({
  snapshot,
}: IntelligenceOperationalBriefProps) {
  const productionGap =
    snapshot.production.targetToday -
    snapshot.production.extractedToday;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f] text-[#d8a83e]">
          <ArrowUpRight size={19} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#10251f]">
            AI Operational Brief
          </h2>

          <p className="text-xs text-slate-400">
            Current management picture
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[#10251f] p-5 text-white">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#d8a83e]">
          Executive Summary
        </p>

        <p className="mt-3 text-sm leading-6 text-white/70">
          Production is currently{" "}
          <strong className="text-white">
            {productionGap} tonnes
          </strong>{" "}
          below today's target. Equipment availability
          remains strong while inventory and outstanding
          safety actions require management attention.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <Factory
              size={17}
              className="text-[#d8a83e]"
            />

            <span className="text-xs font-semibold text-slate-500">
              Production
            </span>
          </div>

          <span className="text-sm font-bold text-[#10251f]">
            {snapshot.production.extractedToday} /{" "}
            {snapshot.production.targetToday} t
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <Truck
              size={17}
              className="text-[#d8a83e]"
            />

            <span className="text-xs font-semibold text-slate-500">
              Equipment
            </span>
          </div>

          <span className="text-sm font-bold text-emerald-700">
            {snapshot.equipment.available}/
            {snapshot.equipment.total} available
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck
              size={17}
              className="text-[#d8a83e]"
            />

            <span className="text-xs font-semibold text-slate-500">
              Safety
            </span>
          </div>

          <span className="text-sm font-bold text-[#10251f]">
            {snapshot.safety.compliance}%
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <CircleDollarSign
              size={17}
              className="text-[#d8a83e]"
            />

            <span className="text-xs font-semibold text-slate-500">
              Operating Result
            </span>
          </div>

          <span className="text-sm font-bold text-[#10251f]">
            R{" "}
            {snapshot.finance.operatingResult.toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
}

export default IntelligenceOperationalBrief;