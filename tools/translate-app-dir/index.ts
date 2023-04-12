import { TranslationService } from '#/i18n/server/service';
import { DEFAULT_LOCALE } from '#/utils';
import { isWatchMode } from '../utils';
import {
  AppDirTranslator,
  AppDirTranslatorTranslationService,
} from './translator';

const translationService = new TranslationService(DEFAULT_LOCALE);

const appDirTranslatorTranslationService =
  new AppDirTranslatorTranslationService(translationService, DEFAULT_LOCALE);

const translator = new AppDirTranslator(appDirTranslatorTranslationService);

translator.clearNextAppDir();
translator.addAllFiles();

if (isWatchMode()) {
  translator.watch();
}
