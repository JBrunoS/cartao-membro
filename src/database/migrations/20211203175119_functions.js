exports.up = function(knex) {
    return knex.schema.createTable('functions', function(table){
        table.increments().primary();
        table.string('funcao').notNullable();
        table.string('data_batismo').notNullable();
        table.integer('user_id').notNullable();

        table.foreign('user_id').references('id').inTable('users');
        
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('functions');
  };