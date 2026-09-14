import {
  ArrowRight,
  Factory,
  Hammer,
  Package,
  Truck,
} from "lucide-react";

type ProcessingFlowProps = {
  materialReceived: number;
  crushed: number;
  processed: number;
  output: number;
};

type FlowCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  active?: boolean;
};

function FlowCard({
  title,
  value,
  description,
  icon: Icon,
  active = false,
}: FlowCardProps) {
  return (
    <div
      className={`min-w-0 flex-1 rounded-2xl border p-4 transition ${
        active
          ? "border-[#d8a83e]/40 bg-[#10251f]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            active
              ? "bg-[#d8a83e]/15 text-[#d8a83e]"
              : "bg-slate-100 text-[#10251f]"
          }`}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p
            className={`truncate text-xs font-medium ${
              active ? "text-white/55" : "text-slate-500"
            }`}
          >
            {title}
          </p>

          <p
            className={`mt-0.5 text-xl font-bold ${
              active ? "text-white" : "text-[#10251f]"
            }`}
          >
            {value}
          </p>
        </div>
      </div>

      <p
        className={`mt-3 text-xs ${
          active ? "text-white/45" : "text-slate-400"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

export default function ProcessingFlow({
  materialReceived,
  crushed,
  processed,
  output,
}: ProcessingFlowProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#10251f]">
          Processing Flow
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Track material movement from receipt through final processing.
        </p>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <FlowCard
          title="Material Received"
          value={`${materialReceived} t`}
          description="Feed entering the processing area"
          icon={Truck}
        />

        <div className="hidden shrink-0 text-slate-300 xl:block">
          <ArrowRight size={22} />
        </div>

        <FlowCard
          title="Crusher"
          value={`${crushed} t`}
          description="Material crushed and prepared"
          icon={Hammer}
          active
        />

        <div className="hidden shrink-0 text-slate-300 xl:block">
          <ArrowRight size={22} />
        </div>

        <FlowCard
          title="Grinding Mill"
          value={`${processed} t`}
          description="Material ground and processed"
          icon={Factory}
        />

        <div className="hidden shrink-0 text-slate-300 xl:block">
          <ArrowRight size={22} />
        </div>

        <FlowCard
          title="Final Output"
          value={`${output.toFixed(1)} t`}
          description="Current processing output"
          icon={Package}
        />
      </div>
    </div>
  );
}