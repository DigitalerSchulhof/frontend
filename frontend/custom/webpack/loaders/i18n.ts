import { LoaderDefinitionFunction } from 'webpack';
import {
  findNearestPackageJson,
  LOCALE,
  readJsonSync,
  toBase64,
} from '../../utils';
import {
  getTranslation,
  getTranslationOrigin,
  reloadTranslations,
} from '../../i18n';
import * as fs from "fs";

const T_FUNC_REGEX = /\bt\(["']([a-z-.]+)["']\)/g;

export const i18nLoader: LoaderDefinitionFunction<{ isDev: boolean }> =
  async function (source) {
    const matches = source.matchAll(T_FUNC_REGEX);

    if (!matches) return source;

    const options = this.getOptions();

    if (options.isDev) {
      reloadTranslations();
    }

    const packageName = readJsonSync<{ name: string }>(
      findNearestPackageJson(this.resourcePath)
    ).name;

    let offset = 0;

    for (const match of matches) {
      const [stringMatch, i18nKey] = match;

      const file = getTranslationOrigin(packageName, i18nKey, LOCALE);

      const replacement = `t('${toBase64(
        getTranslation(packageName, i18nKey, LOCALE)
      )}')`;

      source =
        source.substring(0, offset + match.index!) +
        replacement +
        source.substring(offset + match.index! + stringMatch.length);

      offset += replacement.length - stringMatch.length;

      if (file !== null) this.addDependency(fs.realpathSync(file));
    }

    return source;
  };

export default i18nLoader;
