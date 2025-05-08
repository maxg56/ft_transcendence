

function logformat(
  message: string,
  ...args: any[]
): void {
    console.log(`[${new Date().toISOString()}] ${message} ${args.join(' ')}`);
}

function logError(
    message: string,
    ...args: any[]
): void {
    console.error(`[${new Date().toISOString()}] ${message} ${args.join(' ')}`);
}



export { logformat, logError };