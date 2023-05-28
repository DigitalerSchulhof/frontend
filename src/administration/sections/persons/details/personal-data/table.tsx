'use client';

import { T } from '#/i18n';
import { Button, ButtonGroup } from '#/ui/Button';
import { List, ListCell, ListHeader, ListRow } from '#/ui/List';
import { Note } from '#/ui/Note';
import { useCallback, useState } from 'react';
import { PersonDetailsProps } from '..';

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
        <ListRow>
          <ListHeader>
            <T t='schulhof.administration.sections.persons.details.personal-data.table.type' />
          </ListHeader>
          <ListCell>
            <T t={`generic.person-types.${person.type}.singular`} />
          </ListCell>
        </ListRow>
        {account ? (
          <ListRow>
            <ListHeader>
              <T t='schulhof.administration.sections.persons.details.personal-data.table.username' />
            </ListHeader>
            <ListCell>{account.username}</ListCell>
          </ListRow>
        ) : null}
        <ListRow>
          <ListHeader>
            <T t='schulhof.administration.sections.persons.details.personal-data.table.firstname' />
          </ListHeader>
          <ListCell>{person.firstname}</ListCell>
        </ListRow>
        <ListRow>
          <ListHeader>
            <T t='schulhof.administration.sections.persons.details.personal-data.table.lastname' />
          </ListHeader>
          <ListCell>{person.lastname}</ListCell>
        </ListRow>
        <ListRow>
          <ListHeader>
            <T t='schulhof.administration.sections.persons.details.personal-data.table.gender' />
          </ListHeader>
          <ListCell>
            <T t={`generic.genders.${person.gender}`} />
          </ListCell>
        </ListRow>
        {account ? (
          <ListRow>
            <ListHeader>
              <T t='schulhof.administration.sections.persons.details.personal-data.table.email' />
            </ListHeader>
            <ListCell>{account.email}</ListCell>
          </ListRow>
        ) : null}
        {person.type === 'teacher' ? (
          <ListRow>
            <ListHeader>
              <T t='schulhof.administration.sections.persons.details.personal-data.table.teacher-code' />
            </ListHeader>
            <ListCell>{person.teacherCode}</ListCell>
          </ListRow>
        ) : null}
        {showMore ? (
          <>
            {account ? (
              <>
                <ListRow>
                  <ListHeader>
                    <T t='schulhof.administration.sections.persons.details.personal-data.table.last-login' />
                  </ListHeader>
                  <ListCell>
                    {account.lastLogin ? (
                      <T
                        t='generic.dates.full'
                        args={{ date: new Date(account.lastLogin) }}
                      />
                    ) : (
                      <T t='schulhof.administration.sections.persons.details.personal-data.table.no-login' />
                    )}
                  </ListCell>
                </ListRow>
                <ListRow>
                  <ListHeader>
                    <T t='schulhof.administration.sections.persons.details.personal-data.table.second-last-login' />
                  </ListHeader>
                  <ListCell>
                    {account.secondLastLogin ? (
                      <T
                        t='generic.dates.full'
                        args={{ date: new Date(account.secondLastLogin) }}
                      />
                    ) : (
                      <T t='schulhof.administration.sections.persons.details.personal-data.table.no-login' />
                    )}
                  </ListCell>
                </ListRow>
              </>
            ) : null}
          </>
        ) : null}
      </List>
      {!account ? (
        <Note t='schulhof.administration.sections.persons.details.personal-data.no-account' />
      ) : null}
      {account && (
        <ButtonGroup>
          <Button
            onClick={toggleShowMore}
            t={showMore ? 'generic.less' : 'generic.more'}
          />
          {buttons}
        </ButtonGroup>
      )}
    </>
  );
};
