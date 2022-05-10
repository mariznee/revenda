exports.up = function (knex) {
    return knex.schema.createTable("carros", (table) => {
        table.increments();
        table.string("modelo", 80).notNullable();
        table.string("foto").notNullable();
        table.integer("ano", 4).notNullable();
        table.decimal("preco", 9.2).notNullable();
        table.boolean("destaque").notNullable().defaultTo(false);

        table.integer("usuario_id").notNullable().unsigned();
        table.foreign("usuario_id").references("usuarios.id")
            .onDelete("restrict").onUpdate("cascade");

        table.integer("marca_id").notNullable().unsigned();
        table.foreign("marca_id").references("marcas.id")
            .onDelete("restrict").onUpdate("cascade");

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("carros");
};

