import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string; // Optional className prop
}

export const Modal = ({ children, onClose, className }: ModalProps) => {
  return (
    <div className={className ? cn(className) : cn("fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50")}>
  
      <div className="bg-white p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <X />
        </button>
        {children}
      </div>
    </div>
  );
};


