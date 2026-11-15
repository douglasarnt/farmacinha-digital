// Popula o banco com dados de exemplo: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Medicamento = require('./models/Medicamento');
const Lembrete = require('./models/Lembrete');
const PontoColeta = require('./models/PontoColeta');
const { hojeBR, maisDias } = require('./utils/datas');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([Medicamento.deleteMany(), Lembrete.deleteMany(), PontoColeta.deleteMany()]);
  const hoje = hojeBR();

  const [losartana, dipirona, amoxicilina] = await Medicamento.insertMany([
    { nome: 'Losartana', dosagem: '50 mg', validade: maisDias(hoje, 400), quantidade: 30 },
    { nome: 'Dipirona', dosagem: '500 mg', validade: maisDias(hoje, 15), quantidade: 10 },
    { nome: 'Amoxicilina', dosagem: '500 mg', validade: maisDias(hoje, -40), quantidade: 6 },
  ]);

  await Lembrete.insertMany([
    { medicamento: losartana._id, horario: '08:00', frequencia: 'Diária', observacao: 'Tomar após o café da manhã' },
    { medicamento: losartana._id, horario: '20:00', frequencia: 'Diária' },
    { medicamento: dipirona._id, horario: '14:00', frequencia: 'Quando necessário', ativo: false },
  ]);

  await PontoColeta.insertMany([
    { nome: 'Agafarma', tipo: 'Farmácia', endereco: 'Endereço a confirmar – Sobradinho/RS', funcionamento: 'Seg a Sex, 8h às 18h', orientacoes: 'Leve o medicamento na embalagem original.' },
    { nome: 'Secretaria Municipal de Saúde', tipo: 'Órgão público', endereco: 'Endereço a confirmar – Sobradinho/RS', funcionamento: 'Seg a Sex, 8h às 17h' },
  ]);

  console.log('Dados de exemplo inseridos.');
  await mongoose.disconnect();
})();
