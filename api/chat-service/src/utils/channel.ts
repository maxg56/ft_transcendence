export function getPrivateChannel(userA: string, userB: string): string {
  const [x, y] = [userA, userB].sort();
  return `private:${x}:${y}`;
}
