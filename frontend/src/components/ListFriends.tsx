import React, { useState, useEffect } from "react";
import { useApi } from "@/hooks/api/useApi";
import { Username } from "./profil/type/profilInterface";
import { APIFriendListProps } from "./profil/type/friendsIntefarce";

const FriendListHub: React.FC = () => {
  const [friends, setFriends] = useState<Username[]>([]);
  const [sentInvitations, setSentInvitations] = useState<Username[]>([]);
  const [pendingList, setPendingList] = useState<Username[]>([]);

  const { refetch: fetchFriendList } = useApi<APIFriendListProps>(
    "/user/friend/list",
    {
      immediate: false,
      onSuccess: (data) => {
        if (data) {
          setFriends(data.friendList);
          setSentInvitations(data.pendingList);
        } else {
          console.error("Erreur friends list", data);
        }
      },
      onError: (errMsg) => {
        console.error("Erreur friendList : ", errMsg);
      },
    }
  );

  const { refetch: fetchPendingList } = useApi<Username[]>(
    "/user/friend/pendinglist",
    {
      immediate: false,
      onSuccess: (data) => {
        if (data) {
          setPendingList(data);
        } else {
          console.error("Erreur pending list", data);
        }
      },
      onError: (errMsg) => {
        console.error("Erreur pending list : ", errMsg);
      },
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      await fetchPendingList();
      await fetchFriendList();
  
      setTimeout(() => {
        fetchData();
      }, 5000);
    };
  
    fetchData();
  }, []);
  


  return (
	<div className="w-64 h-[500px] p-2 bg-white shadow-lg rounded-lg mt-4">
		<h3 className="font-bold mb-2 text-xs">Liste d’amis</h3>
		<div className="max-h-[400px] overflow-y-auto pr-1">
			<ul className="space-y-2 text-xs">
				{friends.map((friend, index) => (
					<li key={`friend-${index}`} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
						<img
							src={`https://robohash.org/${friend.username}`}
							alt={friend.username}
							className="w-8 h-8 rounded-full"
						/>
						<span className="truncate max-w-[150px]">{friend.username}</span>
					</li>
				))}
				{sentInvitations.map((inv, index) => (
					<li key={`inv-${index}`} className="flex items-center gap-2 bg-gray-200 p-2 rounded opacity-60 italic">
						<img
							src={`https://robohash.org/${inv.username}`}
							alt={inv.username}
							className="w-8 h-8 rounded-full"
						/>
						<span className="truncate max-w-[150px]">{inv.username} (En attente)</span>
					</li>
				))}
			</ul>
		</div>
	</div>
);
};

export default FriendListHub;
