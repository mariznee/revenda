const dbKnex = require("../data/db_config");  // dados de conexão com o banco de dados

module.exports = {

    // LISTAGEM
    async index(req, res) {
        try {
            const carros = await dbKnex("carros").select("carros.id", "modelo", "foto", "ano", "preco", "destaque", 
                    "m.nome as marca", "u.nome as usuario")
                .innerJoin('marcas as m', 'marca_id', 'm.id')
                .innerJoin('usuarios as u', 'usuario_id', 'u.id');
            res.status(200).json(carros); // retorna statusCode ok e os dados
          } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg

        }
    },

    // INCLUSÃO
    async store(req, res) {
        // faz a desestruturação dos dados recebidos no corpo da requisição
        const { modelo, foto, ano, preco, marca_id, usuario_id } = req.body;
        // se algum dos campos não foi passado, irá enviar uma mensagem de erro e retornar
        if (!modelo || !foto || !ano || !preco || !marca_id || !usuario_id  ) {
            res.status(400).json({ msg: "Enviar: modelo, foto, ano, preco, usuario_id e marca_id" });
            return;
        }

        // caso ocorra algum erro na inclusão, o programa irá capturar (catch) o erro
        try {
            // insert, faz a inserção na tabela carros (e retorna o id do registro inserido)
            const novo = await dbKnex("carros").insert({ modelo, foto, ano, preco, marca_id, usuario_id });
            res.status(201).json({ id: novo[0] }); // statusCode indica Create
            // const novo = dbKnex("produtos").insert({ descricao, marca, quant, preco });
            // console.log(novo.toString())
        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },

    // ALTERAÇÃO
    async update(req, res) {
        const id = req.params.id; 
        // faz a desestruturação dos dados recebidos no corpo da requisição
        const { modelo, foto, ano, preco, marca_id, usuario_id } = req.body;
        // se algum dos campos não foi passado, irá enviar uma mensagem de erro e retornar
        if (!modelo || !foto || !ano || !preco || !marca_id || !usuario_id  ) {
            res.status(400).json({ msg: "Enviar: modelo, foto, ano, preco, usuario_id e marca_id" });
            return;
        }

        // caso ocorra algum erro na inclusão, o programa irá capturar (catch) o erro
        try {
            // insert, faz a inserção na tabela carros (e retorna o id do registro inserido)
            await dbKnex("carros").update({ modelo, foto, ano, preco, marca_id, usuario_id })
                    .where("id", id);
            res.status(200).json(); // statusCode indica Create
            // const novo = dbKnex("produtos").insert({ descricao, marca, quant, preco });
            // console.log(novo.toString())
        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },

    // EXCLUSÃO
    async destroy(req, res) {
        const { id } = req.params; 
        try {
          await dbKnex("carros").del().where({ id });
          res.status(200).json(); 
        } catch (error) {
          res.status(400).json({ msg: error.message }); 
        }
    },

    // ALTERAR O ATRIBUTO DESTAQUE - erro se não informar JSON
    async destaque(req, res) {
        const id = req.params.id; 
        dados = await dbKnex("carros").where({ id });

        if (dados[0].destaque) {
            try {
                await dbKnex("carros").update({ destaque: 0}).where({ id });
                res.status(200).json();
            } catch (error) {
                res.status(400).json({ msg: error.message });
            }
        } else {
            try {
                await dbKnex("carros").update({ destaque: 1}).where({ id });
                res.status(200).json();
            } catch (error) {
                res.status(400).json({ msg: error.message });
            }
        }
    },

    // LISTAGEM DOS CARROS DESTAQUE
    async destaques(req, res) {
        try {
            const carros = await dbKnex("carros").select("carros.id", "modelo", "foto", "ano", "preco", "destaque", "usuarios.id as usuario_id", "marcas.id as marca_id")
                      .innerJoin('usuarios', 'usuario_id', 'usuarios.id').innerJoin('marcas', 'marca_id', 'marcas.id').where({ destaque: 1});
            res.status(200).json(carros); // retorna statusCode ok e os dados
        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },

    // REAJUSTAR CARROS POR MARCA
    async reajuste(req, res) {
        const { marca_id, taxa } = req.params   
        if (req.params.marca_id) {
        try {
            await dbKnex("carros").update({preco: dbKnex.raw(`round(preco + (preco * ${taxa/100}),2)`)})
            .where("marca_id", marca_id)
            res.status(200).json();
        } catch (error) {
            res.status(400).json({ msg: error.message }); 
        }
        } else {
        try {
            await dbKnex("carros").update({preco: dbKnex.raw(`round(preco + (preco * ${taxa/100}),2)`)})
            res.status(200).json(); 
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
        }
    },

    //LISTAGEM POR FILTRO DE PREÇO 
    async filtro(req, res) {
        let minimo = 0;
        let maximo = 0;

        if (req.body.minimo) {
            minimo = req.body.minimo;
        }

        if (req.body.maximo) {
            minimo = req.body.maximo;
        }

        if (minimo == 0 && maximo == 0) {
            res.status(400).json({ msg: "Enviar preço mínimo e/ou máximo do carro para pesquisa."});
            return;
        }

        let carros;
        if (maximo) {
            try {
                carros = await dbKnex("carros").select("carros.id", "modelo", "foto", "ano", "preco", "destaque", 
                "m.nome as marca", "u.nome as usuario")
            .innerJoin('marcas as m', 'marca_id', 'm.id')
            .innerJoin('usuarios as u', 'usuario_id', 'u.id')
            .where("preco", ">=", minimo)
            .andWhere("preco", "<=", maximo);
            } catch (error) {
                res.status(400).json({ msg: error.message }); 
                return
            }    
        } else {
            try {
                carros = await dbKnex("carros").select("carros.id", "modelo", "foto", "ano", "preco", "destaque", 
                "m.nome as marca", "u.nome as usuario")
            .innerJoin('marcas as m', 'marca_id', 'm.id')
            .innerJoin('usuarios as u', 'usuario_id', 'u.id')
            .where("preco", ">=", minimo);
            } catch (error) {
                res.status(400).json({ msg: error.message }); 
                return
            }
        }
        res.status(200).json(carros);
    },

    //LISTAGEM POR FILTRO DE PALAVRA
    async palavra(req, res) {
        const { palavra } = req.params;
        try {
          const carros = await dbKnex("carros").select("carros.id", "modelo", "foto", "ano", "preco", "destaque", 
                "m.nome as marca", "u.nome as usuario")
            .innerJoin('marcas as m', 'marca_id', 'm.id')
            .innerJoin('usuarios as u', 'usuario_id', 'u.id')
            .where("m.nome", "like", `%${palavra}%`)
            .orWhere("modelo", "like", `%${palavra}%`)
          res.status(200).json(carros); 
        } catch (error) {
          res.status(400).json({ msg: error.message }); 
        }
    },

    //LISTAGEM DE CARROS POR MARCA
    async marcas_num(req, res) {
        try {
            const resumoMarca = await dbKnex("carros").select("m.nome as marca")
                .innerJoin('marcas as m', 'marca_id', 'm.id')
                .count({ num: "carros.id" }).groupBy("m.id");
                res.status(200).json({ resumoMarca });
        } catch (error) {
            res.status(400).json({ msg: error.message }); 
        }
    },


    //LISTAGEM DE CARROS POR ANO DE CADASTRO
    async anosCadastro(req, res){
        try {
            const carros = await dbKnex("carros")
                .select(dbKnex.raw("strftime('%Y', created_at) as ano")).count({ num: "id" }).groupBy("ano");
            res.status(200).json(carros);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },


    // LISTAGEM DE CARROS POR ID
    async show(req, res) {
        const { id } = req.params;       
        try {
            const carro = await dbKnex("carros").select("carros.id", "modelo", "foto", "ano", "preco", "destaque", 
                    "m.nome as marca", "u.nome as usuario")
                .innerJoin('marcas as m', 'marca_id', 'm.id')
                .innerJoin('usuarios as u', 'usuario_id', 'u.id').where("carros.id", id);
            res.status(200).json(carro[0]); // retorna statusCode ok e os dados
        } catch (error) {
            res.status(400).json({ msg: error.message }); 
        }
    }

};
