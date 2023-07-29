import type { TypeFilter } from '#/services/interfaces/base';
import { AndFilter, OrFilter } from '#/services/interfaces/base';
import type * as grpc from '@grpc/grpc-js';

export abstract class GrpcService<Client extends grpc.Client> {
  constructor(protected readonly client: Client) {}
}

export function filterToGrpc(
  filter: TypeFilter<object> | undefined
): string | undefined {
  // JSON.stringify(undefined) === undefined
  return JSON.stringify(filterToGrpcWorker(filter));
}

function filterToGrpcWorker(
  filter: TypeFilter<object> | undefined
): object | undefined {
  if (!filter) return undefined;

  if (filter instanceof AndFilter) {
    return {
      and: filter.filters.map(filterToGrpcWorker),
    };
  }

  if (filter instanceof OrFilter) {
    return {
      or: filter.filters.map(filterToGrpcWorker),
    };
  }

  const { property, operator, value } = filter;

  switch (property) {
    case 'id':
      return { property: 'id', operator, value };
    case 'rev':
      return { property: 'rev', operator, value };
    case 'updatedAt':
      return { property: 'updated_at', operator, value };
    case 'createdAt':
      return { property: 'created_at', operator, value };
    case 'personId':
      return { property: 'person_id', operator, value };
    case 'username':
      return { property: 'username', operator, value };
    case 'email':
      return { property: 'email', operator, value };
    case 'password':
      return {
        property: 'password',
        operator,
        value: (value as Buffer).toString('base64'),
      };
    case 'salt':
      return {
        property: 'salt',
        operator,
        value: (value as Buffer).toString('base64'),
      };
    case 'passwordExpiresAt':
      return {
        property: 'password_expires_at',
        operator,
        value: value,
      };
    case 'lastLogin':
      return {
        property: 'last_login',
        operator,
        value: value,
      };
    case 'secondLastLogin':
      return {
        property: 'second_last_login',
        operator,
        value: value,
      };
    case 'settings.emailOn.newMessage':
      return { property: 'settings.email_on.new_message', operator, value };
    case 'settings.emailOn.newSubstitution':
      return {
        property: 'settings.email_on.new_substitution',
        operator,
        value,
      };
    case 'settings.emailOn.newNews':
      return { property: 'settings.email_on.new_news', operator, value };
    case 'settings.pushOn.newMessage':
      return { property: 'settings.push_on.new_message', operator, value };
    case 'settings.pushOn.newSubstitution':
      return { property: 'settings.push_on.new_substitution', operator, value };
    case 'settings.pushOn.newNews':
      return { property: 'settings.push_on.new_news', operator, value };
    case 'settings.considerNews.newEvent':
      return { property: 'settings.consider_news.new_event', operator, value };
    case 'settings.considerNews.newBlog':
      return { property: 'settings.consider_news.new_blog', operator, value };
    case 'settings.considerNews.newGallery':
      return {
        property: 'settings.consider_news.new_gallery',
        operator,
        value,
      };
    case 'settings.considerNews.fileChanged':
      return {
        property: 'settings.consider_news.file_changed',
        operator,
        value,
      };
    case 'settings.mailbox.deleteAfter':
      return { property: 'settings.mailbox.delete_after', operator, value };
    case 'settings.mailbox.deleteAfterInBin':
      return {
        property: 'settings.mailbox.delete_after_in_bin',
        operator,
        value,
      };
    case 'settings.profile.sessionTimeout':
      return { property: 'settings.profile.session_timeout', operator, value };
    case 'settings.profile.formOfAddress':
      return {
        property: 'settings.profile.form_of_address',
        operator,
        value,
      };
    default:
      throw new Error('Invariant: Unknown property in filter');
  }
}
