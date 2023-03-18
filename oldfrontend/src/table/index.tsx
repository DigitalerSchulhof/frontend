import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { TranslationAST, useT } from '@i18n';
import { Loading } from '@UI/Loading';
import { useQuery } from 'urql';

// export type TableOptions<
//   Edges extends readonly {
//     readonly node: Readonly<Record<string, unknown>>;
//   }[]
// > = Edges extends readonly {
//   readonly node: infer Node;
// }[]
//   ? {
//       columns: {
//         field: keyof Node;
//         title: string | TranslationAST<string> | null;
//         render: (row: Node) => JSX.Element;
//         sortable: boolean;
//         permission?: string;
//       }[];
//     }
//   : never;

type Traverse<T, Path extends readonly string[]> = Path extends [
  infer Head extends keyof T,
  ...infer Tail extends readonly string[]
]
  ? Traverse<T[Head], Tail>
  : T;

type Paths<T extends object> = {
  [K in keyof T & string]: T[K] extends object
    ? readonly [K] | readonly [K, ...Paths<T[K]>]
    : readonly [K];
}[keyof T & string];

// export declare function makeTableOptions<
//   Query extends object,
//   Vars,
//   PathToConnection extends Paths<Query>,
//   Node extends Traverse<Query, PathToConnection>[number]['node']
// >(opt: {
//   document: TypedDocumentNode<Query, Vars>;
//   pathToConnection: PathToConnection;
//   columns: {
//     field: keyof Node;
//     title: string | TranslationAST<string> | null;
//     render: (row: Node) => JSX.Element;
//     sortable: boolean;
//     permission?: string;
//   }[];
// }): Paths<Query>;

export function useMakeTable<
  Query extends object,
  Vars,
  PathToConnection extends Paths<Query>
>(
  queryOptions: {
    document: TypedDocumentNode<Query, Vars>;
    pathToConnection: PathToConnection;
  },
  tableOptions: {
    rowId: (row: Traverse<Query, PathToConnection>[number]['node']) => string;
    columns: {
      field: string;
      title: string | TranslationAST<string> | null;
      render: (row: Traverse<Query, PathToConnection>[number]['node']) => JSX.Element;
      sortable: boolean;
      permission?: string;
    }[];
    actions?: {}[];
  }
) {
  const t = useT();
  const { hasPermission } = usePermissions();

  const [data] = useQuery({
    query: tableOptions.document,
  });

  const visibleColumns = tableOptions.columns.filter((column) =>
    column.permission ? hasPermission(column.permission) : true
  );

  return (
    <TableList>
      <TableListHeader>
        {visibleColumns.map((column) => (
          <TableListHeaderCell key={column.field}>
            {column.title === null
              ? null
              : typeof column.title === 'string'
              ? column.title
              : t(column.title)}
          </TableListHeaderCell>
        ))}
        {tableOptions.actions?.length ? (
          <TableListHeaderCell>
            {t('generic.table.actions.title')}
          </TableListHeaderCell>
        ) : null}
      </TableListHeader>
      <TableListBody>
        {data.fetching ? (
          <TableListRow>
            <TableListCell
              colSpan={
                visibleColumns.length + (tableOptions.actions?.length ? 1 : 0)
              }
            >
              <Flex justifyContent="center">
                <Loading />
              </Flex>
            </TableListCell>
          </TableListRow>
        ) : data.error ? (
          <TableListRow>
            <TableListCell
              colSpan={
                visibleColumns.length + (tableOptions.actions?.length ? 1 : 0)
              }
            >
              <Flex justifyContent="center">Fetch error</Flex>
            </TableListCell>
          </TableListRow>
        ) : data.data ? (
          data.data.map((row: any) => (
            <TableListRow key={tableOptions.rowId(row)}>
              {visibleColumns.map((column) => (
                <TableListCell key={column.field}>
                  {column.render(row)}
                </TableListCell>
              ))}
            </TableListRow>
          ))
        ) : (
          <>Invalid State</>
        )}
      </TableListBody>
    </TableList>
  );
}
