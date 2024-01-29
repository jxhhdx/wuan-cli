import GitServer from './GitServer';
import GiteeRequest from './GiteeRequest';

class Gitee extends GitServer {
  constructor() {
    super('gitee');
  }

  getTokenHelpUrl = (): string => {
    return 'https://gitee.com/profile/personal_access_tokens';
  };

  getUser = () => {
    return this.request.get('/user').then(response => {
      return this.handleResponse(response);
    });
  };

  getOrgs = () => {
    return this.request.get('/user/orgs', {
      page: 1,
      per_page: 100,
      admin: true,
    }).then(response => {
      return this.handleResponse(response);
    });
  };

  setToken = (token: string) => {
    this.request = new GiteeRequest(token);
  };

  getRepo = (owner: string, repo: string) => {
    return this.request.get(`/repos/${owner}/${repo}`).then(response => {
      return this.handleResponse(response);
    });
  };

  createRepo = (repo: string) => {
    return this.request.post('/user/repos', {
      name: repo,
    });
  };

  createOrgRepo = (repo: string, login: string) => {
    return this.request.post(`/orgs/${login}/repos`, {
      name: repo,
    });
  };

  getRemote = (login: string, repo: string) => {
    return `git@gitee.com:${login}/${repo}.git`;
  };

  getSSHKeysUrl = (): string => {
    return 'https://gitee.com/profile/sshkeys';
  };

  getSSHKeysHelpUrl = (): string => {
    return 'https://gitee.com/help/articles/4191';
  };
}

export = Gitee;
