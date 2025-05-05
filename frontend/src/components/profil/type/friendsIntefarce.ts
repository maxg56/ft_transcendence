export interface Invitation {
	username: string;
	avatar: string | null;
}

export interface FriendListProps {
	friends: Invitation[];
	sentInvitations: Invitation[];
}

export interface APIFriendListProps {
	friendList: Invitation[];
	pendingList: Invitation[];
}