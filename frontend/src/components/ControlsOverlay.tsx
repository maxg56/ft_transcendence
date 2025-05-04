
interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ControlsModal({ isOpen, onClose }: ControlsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Touches de Contrôle</h2>
        <ul className="space-y-2 text-sm">
          <li><strong>Joueur 1</strong> : W / S</li>
          <li><strong>Joueur 2</strong> : ↑ / ↓</li>
          <li><strong>Joueur 3</strong> : 5 / 6</li>
          <li><strong>Joueur 4</strong> : k / l</li>
        </ul>
        <button
          className="mt-6 block mx-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
