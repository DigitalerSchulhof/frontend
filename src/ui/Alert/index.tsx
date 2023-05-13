import { getContext } from '#/auth/component';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { StyledAlert } from '#/ui/Alert/client';
import { Heading } from '#/ui/Heading';
import { Variant } from '../variants';

export interface AlertProps {
  variant: Variant;
  title?: TranslationsWithStringTypeAndNoVariables;
  children: React.ReactNode;
}

export const Alert = ({ title, children, variant }: AlertProps) => {
  const { t } = getContext();

  const titleElement = title ? <Heading size='4'>{t(title)}</Heading> : null;

  return (
    <StyledAlert $variant={variant}>
      {titleElement}
      {children}
    </StyledAlert>
  );
};
