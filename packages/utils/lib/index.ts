import * as path from 'path';
import * as log from './log';
import * as request from './request';
import * as npm from './npm';
import * as inquirer from './inquirer';
import * as spinner from './spinner';
import * as ejs from './ejs';
import * as terminalLink from './terminalLink';

import Package from './Package';
import Git from './Git/Git';
import * as file from './file';
import * as locale from './Locale/loadLocale';
import * as formatPath from './formatPath';

function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

function exec(command: string, args: string[], options?: any): any {
  const win32: boolean = process.platform === 'win32';

  const cmd: string = win32 ? 'cmd' : command;
  const cmdArgs: string[] = win32 ? ['/c'].concat(command, args) : args;

  return require('child_process').spawn(cmd, cmdArgs, options || {});
}

function firstUpperCase(str: string): string {
  return str.replace(/^\S/, (s) => s.toUpperCase());
}

function camelTrans(str: string, isBig: boolean): string {
  let i: number = isBig ? 0 : 1;
  const strs = str.split('-');
  for (; i < strs.length; i += 1) {
    strs[i] = firstUpperCase(str[i]);
  }
  return strs.join('');
}

function formatName(name: string): string {
  if (name) {
    name = `${name}`.trim();
    if (name) {
      if (/^[.*_\/\\()&^!@#$%+=?<>~`\s]/.test(name)) {
        name = name.replace(/^[.*_\/\\()&^!@#$%+=?<>~`\s]+/g, '');
      }
      if (/^[0-9]+/.test(name)) {
        name = name.replace(/^[0-9]+/, '');
      }
      if (/[.*_\/\\()&^!@#$%+=?<>~`\s]/.test(name)) {
        name = name.replace(/[.*_\/\\()&^!@#$%+=?<>~`\s]/g, '-');
      }
      return camelTrans(name, true);
    } else {
      return name;
    }
  } else {
    return name;
  }
}

function formatClassName(name: string): string {
  return require('kebab-case')(name).replace(/^-/, '');
}

export {
  log,
  request,
  npm,
  inquirer,
  spinner,
  ejs,
  Package,
  Git,
  sleep,
  exec,
  formatName,
  formatClassName,
  terminalLink,
  ...file,
  locale,
  formatPath,
};
