import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface ModalProps {
	children: React.ReactNode;
	onClose: () => void;
	className?: string;
}

export const Modal = ({ children, onClose, className }: ModalProps) => {
	const modalRoot = typeof window !== "undefined" ? document.getElementById("modal-root") : null;

	if (!modalRoot) return null;

	return createPortal(
		<div className={cn("fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", className)}>
			<div className="bg-white p-6 rounded shadow-lg relative" onClick={(e) => e.stopPropagation()}>
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
				>
					<X />
				</button>
				{children}
			</div>
		</div>,
		modalRoot
	);
};


