
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table){
      table.increments().primary();
      table.string('nome').notNullable();
      table.string('estado_civil').notNullable();
      table.string('cpf').notNullable();
      table.string('rg').notNullable();
      table.string('sexo').notNullable();
      table.string('filiacao').notNullable();
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
