import { useT } from '@i18n';
import { Breadcrumbs } from '@UI/Breadcrumbs';
import { IconButton } from '@UI/Button';
import { Col } from '@UI/Col';
import { Flex } from '@UI/Flex';
import { Heading } from '@UI/Heading';
import {
  IconGenderFemale,
  IconGenderMale,
  IconGenderOther,
  IconPersonAdministrator,
  IconPersonChangeTeacherIdAction,
  IconPersonDeleteAccountAction,
  IconPersonDeletePersonWithAction,
  IconPersonMailAction,
  IconPersonOther,
  IconPersonParent,
  IconPersonPermissionsAction,
  IconPersonStudent,
  IconPersonTeacher,
} from '@UI/Icon';
import { Loading } from '@UI/Loading';
import { Note } from '@UI/Note';
import {
  TableList,
  TableListBody,
  TableListCell,
  TableListHead,
  TableListHeader,
  TableListIconHeader,
  TableListRow,
} from '@UI/TableList';
import { useQuery } from 'urql';
import { breadcrumbs } from '.';
import { Gender, PageDocument, PersonType } from './page.query';

export const Page = () => {
  const t = useT();
  // const { hasPermission } = usePermissions();
  const hasPermission = (_: string) => true;

  const [{ data, fetching }] = useQuery({
    query: PageDocument,
  });

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
              {canSeeColumn.type ? <TableListIconHeader /> : null}
              {canSeeColumn.lastname ? (
                <TableListHeader>
                  {t(
                    'schulhof.administration.persons.persons.page.table.columns.lastname'
                  )}
                </TableListHeader>
              ) : null}
              {canSeeColumn.firstname ? (
                <TableListHeader>
                  {t(
                    'schulhof.administration.persons.persons.page.table.columns.firstname'
                  )}
                </TableListHeader>
              ) : null}
              {canSeeColumn.gender ? <TableListIconHeader /> : null}
              <TableListIconHeader nr={5} />
            </TableListRow>
          </TableListHead>
          <TableListBody>
            {fetching ? (
              <TableListRow>
                <TableListCell colSpan={5}>
                  <Flex flexDirection="column" alignItems="center">
                    <Loading />
                    <Note>
                      {t(
                        'schulhof.administration.persons.persons.page.table.loading'
                      )}
                    </Note>
                  </Flex>
                </TableListCell>
              </TableListRow>
            ) : data ? (
              data.persons.edges.map(({ node }) => (
                <TableListRow>
                  {canSeeColumn.type ? (
                    <TableListCell>
                      {node.type
                        ? {
                            [PersonType.Student]: <IconPersonStudent />,
                            [PersonType.Teacher]: <IconPersonTeacher />,
                            [PersonType.Parent]: <IconPersonParent />,
                            [PersonType.Administrator]: (
                              <IconPersonAdministrator />
                            ),
                            [PersonType.Other]: <IconPersonOther />,
                          }[node.type]
                        : null}
                    </TableListCell>
                  ) : null}
                  {canSeeColumn.lastname ? (
                    <TableListCell>{node.lastname}</TableListCell>
                  ) : null}
                  {canSeeColumn.firstname ? (
                    <TableListCell>{node.firstname}</TableListCell>
                  ) : null}
                  {canSeeColumn.gender ? (
                    <TableListCell>
                      {node.gender
                        ? {
                            [Gender.Male]: <IconGenderMale />,
                            [Gender.Female]: <IconGenderFemale />,
                            [Gender.Other]: <IconGenderOther />,
                          }[node.gender]
                        : null}
                    </TableListCell>
                  ) : null}
                  <TableListCell>
                    <IconButton icon={<IconPersonMailAction />} />
                    <IconButton icon={<IconPersonPermissionsAction />} />
                    <IconButton icon={<IconPersonChangeTeacherIdAction />} />
                    <IconButton
                      icon={<IconPersonDeleteAccountAction />}
                      variant="error"
                    />
                    <IconButton
                      icon={<IconPersonDeletePersonWithAction />}
                      variant="error"
                    />
                  </TableListCell>
                </TableListRow>
              ))
            ) : (
              <TableListRow>
                <TableListCell colSpan={5}>
                  <Flex justifyContent="center">
                    <Note variant="error">
                      {t(
                        'schulhof.administration.persons.persons.page.table.error'
                      )}
                    </Note>
                  </Flex>
                </TableListCell>
              </TableListRow>
            )}
            <TableListRow>
              <TableListCell colSpan={5}>
                <Flex justifyContent="center">
                  <Note>
                    {t(
                      'schulhof.administration.persons.persons.page.table.empty'
                    )}
                  </Note>
                </Flex>
              </TableListCell>
            </TableListRow>
          </TableListBody>
        </TableList>
      </Col>
    </Flex>
  );
};
