
exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table){
      table.boolean('status');
  })
};

exports.down = function(knex) {
    return knex.schema.alterTable('users', function(table){
        table.dropColumn('status');
    })
};
