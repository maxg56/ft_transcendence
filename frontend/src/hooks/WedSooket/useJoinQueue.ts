import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import  { useSendWSMessage }  from "./useSendWSMessage";

type Format = {
  playersPerTeam: number;
  teams: number;
};

export const useJoinQueue = () => {
  const navigate = useNavigate();
  const send = useSendWSMessage();

  const joinQueue = useCallback((format: Format, redirectTo?: string) => {
    send({
      event: "join_queue",
      format,
    });

    if (redirectTo) {
      navigate(redirectTo);
    }
  }, [navigate, send]);
  return { joinQueue };
};

export const create_private_game = () => {
  const navigate = useNavigate();
  const send = useSendWSMessage();

  const createPrivateGame = useCallback(( redirectTo?: string ,nb: Number = 2 ,isTournament = false) => {
    send({
      event: "create_private_game",
      nb_players :nb,
      isTournament,
    });

    if (redirectTo) {
      navigate(redirectTo);
    }
  }, [navigate, send]);
  return { createPrivateGame };
}

export const join_private_game = () => {
  const navigate = useNavigate();
  const send = useSendWSMessage();

  const joinPrivateGame = useCallback((code: string, redirectTo?: string) => {
    send({
      event: "join_private_game",
      gameCode: code,
    });

    if (redirectTo) {
      navigate(redirectTo);
    }
  }, [navigate, send]);
  return { joinPrivateGame };
}
