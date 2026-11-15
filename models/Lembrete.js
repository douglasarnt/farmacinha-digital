const mongoose = require('mongoose');

const lembreteSchema = new mongoose.Schema(
  {
    medicamento: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicamento', required: [true, 'Escolha o medicamento.'] },
    horario: {
      type: String,
      required: [true, 'Informe o horário.'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário inválido (use HH:MM).'],
    },
    frequencia: { type: String, required: [true, 'Informe a frequência.'], trim: true },
    observacao: { type: String, trim: true },
    ativo: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lembrete', lembreteSchema);
