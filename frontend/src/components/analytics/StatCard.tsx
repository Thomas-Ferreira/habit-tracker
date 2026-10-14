import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  icon?: React.ReactNode;
}

export const StatCard = ({ label, value, unit = '', icon }: StatCardProps) => {
  const cardColor = value >= 70 ? "border-green-500" : "border-red-500";

  return (
    <div className={`p-4 rounded-lg shadow flex flex-row items-center justify-center border ${cardColor}`}>
      {icon && <div className="mb-2">{icon}</div>}
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-base text-gray-500">{unit}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
};