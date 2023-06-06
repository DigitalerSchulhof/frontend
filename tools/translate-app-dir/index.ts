import { DEFAULT_LOCALE } from '#/utils';
import { isWatchMode } from '../utils';
import {
  AppDirTranslator,
  AppDirTranslatorTranslationService,
} from './translator';

const appDirTranslatorTranslationService =
  new AppDirTranslatorTranslationService(DEFAULT_LOCALE);

const translator = new AppDirTranslator(appDirTranslatorTranslationService);

translator.clearNextAppDir();
translator.addAllFiles();

if (isWatchMode()) {
  translator.watch();
}
