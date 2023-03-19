import type { StandardLonghandProperties } from 'csstype';
import styled, { css } from 'styled-components';

export interface FlexProps
  extends Pick<
    StandardLonghandProperties,
    'flexDirection' | 'flexWrap' | 'justifyContent' | 'alignItems'
  > {}

export const Flex = styled.div<FlexProps>(
  ({
    flexDirection = 'row',
    flexWrap = 'wrap',
    justifyContent,
    alignItems,
  }) => css`
    display: flex;
    flex-direction: ${flexDirection};
    flex-wrap: ${flexWrap};
    justify-content: ${justifyContent};
    align-items: ${alignItems};
  `
);
