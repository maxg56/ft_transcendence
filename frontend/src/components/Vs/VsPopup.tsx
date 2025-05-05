import { Mode } from "@/context/ModeContext";

type Props = {
  onSelect: (value: Mode) => void;
  onClose: () => void;
};

export default function VsPopup({ onSelect, onClose } : Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-8 flex flex-col gap-4 min-w-[400px]"
          onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the popup
      >
        <button
          className="bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
          onClick={() => { onSelect("ia"); onClose(); }}
        >
          IA
        </button>
        <button
          className="bg-green-600 text-white rounded py-2 hover:bg-green-700 transition"
          onClick={() => { onSelect("humain"); onClose(); }}
        >
          HUMAIN
        </button>
      </div>
    </div>
  );
}
