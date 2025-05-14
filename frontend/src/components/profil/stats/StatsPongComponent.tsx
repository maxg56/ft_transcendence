import { GraphEloPong } from "./GraphEloPong";
import { RatioPong } from "./RatioPongComponent";
import { HistoriquePong } from "./HistoriquePong";

const StatsPong: React.FC = () => {

  return (
    <div className="flex flex-row gap-24">
      <div className="flex flex-row gap-10 w-full">
        <div className="flex flex-col gap-5 ">
          <div className="w-full h-[391px]">
            <GraphEloPong />
          </div>
          <div className="w-full h-full">
            <RatioPong />
          </div>
        </div>

        <div className="flex-1">
          <HistoriquePong />
        </div>
      </div>
  </div>
  );
};

export default StatsPong;
