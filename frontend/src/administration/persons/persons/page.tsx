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
import { breadcrumbs } from '.';

export const Page = () => {
  const t = useT();
  // const { hasPermission } = usePermissions();
  const hasPermission = () => true;

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
              {hasPermission('schulhof.administration.persons.type.read') ? (
                <TableListIconHeader />
              ) : null}
              {hasPermission(
                'schulhof.administration.persons.lastname.read'
              ) ? (
                <TableListHeader>
                  {t(
                    'schulhof.administration.persons.persons.page.table.columns.lastname'
                  )}
                </TableListHeader>
              ) : null}
              {hasPermission(
                'schulhof.administration.persons.firstname.read'
              ) ? (
                <TableListHeader>
                  {t(
                    'schulhof.administration.persons.persons.page.table.columns.firstname'
                  )}
                </TableListHeader>
              ) : null}
              {hasPermission('schulhof.administration.persons.gender.read') ? (
                <TableListIconHeader />
              ) : null}
              <TableListIconHeader nr={5} />
            </TableListRow>
          </TableListHead>
          <TableListBody>
            <TableListRow>
              <TableListCell>
                <IconPersonStudent />
              </TableListCell>
              <TableListCell>Engberg</TableListCell>
              <TableListCell>Jesper</TableListCell>
              <TableListCell>
                <IconGenderMale />
              </TableListCell>
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
            <TableListRow>
              <TableListCell>
                <IconPersonTeacher />
              </TableListCell>
              <TableListCell>Engberg</TableListCell>
              <TableListCell>Jesper</TableListCell>
              <TableListCell>
                <IconGenderFemale />
              </TableListCell>
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
            <TableListRow>
              <TableListCell>
                <IconPersonParent />
              </TableListCell>
              <TableListCell>Engberg</TableListCell>
              <TableListCell>Jesper</TableListCell>
              <TableListCell>
                <IconGenderMale />
              </TableListCell>
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
            <TableListRow>
              <TableListCell>
                <IconPersonAdministrator />
              </TableListCell>
              <TableListCell>Engberg</TableListCell>
              <TableListCell>Jesper</TableListCell>
              <TableListCell>
                <IconGenderMale />
              </TableListCell>
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
            <TableListRow>
              <TableListCell>
                <IconPersonOther />
              </TableListCell>
              <TableListCell>Engberg</TableListCell>
              <TableListCell>Jesper</TableListCell>
              <TableListCell>
                <IconGenderMale />
              </TableListCell>
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
