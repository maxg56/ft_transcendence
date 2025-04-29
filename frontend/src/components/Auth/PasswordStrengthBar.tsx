
function calculateStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength; // max = 5
}

function getColor(strength: number): string {
  const colors = ["#f87171", "#fbbf24", "#facc15", "#4ade80", "#22c55e"];
  return colors[strength - 1] || "#f87171";
}

export default function PasswordStrengthBar({ password }: { password: string }) {
  const strength = calculateStrength(password);
  const width = (strength / 5) * 100;

  return (
    <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mt-1 mb-2">
      <div
        className="h-full transition-all duration-300"
        style={{
          width: `${width}%`,
          backgroundColor: getColor(strength),
        }}
      />
    </div>
  );
}
