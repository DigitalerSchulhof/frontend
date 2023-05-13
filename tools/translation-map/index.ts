import { TranslationService } from '#/context/contexts/i18n/service';
import { DEFAULT_LOCALE } from '#/utils';
import { isWatchMode } from '../utils';
import { TranslationMapWriter } from './writer';

const translationService = new TranslationService(DEFAULT_LOCALE);

const translationMapWriter = new TranslationMapWriter(translationService);

translationMapWriter.writeTranslationMap();

if (isWatchMode()) {
  translationMapWriter.watch();
}
