import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSendWSMessage } from "@/hooks/WedSooket/useSendWSMessage";
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
  }, [navigate]);

  return { joinQueue };
};
