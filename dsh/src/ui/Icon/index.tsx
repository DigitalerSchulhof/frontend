/* eslint-disable @typescript-eslint/no-var-requires */
'use client';

import { useT } from '#/i18n/client';
import { TranslationsWithStringType } from '#/i18n/translations';
import Image, { StaticImageData } from 'next/image';
import { memo } from 'react';
import styled from 'styled-components';

export const IconPersonStudent = makeIcon(
  require('../../../icons/16/user_student.png'),
  'icons.person.type.student',
  16
);

export const IconPersonTeacher = makeIcon(
  require('../../../icons/16/user_suit.png'),
  'icons.person.type.teacher',
  16
);

export const IconPersonParent = makeIcon(
  require('../../../icons/16/user_orange.png'),
  'icons.person.type.parent',
  16
);

export const IconPersonAdministrator = makeIcon(
  require('../../../icons/16/user_angel.png'),
  'icons.person.type.administrator',
  16
);

export const IconPersonOther = makeIcon(
  require('../../../icons/16/user_alien.png'),
  'icons.person.type.other',
  16
);

export const IconGenderMale = makeIcon(
  require('../../../icons/16/male.png'),
  'icons.person.gender.male',
  16
);

export const IconGenderFemale = makeIcon(
  require('../../../icons/16/female.png'),
  'icons.person.gender.female',
  16
);

export const IconGenderOther = makeIcon(
  require('../../../icons/16/missing_texture.png'),
  'icons.person.gender.other',
  16
);

export const IconPersonMailAction = makeIcon(
  require('../../../icons/16/new_email.png'),
  'icons.person.action.mail',
  16
);

export const IconPersonPermissionsAction = makeIcon(
  require('../../../icons/16/award_star_gold_blue.png'),
  'icons.person.action.permissions',
  16
);

export const IconPersonChangeTeacherIdAction = makeIcon(
  require('../../../icons/16/digital_signature_pen.png'),
  'icons.person.action.changeTeacherId',
  16
);

export const IconPersonDeleteAccountAction = makeIcon(
  require('../../../icons/16/vcard_delete.png'),
  'icons.person.action.delete.account',
  16
);

export const IconPersonDeletePersonOnlyAction = makeIcon(
  require('../../../icons/16/user_delete.png'),
  'icons.person.action.delete.person.only',
  16
);

export const IconPersonDeletePersonWithAction = makeIcon(
  require('../../../icons/16/user_delete.png'),
  'icons.person.action.delete.person.with',
  16
);

export const LargeIconVersion = makeIcon(
  require('../../../icons/32/server_components.png'),
  'icons.version',
  32
);

export const LargeIconCookies = makeIcon(
  require('../../../icons/32/cookies.png'),
  'icons.cookies-tech',
  32
);

export const LargeIconGroupError = makeIcon(
  require('../../../icons/32/group_error.png'),
  'icons.group-error',
  32
);

export const LargeIconTick = makeIcon(
  require('../../../icons/32/tick.png'),
  'icons.group-error',
  32
);

export const LargeIconWarning = makeIcon(
  require('../../../icons/32/error.png'),
  'icons.warning',
  32
);

function makeIcon(
  src: StaticImageData,
  alt: TranslationsWithStringType,
  size: number
) {
  return memo(function IconMaker() {
    const { t } = useT();
    const altString = t(alt);

    return <Icon src={src} alt={altString} title={altString} size={size} />;
  });
}

const noForwardProps = new Set(['size']);

export const Icon = styled(Image).withConfig({
  shouldForwardProp: (prop) => !noForwardProps.has(prop),
})<{ size?: number }>`
  width: ${({ size: $size }) => $size}px;
  height: ${({ size: $size }) => $size}px;
  image-rendering: pixelated;
  margin: 2px;
  display: block;
`;
