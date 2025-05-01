export interface Username{
	username: string
}

export interface Invitation {
	username: string;
	avatar: string | null;
}

export interface FriendListProps {
	friends: Invitation[];
	sentInvitations: Invitation[];
}