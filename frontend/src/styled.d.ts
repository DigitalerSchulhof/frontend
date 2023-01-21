import { theme } from './ui/theme';
import 'styled-components';

declare module 'styled-components' {
  type Theme = typeof theme;
  export interface DefaultTheme extends Theme {}
}
