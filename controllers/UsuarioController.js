const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config()

const dbKnex = require("../data/db_config");  // dados de conexão com o banco de dados

const saltRounds = 10;

module.exports = {

    // LISTAGEM
    async index(req, res) {
        try {
            // para obter os produtos pode-se utilizar .select().orderBy() ou apenas .orderBy()
            const usuarios = await dbKnex("usuarios");
            res.status(200).json(usuarios); // retorna statusCode ok e os dados
          } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg

          }
    },

    // INCLUSÃO
    async store(req, res) {
        // faz a desestruturação dos dados recebidos no corpo da requisição
        const { nome, email, senha } = req.body;

        // se algum dos campos não foi passado, irá enviar uma mensagem de erro e retornar
        if (!nome || !email || !senha) {
            res.status(400).json({ msg: "Enviar nome, email e senha do usuário" });
            return;
        }

        // verifica se o e-mail já está cadastrado
        try {
            const dados = await dbKnex("usuarios").where({ email });
            if (dados.length) {
                res.status(400).json({ erro: "E-mail já cadastrado"})
                return;
            }
        } catch {
            res.status(400).json({ erro: error.message });
            return;
        };

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(senha, salt);

        //console.log(salt)
        //console.log(hash)


        // caso ocorra algum erro na inclusão, o programa irá capturar (catch) o erro
        try {
            // insert, faz a inserção na tabela usuarios (e retorna o id do registro inserido)
            const novo = await dbKnex("usuarios").insert({ nome, email, senha: hash });
            res.status(201).json({ id: novo[0] }); // statusCode indica Create
            // const novo = dbKnex("produtos").insert({ descricao, marca, quant, preco });
            // console.log(novo.toString())

        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },


    // LOGIN
    async login(req, res) {
        // faz a desestruturação dos dados recebidos no corpo da requisição
        const { email, senha } = req.body;

        // se algum dos campos não foi passado, irá enviar uma mensagem de erro e retornar
        if ( !email || !senha) {
           // res.status(400).json({ msg: "Enviar email e senha do usuário" });
            res.status(400).json({ msg: "Login/Senha Incorretos." });
            return;
        }

        // caso ocorra algum erro na inclusao o programa irá capturar (catch) o erro
        try {
            const dados = await dbKnex("usuarios").where({ email });
            if (dados.length == 0) {
                //res.status(400).json({ msg: "E-mail não cadastrado" });
                res.status(400).json({ msg: "Login/Senha Incorretos." });
                return;
            }

            if (bcrypt.compareSync(senha, dados[0].senha)) {

                const token = jwt.sign({
                    usuario_id: dados[0].id,
                    usuario_nome: dados[0].nome
                },
                    process.env.JWT_KEY,
                    {expiresIn: "1h"}
                );

                res.status(200).json({token, usuario_id: dados[0].id, usuario_nome: dados[0].nome});
            } else {
                res.status(400).json({ msg: "Login/Senha Incorretos." });
            }
            
        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },

    async senhas(req, res) {
        res.status(200).json({senhas: "123Ok"});
    },

    // ALTERAÇÃO
    async update(req, res) {
        const id = req.params.id; 
        // faz a desestruturação dos dados recebidos no corpo da requisição
        const { nome, email, senha } = req.body;
        // se algum dos campos não foi passado, irá enviar uma mensagem de erro e retornar
        if (!nome || !email || !senha ) {
            res.status(400).json({ msg: "Enviar: nome, email e senha" });
            return;
        }

        // caso ocorra algum erro na inclusão, o programa irá capturar (catch) o erro
        try {
            // insert, faz a inserção na tabela usuarios (e retorna o id do registro inserido)
            await dbKnex("usuarios").update({ nome, email, senha })
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
        await dbKnex("usuarios").del().where({ id });
        res.status(200).json(); 
        } catch (error) {
        res.status(400).json({ msg: error.message }); 
        }
    }
};