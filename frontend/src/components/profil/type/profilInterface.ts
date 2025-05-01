export interface Username {
	username: string
}

export interface Elos {
    elo: number;
}

export interface SettingsPageProps {
	onUsernameChange?: (newUsername: string) => void
}

