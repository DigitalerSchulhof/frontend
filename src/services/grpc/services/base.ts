import type * as grpc from '@grpc/grpc-js';

export abstract class GrpcService<Client extends grpc.Client> {
  constructor(protected readonly client: Client) {}
}
