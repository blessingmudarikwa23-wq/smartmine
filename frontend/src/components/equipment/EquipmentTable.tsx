import {
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Truck,
  Wrench,
  XCircle,
} from "lucide-react";

import type {
  EquipmentRecord,
  EquipmentStatus,
} from "../../pages/Equipment";

type EquipmentTableProps = {
  equipment: EquipmentRecord[];
  onStatusChange: (
    equipmentId: string,
    status: EquipmentStatus
  ) => void;
  onDelete: (record: EquipmentRecord) => void;
};

function StatusBadge({ status }: { status: EquipmentStatus }) {
  const config = {
    Running: {
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700",
    },
    Available: {
      icon: Clock3,
      className: "bg-blue-50 text-blue-700",
    },
    Maintenance: {
      icon: Wrench,
      className: "bg-amber-50 text-amber-700",
    },
    Down: {
      icon: XCircle,
      className: "bg-red-50 text-red-700",
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold ${config.className}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

export default function EquipmentTable({
  equipment,
  onStatusChange,
  onDelete,
}: EquipmentTableProps) {
  if (equipment.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
        <div className="rounded-2xl bg-slate-100 p-4">
          <CircleAlert size={26} className="text-slate-400" />
        </div>

        <h3 className="mt-4 font-bold text-[#10251f]">
          No equipment found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Try changing your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70">
            <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Equipment
            </th>

            <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Type
            </th>

            <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Location
            </th>

            <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Status
            </th>

            <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Operating Hours
            </th>

            <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Utilisation
            </th>

            <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Next Maintenance
            </th>

            <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {equipment.map((item) => {
            const operatingHours = Number(item.operatingHours ?? 0);
            const utilisation = Number(item.utilisation ?? 0);

            const safeOperatingHours = Number.isFinite(
              operatingHours
            )
              ? operatingHours
              : 0;

            const safeUtilisation = Number.isFinite(
              utilisation
            )
              ? Math.min(Math.max(utilisation, 0), 100)
              : 0;

            return (
              <tr
                key={item.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#10251f]/5 p-2.5">
                      <Truck
                        size={18}
                        className="text-[#10251f]"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {item.equipmentId} · {item.manufacturer}{" "}
                        {item.model}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {item.type}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {item.location}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={item.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Clock3
                      size={15}
                      className="text-slate-400"
                    />

                    <span className="text-sm font-semibold text-slate-700">
                      {safeOperatingHours.toLocaleString()} h
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="w-28">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        {safeUtilisation}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#d8a83e]"
                        style={{
                          width: `${safeUtilisation}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {item.nextMaintenance || "Not scheduled"}
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="relative inline-flex">
                      <select
                        value={item.status}
                        onChange={(event) =>
                          onStatusChange(
                            item.equipmentId,
                            event.target.value as EquipmentStatus
                          )
                        }
                        className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-600 outline-none transition hover:border-[#d8a83e] focus:border-[#d8a83e]"
                        aria-label={`Change status for ${item.name}`}
                      >
                        <option value="Running">
                          Running
                        </option>

                        <option value="Available">
                          Available
                        </option>

                        <option value="Maintenance">
                          Maintenance
                        </option>

                        <option value="Down">
                          Down
                        </option>
                      </select>

                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="inline-flex items-center justify-center rounded-lg border border-red-100 bg-red-50 p-2 text-red-600 transition hover:border-red-200 hover:bg-red-100"
                      aria-label={`Delete ${item.name}`}
                      title="Delete equipment"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}