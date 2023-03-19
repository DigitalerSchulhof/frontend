import * as chokidar from 'chokidar';
import * as fs from 'fs';
import * as globby from 'globby';
import * as path from 'path';
import { TranslationService } from '../utils/i18n/service';
import { __app, __nextApp } from '../utils/paths';

export class AppDirTranslator {
  private watcher: AppDirTranslatorWatcher | null = null;

  constructor(private translationService: AppDirTranslatorTranslationService) {}

  clearNextAppDir(): void {
    fs.rmSync(__nextApp, { recursive: true, force: true });
  }

  addAllFiles(): void {
    const appDirFiles = globby.sync('**/*', { cwd: __app });

    for (const appDirFile of appDirFiles) {
      this.addAppDirFile(appDirFile);
    }
  }

  addAppDirFile(appDirFile: string): void {
    const nextAppDirFile =
      this.translationService.getNextAppDirFile(appDirFile);
    const nextAppDirFilePath = path.join(__nextApp, nextAppDirFile);

    if (fs.existsSync(nextAppDirFilePath)) return;

    const nextAppDirFileDir = path.dirname(nextAppDirFilePath);
    if (!fs.existsSync(nextAppDirFileDir)) {
      fs.mkdirSync(nextAppDirFileDir, { recursive: true });
    }

    fs.writeFileSync(
      nextAppDirFilePath,
      this.makeNextAppDirFileContent(appDirFile)
    );
  }

  removeAppDirFile(appDirFile: string): void {
    const nextAppDirFile =
      this.translationService.getNextAppDirFile(appDirFile);
    const nextAppDirFilePath = path.join(__nextApp, nextAppDirFile);

    if (!fs.existsSync(nextAppDirFilePath)) return;

    fs.rmSync(nextAppDirFilePath);
  }

  removeAppDirDir(appDirDir: string): void {
    const nextAppDirDir = this.translationService.getNextAppDirFile(appDirDir);
    const nextAppDirFilePath = path.join(__nextApp, nextAppDirDir);

    fs.rmSync(nextAppDirFilePath, { recursive: true, force: true });
  }

  private makeNextAppDirFileContent(appDirFile: string): string {
    const relativeAppDirFile = `${new Array(1 + appDirFile.split('/').length)
      .fill('..')
      .join('/')}/src/app/${appDirFile.substring(
      0,
      appDirFile.lastIndexOf('.')
    )}`;

    return `export { default } from '${relativeAppDirFile}';
export * from '${relativeAppDirFile}';
`;
  }

  watch(): void {
    if (this.watcher) return;

    this.watcher = new AppDirTranslatorWatcher(this);
    this.watcher.watch();
  }

  async unwatch(): Promise<void> {
    if (!this.watcher) return;

    await this.watcher.unwatch();
    this.watcher = null;
  }
}

export class AppDirTranslatorWatcher {
  private watcher: chokidar.FSWatcher | null = null;

  constructor(private readonly appDirTranslator: AppDirTranslator) {}

  watch(): void {
    this.watcher = chokidar.watch('.', {
      cwd: __app,
      ignoreInitial: true,
    });

    this.watcher.on('add', (appDirFile) => {
      this.appDirTranslator.addAppDirFile(appDirFile);
    });

    this.watcher.on('unlink', (appDirFile) => {
      this.appDirTranslator.removeAppDirFile(appDirFile);
    });

    this.watcher.on('unlinkDir', (appDirFile) => {
      this.appDirTranslator.removeAppDirDir(appDirFile);
    });

    this.watcher.on('error', (error) => {
      console.error('Watcher error:', error);
    });
  }

  async unwatch(): Promise<void> {
    if (!this.watcher) return;

    await this.watcher.close();
    this.watcher = null;
  }
}

export class AppDirTranslatorTranslationService {
  constructor(
    private readonly translationService: TranslationService,
    private readonly locale: string
  ) {}

  getNextAppDirFile(appDirFile: string): string {
    const appDirFileParts = appDirFile.split('/');

    const nextAppDirFileParts = appDirFileParts.map(
      this.translateAppDirFilePart.bind(this)
    );

    return nextAppDirFileParts.join('/');
  }

  private translateAppDirFilePart(appDirFilePart: string): string {
    if (!appDirFilePart.startsWith('{') || !appDirFilePart.endsWith('}')) {
      return appDirFilePart;
    }

    const translationKey = appDirFilePart.substring(
      1,
      appDirFilePart.length - 1
    );

    const translation = this.translationService.translate(
      this.locale,
      translationKey
    );

    if (typeof translation !== 'string') {
      throw new Error(
        `Translation for key '${translationKey}' is not a string`
      );
    }

    return translation;
  }
}
