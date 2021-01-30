const { DB_URL, TEST_DB_URL, LOCAL_DB_URL } = require('./config');

module.exports = {
  development: {
    client: 'pg',
    connection: LOCAL_DB_URL,
    migrations: {
      directory: __dirname + '/knex/migrations'
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    }
  },
  production: {
    client: 'pg',
    connection: DB_URL,
    migrations: {
      directory: __dirname + '/knex/migrations'
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    }
  },
  test: {
    client: 'pg',
    connection: TEST_DB_URL,
    migrations: {
      directory: __dirname + '/knex/migrations'
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    }
  }
};
