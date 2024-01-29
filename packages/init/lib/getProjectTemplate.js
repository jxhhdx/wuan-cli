const { request } = require('@wuan-cli/utils');

module.exports = function() {
  return request({
    url: '/project/template',
  });
};
