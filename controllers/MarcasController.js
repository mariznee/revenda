// const bcrypt = require('bcrypt');
// const jwt = require("jsonwebtoken");
// require('dotenv').config()

const dbKnex = require("../data/db_config");  // dados de conexão com o banco de dados

module.exports = {

    // LISTAGEM
    async index(req, res) {
        try {
            // para obter os produtos pode-se utilizar .select().orderBy() ou apenas .orderBy()
            const marcas = await dbKnex("marcas");
            res.status(200).json(marcas); // retorna statusCode ok e os dados
          } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg

          }
    },

    // INCLUSÃO
    async store(req, res) {
        // faz a desestruturação dos dados recebidos no corpo da requisição
        const { nome } = req.body;

        // se algum dos campos não foi passado, irá enviar uma mensagem de erro e retornar
        if (!nome) {
            res.status(400).json({ msg: "Enviar nome da marca." });
            return;
        }

        try {
            const dados = await dbKnex("marcas").where({ nome });
            if (dados.length) {
                res.status(400).json({ erro: "Marca já cadastrada"})
                return;
            }
        } catch {
            res.status(400).json({ erro: error.message });
            return;
        };

      
        // caso ocorra algum erro na inclusão, o programa irá capturar (catch) o erro
        try {
            // insert, faz a inserção na tabela usuarios (e retorna o id do registro inserido)
            const novo = await dbKnex("marcas").insert({ nome });
            res.status(201).json({ id: novo[0] }); // statusCode indica Create
            // const novo = dbKnex("produtos").insert({ descricao, marca, quant, preco });
            // console.log(novo.toString())

        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },

};