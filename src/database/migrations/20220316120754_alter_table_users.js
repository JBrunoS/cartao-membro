
exports.up = function(knex) {
  knex.schema.alterTable('users', function(table){
      table.boolean('status');
  })
};

exports.down = function(knex) {
knex.schema.alterTable('users', function(table){
    table.dropColumn('status');
})
};
