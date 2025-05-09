// src/components/GameCanvas4Players.tsx
"use client"

import React from "react"
import { useGameScene4Players }    from "@/hooks/game/Scene/useGameScene4Players"
import { useInputControls4Players, usePlayerControls } from "@/hooks/game/Controls/useInputControls4Players"
import { useBallPhysics4Players }   from "@/hooks/game/Ball/useBallPhysics4Players"
import { useBallFromServer4Players  } from '@/hooks/game/Ball/useBallFromServer4Players';
import Cookies from "js-cookie"

type GameCanvas4PlayersProps = {
  gameStarted: boolean
  setScore: (score: [number, number]) => void
  setWinner: (winner: string | null) => void
  setGameStarted: (started: boolean) => void
}

  const GameCanvas4Players = ({
  gameStarted,
  setScore,
  setWinner,
  setGameStarted,
}: React.FC<GameCanvas4PlayersProps>) => {
  const {
    mountRef,
    leftPaddle1Ref,
    leftPaddle2Ref,
    rightPaddle1Ref,
    rightPaddle2Ref,
    ballRef,
  } = useGameScene4Players()

  useInputControls4Players(
    leftPaddle1Ref,
    leftPaddle2Ref,
    rightPaddle1Ref,
    rightPaddle2Ref,
  )
    useBallPhysics4Players(
      ballRef,
      leftPaddle1Ref,
      leftPaddle2Ref,
      rightPaddle1Ref,
      rightPaddle2Ref,
      setScore,
      setWinner,
      setGameStarted,
      gameStarted
    )
 

  return (
    <div
      ref={mountRef}
      style={{ width: "100vw", height: "100vh" }}
      className="relative"
    />
  )
}



const GameCanvas4PlayersWS = ({
  setScore,
  setWinner,
  setGameStarted,
}: React.FC<GameCanvas4PlayersProps>) => {
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




export { GameCanvas4PlayersWS , GameCanvas4Players }



