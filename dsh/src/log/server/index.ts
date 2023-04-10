export class Logger {
  error(message: string, ...args: any[]): void {
    console.error(message, ...args);
  }
}
