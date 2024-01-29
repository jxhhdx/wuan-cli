import GitServer from './GitServer';
import GithubRequest from './GithubRequest';

class Github extends GitServer {
  constructor() {
    super('github');
  }

  getTokenHelpUrl = (): string => {
    return 'https://github.com/settings/tokens';
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
    }).then(response => {
      return this.handleResponse(response);
    });
  };

  setToken = (token: string) => {
    this.request = new GithubRequest(token);
  };

  getRepo = (owner: string, repo: string) => {
    return this.request.get(`/repos/${owner}/${repo}`).then(response => {
      return this.handleResponse(response);
    });
  };

  createRepo = (repo: string) => {
    return this.request.post('/user/repos', {
      name: repo,
    }, {
      Accept: 'application/vnd.github.v3+json',
    });
  };

  createOrgRepo = (repo: string, login: string) => {
    return this.request.post(`/orgs/${login}/repos`, {
      name: repo,
    }, {
      Accept: 'application/vnd.github.v3+json',
    });
  };

  getRemote = (login: string, repo: string) => {
    return `git@github.com:${login}/${repo}.git`;
  };

  getSSHKeysUrl = (): string => {
    return 'https://github.com/settings/keys';
  };

  getSSHKeysHelpUrl = (): string => {
    return 'https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh';
  };
}

export = Github;
