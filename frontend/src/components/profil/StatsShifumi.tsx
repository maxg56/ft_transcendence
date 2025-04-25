import React from "react";
import { GraphEloShifumi } from "./GraphEloShifumi";
import { RatioShifumi } from "./RatioShifumi";
import { HistoriqueShifumi } from "./HistoriqueShifumi";

const StatsShifumi: React.FC = () => {
  return (
    <div className="flex flex-row gap-10">
      <div className="flex flex-row gap-10 w-full">
        <div className="flex flex-col gap-4">
          <div className="w-[490px]">
			<GraphEloShifumi/>
          </div>
          <div className="w-[490px]">
			<RatioShifumi/>
          </div>
        </div>

        <div className="flex-1">
          <HistoriqueShifumi/>
        </div>
      </div>
  </div>
  );
};

export default StatsShifumi;