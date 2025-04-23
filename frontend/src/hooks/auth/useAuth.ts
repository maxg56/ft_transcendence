import { useCallback } from "react";
import { toast } from "sonner"

const API_URL = "https://localhost:8443/auth";

function validateSignUp(username: string, email: string, password: string, confirmPassword: string): string | null {
    if (!username || !email || !password || !confirmPassword) return "Tous les champs doivent être remplis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Adresse email invalide";
    if (username.length < 3 || username.length > 20) return "Le nom d'utilisateur doit contenir entre 3 et 20 caractères";
    if (password.length < 8) return "Le mot de passe doit contenir entre 8 et 20 caractères";
    if (password !== confirmPassword) return "Les mots de passe ne correspondent pas";
    return null;
}
  
export function useAuth({ onSuccess }: { onSuccess?: () => void } = {}) {
  const signIn = useCallback(async (username: string, password: string) => {
    if (!username || !password) {
      console.error("Champs manquants");
      return;
    }
    toast("Connexion réussie")
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}: ${await res.text()}`);
      const { token } = await res.json();
      if (!token) throw new Error("Token non reçu");

      document.cookie = `token=${token}; path=/; max-age=${60 * 60}; Secure; SameSite=Strict`;
      console.log("Connexion réussie");
      
      onSuccess?.();
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
    }
  }, [onSuccess]);
  let error = null;
  const signUp = useCallback(async (username: string, email: string, password: string, confirmPassword: string) => {
    error = validateSignUp(username, email, password, confirmPassword);
    if (error) {
      console.error(error);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}: ${await res.text()}`);
      toast("Event has been created.")
      console.log("Inscription réussie");
      onSuccess?.();
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
    }
  }, [onSuccess]);

  return { signIn, signUp, error};
}
