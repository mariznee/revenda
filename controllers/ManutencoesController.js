const dbKnex = require("../data/db_config");  // dados de conexão com o banco de dados

module.exports = {

    // LISTAGEM
    async index(req, res) {
        try {
            const manut = await dbKnex("manutencoes").select("manutencoes.id", "servicoDesc", "custo", "prestador", "garantiaMeses", 
                    "manutencoes.created_at", "manutencoes.updated_at", "prazoDias", "c.modelo as carro")
                .innerJoin('carros as c', 'carro_id', 'c.id');
            res.status(200).json(manut); // retorna statusCode ok e os dados
          } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg

        }
    },

    // INCLUSÃO
    async store(req, res) {
        const { servicoDesc, custo, prestador, garantiaMeses, carro_id, prazoDias } = req.body;
        if (!servicoDesc || !custo || !prestador || !garantiaMeses || !carro_id || !prazoDias  ) {
            res.status(400).json({ msg: "Enviar: descricão do servico, custo, prestador, garantia em meses, carro_id, prazo para realização em dias" });
            return;
        }

        try {
            const novo = await dbKnex("manutencoes").insert({ servicoDesc, custo, prestador, garantiaMeses, carro_id, prazoDias });
            res.status(201).json({ id: novo[0] }); 
        } catch (error) {
            res.status(400).json({ msg: error.message }); 
        }
    },

    // ALTERAÇÃO
    async update(req, res) {
        const id = req.params.id; 
        const { servicoDesc, custo, prestador, garantiaMeses, carro_id, prazoDias } = req.body;
        if (!servicoDesc || !custo || !prestador || !garantiaMeses || !carro_id || !prazoDias  ) {
            res.status(400).json({ msg: "Enviar: descricão do servico, custo, prestador, garantia em meses, carro_id, prazo para realização em dias" });
            return;
        }

        try {
            await dbKnex("manutencoes").update({ servicoDesc, custo, prestador, garantiaMeses, carro_id, prazoDias })
                    .where("id", id);
            res.status(200).json(); 
        } catch (error) {
            res.status(400).json({ msg: error.message }); 
        }
    },

    // EXCLUSÃO
    async destroy(req, res) {
        const { id } = req.params; 
        try {
          await dbKnex("manutencoes").del().where({ id });
          res.status(200).json(); 
        } catch (error) {
          res.status(400).json({ msg: error.message }); 
        }
    },

    // ESTATÍSTICAS
    async dados(req, res) {
        try {
            const estatisticas = await dbKnex("manutencoes").select("servicoDesc").count({ num: "id" })
                .sum({ total_custo: "custo" }).min({ menor_custo: "custo"}).max({ maior_custo: "custo" })
                .avg({ media: "custo" }).groupBy("servicoDesc");
            res.status(200).json({ estatisticas });
    
        } catch (error) {
            res.status(400).json({ msg: error.message }); 
        }
    }

}