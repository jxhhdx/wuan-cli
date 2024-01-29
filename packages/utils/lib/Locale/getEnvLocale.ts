function getEnvLocale(env?: NodeJS.ProcessEnv): string {
  env = env || process.env;
  return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE || '';
}

export default getEnvLocale;
