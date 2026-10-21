import React from "react";

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  icon?: React.ReactNode;
  accentClass?: string;
}

export const StatCard = (props: StatCardProps) => {
  const { label, value, unit, icon, accentClass } = props;

  return (
    <div
      className={`relative w-40 h-40 rounded-full border bg-gray-900 p-2 shadow flex flex-col items-center justify-center ${accentClass ?? "border-gray-800"}`}
    >
      {icon && <div className="mb-1">{icon}</div>}
      <div className="text-2xl font-bold text-white">
        {value}
        {unit ? ` ${unit}` : ""}
      </div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
};
