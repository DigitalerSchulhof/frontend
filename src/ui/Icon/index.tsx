/* eslint-disable @typescript-eslint/no-var-requires */
'use client';

import { useT } from '#/i18n';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import Image, { StaticImageData } from 'next/image';
import { styled } from 'styled-components';

export const IconPersonStudent = makeIcon(
  require('../../../icons/16/user_student.png'),
  16
);

export const IconPersonTeacher = makeIcon(
  require('../../../icons/16/user_suit.png'),
  16
);

export const IconPersonParent = makeIcon(
  require('../../../icons/16/user_orange.png'),
  16
);

export const IconPersonAdministrator = makeIcon(
  require('../../../icons/16/user_angel.png'),
  16
);

export const IconPersonOther = makeIcon(
  require('../../../icons/16/user_alien.png'),
  16
);

export const IconGenderMale = makeIcon(
  require('../../../icons/16/male.png'),
  16
);

export const IconGenderFemale = makeIcon(
  require('../../../icons/16/female.png'),
  16
);

export const IconGenderOther = makeIcon(
  require('../../../icons/16/missing_texture.png'),
  16
);

export const IconPersonActionMail = makeIcon(
  require('../../../icons/16/new_email.png'),
  16
);

export const IconPersonActionDetails = makeIcon(
  require('../../../icons/16/vcard.png'),
  16
);

export const IconPersonActionPermissions = makeIcon(
  require('../../../icons/16/award_star_gold_blue.png'),
  16
);

export const IconPersonActionChangeTeacherId = makeIcon(
  require('../../../icons/16/digital_signature_pen.png'),
  16
);

export const IconPersonActionDeleteAccount = makeIcon(
  require('../../../icons/16/vcard_delete.png'),
  16
);

export const IconPersonActionCreateAccount = makeIcon(
  require('../../../icons/16/vcard_add.png'),
  16
);

export const IconPersonActionDeletePerson = makeIcon(
  require('../../../icons/16/user_delete.png'),
  16
);

export const IconPersonActionSettings = makeIcon(
  require('../../../icons/16/account_functions.png'),
  16
);

export const IconPersonActionEditPerson = makeIcon(
  require('../../../icons/16/user_edit.png'),
  16
);

export const IconPersonActionEditAccount = makeIcon(
  require('../../../icons/16/vcard_edit.png'),
  16
);

export const LargeIconVersion = makeIcon(
  require('../../../icons/32/server_components.png'),
  32
);

export const LargeIconCookies = makeIcon(
  require('../../../icons/32/cookies.png'),
  32
);

export const LargeIconGroupError = makeIcon(
  require('../../../icons/32/group_error.png'),
  32
);

export const LargeIconTick = makeIcon(
  require('../../../icons/32/tick.png'),
  32
);

export const LargeIconWarning = makeIcon(
  require('../../../icons/32/error.png'),
  32
);

export const LargeIconError = makeIcon(
  require('../../../icons/32/cross.png'),
  32
);

export type IconProps = {
  alt: TranslationsWithStringTypeAndNoVariables;
};

function makeIcon(src: StaticImageData, size: number) {
  return function Icon({ alt }: IconProps) {
    const { t } = useT();
    const translatedAlt = t(alt);

    return (
      <StyledIcon
        src={src}
        alt={translatedAlt}
        title={translatedAlt}
        $size={size}
      />
    );
  };
}

export const StyledIcon = styled(Image)<{ $size?: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  image-rendering: pixelated;
  margin: 2px;
  display: block;
`;
