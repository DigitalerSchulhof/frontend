import { CreateContextContext } from '../context';
import { schulhof } from './schulhof';

export const database = (context: CreateContextContext) => ({
  schulhof: schulhof(context),
});
