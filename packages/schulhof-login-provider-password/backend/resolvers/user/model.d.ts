import type { User as SchulhofUser } from '@dsh/schulhof/backend/resolvers/user/models';
import type { BaseModel } from '@dsh/core/backend/resolvers/models';

export type User = BaseModel &
  SchulhofUser & {
    password: string;
    salt: string;
  };
