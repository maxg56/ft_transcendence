import React from "react";
import Header from "@/components/HeaderComponent";
import { useMode } from "@/context/ModeContext";
import useNavigation from "@/hooks/useNavigation";
import { useJoinQueue } from "@/hooks/WedSooket/useJoinQueue";
import {SpaceShipInterior} from "@/animation/SpaceShipInterior";
import FriendListHub from "@/components/ListFriends";
import Chat from "@/components/chat/Chat";
const Hub: React.FC = () => {
  const { mode } = useMode();
  const { navigate } = useNavigation();
  const { joinQueue } = useJoinQueue();
  const getStartText = () => {
    if (mode) {
      return (
        <>
          Start !<br />{mode} mode
        </>
      );
    }
    return "Start !";
  };

  
  const handleJoinQueue2v2 = () => {
    joinQueue({ playersPerTeam: 2, teams: 2 }, "/WaitingRoom");
  };

  const handleJoinQueue1v1 = () => {
    joinQueue({ playersPerTeam: 1, teams: 2 }, "/WaitingRoom");
  };

  const handleStart = () => {
    if (mode === "ia") {
      navigate("/solo");
    } else if (mode === "humain") {
      navigate("/duel2");
    } else if (mode === "1 vs 1") {
      handleJoinQueue1v1();
    } else  if  (mode === "2 vs 2") {
      handleJoinQueue2v2();
    } else {
      navigate("/solo");
    }
  };

  return (
    <div className="scale-95">
      <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 ">
          <SpaceShipInterior/>
          <Header />
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="w-full h-full absolute top-[-100%] scanline-glow" />
          </div>
          </div>
          <div className="z-50">
          <div className="absolute top-[28%] left-[2%] justify-center z-100">
                <FriendListHub />
              </div>
              <div className="absolute top-[30%] left-[75%] justify-center z-100  ">
                <Chat />
                </div>
                <div className="w-[22%] place-content-evenly overflow-y-auto">
              <button
                className="title absolute bottom-[10%] left-1/2 -translate-x-1/2 
                       px-20 py-10 rounded-md text-white font-semibold 
                        bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 
                        backdrop-blur-md
                        shadow-[0_0_20px_rgba(0,255,255,0.4)] 
                        hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
                        border border-cyan-300/30 
                        transition duration-300"
                    onClick={handleStart}
                    >
                {getStartText()}
              </button>
            </div>
          </div>
      </div>
  );  
};

export default Hub;
