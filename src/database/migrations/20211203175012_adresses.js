exports.up = function(knex) {
    return knex.schema.createTable('adresses', function(table){
        table.increments().primary();
        table.string('endereco').notNullable();
        table.string('numero').notNullable();
        table.string('bairro').notNullable();
        table.string('cidade').notNullable();
        table.string('uf').notNullable();
        table.integer('user_id').notNullable();

        table.foreign('user_id').references('id').inTable('users');
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('adresses');
  };