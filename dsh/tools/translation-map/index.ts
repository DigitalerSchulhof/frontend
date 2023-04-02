import { TranslationMapWriter } from './writer';
import { TranslationService } from '../../src/i18n/service';
import { DEFAULT_LOCALE } from '../../src/utils';
import { isWatchMode } from '../utils';

const translationService = new TranslationService(DEFAULT_LOCALE);

const translationMapWriter = new TranslationMapWriter(translationService);

translationMapWriter.writeTranslationMap();

if (isWatchMode()) {
  translationMapWriter.watch();
}
