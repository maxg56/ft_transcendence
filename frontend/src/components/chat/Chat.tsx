import React from "react";

const Chat: React.FC = () => {
  const messages = [
    { from: "user", content: "Salut tout le monde !" },
    { from: "me", content: "Salut ! Comment tu vas ?" },
    { from: "user", content: "Plutôt bien, et toi ?" },
    { from: "me", content: "Nickel, prêt pour jouer ?" },
    { from: "me", content: "Nickel, prêt pour jouer ?" },
    { from: "me", content: "Nickel, prêt pour jouer ?" },
    { from: "me", content: "Nickel, prêt pour jouer ?" },

  ];

  return (
    <div className="w-[400px] h-[500px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-2 rounded-lg max-w-[70%] text-sm ${
                msg.from === "me"
                  ? "bg-blue-100 text-right"
                  : "bg-gray-100 text-left"
              }`}
            >
              {msg.from !== "me" && (
                <div className="text-[9px] text-gray-600 mb-1">Utilisateur</div>
              )}
              <div>{msg.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 border rounded-md p-2 text-sm"
          type="text"
          placeholder="Écrire un message..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default Chat;
