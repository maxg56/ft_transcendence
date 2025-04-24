import { useCallback, useState } from "react";
import { toast } from "sonner";
import useNavigation from "@/hooks/useNavigation";

const API_URL = "https://localhost:8443/auth";

function validateSignUp(username: string, email: string, password: string, confirmPassword: string): string | null {
  if (!username || !email || !password || !confirmPassword) return "Tous les champs doivent être remplis";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Adresse email invalide";
  if (username.length < 3 || username.length > 20) return "Le nom d'utilisateur doit contenir entre 3 et 20 caractères";
  if (password.length < 8 || password.length > 20) return "Le mot de passe doit contenir entre 8 et 20 caractères";
  if (password !== confirmPassword) return "Les mots de passe ne correspondent pas";
  return null;
}

export function useAuth({ onSuccess, onError }: { onSuccess?: () => void, onError?: (err: string) => void } = {}) {
  const [error, setError] = useState<string | null>(null);
  const [needs2FA, setNeeds2FA] = useState(false);
  const [preToken, setPreToken] = useState<string | null>(null);
  const { navigate } = useNavigation();

  const signIn = useCallback(async (username: string, password: string) => {
    if (!username || !password) {
      const errorMessage = "Champs manquants";
      setError(errorMessage);
      toast.error(errorMessage);
      onError?.(errorMessage); // Call onError callback
      return;
    }
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${data?.message || "Erreur inconnue"}`);

      if (data.twoFactorRequired) {
        console.log("2FA requis",needs2FA );
        setNeeds2FA(true);
        setPreToken(data.tempToken);
        toast.info("Code 2FA requis");
        return;
      }

      if (!data.token) throw new Error("Token non reçu");

      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60}; Secure; SameSite=Strict`;
      setError(null);
      toast.success("Connexion réussie");
      onSuccess?.();
      navigate("/hub");
    } catch (err) {
      const errorMessage = "Erreur lors de la connexion";
      setError(errorMessage);
      toast.error(errorMessage);
      onError?.(errorMessage); // Call onError callback
      console.error(err);
    }
  }, [onSuccess, navigate, onError]);
  const cancel2FA = () => {
    setNeeds2FA(false);
    setPreToken(null); // ou autre état temporaire utilisé pour stocker le token avant validation
  };
  
  const verify2FA = useCallback(async (code: string) => {
    if (!preToken) {
      const errorMessage = "Aucun token de vérification trouvé";
      toast.error(errorMessage);
      onError?.(errorMessage); // Call onError callback
      return;
    }
    try {
      const res = await fetch(`${API_URL}/2fa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, preToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${data?.message || "Erreur inconnue"}`);

      if (!data.token) throw new Error("Token final non reçu");

      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60}; Secure; SameSite=Strict`;
      setNeeds2FA(false);
      setPreToken(null);
      toast.success("Connexion réussie avec 2FA");
      onSuccess?.();
      navigate("/hub");
    } catch (err) {
      const errorMessage = "Code 2FA invalide";
      toast.error(errorMessage);
      onError?.(errorMessage); // Call onError callback
      console.error("Erreur 2FA:", err);
    }
  }, [onSuccess, preToken, navigate, onError]);

  const signUp = useCallback(async (username: string, email: string, password: string, confirmPassword: string) => {
    // const validationError = validateSignUp(username, email, password, confirmPassword);
    // if (validationError) {
    //   setError(validationError);
    //   toast.error(validationError);
    //   onError?.(validationError); 
    //   return;
    // }
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}: ${await res.text()}`);
      setError(null);
      toast.success("Inscription réussie");
      onSuccess?.();
      navigate("/hub");
    } catch (err) {
      const errorMessage = "Erreur lors de l'inscription";
      setError(errorMessage);
      toast.error(errorMessage);
      onError?.(errorMessage); // Call onError callback
      console.error(err);
    }
  }, [onSuccess, navigate, onError]);

  return {
    signIn,
    signUp,
    verify2FA,
    cancel2FA,
    needs2FA,
    preToken,
    error,
  };
}
