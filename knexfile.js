const {
  DATABASE_URL,
  TEST_DATABASE_URL,
  LOCAL_DATABASE_URL
} = require('./config');

module.exports = {
  development: {
    client: 'pg',
    connection: LOCAL_DATABASE_URL,
    migrations: {
      directory: __dirname + '/knex/migrations'
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    }
  },
  production: {
    client: 'pg',
    connection: DATABASE_URL,
    migrations: {
      directory: __dirname + '/knex/migrations'
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    }
  },
  test: {
    client: 'pg',
    connection: TEST_DATABASE_URL,
    migrations: {
      directory: __dirname + '/knex/migrations'
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    }
  }
};
