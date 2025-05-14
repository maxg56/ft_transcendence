import { useLogout } from "@/hooks/useLogOut";
import { useTranslation } from "@/context/TranslationContext";

const LogoutButton: React.FC = () => {
	const { logout } = useLogout();
	const {t} = useTranslation();
	return (
		<button
			onClick={logout}
			className="bg-blue-500 text-white text-xl w-full px-4 py-2 rounded-2xl hover:bg-red-600"
		>
			{t("Log Out")}
		</button>
	);
};

export default LogoutButton;