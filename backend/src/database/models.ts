export interface Model {
  [key: string]: {
    type: keyof ModelTypesMap;
    required: boolean;
    searchable: boolean;
    sortable: boolean;
    graphql?: {
      public: boolean;
      field?: string;
    };
  };
}

export const CollectionModel = {
  _key: {
    type: 'ID',
    required: true,
    searchable: true,
    sortable: true,
    graphql: {
      public: true,
      field: 'id',
    },
  },
  _id: {
    type: 'String',
    required: true,
    searchable: false,
    sortable: false,
  },
  _rev: {
    type: 'String',
    required: true,
    searchable: false,
    sortable: false,
  },
} as const satisfies Model;

export type CollectionModel = typeof CollectionModel;

export type ID = string;

export type ModelTypesMap = {
  ID: ID;
  String: string;
};

export type GetModelType<Model> = {
  [K in keyof Model]: Model[K] extends {
    type: infer Type extends keyof ModelTypesMap;
  }
    ? ModelTypesMap[Type]
    : 'Unknown type!';
};
