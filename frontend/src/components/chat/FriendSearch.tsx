import React, { useState, useEffect } from 'react';
import { useChatWebSocket } from '@/context/ChatWebSocketContext';

interface User { id: number; username: string; }

const FriendSearch: React.FC = () => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const { initiatePrivate } = useChatWebSocket();

  useEffect(() => {
    if (!q) { setResults([]); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/friends/search?q=${encodeURIComponent(q)}`);
      const data: User[] = await res.json();
      setResults(data);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const handleSelect = (u: User) => {
    initiatePrivate(u);
    setResults([]);
    setQ('');
  };

  return (
    <div className="p-2">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Rechercher un ami…"
        className="w-full px-2 py-1 border rounded-md text-sm mb-2"
      />
      {results.length > 0 && (
        <ul className="border rounded-md max-h-40 overflow-y-auto bg-white">
          {results.map(u => (
            <li
              key={u.id}
              onClick={() => handleSelect(u)}
              className="px-2 py-1 cursor-pointer hover:bg-gray-200"
            >
              {u.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendSearch;
