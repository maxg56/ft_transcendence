// src/components/GameCanvas4Players.tsx
"use client"

// import React from "react"
import { useGameScene4Players }    from "@/hooks/game/Scene/useGameScene4Players"
import { usePlayerControls } from "@/hooks/game/Controls/useInputControls4Players"
import { useBallFromServer4Players  } from '@/hooks/game/Ball/useBallFromServer4Players';
import Cookies from "js-cookie"

type GameCanvas4PlayersPropsWs = {
  setScore: (score: [number, number]) => void
  setWinner: (winner: string | null) => void
  setGameStarted: (started: boolean) => void
}

const GameCanvas4PlayersWS = ({
  setScore,
  setWinner,
  setGameStarted,
}: GameCanvas4PlayersPropsWs) => {
  const {
    mountRef,
    leftPaddle1Ref,
    leftPaddle2Ref,
    rightPaddle1Ref,
    rightPaddle2Ref,
    ballRef,
  } = useGameScene4Players()
  
  usePlayerControls(Cookies.get("gameid") || "")

  useBallFromServer4Players(
    ballRef,
    leftPaddle1Ref,
    leftPaddle2Ref,
    rightPaddle1Ref,
    rightPaddle2Ref,
    setScore,
    setWinner,
    setGameStarted,
  )

  return (
    <div
      ref={mountRef}
      style={{ width: "100vw", height: "100vh" }}
      className="relative"
    />
  )
}




export { GameCanvas4PlayersWS }



