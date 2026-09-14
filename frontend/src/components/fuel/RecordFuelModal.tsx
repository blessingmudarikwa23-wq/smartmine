import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  CalendarDays,
  ChevronDown,
  Fuel as FuelIcon,
  Gauge,
  MapPin,
  User,
  X,
} from "lucide-react";

import type {
  FuelTank,
  FuelTransactionType,
  FuelType,
} from "../../pages/Fuel";

type FuelFormData = {
  type: FuelTransactionType;
  tankId: number;
  equipment: string;
  operator: string;
  fuelType: FuelType;
  quantity: number;
  meterReading: number;
  date: string;
  time: string;
  unitPrice: number;
  reference: string;
  location: string;
};

type RecordFuelModalProps = {
  isOpen: boolean;
  mode: "consumption" | "delivery";
  tanks: FuelTank[];
  onClose: () => void;
  onSubmit: (data: FuelFormData) => void;
};

const equipmentOptions: string[] = [
  "Loader LHD-01",
  "Loader LHD-02",
  "Excavator EX-01",
  "Excavator EX-02",
  "Primary Crusher",
  "Grinding Mill",
  "Generator GEN-01",
  "Water Pump WP-01",
  "Water Pump WP-02",
  "Service Vehicle",
];

const getToday = (): string => {
  const date = new Date();

  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCurrentTime = (): string =>
  new Date().toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

function RecordFuelModal({
  isOpen,
  mode,
  tanks,
  onClose,
  onSubmit,
}: RecordFuelModalProps) {
  const [tankId, setTankId] = useState<number>(0);
  const [equipment, setEquipment] = useState<string>(equipmentOptions[0]);
  const [operator, setOperator] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [meterReading, setMeterReading] = useState<string>("");
  const [date, setDate] = useState<string>(getToday());
  const [time, setTime] = useState<string>(getCurrentTime());
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [error, setError] = useState<string>("");

  const selectedTank: FuelTank | undefined = tanks.find(
    (tank) => tank.id === tankId,
  );

  useEffect(() => {
    if (!isOpen) return;

    setTankId(0);
    setEquipment(equipmentOptions[0]);
    setOperator("");
    setQuantity("");
    setMeterReading("");
    setDate(getToday());
    setTime(getCurrentTime());
    setUnitPrice("");
    setReference("");
    setLocation("");
    setError("");
  }, [isOpen, mode]);

  useEffect(() => {
    if (!selectedTank) {
      setUnitPrice("");
      setLocation("");
      return;
    }

    setUnitPrice(selectedTank.unitCost.toString());
    setLocation(selectedTank.location);
    setError("");
  }, [selectedTank]);

  if (!isOpen) return null;

  const isDelivery: boolean = mode === "delivery";

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const parsedQuantity: number = Number(quantity);
    const parsedMeter: number = Number(meterReading || 0);
    const parsedPrice: number = Number(unitPrice);

    if (!selectedTank) {
      setError("Please select a fuel tank.");
      return;
    }

    if (!parsedQuantity || parsedQuantity <= 0) {
      setError("Enter a valid fuel quantity.");
      return;
    }

    if (!parsedPrice || parsedPrice <= 0) {
      setError("Enter a valid fuel price per litre.");
      return;
    }

    if (!isDelivery && parsedQuantity > selectedTank.currentLevel) {
      setError(
        `Insufficient fuel in ${selectedTank.name}. Only ${selectedTank.currentLevel.toLocaleString(
          "en-ZA",
        )} L is available.`,
      );
      return;
    }

    if (
      isDelivery &&
      parsedQuantity > selectedTank.capacity - selectedTank.currentLevel
    ) {
      setError(
        `${selectedTank.name} can only receive ${Math.max(
          0,
          selectedTank.capacity - selectedTank.currentLevel,
        ).toLocaleString("en-ZA")} L.`,
      );
      return;
    }

    if (!operator.trim()) {
      setError(
        isDelivery
          ? "Enter the supplier or person responsible for the delivery."
          : "Enter the operator name.",
      );
      return;
    }

    onSubmit({
      type: isDelivery ? "Delivery" : "Consumption",
      tankId: selectedTank.id,
      equipment: isDelivery ? "Fuel Delivery" : equipment,
      operator,
      fuelType: selectedTank.fuelType,
      quantity: parsedQuantity,
      meterReading: parsedMeter,
      date,
      time,
      unitPrice: parsedPrice,
      reference,
      location,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
              <FuelIcon size={20} />
            </div>

            <div>
              <h2 className="font-bold text-[#10251f]">
                {isDelivery
                  ? "Record Fuel Delivery"
                  : "Record Fuel Consumption"}
              </h2>

              <p className="text-xs text-slate-400">
                {isDelivery
                  ? "Add fuel received into mine storage."
                  : "Record fuel issued to mine equipment."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Fuel Tank
              </label>

              <div className="relative">
                <select
                  value={tankId}
                  onChange={(event) =>
                    setTankId(Number(event.target.value))
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white"
                >
                  <option value={0} disabled>
                    Select a fuel tank
                  </option>

                  {tanks.map((tank) => (
                    <option key={tank.id} value={tank.id}>
                      {tank.name} — {tank.fuelType} —{" "}
                      {tank.currentLevel.toLocaleString("en-ZA")} L available
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {!isDelivery && (
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Equipment
                </label>

                <div className="relative">
                  <select
                    value={equipment}
                    onChange={(event) =>
                      setEquipment(event.target.value)
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white"
                  >
                    {equipmentOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                {isDelivery ? "Supplier / Responsible Person" : "Operator"}
              </label>

              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={operator}
                  onChange={(event) =>
                    setOperator(event.target.value)
                  }
                  placeholder={
                    isDelivery
                      ? "Supplier name"
                      : "Operator name"
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Quantity (Litres)
              </label>

              <div className="relative">
                <FuelIcon
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(event.target.value)
                  }
                  placeholder="0.00"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Price / Litre
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={(event) =>
                  setUnitPrice(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
              />
            </div>

            {!isDelivery && (
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Equipment Meter Reading
                </label>

                <div className="relative">
                  <Gauge
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={meterReading}
                    onChange={(event) =>
                      setMeterReading(event.target.value)
                    }
                    placeholder="Current meter reading"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Time
              </label>

              <input
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Reference
              </label>

              <input
                value={reference}
                onChange={(event) =>
                  setReference(event.target.value)
                }
                placeholder="Optional reference"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
              />
            </div>
          </div>

          {selectedTank && quantity && (
            <div className="mt-5 rounded-xl border border-[#d8a83e]/20 bg-[#d8a83e]/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Estimated Transaction Value
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#10251f]">
                    R
                    {(
                      Number(quantity) * Number(unitPrice || 0)
                    ).toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    {isDelivery
                      ? "Tank after delivery"
                      : "Tank after issue"}
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#10251f]">
                    {Math.max(
                      0,
                      isDelivery
                        ? selectedTank.currentLevel +
                            Number(quantity)
                        : selectedTank.currentLevel -
                            Number(quantity),
                    ).toLocaleString("en-ZA")}{" "}
                    L
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#10251f] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#18382f]"
            >
              {isDelivery
                ? "Save Delivery"
                : "Record Consumption"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecordFuelModal;