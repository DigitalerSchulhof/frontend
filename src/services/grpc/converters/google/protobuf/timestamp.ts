import * as grpc from '@dsh/protocols/google/protobuf/timestamp';

export function timestampToJs(timestamp: grpc.Timestamp): number {
  return Math.floor(timestamp.seconds * 1000 + timestamp.nanos / 1e6);
}

export function timestampFromJs(
  timestamp: number | undefined
): grpc.Timestamp | undefined {
  if (timestamp === undefined) return undefined;

  return new grpc.Timestamp({
    seconds: Math.floor(timestamp / 1000),
    nanos: (timestamp % 1000) * 1e6,
  });
}
