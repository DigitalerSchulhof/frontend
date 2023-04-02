export function isWatchMode(): boolean {
  return process.argv.includes('--watch');
}
