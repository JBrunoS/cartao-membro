exports.up = function(knex) {
    return knex.schema.createTable('churches', function(table){
        table.increments().primary();
        table.string('congregacao').notNullable();
        table.integer('user_id').notNullable();

        table.foreign('user_id').references('id').inTable('users');
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('churches');
  };