// src/components/GameCanvas4Players.tsx
"use client"

import React from "react"
import * as THREE from "three"
import { useGameScene4Players }    from "@/hooks/game/Scene/useGameScene4Players"
import { useInputControls4Players } from "@/hooks/game/Controls/useInputControls4Players"
import { useBallPhysics4Players }   from "@/hooks/game/Ball/useBallPhysics4Players"

type GameCanvas4PlayersProps = {
  gameStarted: boolean
  isPaused: boolean
  setScore: (score: [number, number]) => void
  setWinner: (winner: string | null) => void
  setGameStarted: (started: boolean) => void
}

const GameCanvas4Players: React.FC<GameCanvas4PlayersProps> = ({
  gameStarted,
  isPaused,
  setScore,
  setWinner,
  setGameStarted,
}) => {
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
    isPaused,
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

export default GameCanvas4Players
