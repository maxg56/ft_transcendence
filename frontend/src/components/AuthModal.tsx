import { useEffect } from "react";
import { X } from "lucide-react";

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden"; // empêche le scroll
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = ""; // restaure le scroll
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="relative bg-white w-full max-w-3xl mx-4 md:mx-auto p-8 rounded-2xl shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 focus:outline-none"
                    aria-label="Close modal"
                >
                    <X size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};

AuthModal.displayName = "AuthModal";
