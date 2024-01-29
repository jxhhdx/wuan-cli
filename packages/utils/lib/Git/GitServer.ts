function error(methodName: string): never {
  throw new Error(`${methodName} must be implemented!`);
}

class GitServer {
  type: string;
  token: string;

  constructor(type: string, token: string) {
    this.type = type;
    this.token = token;
  }

  setToken = (): never => {
    error('setToken');
  };
  createRepo = (): never => {
    error('createRepo');
  };
  createOrgRepo = (): never => {
    error('createOrgRepo');
  };
  getRepo = (): never => {
    error('getRepo');
  };
  getUser = (): never => {
    error('getUser');
  };
  getOrgs = (): never => {
    error('getOrgs');
  };
  getTokenHelpUrl = (): never => {
    error('getTokenHelpUrl');
  };
  getSSHKeysUrl = (): never => {
    error('getSSHKeysUrl');
  };
  getSSHKeysHelpUrl = (): never => {
    error('getSSHKeysHelpUrl');
  };
  getRemote = (): never => {
    error('getRemote');
  };

  isHttpResponse = (response: any): response is {
    status: number;
    statusText: string;
    headers: any;
    data: any;
    config: any;
  } => {
    return response && response.status && response.statusText &&
      response.headers && response.data && response.config;
  };

  handleResponse = (response: any): any => {
    if (response !== 200 && this.isHttpResponse(response)) {
      return null;
    } else {
      return response;
    }
  };
}

export = GitServer;
