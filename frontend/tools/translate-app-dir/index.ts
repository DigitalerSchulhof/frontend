import { DEFAULT_LOCALE, isWatchMode } from '../utils';
import { makeTranslationService } from '../utils/i18n';
import {
  AppDirTranslator,
  AppDirTranslatorTranslationService,
} from './translator';

const translationService = makeTranslationService();

const appDirTranslatorTranslationService =
  new AppDirTranslatorTranslationService(translationService, DEFAULT_LOCALE);

const translator = new AppDirTranslator(appDirTranslatorTranslationService);

translator.clearNextAppDir();
translator.addAllFiles();

if (isWatchMode()) {
  translator.watch();
}
