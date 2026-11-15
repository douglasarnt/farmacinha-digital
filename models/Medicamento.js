const mongoose = require('mongoose');

const medicamentoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: [true, 'Informe o nome do medicamento.'], trim: true },
    dosagem: { type: String, required: [true, 'Informe a dosagem (ex.: 50 mg).'], trim: true },
    validade: { type: Date, required: [true, 'Informe a data de validade.'] },
    quantidade: { type: Number, min: [0, 'A quantidade não pode ser negativa.'] },
    descartado: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medicamento', medicamentoSchema);
