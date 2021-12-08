
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table){
      table.increments().primary();
      table.string('nome').notNullable();
      table.string('estado_civil').notNullable();
      table.string('cpf').notNullable();
      table.string('rg').notNullable();
      table.string('filiacao').notNullable();
      table.string('data_nascimento').notNullable();
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
