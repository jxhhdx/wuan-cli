import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as npminstall from 'npminstall';
import * as log from './log';
import * as npm from './npm';
import * as formatPath from './formatPath';

const useOriginNpm: boolean = false;

/**
 * Package 类，用于管理动态下载的库文件
 */
class Package {
  private targetPath: string;
  private storePath: string;
  private packageName: string;
  private packageVersion: string;
  private npmFilePathPrefix: string;

  constructor(options: { targetPath: string; storePath: string; name: string; version: string }) {
    log.verbose('options', options);
    this.targetPath = options.targetPath;
    this.storePath = options.storePath;
    this.packageName = options.name;
    this.packageVersion = options.version;
    this.npmFilePathPrefix = this.packageName.replace('/', '_');
  }

  get npmFilePath(): string {
    return path.resolve(this.storePath, `_${this.npmFilePathPrefix}@${this.packageVersion}@${this.packageName}`);
  }

  async prepare(): Promise<void> {
    if (!fs.existsSync(this.targetPath)) {
      fse.mkdirpSync(this.targetPath);
    }
    if (!fs.existsSync(this.storePath)) {
      fse.mkdirpSync(this.storePath);
    }
    log.verbose(this.targetPath);
    log.verbose(this.storePath);
    const latestVersion = await npm.getNpmLatestSemverVersion(this.packageName, this.packageVersion);
    log.verbose('latestVersion', this.packageName, latestVersion);
    if (latestVersion) {
      this.packageVersion = latestVersion;
    }
  }

  async install(): Promise<void> {
    await this.prepare();
    return npminstall({
      root: this.targetPath,
      storeDir: this.storePath,
      registry: npm.getNpmRegistry(useOriginNpm),
      pkgs: [
        {
          name: this.packageName,
          version: this.packageVersion,
        },
      ],
    });
  }

  async exists(): Promise<boolean> {
    await this.prepare();
    return fs.existsSync(this.npmFilePath);
  }

  getPackage(isOriginal: boolean = false): any {
    if (!isOriginal) {
      return fse.readJsonSync(path.resolve(this.npmFilePath, 'package.json'));
    }
    return fse.readJsonSync(path.resolve(this.storePath, 'package.json'));
  }

  getRootFilePath(isOriginal: boolean = false): string | null {
    const pkg = this.getPackage(isOriginal);
    if (pkg) {
      if (!isOriginal) {
        return formatPath(path.resolve(this.npmFilePath, pkg.main));
      }
      return formatPath(path.resolve(this.storePath, pkg.main));
    }
    return null;
  }

  async getVersion(): Promise<string | null> {
    await this.prepare();
    return (await this.exists()) ? this.getPackage().version : null;
  }

  async getLatestVersion(): Promise<string | null> {
    const version = await this.getVersion();
    if (version) {
      const latestVersion = await npm.getNpmLatestSemverVersion(this.packageName, version);
      return latestVersion;
    }
    return null;
  }

  async update(): Promise<void> {
    const latestVersion = await this.getLatestVersion();
    return npminstall({
      root: this.targetPath,
      storeDir: this.storePath,
      registry: npm.getNpmRegistry(useOriginNpm),
      pkgs: [
        {
          name: this.packageName,
          version: latestVersion,
        },
      ],
    });
  }
}

export = Package;
