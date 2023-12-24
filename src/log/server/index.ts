export class Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO
  error(...args: any[]): void {
    console.error(...args);
  }
}
