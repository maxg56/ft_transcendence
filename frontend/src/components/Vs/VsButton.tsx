import React, { useState } from "react";
import VsPopup from "./VsPopup";
import { useTranslation } from "../../context/TranslationContext";
import { useMode } from "../../context/ModeContext";

export default function VsButton() {
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation();
  const { setMode } = useMode();

  const handleSelect = (choice) => {
    setMode(choice); // Store "ia" or "humain"
    setShowPopup(false);
  };

  return (
    <>
      <button
        className="button-header px-7 py-1 text-black rounded hover:bg-gray-300 transition"
        onClick={() => setShowPopup(true)}
      >
        {t("VS")}
      </button>
      {showPopup && (
        <VsPopup
          onSelect={handleSelect}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
