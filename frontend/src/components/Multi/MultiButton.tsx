import { useState } from "react";
import MultiPopup from "./MultiPopup";
import { useTranslation } from "../../context/TranslationContext";
import { useMode , Mode } from "@/context/ModeContext";

export default function VsButton() {
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation();
  const { setMode } = useMode();

  const handleSelect = (choice : Mode) => {
    setMode(choice);
    setShowPopup(false);
  };

  return (
    <>
      <button
        className="button-header px-7 py-1 text-black rounded hover:bg-gray-300 transition"
        onClick={() => setShowPopup(true)}
      >
        {t("Multi")}
      </button>
      {showPopup && (
        <MultiPopup
          onSelect={handleSelect}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
