exports.up = function (knex) {

    return knex.schema.createTable("usuarios", (table) => {
        table.increments();
        table.string("nome", 80).notNullable();
        table.string("email", 80).unique().notNullable();
        table.string("senha", 60).notNullable();
        table.timestamps(true, true);
    });
};


exports.down = function (knex) {
    return knex.schema.dropTable("usuarios");
};