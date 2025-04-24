import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils"

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, children, className }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-1 z-10 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-label="Authentication modal"
            onClick={onClose}
        >
            <div
                className={cn("grid bg-white  max-w-3xl mx-4 md:mx-auto p-8 rounded-2xl shadow-xl transform transition-all duration-200 scale-95 animate-fade-in", className)}
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
