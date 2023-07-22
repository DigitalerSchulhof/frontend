import * as grpc from '@dsh/protocols/google/protobuf/duration';

export function durationToJs(duration: grpc.Duration): number {
  return duration.seconds * 1000 + Math.floor(duration.nanos / 1e6);
}

export function durationFromJs(
  duration: number | undefined
): grpc.Duration | undefined {
  if (duration === undefined) {
    return undefined;
  }

  return new grpc.Duration({
    seconds: Math.floor(duration / 1000),
    nanos: (duration % 1000) * 1e6,
  });
}
