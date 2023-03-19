import { getTranslation, TranslationAST, useT } from '@i18n';
import Image, { StaticImageData } from 'next/image';
import { memo } from 'react';
import styled from 'styled-components';

export const IconPersonStudent = makeIcon(
  require('../../../icons/16/user_student.png'),
  getTranslation('icons.person.type.student')
);

export const IconPersonTeacher = makeIcon(
  require('../../../icons/16/user_suit.png'),
  getTranslation('icons.person.type.teacher')
);

export const IconPersonParent = makeIcon(
  require('../../../icons/16/user_orange.png'),
  getTranslation('icons.person.type.parent')
);

export const IconPersonAdministrator = makeIcon(
  require('../../../icons/16/user_angel.png'),
  getTranslation('icons.person.type.administrator')
);

export const IconPersonOther = makeIcon(
  require('../../../icons/16/user_alien.png'),
  getTranslation('icons.person.type.other')
);

export const IconGenderMale = makeIcon(
  require('../../../icons/16/male.png'),
  getTranslation('icons.person.gender.male')
);

export const IconGenderFemale = makeIcon(
  require('../../../icons/16/female.png'),
  getTranslation('icons.person.gender.female')
);

export const IconGenderOther = makeIcon(
  require('../../../icons/16/missing_texture.png'),
  getTranslation('icons.person.gender.other')
);

export const IconPersonMailAction = makeIcon(
  require('../../../icons/16/new_email.png'),
  getTranslation('icons.person.action.mail')
);

export const IconPersonPermissionsAction = makeIcon(
  require('../../../icons/16/award_star_gold_blue.png'),
  getTranslation('icons.person.action.permissions')
);

export const IconPersonChangeTeacherIdAction = makeIcon(
  require('../../../icons/16/digital_signature_pen.png'),
  getTranslation('icons.person.action.changeTeacherId')
);

export const IconPersonDeleteAccountAction = makeIcon(
  require('../../../icons/16/vcard_delete.png'),
  getTranslation('icons.person.action.delete.account')
);

export const IconPersonDeletePersonOnlyAction = makeIcon(
  require('../../../icons/16/user_delete.png'),
  getTranslation('icons.person.action.delete.person.only')
);

export const IconPersonDeletePersonWithAction = makeIcon(
  require('../../../icons/16/user_delete.png'),
  getTranslation('icons.person.action.delete.person.with')
);

function makeIcon(src: StaticImageData, alt: string | TranslationAST<string>) {
  return memo(() => {
    const t = useT();
    const altString = typeof alt === 'string' ? alt : t(alt);

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
