import getEnvLocale from './getEnvLocale';

function loadLocale() {
  const locale = getEnvLocale();
  if (locale) {
    const localeShortName = locale.split('.')[0].toLocaleLowerCase();
    return require(`./${localeShortName}`);
  } else {
    return require('./zh_cn');
  }
}

export default loadLocale();
