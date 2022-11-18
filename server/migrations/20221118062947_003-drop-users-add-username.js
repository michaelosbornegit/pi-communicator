/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable('messages', (table) => {
        table.dropForeign('userId')
        table.dropColumn('userId');
        table.string('to').notNullable();
        table.string('from').notNullable();
    });
    await knex.schema.alterTable('device_registration', (table) => {
        table.dropForeign('userId')
        table.dropColumn('userId');
        table.string('username')
    });
    await knex.schema.dropTable('users');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.createTable('users', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

        table.string('username').notNullable();
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    });
    await knex.schema.alterTable('device_registration', (table) => {
        table.dropColumn('username');
        table.string('userId');
        table.foreign('userId').references('users.id').deferrable('deferred');
    });
    await knex.schema.alterTable('messages', (table) => {
        table.string('userId');
        table.foreign('userId').references('users.id').deferrable('deferred');
        table.dropColumn('to');
        table.dropColumn('from');
    });
};