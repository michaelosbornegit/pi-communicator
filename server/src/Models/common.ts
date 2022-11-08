import knex from 'knex';
import env from '../environment';

export default knex({
  client: 'pg',
  connection: env.PG_CONNECTION_STRING,
  searchPath: ['knex', 'public'],
});