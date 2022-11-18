/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = async function(knex) {
    await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  
    await knex.schema.createTable('users', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
  
      table.string('username').notNullable();
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    });
  
    await knex.schema.createTable('messages', (table) => {
      table.increments();
  
      table.uuid('userId');
      table.foreign('userId').references('users.id').deferrable('deferred');
      table.string('message').notNullable();
      table.boolean('read').notNullable();
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('fetchedAt')
      table.timestamp('readAt')
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function(knex) {
    await knex.schema.dropTable('messages');
    await knex.schema.dropTable('users');
  };