exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('carros').del()
  await knex('carros').insert([
    {modelo: 'Sandero', foto: "https://quatrorodas.abril.com.br/wp-content/uploads/2022/01/DSCF0335.jpg", ano: "2019", preco: 49500, marca_id: 3, usuario_id: 1 },
    {modelo: 'Gol', foto: "https://cdn.motor1.com/images/mgl/o3M6L/s1/gol.jpg", ano: "2021", preco: 52900, marca_id: 5, usuario_id: 2 },
    {modelo: 'Palio', foto: "https://autoo.com.br/fotos/2016/3/960_720/Pfire_22032016_1777_960_720.jpg", ano: "2018", preco: 32800, marca_id: 4, usuario_id: 1 }
  ]);
};

