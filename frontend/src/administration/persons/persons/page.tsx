import { useT } from '@i18n';
import { Breadcrumbs } from '@UI/Breadcrumbs';
import { Col } from '@UI/Col';
import { Flex } from '@UI/Flex';
import { Heading } from '@UI/Heading';
import {
  TableList, TableListBody,
  TableListCell, TableListHead, TableListHeader, TableListIconHeader, TableListRow
} from '@UI/TableList';
import { breadcrumbs } from '.';

export const Page = () => {
  const t = useT();
  // const { hasPermission } = usePermissions();
  const hasPermission = () => true;

  // const table = useMakeTable({
  //   document: PageDocument,
  //   pathToConnection: ['persons', 'edges'],
  // })({
  //   rowId: (row) => row.id,
  // columns: [
  //   {
  //     field: 'type',
  //     title: null,
  //     render: (row) => {
  //       return <span>{row.type}</span>;
  //     },
  //     sortable: false,
  //     permission: 'schulhof.administration.persons.type.view',
  //   },
  //   {
  //     field: 'lastname',
  //     title: getTranslation(
  //       'schulhof.administration.persons.persons.page.table.columns.lastname'
  //     ),
  //     render: (row) => {
  //       return <span>{row.lastname}</span>;
  //     },
  //     sortable: true,
  //     permission: 'schulhof.administration.persons.lastname.view',
  //   },
  //   {
  //     field: 'firstname',
  //     title: getTranslation(
  //       'schulhof.administration.persons.persons.page.table.columns.firstname'
  //     ),
  //     render: (row) => {
  //       return <span>{row.firstname}</span>;
  //     },
  //     sortable: true,
  //     permission: 'schulhof.administration.persons.firstname.view',
  //   },
  //   {
  //     field: 'gender',
  //     title: null,
  //     render: (row) => {
  //       return <span>{row.gender}</span>;
  //     },
  //     sortable: false,
  //     permission: 'schulhof.administration.persons.gender.view',
  //   },
  // ],
  // });

  return (
    <Flex>
      <Col nr="1">
        <Breadcrumbs path={breadcrumbs} />
        <Heading size="1">
          {t('schulhof.administration.persons.persons.page.title')}
        </Heading>
        <Heading size="4">
          {t('schulhof.administration.persons.persons.page.table.title')}
        </Heading>
        <TableList>
          <TableListHead>
            <TableListRow>
              {hasPermission('schulhof.administration.persons.type.view') ? (
                <TableListIconHeader />
              ) : null}
              {hasPermission(
                'schulhof.administration.persons.lastname.view'
              ) ? (
                <TableListHeader>
                  {t(
                    'schulhof.administration.persons.persons.page.table.columns.lastname'
                  )}
                </TableListHeader>
              ) : null}
              {hasPermission(
                'schulhof.administration.persons.firstname.view'
              ) ? (
                <TableListHeader>
                  {t(
                    'schulhof.administration.persons.persons.page.table.columns.firstname'
                  )}
                </TableListHeader>
              ) : null}
              {hasPermission('schulhof.administration.persons.gender.view') ? (
                <TableListIconHeader />
              ) : null}
            </TableListRow>
          </TableListHead>
          <TableListBody>
            <TableListRow>
              <TableListCell>
                S
              </TableListCell>
              <TableListCell>
                Engberg
              </TableListCell>
              <TableListCell>
                Jesper
              </TableListCell>
              <TableListCell>
                M
              </TableListCell>
            </TableListRow>
            <TableListRow>
              <TableListCell>
                S
              </TableListCell>
              <TableListCell>
                Engberg
              </TableListCell>
              <TableListCell>
                Jesper
              </TableListCell>
              <TableListCell>
                M
              </TableListCell>
            </TableListRow>
            <TableListRow>
              <TableListCell>
                S
              </TableListCell>
              <TableListCell>
                Engberg
              </TableListCell>
              <TableListCell>
                Jesper
              </TableListCell>
              <TableListCell>
                M
              </TableListCell>
            </TableListRow>
            <TableListRow>
              <TableListCell>
                S
              </TableListCell>
              <TableListCell>
                Engberg
              </TableListCell>
              <TableListCell>
                Jesper
              </TableListCell>
              <TableListCell>
                M
              </TableListCell>
            </TableListRow>
            {/* {data.fetching ? (
              <TableListRow>
                <TableListCell>
                  <Flex justifyContent="center">
                    <Loading />
                  </Flex>
                </TableListCell>
              </TableListRow>
            ) : data.error ? (
              <TableListRow>
                <TableListCell
                  colSpan={
                    visibleColumns.length +
                    (tableOptions.actions?.length ? 1 : 0)
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
            )}  */}
          </TableListBody>
        </TableList>
      </Col>
    </Flex>
  );
};
