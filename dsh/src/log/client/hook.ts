export function useLog() {
  return {
    error: (...args: any[]) => {
      console.error(...args);
    },
  };
}
