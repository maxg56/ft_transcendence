'use client';
import { useRef, useState } from "react";
import { Eye, EyeOff, ClipboardCopy, Check } from "lucide-react";

type TournamentCodeProps = {
	code: string;
};

const TournamentCode = ({ code }: TournamentCodeProps) => {
	const [revealed, setRevealed] = useState(false);
	const [copied, setCopied] = useState(false);
	const hiddenInputRef = useRef<HTMLInputElement>(null);

	const handleCopy = () => {
		if (hiddenInputRef.current) {
			hiddenInputRef.current.select();
			document.execCommand("copy");
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div className="flex justify-center items-center space-x-4 mt-8">
			{/* Code affiché */}
			<div className="flex space-x-2">
				{code.split("").map((char, index) => (
					<div
						key={index}
						className="w-12 h-12 border-2 border-gray-400 rounded-md flex items-center justify-center text-xl font-bold bg-white shadow"
					>
						{revealed ? char : "•"}
					</div>
				))}
			</div>

			{/* Toggle visibility */}
			<button
				onClick={() => setRevealed(!revealed)}
				className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
			>
				{revealed ? <EyeOff /> : <Eye />}
			</button>

			{/* Copier */}
			<>
				<input
					type="text"
					ref={hiddenInputRef}
					value={code}
					readOnly
					className="absolute opacity-0 left-[-9999px]"
				/>
				<button
					onClick={handleCopy}
					className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
					disabled={!revealed}
				>
					{copied ? <Check className="text-green-500" /> : <ClipboardCopy />}
				</button>
			</>
		</div>
	);
};

export default TournamentCode;
