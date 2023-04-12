'use client';

import { Link } from '#/ui/Link';
import styled from 'styled-components';

export const StyledBreadcrumbs = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const StyledBreadcrumbItem = Link;
