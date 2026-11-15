const mongoose = require('mongoose');

const pontoColetaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: [true, 'Informe o nome do ponto de coleta.'], trim: true },
    tipo: { type: String, required: [true, 'Informe o tipo.'], trim: true },
    endereco: { type: String, required: [true, 'Informe o endereço.'], trim: true },
    funcionamento: { type: String, trim: true },
    telefone: { type: String, trim: true },
    orientacoes: { type: String, trim: true }, // opcional: como descartar, em linguagem simples
    ativo: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PontoColeta', pontoColetaSchema);
