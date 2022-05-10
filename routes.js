const express = require("express");

const routes = express.Router();

const UsuarioController = require("./controllers/UsuarioController");
const MarcasController = require("./controllers/MarcasController");
const CarrosController = require("./controllers/CarrosController");
const ManutencoesController = require("./controllers/ManutencoesController");

const login = require("./middlewares/login");

routes.get("/usuarios", UsuarioController.index)
      .post("/usuarios", UsuarioController.store)
      .post("/login", UsuarioController.login)
      .get("/senhas", login, UsuarioController.senhas)
      .put("/usuarios/:id", UsuarioController.update)
      .delete("/usuarios/:id", UsuarioController.destroy);

      
routes.get("/carros", CarrosController.index)
      .post("/carros", CarrosController.store)
      .put("/carros/:id", CarrosController.update)
      .delete("/carros/:id", CarrosController.destroy)

      .put("/carros/destaque/:id", CarrosController.destaque)
      .get("/carros/destaques", CarrosController.destaques)

      .put("/carros/reajuste/:taxa/:marca_id?", CarrosController.reajuste)

      .get("/carros/filtro-preco", CarrosController.filtro)
      .get("/carros/filtro/:palavra", CarrosController.palavra)

      .get("/carros/marcas-num", CarrosController.marcas_num)
      .get("/carros/anos-cad", CarrosController.anosCadastro)

      .get("/carros/:id", CarrosController.show);


routes.get("/marcas", MarcasController.index)
      .post("/marcas", MarcasController.store);


routes.get("/manutencoes", ManutencoesController.index)
      .get("/manutencoes/estatisticas", ManutencoesController.dados)
      .post("/manutencoes", ManutencoesController.store)
      .put("/manutencoes/:id", ManutencoesController.update)
      .delete("/manutencoes/:id", ManutencoesController.destroy);

module.exports = routes;