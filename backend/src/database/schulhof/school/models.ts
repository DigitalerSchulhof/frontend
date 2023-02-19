import { CollectionModel, GetModelType, Model } from '../../models';

/**
 * @collection schools
 */
export const SchoolModel = {
  ...CollectionModel,
  name: {
    type: 'String',
    required: true,
    searchable: true,
    sortable: true,
    graphql: {
      public: true,
    },
  },
} as const satisfies Model;

export type SchoolModel = typeof SchoolModel;
export type School = GetModelType<typeof SchoolModel>;
