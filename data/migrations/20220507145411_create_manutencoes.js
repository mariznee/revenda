exports.up = function (knex) {

    return knex.schema.createTable("manutencoes", (table) => {
        table.increments();
        table.string("servicoDesc", 100).notNullable();
        table.decimal("custo", 9.2).notNullable();
        table.string("prestador", 80).notNullable();
        table.integer("garantiaMeses", 2).notNullable();
        table.integer("prazoDias", 2).notNullable();
        
        table.integer("carro_id").notNullable().unsigned();
        table.foreign("carro_id").references("carros.id")
            .onDelete("restrict").onUpdate("cascade");

        table.timestamps(true, true);
    });
};


exports.down = function (knex) {
    return knex.schema.dropTable("manutencoes");
};

