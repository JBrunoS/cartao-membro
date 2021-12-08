exports.up = function(knex) {
    return knex.schema.createTable('images', function(table){
        table.increments().primary();
        table.string('nome').notNullable();
        table.string('key').notNullable();
        table.integer('size').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.integer('user_id').notNullable();
        
        table.foreign('user_id').references('id').inTable('users');
        
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('images');
  };