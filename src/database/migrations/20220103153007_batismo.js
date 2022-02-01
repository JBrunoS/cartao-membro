exports.up = function(knex) {
    return knex.schema.createTable('batismo', function(table){
        table.increments().primary();
        table.string('dia_batismo').notNullable();
        table.string('mes_batismo').notNullable();
        table.string('ano_batismo').notNullable();
        table.integer('user_id').notNullable();

        table.foreign('user_id').references('id').inTable('users');
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('batismo');
  };