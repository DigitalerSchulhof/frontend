import React, { memo } from 'react';
import styled from 'styled-components';

export interface NoteProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Note: React.FC<NoteProps> = memo(function Note({ ...props }) {
  return <StyledNote {...props} />;
});

export const StyledNote = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 7px 0;
  font-size: 70%;
`;
