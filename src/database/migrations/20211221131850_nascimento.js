exports.up = function(knex) {
    return knex.schema.createTable('nascimento', function(table){
        table.increments().primary();
        table.string('dia_nascimento').notNullable();
        table.string('mes_nascimento').notNullable();
        table.string('ano_nascimento').notNullable();
        table.integer('user_id').notNullable();

        table.foreign('user_id').references('id').inTable('users');
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('nascimento');
  };