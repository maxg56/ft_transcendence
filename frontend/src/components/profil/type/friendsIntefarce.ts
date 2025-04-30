export interface Pending{
	pending: string
}

export interface Accepting{
	username: string
}

export interface Refusing{
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