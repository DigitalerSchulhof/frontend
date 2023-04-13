'use client';

import { T } from '#/i18n';
import { Button, ButtonGroup } from '#/ui/Button';
import { Note } from '#/ui/Note';
import { List } from '#/ui/List';
import { useCallback, useState } from 'react';
import { PersonDetailsProps } from '..';
import { PersonType } from '#/backend/repositories/content/person';

export type PersonDetailsPersonalDataSectionTableProps = Pick<
  PersonDetailsProps,
  'person' | 'account'
> & {
  buttons?: React.ReactNode;
};

export const PersonDetailsPersonalDataSectionTable = ({
  person,
  account,
  buttons,
}: PersonDetailsPersonalDataSectionTableProps) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = useCallback(() => {
    setShowMore((s) => !s);
  }, [setShowMore]);

  return (
    <>
      <List>
        <List.Body>
          <List.Row>
            <List.Header>
              <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.type' />
            </List.Header>
            <List.Cell>
              <T t={`generic.person-type.${person.type}`} />
            </List.Cell>
          </List.Row>
          {account ? (
            <List.Row>
              <List.Header>
                <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.username' />
              </List.Header>
              <List.Cell>{account.username}</List.Cell>
            </List.Row>
          ) : null}
          <List.Row>
            <List.Header>
              <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.firstname' />
            </List.Header>
            <List.Cell>{person.firstname}</List.Cell>
          </List.Row>
          <List.Row>
            <List.Header>
              <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.lastname' />
            </List.Header>
            <List.Cell>{person.lastname}</List.Cell>
          </List.Row>
          <List.Row>
            <List.Header>
              <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.gender' />
            </List.Header>
            <List.Cell>
              <T t={`generic.gender.${person.gender}`} />
            </List.Cell>
          </List.Row>
          {account ? (
            <List.Row>
              <List.Header>
                <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.email' />
              </List.Header>
              <List.Cell>{account.email}</List.Cell>
            </List.Row>
          ) : null}
          {person.type === PersonType.Teacher ? (
            <List.Row>
              <List.Header>
                <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.teacher-code' />
              </List.Header>
              <List.Cell>{person.teacherCode}</List.Cell>
            </List.Row>
          ) : null}
          {showMore ? (
            <>
              {account ? (
                <>
                  <List.Row>
                    <List.Header>
                      <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.last-login' />
                    </List.Header>
                    <List.Cell>
                      {account.lastLogin ? (
                        <T
                          t='generic.date.full'
                          args={{ date: new Date(account.lastLogin) }}
                        />
                      ) : (
                        <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.no-login' />
                      )}
                    </List.Cell>
                  </List.Row>
                  <List.Row>
                    <List.Header>
                      <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.second-last-login' />
                    </List.Header>
                    <List.Cell>
                      {account.secondLastLogin ? (
                        <T
                          t='generic.date.full'
                          args={{ date: new Date(account.secondLastLogin) }}
                        />
                      ) : (
                        <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.no-login' />
                      )}
                    </List.Cell>
                  </List.Row>
                </>
              ) : null}
            </>
          ) : null}
        </List.Body>
      </List>
      {!account ? (
        <Note t='schulhof.administration.sections.persons.slices.persons.details.personal-data.no-account' />
      ) : null}
      <ButtonGroup>
        <Button
          onClick={toggleShowMore}
          t={showMore ? 'generic.less' : 'generic.more'}
        />
        {buttons}
      </ButtonGroup>
    </>
  );
};
