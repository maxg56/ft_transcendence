"use client"
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/context/TranslationContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { AuthModal } from "../AuthModal";
import PasswordStrengthBar from "./PasswordStrengthBar";
import PasswordInput from "./PasswordInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "../ModalCompo";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedPolicy, setPolicy ] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [isTermsModalOpen, setTermsModalOpen] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const { signUp } = useAuth({
    onSuccess: () => {
      handleClose();
    },
    onError: (err) => {
      setError(err);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    },
  });

  const handleSignUp = () => {
    if (!username || !mail || !password || !confirmPassword) {
      setError(t("Tous les champs sont requis."));
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setError(null);
    signUp(username, mail, password, confirmPassword);
  };

  const handleClose = () => {
    setUsername("");
    setMail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setPolicy(false);
    onClose();
  };

  const handleOpenTermsModal = () => {
    setTermsModalOpen(true);
  };

  const handleCloseTermsModal = () => {
    setTermsModalOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      handleClose();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignUp();
    }
  };

  return (
    <>
      <AuthModal isOpen={isOpen} onClose={handleClose}>
        <div
          ref={formRef}
          onKeyDown={handleKeyDown}
          className={`${shake ? "animate-shake" : ""}`}
        >
          <h2 className="px-2 py-2 rounded w-full text-center">
            {t("Inscription")}
          </h2>

          {error && (
            <div className="border border-red-500 bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <input
            className="w-full px-3 py-2 border rounded mb-4"
            type="text"
            placeholder={t("Nom d'utilisateur")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border rounded mb-4"
            type="email"
            placeholder={t("Email")}
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
          <PasswordStrengthBar password={password} />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name={t("Mot de passe")}
          />
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("Confirmer le mot de passe")}
          />

          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="terms" checked={acceptedPolicy} onCheckedChange={(checked) =>setPolicy(!!checked)}/>

            <label htmlFor="terms" className="text-sm font-medium">
              J'ai lu et accepte les{" "}
              <button
                type="button"
                className="underline text-blue-500 hover:text-blue-700"
                onClick={handleOpenTermsModal}
              >
                conditions d'utilisation
              </button>.
            </label>
          </div>

          <button
            className={`px-4 py-2 rounded w-full ${
              username && mail && password && confirmPassword && acceptedPolicy
                ? "bg-blue-300 text-black hover:bg-gray-200"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleSignUp}
            disabled={!username || !mail || !password || !confirmPassword || !acceptedPolicy}
          >
            {t("Inscription")}
          </button>
        </div>
      </AuthModal>

      {isTermsModalOpen && (
        <Modal onClose={handleCloseTermsModal}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-center">
              {t("Conditions d'utilisation")}
            </h2>
            <div className="max-h-[600px] overflow-y-auto">
              <div className="space-y-4 p-2 text-justify">
                <p className="text-xl font-bold">🔒 Politique de Confidentialité – ft_transcendence</p>

                <p className="font-semibold text-xl">1. Qui sommes-nous ?</p>
                <p className="text-sm">
                  Ce projet est réalisé dans le cadre de l’école 42. Il s'agit d'une application web multijoueur.
                  Le traitement des données est fait par le groupe composé d'Emma, Manon, Maxence et Thomas.
                </p>

                <p className="font-semibold text-xl">2. Données collectées</p>
                <p className="text-sm">Nous collectons uniquement les données nécessaires au bon fonctionnement de l'application :</p>
                <ul className="list-disc list-inside text-sm">
                  <li>Identifiants : pseudonyme, adresse email, mot de passe (hashé)</li>
                  <li>Profil : avatar, statut en ligne</li>
                  <li>Activité : historique des parties, scores, statistiques</li>
                  <li>Données techniques : date de dernière connexion</li>
                </ul>

                <p className="font-semibold text-xl">3. Finalité de la collecte</p>
                <p className="text-sm">Les données sont utilisées pour :</p>
                <ul className="list-disc list-inside text-sm">
                  <li>Créer et gérer les comptes utilisateurs</li>
                  <li>Permettre le matchmaking et les interactions en jeu</li>
                  <li>Afficher les classements et statistiques</li>
                  <li>Garantir la sécurité de l’application</li>
                </ul>

                <p className="font-semibold text-xl">4. Sécurité des données</p>
                <p className="text-sm">Vos données sont stockées de manière sécurisée :</p>
                <ul className="list-disc list-inside text-sm">
                  <li>Les mots de passe sont hashés</li>
                  <li>L’application fonctionne en HTTPS</li>
                  <li>L’accès aux données est limité aux développeurs du projet</li>
                </ul>

                <p className="font-semibold text-xl">5. Durée de conservation</p>
                <p className="text-sm">
                  Les données sont conservées tant que le compte est actif. En cas d’inactivité prolongée
                  (plus de 6 mois), le compte et ses données peuvent être supprimés automatiquement.
                </p>

                <p className="font-semibold text-xl">6. Vos droits</p>
                <p className="text-sm">Conformément au RGPD, vous avez le droit de :</p>
                <ul className="list-disc list-inside text-sm">
                  <li>Consulter les données que nous avons sur vous</li>
                  <li>Modifier vos informations personnelles</li>
                  <li>Supprimer votre compte à tout moment</li>
                </ul>

                <p className="font-semibold text-xl">7. Cookies</p>
                <p className="text-sm">
                  L’application n’utilise que des cookies techniques nécessaires à son bon fonctionnement.
                  Aucun cookie de tracking ou publicitaire n’est utilisé.
                </p>

                <p className="font-semibold text-xl">8. Modifications</p>
                <p className="text-sm">
                  Cette politique peut être mise à jour à tout moment. Les utilisateurs seront informés en cas de changements significatifs.
                </p>

                <p className="font-semibold text-xl">9. Contact</p>
                <p className="text-sm">
                  Pour toute question sur cette politique ou l’usage de vos données :<br />
                  📧 [votre@email.com]
                </p>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleCloseTermsModal}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {t("Fermer")}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SignUpModal;
