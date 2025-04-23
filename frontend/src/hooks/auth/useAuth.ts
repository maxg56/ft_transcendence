import { useCallback, useState } from "react";
import { toast } from "sonner";

const API_URL = "https://localhost:8443/auth";

function validateSignUp(username: string, email: string, password: string, confirmPassword: string): string | null {
  if (!username || !email || !password || !confirmPassword) return "Tous les champs doivent être remplis";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Adresse email invalide";
  if (username.length < 3 || username.length > 20) return "Le nom d'utilisateur doit contenir entre 3 et 20 caractères";
  if (password.length < 8 || password.length > 20) return "Le mot de passe doit contenir entre 8 et 20 caractères";
  if (password !== confirmPassword) return "Les mots de passe ne correspondent pas";
  return null;
}

export function useAuth({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [error, setError] = useState<string | null>(null);
  const [needs2FA, setNeeds2FA] = useState(true);
  const [preToken, setPreToken] = useState<string | null>(null);

  const signIn = useCallback(async (username: string, password: string) => {
    if (!username || !password) {
      setError("Champs manquants");
      toast.error("Champs manquants");
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

      if (data.requires2FA ) {
        setNeeds2FA(true);
        setPreToken(data.preToken);
        toast.info("Code 2FA requis");
        return;
      }

      if (!data.token) throw new Error("Token non reçu");

      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60}; Secure; SameSite=Strict`;
      setError(null);
      toast.success("Connexion réussie");
      onSuccess?.();
    } catch (err) {
      setError("Erreur lors de la connexion");
      toast.error("Erreur lors de la connexion");
      console.error(err);
    }
  }, [onSuccess]);

  const verify2FA = useCallback(async (code: string) => {
    if (!preToken) {
      toast.error("Aucun token de vérification trouvé");
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
    } catch (err) {
      toast.error("Code 2FA invalide");
      console.error("Erreur 2FA:", err);
    }
  }, [onSuccess, preToken]);

  const signUp = useCallback(async (username: string, email: string, password: string, confirmPassword: string) => {
    // const validationError = validateSignUp(username, email, password, confirmPassword);
    // if (validationError) {
    //   setError(validationError);
    //   toast.error(validationError);
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
    } catch (err) {
      setError("Erreur lors de l'inscription");
      toast.error("Erreur lors de l'inscription");
      console.error(err);
    }
  }, [onSuccess]);

  return {
    signIn,
    signUp,
    verify2FA,
    needs2FA,
    error,
  };
}
