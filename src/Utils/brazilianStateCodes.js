// https://github.com/datasets-br/state-codes/blob/master/data/br-state-codes.csv

// Following States has been filtered out
// 'Fernando de Noronha'
// 'Guanabara'
// 'Guaporé'
// 'Ponta Porã'
// 'Rio Branco'
// 'Guanabara'
// 'Iguaçu'

// stripe accepts ISO_3166-2:BR[https://en.wikipedia.org/wiki/ISO_3166-2:BR] state codes.

const BRAZILIAN_STATES = [
  { name: "Acre", id: 1, code: "AC" },
  { name: "Alagoas", id: 2, code: "AL" },
  { name: "Amapá", id: 3, code: "AP" },
  { name: "Amazonas", id: 4, code: "AM" },
  { name: "Bahia", id: 5, code: "BA" },
  { name: "Ceará", id: 6, code: "CE" },
  { name: "Distrito Federal", id: 7, code: "DF" },
  { name: "Espírito Santo", id: 8, code: "ES" },
  { name: "Goiás", id: 9, code: "GO" },
  { name: "Maranhão", id: 10, code: "MA" },
  { name: "Mato Grosso", id: 11, code: "MT" },
  { name: "Mato Grosso do Sul", id: 12, code: "MS" },
  { name: "Minas Gerais", id: 13, code: "MG" },
  { name: "Pará", id: 14, code: "PA" },
  { name: "Paraíba", id: 15, code: "PB" },
  { name: "Paraná", id: 16, code: "PR" },
  { name: "Pernambuco", id: 17, code: "PE" },
  { name: "Piauí", id: 18, code: "PI" },
  { name: "Rio de Janeiro", id: 19, code: "RJ" },
  { name: "Rio Grande do Norte", id: 20, code: "RN" },
  { name: "Rio Grande do Sul", id: 21, code: "RS" },
  { name: "Rondônia", id: 22, code: "RO" },
  { name: "Roraima", id: 23, code: "RR" },
  { name: "Santa Catarina", id: 24, code: "SC" },
  { name: "São Paulo", id: 25, code: "SP" },
  { name: "Sergipe", id: 26, code: "SE" },
  { name: "Tocantins", id: 27, code: "TO" },
];

export default BRAZILIAN_STATES;
