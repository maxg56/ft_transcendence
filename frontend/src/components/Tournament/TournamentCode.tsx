const TournamentCode = () => {
	const code = 'ABCD';

	return (
		<div className="flex justify-center space-x-4 mt-8">
			{code.split('').map((char, index) => (
				<div
					key={index}
					className="w-12 h-12 border-2 border-gray-400 rounded-md flex items-center justify-center text-xl font-bold bg-white shadow"
				>
					{char}
				</div>
			))}
		</div>
	);
};

export default TournamentCode;