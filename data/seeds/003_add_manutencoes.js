exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('manutencoes').del()
  await knex('manutencoes').insert([
    {servicoDesc: 'Polimento', custo: 350.00, prestador: "Michel Lessa Car Detail", garantiaMeses: 1, prazoDias: 2, carro_id: 3 },
    {servicoDesc: 'Troca de pneus', custo: 1200.00, prestador: "Mecânica Lisboa", garantiaMeses: 6, prazoDias: 2, carro_id: 2 },
    {servicoDesc: 'Troca de estofados', custo: 2750.00, prestador: "Estofados Danemberg", garantiaMeses: 12, prazoDias: 2, carro_id: 2 },
    {servicoDesc: 'Troca de para-brisa', custo: 1600.00, prestador: "Continental Auto Peças", garantiaMeses: 2, prazoDias: 2, carro_id: 1 }
  ]);
};

