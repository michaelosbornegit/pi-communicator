/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('sessions', (table) => {
    table.increments();

    table.string('hostMachine').notNullable();
    table.string('application').notNullable();
    table.timestamp('startCollectionDate').notNullable();
    table.timestamp('endCollectionDate').notNullable();
    table.integer('openTimeSeconds').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('sessions');
};
