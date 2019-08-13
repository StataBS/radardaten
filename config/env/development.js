let local = {};
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  local = require('../local.js');
}

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/


  security: {
    cors: {
      allRoutes: true,
      allowOrigins: '*'
    }
  },
};

