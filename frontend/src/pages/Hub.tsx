import React from "react";
import Header from "@/components/HeaderComponent";
import { useMode } from "@/context/ModeContext";
import useNavigation from "@/hooks/useNavigation";
import { useJoinQueue } from "@/hooks/WedSooket/useJoinQueue";
import FriendListHub from "@/components/ListFriends";

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
      <div>
        <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col">
          <Header />
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="w-full h-full absolute top-[-100%] scanline-glow" />
          </div>
          <div className="flex flex-row justify-between items-center w-full h-[839px] px-10 overflow-hidden">
              <FriendListHub />
              <div className="flex-1 flex justify-center">
                <button
                  className="neon-button px-20 py-10 bg-blue-300 text-black rounded hover:bg-gray-50"
                  onClick={handleStart}
                >
                  {getStartText()}
                </button>
              </div>
              <FriendListHub />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hub;
