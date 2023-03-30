/* eslint-disable @typescript-eslint/no-var-requires */
'use client';

import { useTranslations } from '#/i18n';
import { TranslationsWithStringType } from '#/i18n/translations';
import Image, { StaticImageData } from 'next/image';
import { memo } from 'react';
import styled from 'styled-components';

export const IconPersonStudent = makeIcon(
  require('../../../icons/16/user_student.png'),
  'icons.person.type.student'
);

export const IconPersonTeacher = makeIcon(
  require('../../../icons/16/user_suit.png'),
  'icons.person.type.teacher'
);

export const IconPersonParent = makeIcon(
  require('../../../icons/16/user_orange.png'),
  'icons.person.type.parent'
);

export const IconPersonAdministrator = makeIcon(
  require('../../../icons/16/user_angel.png'),
  'icons.person.type.administrator'
);

export const IconPersonOther = makeIcon(
  require('../../../icons/16/user_alien.png'),
  'icons.person.type.other'
);

export const IconGenderMale = makeIcon(
  require('../../../icons/16/male.png'),
  'icons.person.gender.male'
);

export const IconGenderFemale = makeIcon(
  require('../../../icons/16/female.png'),
  'icons.person.gender.female'
);

export const IconGenderOther = makeIcon(
  require('../../../icons/16/missing_texture.png'),
  'icons.person.gender.other'
);

export const IconPersonMailAction = makeIcon(
  require('../../../icons/16/new_email.png'),
  'icons.person.action.mail'
);

export const IconPersonPermissionsAction = makeIcon(
  require('../../../icons/16/award_star_gold_blue.png'),
  'icons.person.action.permissions'
);

export const IconPersonChangeTeacherIdAction = makeIcon(
  require('../../../icons/16/digital_signature_pen.png'),
  'icons.person.action.changeTeacherId'
);

export const IconPersonDeleteAccountAction = makeIcon(
  require('../../../icons/16/vcard_delete.png'),
  'icons.person.action.delete.account'
);

export const IconPersonDeletePersonOnlyAction = makeIcon(
  require('../../../icons/16/user_delete.png'),
  'icons.person.action.delete.person.only'
);

export const IconPersonDeletePersonWithAction = makeIcon(
  require('../../../icons/16/user_delete.png'),
  'icons.person.action.delete.person.with'
);

function makeIcon(src: StaticImageData, alt: TranslationsWithStringType) {
  return memo(function IconMaker() {
    const { t } = useTranslations();
    const altString = t(alt);

    return <Icon src={src} alt={altString} title={altString} />;
  });
}

export const Icon = styled(Image)`
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
  margin: 2px;
  display: block;
`;
