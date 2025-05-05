import React from "react";
import Header from "@/components/HeaderComponent";
import { useMode } from "@/context/ModeContext";
import useNavigation from "@/hooks/useNavigation";
import { useJoinQueue } from "@/hooks/WedSooket/useJoinQueue";
import FriendListHub from "@/components/ListFriends";
import Chat from "@/components/chat/Chat";
import PrivateMessage from "@/components/chat/PrivateMessage";

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
    <div className="scale-95 w-screen h-screen">
      <div className="crt w-full h-full rounded-[150px] overflow-hidden bg-gray-900 flex flex-col">
        <Header />
        <div className="absolute top-6 right-12 z-30">
          <PrivateMessage />
        </div>
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="w-full h-full absolute top-[-100%] scanline-glow" />
        </div>
        <div className="flex flex-1 justify-between items-stretch px-10 pb-4">
          <div className="w-[22%] flex items-center justify-center">
            <div className="overflow-y-auto place-content-evenly">
              <FriendListHub />
            </div>
          </div>
          <div className="flex justify-center items-center w-full h-[839px] overflow-hidden">
            <App />
            {/* <StarTunnelBackground /> */}
            <button
              className="neon-button px-20 py-10 bg-blue-300 text-black rounded hover:bg-gray-50"
              onClick={handleStart}
            >
              {getStartText()}
            </button>
          </div>

          <div className="w-[22%] place-content-evenly overflow-y-auto">
            <Chat />
          </div>
        </div>

      </div>
    </div>
  );  
};

export default Hub;
