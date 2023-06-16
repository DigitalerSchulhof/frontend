import { AccountServiceClient } from '@dsh/protocols/dsh/services/account/v1/service';
import { ClassServiceClient } from '@dsh/protocols/dsh/services/class/v1/service';
import { CourseServiceClient } from '@dsh/protocols/dsh/services/course/v1/service';
import { IdentityTheftServiceClient } from '@dsh/protocols/dsh/services/identity_theft/v1/service';
import { LevelServiceClient } from '@dsh/protocols/dsh/services/level/v1/service';
import { PersonServiceClient } from '@dsh/protocols/dsh/services/person/v1/service';
import { SchoolyearServiceClient } from '@dsh/protocols/dsh/services/schoolyear/v1/service';
import { SessionServiceClient } from '@dsh/protocols/dsh/services/session/v1/service';
import * as grpc from '@grpc/grpc-js';
import { ContextCreatorContext } from '../setup';

export interface Services {
  account: AccountServiceClient;
  class: ClassServiceClient;
  course: CourseServiceClient;
  identityTheft: IdentityTheftServiceClient;
  level: LevelServiceClient;
  person: PersonServiceClient;
  schoolyear: SchoolyearServiceClient;
  session: SessionServiceClient;
}

export interface BackendServicesContext {
  services: Services;
}

export function createServicesContext(
  context: ContextCreatorContext
): BackendServicesContext {
  const address = '';
  const credentials = grpc.credentials.createInsecure();
  const options: grpc.ChannelOptions = {};

  return {
    services: {
      account: new AccountServiceClient(address, credentials, options),
      class: new ClassServiceClient(address, credentials, options),
      course: new CourseServiceClient(address, credentials, options),
      identityTheft: new IdentityTheftServiceClient(
        address,
        credentials,
        options
      ),
      level: new LevelServiceClient(address, credentials, options),
      person: new PersonServiceClient(address, credentials, options),
      schoolyear: new SchoolyearServiceClient(address, credentials, options),
      session: new SessionServiceClient(address, credentials, options),
    },
  };
}
