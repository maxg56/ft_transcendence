import React from "react";

import Game4PlayersWS from "@/components/wsGame4Players";
const Game4Players: React.FC = () => {
    return (
        <div className=" scale-95">
            <div>
                <div className="w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col">
                    <div className="flex justify-center items-center w-full h-[839px] overflow-hidden">
                        <Game4PlayersWS />
                    </div>
                </div>
            </div>
	    </div>
  )};

export default Game4Players;