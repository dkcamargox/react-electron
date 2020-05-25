
exports.up = function(knex) {
    return knex.schema.createTable('products', function(table) {
        table.increments('id').primary();
        // eslint-disable-next-line no-unused-expressions
        table.string('title').notNullable;
        // eslint-disable-next-line no-unused-expressions
        table.string('description').notNullable;
        // eslint-disable-next-line no-unused-expressions
        table.string('url').notNullable;
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('products');
};
