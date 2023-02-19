import { CreateContextContext } from '../../context';
import { school } from './school';

export const schulhof = (context: CreateContextContext) => ({
  school: school(context),
});
