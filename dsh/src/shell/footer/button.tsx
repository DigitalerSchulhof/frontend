import { Button, ButtonGroup } from '#/ui/Button';
import { styled } from 'styled-components';

export const FooterButtonGroup = styled(ButtonGroup)`
  margin: 0;
`;

export const FooterButton = styled(Button)`
  background-color: transparent;
  color: #fcf8e3;

  &:hover {
    background-color: #fbc162;
    color: #fcf8e3;
  }
`;
