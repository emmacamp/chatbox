import React from "react";
import { format, isToday, isYesterday, isThisYear } from "date-fns";
import { es } from "date-fns/locale";

interface DaySeparatorProps {
  date: Date;
}

const DaySeparator: React.FC<DaySeparatorProps> = ({ date }) => {
  const renderDateText = () => {
    if (isToday(date)) return "Hoy";
    if (isYesterday(date)) return "Ayer";

    // Si es de este año, formato sin año
    if (isThisYear(date)) {
      return format(date, "EEEE, d MMMM", { locale: es });
    }

    // Si es de otro año, incluye el año
    return format(date, "EEEE, d MMMM yyyy", { locale: es });
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="h-px bg-gray-300 flex-grow"></div>
      <span className="mx-4 text-sm text-gray-500 font-medium">
        {renderDateText()}
      </span>
      <div className="h-px bg-gray-300 flex-grow"></div>
    </div>
  );
};

export default DaySeparator;
