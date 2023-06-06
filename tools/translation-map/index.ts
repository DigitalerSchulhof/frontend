import { isWatchMode } from '../utils';
import { writeTranslationsMap } from './writer';

writeTranslationsMap();

if (isWatchMode()) {
  // TODO: Watch for changes in the translations map and re-generate it.
}
