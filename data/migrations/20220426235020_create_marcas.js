exports.up = function (knex) {

    return knex.schema.createTable("marcas", (table) => {
        table.increments();
        table.string("nome", 40).notNullable();
        
    });
};


exports.down = function (knex) {
    return knex.schema.dropTable("marcas");
};
