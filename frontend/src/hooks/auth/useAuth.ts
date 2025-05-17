import { useCallback, useState } from "react";
import { toast } from "sonner";
import useNavigation from "@/hooks/useNavigation";
import Cookies from 'js-cookie';
import { useTranslation } from "@/context/TranslationContext";

const API_URL = import.meta.env.VITE_URL_PRODE || "https://localhost:8443";

function validateSignUp(t: (key: string) => string, username: string, password: string, confirmPassword: string): string | null {
  if (!username || !password || !confirmPassword) return t("Tous les champs doivent être remplis");
  if (username.length < 3 || username.length > 20) return t("Le nom d'utilisateur doit contenir entre 3 et 20 caractères");
  if (password.length < 8 || password.length > 20) return t("Le mot de passe doit contenir entre 8 et 20 caractères");
  if (password !== confirmPassword) return t("Les mots de passe ne correspondent pas");
  return null;
}

export function useAuth({ onSuccess, onError }: { onSuccess?: () => void, onError?: (err: string) => void } = {}) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [needs2FA, setNeeds2FA] = useState(false);
  const { navigate } = useNavigation();

  const signIn = useCallback(async (username: string, password: string) => {
    if (!username || !password) {
      const errorMessage = t("Champs manquants");
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${data?.message || t("Erreur inconnue")}`);
      if (data.twoFactorRequired) {
        setNeeds2FA(true);
        document.cookie = `token=${data.tempToken}; path=/; max-age=${60 * 3}; Secure; SameSite=Strict`;
        onSuccess?.();
        return;
      }

      if (!data.token) throw new Error(t("Token non reçu"));

      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60}; Secure; SameSite=Strict`;
      document.cookie = `refreshtoken=${data.refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`;
      setError(null);
      toast.success(t("Connexion réussie"));
      onSuccess?.();
      navigate("/hub");
    } catch (err) {
      const errorMessage = t("Erreur lors de la connexion");
      setError(errorMessage);
      onError?.(errorMessage); // Call onError callback
      console.error(err);
    }
  }, [onSuccess, navigate, onError]);
  
  const cancel2FA = () => {
    setNeeds2FA(false);
  };
  
  const verify2FA = useCallback(async (code: string , nav = true ) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error(t("Token manquant. Veuillez vous reconnecter."));
      }
  
      const res = await fetch(`${API_URL}/auth/verify-2fa`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(`${data?.message || t("Erreur inconnue")}`);
      }
  
      if (!data.data.token) {
        throw new Error(t("Token final non reçu"));
      }
      
      document.cookie = `token=${data.data.token}; path=/; max-age=${60 * 60}; Secure; SameSite=Strict`;
      document.cookie = `refreshtoken=${data.data.refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`;
  
      // Reset 2FA state and notify user
      setNeeds2FA(false);
      toast.success(t("Connexion réussie avec 2FA"));
      onSuccess?.();
      if (nav) {
        navigate("/hub");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("Code 2FA invalide");
      onError?.(errorMessage);
    }
  }, [onSuccess, navigate, onError]);
  

  const signUp = useCallback(async (username: string, password: string, confirmPassword: string) => {
    const validationError = validateSignUp(t, username, password, confirmPassword);
    if (validationError) {
    //   setError(validationError);
    //   onError?.(validationError); 
    //   return;
    }
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${await res.text()}`);
      if (!data.token) throw new Error(t("Token non reçu"));
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60}; Secure; SameSite=Strict`;
      document.cookie = `refreshtoken=${data.refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`;
      setError(null);
      onSuccess?.();
      navigate("/hub");
    } catch (err) {
      const errorMessage = t("Erreur lors de l'inscription");
      setError(errorMessage);
      onError?.(errorMessage);
      console.error(err);
    }
  }, [onSuccess, navigate, onError]);

  return {
    signIn,
    signUp,
    verify2FA,
    cancel2FA,
    needs2FA,
    error,
  };
}
