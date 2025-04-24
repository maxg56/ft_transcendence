import React from "react";
import { GraphEloPong } from "./GraphEloPong";
import { RatioPong } from "./RatioPongComponent";
import { HistoriquePong } from "./HistoriquePong";

const StatsPong: React.FC = () => {
  return (
    <div className="flex flex-row gap-10">
      <div className="flex justify-between gap-10	">
      <div className="flex flex-col gap-4">

        <div className="w-full w-[550px]">
          <GraphEloPong />
        </div>

        <div className="w-full w-[500px]">
          <RatioPong/>
		  </div>
	    </div>
      <div>
		Historique
        {/* <HistoriquePong/> */}
      </div>
      </div>
    </div>
  );
};

export default StatsPong;
