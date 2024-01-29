import io from 'socket.io-client';
import get from 'lodash/get';
import { parseMsg } from './parse';
import log from '../log';
import getOSSProject from './getOSSProject';
import inquirer from '../inquirer';

const WS_SERVER = 'ws://book.youbaobao.xyz:7002';
const FAILED_CODE = ['prepare failed', 'download failed', 'build failed', 'pre-publish failed', 'publish failed'];

interface GitInfo {
  remote: string;
  name: string;
  branch: string;
  version: string;
}

interface CloudBuildOptions {
  timeout?: number;
  prod?: boolean;
  keepCache?: boolean;
  cnpm?: boolean;
  buildCmd?: string;
}

class CloudBuild {
  private _git: GitInfo;
  private _type: string;
  private _timeout: number;
  private _prod?: boolean;
  private _keepCache?: boolean;
  private _cnpm?: boolean;
  private _buildCmd?: string;
  private _socket: any;
  private timer: NodeJS.Timeout;

  constructor(git: GitInfo, type: string, options: CloudBuildOptions = {}) {
    log.verbose('CloudBuild options', options);
    this._git = git;
    this._type = type; // 发布类型，目前仅支持oss
    this._timeout = options.timeout || 1200 * 1000; // 默认超时时间20分钟
    this._prod = options.prod;
    this._keepCache = options.keepCache;
    this._cnpm = options.cnpm;
    this._buildCmd = options.buildCmd;
  }

  timeout = (fn: () => void, timeout: number) => {
    clearTimeout(this.timer);
    log.notice('设置任务超时时间：', `${+timeout / 1000}秒`);
    this.timer = setTimeout(fn, timeout);
  };

  prepare = async () => {
    // 如果是上线发布，则检查OSS中是否存在项目
    const projectName = this._git.name;
    if (this._prod) {
      const ossProject = await getOSSProject({
        name: projectName,
        type: this._prod ? 'prod' : 'dev',
      });
      if (ossProject.code === 0 && ossProject.data.length > 0) {
        const cover = await inquirer({
          type: 'list',
          choices: [{ name: '覆盖发布', value: true }, { name: '放弃发布', value: false }],
          defaultValue: true,
          message: `OSS已存在 [${projectName}] 项目，是否强行覆盖发布？`,
        });
        if (!cover) {
          throw new Error('发布终止');
        }
      }
    }
  };

  init = () => {
    log.notice('开始云构建任务初始化');
    log.verbose(this._git.remote);
    return new Promise((resolve, reject) => {
      const socket = io(WS_SERVER, {
        query: {
          repo: this._git.remote,
          type: this._type,
          name: this._git.name,
          branch: this._git.branch,
          version: this._git.version,
          prod: this._prod,
          keepCache: this._keepCache,
          cnpm: this._cnpm,
          buildCmd: this._buildCmd,
        },
        transports: ['websocket'],
      });
      this.timeout(() => {
        log.error('云构建服务创建超时，自动终止');
        disconnect();
      }, 5000);
      const disconnect = () => {
        clearTimeout(this.timer);
        socket.disconnect();
        socket.close();
      };
      socket.on('connect', () => {
        const id = socket.id;
        log.success('云构建任务创建成功', `任务ID：${id}`);
        this.timeout(() => {
          log.error('云构建服务执行超时，自动终止');
          disconnect();
        }, this._timeout);
        socket.on(id, (msg: any) => {
          const parsedMsg = parseMsg(msg);
          log.success(parsedMsg.action, parsedMsg.message);
        });
        resolve();
      });
      socket.on('disconnect', () => {
        log.success('disconnect', '云构建任务断开');
        disconnect();
      });
      socket.on('error', (err: any) => {
        log.error('云构建出错', err);
        disconnect();
        reject(err);
      });
      this._socket = socket;
    });
  };

  build = () => {
    let ret = true;
    return new Promise((resolve, reject) => {
      this._socket.emit('build');
      this._socket.on('build', (msg: any) => {
        const parsedMsg = parseMsg(msg);
        if (FAILED_CODE.indexOf(parsedMsg.action) >= 0) {
          log.error(parsedMsg.action, parsedMsg.message);
          clearTimeout(this.timer);
          this._socket.disconnect();
          this._socket.close();
          ret = false;
        } else {
          log.success(parsedMsg.action, parsedMsg.message);
        }
      });
      this._socket.on('building', (msg: any) => {
        console.log(msg);
      });
      this._socket.on('disconnect', () => {
        resolve(ret);
      });
      this._socket.on('error', (err: any) => {
        reject(err);
      });
    });
  };
}

export = CloudBuild;
