import React from "react";

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  icon?: React.ReactNode;
}

export const StatCard = (props: StatCardProps) => {
  const { label, value, unit, icon } = props;
  const cardColor = value >= 70 ? "border-green-500" : "border-red-500";

  return (
    <div
      className={`p-4 rounded-full w-40 h-40 shadow flex flex-col items-center justify-center border ${cardColor}`}
    >
      {icon && <div className="mb-2">{icon}</div>}
      <div className="text-2xl font-bold text-white mb-2">
        {value}
        {unit ? " " + unit : ""}
      </div>
      <div className="text-base text-gray-500 mb-2">{label}</div>
    </div>
  );
};
