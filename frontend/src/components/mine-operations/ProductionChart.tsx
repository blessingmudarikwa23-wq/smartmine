import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  TrendingUp,
} from "lucide-react";

type ProductionChartData = {
  day: string;
  extracted: number;
  processed: number;
  output: number;
};

type ProductionChartProps = {
  data: ProductionChartData[];
};

type MetricKey = "extracted" | "processed" | "output";

const metricConfig: Record<
  MetricKey,
  {
    label: string;
    unit: string;
    stroke: string;
    fill: string;
  }
> = {
  extracted: {
    label: "Extracted",
    unit: "t",
    stroke: "#10251f",
    fill: "#10251f",
  },
  processed: {
    label: "Processed",
    unit: "t",
    stroke: "#d8a83e",
    fill: "#d8a83e",
  },
  output: {
    label: "Output",
    unit: "kg",
    stroke: "#059669",
    fill: "#059669",
  },
};

function ProductionChart({
  data,
}: ProductionChartProps) {
  const [activeMetric, setActiveMetric] =
    useState<MetricKey>("extracted");

  const chart = useMemo(() => {
    if (data.length === 0) {
      return {
        points: [],
        maxValue: 100,
        total: 0,
        average: 0,
        peak: 0,
        low: 0,
      };
    }

    const values = data.map(
      (item) => item[activeMetric],
    );

    const highestValue = Math.max(...values, 1);

    const roundedMax =
      Math.ceil(highestValue / 10) * 10;

    const maxValue = Math.max(roundedMax, 10);

    const chartWidth = 800;
    const chartHeight = 260;
    const paddingX = 20;
    const paddingTop = 20;
    const paddingBottom = 35;

    const usableWidth =
      chartWidth - paddingX * 2;

    const usableHeight =
      chartHeight -
      paddingTop -
      paddingBottom;

    const points = data.map((item, index) => {
      const value = item[activeMetric];

      const x =
        data.length === 1
          ? chartWidth / 2
          : paddingX +
            (index / (data.length - 1)) *
              usableWidth;

      const y =
        paddingTop +
        (1 - value / maxValue) *
          usableHeight;

      return {
        x,
        y,
        value,
        day: item.day,
      };
    });

    const total = values.reduce(
      (sum, value) => sum + value,
      0,
    );

    const average =
      values.length > 0
        ? total / values.length
        : 0;

    const peak =
      values.length > 0
        ? Math.max(...values)
        : 0;

    const low =
      values.length > 0
        ? Math.min(...values)
        : 0;

    return {
      points,
      maxValue,
      total,
      average,
      peak,
      low,
    };
  }, [data, activeMetric]);

  const points = chart.points;

  const linePath =
    points.length > 0
      ? points
          .map((point, index) =>
            index === 0
              ? `M ${point.x} ${point.y}`
              : `L ${point.x} ${point.y}`,
          )
          .join(" ")
      : "";

  const areaPath =
    points.length > 0
      ? `${linePath} L ${
          points[points.length - 1].x
        } 225 L ${points[0].x} 225 Z`
      : "";

  const gridLines = 5;

  return (
    <div className="w-full">
      {/* Chart Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f]/[0.07] text-[#10251f]">
            <BarChart3 size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              Production Trend
            </p>

            <p className="text-xs text-slate-400">
              Daily operational performance
            </p>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(metricConfig) as MetricKey[]).map(
            (metric) => {
              const config = metricConfig[metric];
              const isActive =
                activeMetric === metric;

              return (
                <button
                  key={metric}
                  type="button"
                  onClick={() =>
                    setActiveMetric(metric)
                  }
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#10251f] text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        config.stroke,
                    }}
                  />

                  {config.label}
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[320px] w-full overflow-hidden rounded-2xl bg-[#f8faf9]">
        {/* Y-Axis Labels */}
        <div className="absolute bottom-[48px] left-3 top-5 flex flex-col justify-between text-[10px] font-medium text-slate-400">
          {Array.from({
            length: gridLines + 1,
          }).map((_, index) => {
            const value =
              chart.maxValue -
              (index / gridLines) *
                chart.maxValue;

            return (
              <span key={index}>
                {Math.round(value)}
                {metricConfig[activeMetric].unit}
              </span>
            );
          })}
        </div>

        {/* Grid */}
        <div className="absolute bottom-[48px] left-[52px] right-5 top-5 flex flex-col justify-between">
          {Array.from({
            length: gridLines + 1,
          }).map((_, index) => (
            <div
              key={index}
              className="border-t border-dashed border-slate-200"
            />
          ))}
        </div>

        {/* SVG Chart */}
        <svg
          viewBox="0 0 800 260"
          preserveAspectRatio="none"
          className="absolute bottom-[35px] left-[52px] right-5 top-5 h-[260px] w-[calc(100%-72px)]"
          role="img"
          aria-label={`${metricConfig[activeMetric].label} production trend`}
        >
          <defs>
            <linearGradient
              id={`productionArea-${activeMetric}`}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={
                  metricConfig[activeMetric].fill
                }
                stopOpacity="0.18"
              />

              <stop
                offset="100%"
                stopColor={
                  metricConfig[activeMetric].fill
                }
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Area */}
          {areaPath && (
            <path
              d={areaPath}
              fill={`url(#productionArea-${activeMetric})`}
            />
          )}

          {/* Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={
                metricConfig[activeMetric].stroke
              }
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Points */}
          {points.map((point, index) => (
            <g key={`${point.day}-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="7"
                fill="white"
                stroke={
                  metricConfig[activeMetric].stroke
                }
                strokeWidth="3"
              />

              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill={
                  metricConfig[activeMetric].stroke
                }
              />
            </g>
          ))}
        </svg>

        {/* X-Axis Labels */}
        <div className="absolute bottom-3 left-[52px] right-5 flex justify-between">
          {data.map((item) => (
            <span
              key={item.day}
              className="text-[10px] font-medium text-slate-400"
            >
              {item.day}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Activity
              size={15}
              className="text-[#10251f]"
            />

            <p className="text-xs font-medium text-slate-400">
              Total
            </p>
          </div>

          <p className="mt-2 text-lg font-bold text-slate-900">
            {chart.total.toFixed(1)}
            {metricConfig[activeMetric].unit}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp
              size={15}
              className="text-emerald-600"
            />

            <p className="text-xs font-medium text-slate-400">
              Average
            </p>
          </div>

          <p className="mt-2 text-lg font-bold text-slate-900">
            {chart.average.toFixed(1)}
            {metricConfig[activeMetric].unit}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-400">
            Peak
          </p>

          <p className="mt-2 text-lg font-bold text-slate-900">
            {chart.peak.toFixed(1)}
            {metricConfig[activeMetric].unit}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-400">
            Lowest
          </p>

          <p className="mt-2 text-lg font-bold text-slate-900">
            {chart.low.toFixed(1)}
            {metricConfig[activeMetric].unit}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductionChart;