'use client';

import { T } from '#/i18n';
import {
  PersonType,
  type Person,
  PersonGender,
} from '#/services/interfaces/person';
import { Button, ButtonGroup } from '#/ui/Button';
import { List, ListCell, ListHeader, ListRow } from '#/ui/List';
import { Note } from '#/ui/Note';
import { useCallback, useState } from 'react';

export const PersonDetailsPersonalDataSectionTable = ({
  person,
  buttons,
}: {
  person: Person;
  buttons?: React.ReactNode;
}) => {
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
            <T
              t={`generic.person-types.${
                (
                  {
                    [PersonType.Student]: 'student',
                    [PersonType.Teacher]: 'teacher',
                    [PersonType.Parent]: 'parent',
                    [PersonType.Admin]: 'admin',
                    [PersonType.Other]: 'other',
                  } as const
                )[person.type]
              }.singular`}
            />
          </ListCell>
        </ListRow>
        {person.account ? (
          <ListRow>
            <ListHeader>
              <T t='schulhof.administration.sections.persons.details.personal-data.table.username' />
            </ListHeader>
            <ListCell>{person.account.username}</ListCell>
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
            <T
              t={`generic.genders.${
                (
                  {
                    [PersonGender.Male]: 'male',
                    [PersonGender.Female]: 'female',
                    [PersonGender.Other]: 'other',
                  } as const
                )[person.gender]
              }`}
            />
          </ListCell>
        </ListRow>
        {person.account ? (
          <ListRow>
            <ListHeader>
              <T t='schulhof.administration.sections.persons.details.personal-data.table.email' />
            </ListHeader>
            <ListCell>{person.account.email}</ListCell>
          </ListRow>
        ) : null}
        {person.type === PersonType.Teacher ? (
          <ListRow>
            <ListHeader>
              <T t='schulhof.administration.sections.persons.details.personal-data.table.teacher-code' />
            </ListHeader>
            <ListCell>{person.teacherCode}</ListCell>
          </ListRow>
        ) : null}
        {showMore ? (
          <>
            {person.account ? (
              <>
                <ListRow>
                  <ListHeader>
                    <T t='schulhof.administration.sections.persons.details.personal-data.table.last-login' />
                  </ListHeader>
                  <ListCell>
                    {person.account.lastLogin ? (
                      <T
                        t='generic.dates.full'
                        args={{ date: new Date(person.account.lastLogin) }}
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
                    {person.account.secondLastLogin ? (
                      <T
                        t='generic.dates.full'
                        args={{
                          date: new Date(person.account.secondLastLogin),
                        }}
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
      {person.account ? (
        <ButtonGroup>
          <Button
            onClick={toggleShowMore}
            t={showMore ? 'generic.less' : 'generic.more'}
          />
          {buttons}
        </ButtonGroup>
      ) : (
        <Note t='schulhof.administration.sections.persons.details.personal-data.no-account' />
      )}
    </>
  );
};
