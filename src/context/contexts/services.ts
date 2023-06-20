import { AccountServiceGrpcAdapter } from '#/services/grpc/adapters/account';
import { ClassServiceGrpcAdapter } from '#/services/grpc/adapters/class';
import { CourseServiceGrpcAdapter } from '#/services/grpc/adapters/course';
import { IdentityTheftServiceGrpcAdapter } from '#/services/grpc/adapters/identity-theft';
import { LevelServiceGrpcAdapter } from '#/services/grpc/adapters/level';
import { PersonServiceGrpcAdapter } from '#/services/grpc/adapters/person';
import { SchoolyearServiceGrpcAdapter } from '#/services/grpc/adapters/schoolyear';
import { SessionServiceGrpcAdapter } from '#/services/grpc/adapters/session';
import { AccountService } from '#/services/interfaces/account';
import { ClassService } from '#/services/interfaces/class';
import { CourseService } from '#/services/interfaces/course';
import { IdentityTheftService } from '#/services/interfaces/identity-theft';
import { LevelService } from '#/services/interfaces/level';
import { PersonService } from '#/services/interfaces/person';
import { SchoolyearService } from '#/services/interfaces/schoolyear';
import { SessionService } from '#/services/interfaces/session';
import { AccountServiceClient } from '@dsh/protocols/dsh/services/account/v1/service';
import { ClassServiceClient } from '@dsh/protocols/dsh/services/class/v1/service';
import { CourseServiceClient } from '@dsh/protocols/dsh/services/course/v1/service';
import { IdentityTheftServiceClient } from '@dsh/protocols/dsh/services/identity_theft/v1/service';
import { LevelServiceClient } from '@dsh/protocols/dsh/services/level/v1/service';
import { PersonServiceClient } from '@dsh/protocols/dsh/services/person/v1/service';
import { SchoolyearServiceClient } from '@dsh/protocols/dsh/services/schoolyear/v1/service';
import { SessionServiceClient } from '@dsh/protocols/dsh/services/session/v1/service';
import * as grpc from '@grpc/grpc-js';
import { ContextCreatorContext } from '..';

export interface Services {
  account: AccountService;
  class: ClassService;
  course: CourseService;
  identityTheft: IdentityTheftService;
  level: LevelService;
  person: PersonService;
  schoolyear: SchoolyearService;
  session: SessionService;
}

export interface BackendServicesContext {
  services: Services;
}

export function createServicesContext(
  context: ContextCreatorContext
): BackendServicesContext {
  const address = context.config.grpc.address;
  // TODO: Add TLS support
  const credentials = grpc.credentials.createInsecure();
  const options: grpc.ChannelOptions = {};

  return {
    services: {
      account: new AccountServiceGrpcAdapter(
        new AccountServiceClient(address, credentials, options)
      ),
      class: new ClassServiceGrpcAdapter(
        new ClassServiceClient(address, credentials, options)
      ),
      course: new CourseServiceGrpcAdapter(
        new CourseServiceClient(address, credentials, options)
      ),
      identityTheft: new IdentityTheftServiceGrpcAdapter(
        new IdentityTheftServiceClient(address, credentials, options)
      ),
      level: new LevelServiceGrpcAdapter(
        new LevelServiceClient(address, credentials, options)
      ),
      person: new PersonServiceGrpcAdapter(
        new PersonServiceClient(address, credentials, options)
      ),
      schoolyear: new SchoolyearServiceGrpcAdapter(
        new SchoolyearServiceClient(address, credentials, options)
      ),
      session: new SessionServiceGrpcAdapter(
        new SessionServiceClient(address, credentials, options)
      ),
    },
  };
}
