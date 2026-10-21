import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

interface CompletionRingProps {
  label: string;
  value: number;
  unit?: string;
  icon?: React.ReactNode;
}

export const CompletionRing = (props: CompletionRingProps) => {
  const { label, value, unit, icon } = props;
  const data = [{ name: "Completion", value, fill: "#34D399" }];

  return (
    <div className="w-40 h-40 relative p-2 shadow">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={data}
          innerRadius="75%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            background={{ fill: "#1f2937" }}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {icon && <div className="mb-1">{icon}</div>}
        <div className="text-2xl font-bold text-white">
          {value}
          {unit ? ` ${unit}` : ""}
        </div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
};
