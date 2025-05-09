export interface Username {
	username: string
}

export interface UserInfos {
	id: number,
	username: string,
	avatar: string
}

export interface Elos {
    elo: number;
}

export interface SettingsPageProps {
	onUsernameChange?: (newUsername: string) => void
}

export interface Password {
	password: string
}

export interface FriendWithStatus{
	id: number;
	username: string;
	online: boolean;
	avatar: string;
}

export interface FriendStatusResponse {
	friends: FriendWithStatus[];
}