import * as grpc from '@dsh/protocols/google/protobuf/timestamp';

export function timestampToJs(timestamp: grpc.Timestamp): Date {
  return new Date(Math.floor(timestamp.seconds * 1000 + timestamp.nanos / 1e6));
}

export function timestampFromJs(
  timestamp: Date | undefined
): grpc.Timestamp | undefined {
  if (timestamp === undefined) return undefined;

  const time = timestamp.getTime();

  return new grpc.Timestamp({
    seconds: Math.floor(time / 1000),
    nanos: (time % 1000) * 1e6,
  });
}
