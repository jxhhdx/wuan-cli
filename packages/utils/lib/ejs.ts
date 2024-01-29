import * as path from 'path';
import glob from 'glob';
import * as ejs from 'ejs';
import * as fse from 'fs-extra';
import get from 'lodash/get';

import * as log from './log';

interface RenderOptions {
  ignore?: string[];
}

interface ExtraOptions {
  ignore?: string[];
}

export default async function renderFiles(dir: string, options: RenderOptions = {}, extraOptions: ExtraOptions = {}, disableFormatDotFile: boolean = false): Promise<void> {
  const ignore = get(extraOptions, 'ignore');
  log.verbose('ignore', ignore);
  return new Promise<void>((resolve, reject) => {
    glob('**', {
      cwd: dir,
      nodir: true,
      ignore: ignore || ['**/node_modules/**'],
    }, (err, files) => {
      if (err) {
        return reject(err);
      }

      log.verbose('render files:', files);

      Promise.all(files.map((file) => {
        const filepath = path.join(dir, file);
        return renderFile(filepath, options, disableFormatDotFile);
      })).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  });
}

function renderFile(filepath: string, options: RenderOptions, disableFormatDotFile: boolean): Promise<string> {
  let filename = path.basename(filepath);

  if (filename.indexOf('.png') !== -1 || filename.indexOf('.jpg') !== -1) {
    return Promise.resolve(filepath);
  }

  return new Promise<string>((resolve, reject) => {
    ejs.renderFile(filepath, options, (err, result) => {
      if (err) {
        return reject(err);
      }

      if (/^_package.json/.test(filename)) {
        filename = filename.replace('_package.json', 'package.json');
        fse.removeSync(filepath);
      }

      if (/\.ejs$/.test(filepath)) {
        filename = filename.replace(/\.ejs$/, '');
        fse.removeSync(filepath);
      }

      if (!disableFormatDotFile && /^_/.test(filename)) {
        filename = filename.replace(/^_/, '.');
        fse.removeSync(filepath);
      }

      const newFilepath = path.join(filepath, '../', filename);
      fse.writeFileSync(newFilepath, result);
      resolve(newFilepath);
    });
  });
}
