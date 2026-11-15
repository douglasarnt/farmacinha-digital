const router = require('express').Router();
const Medicamento = require('../models/Medicamento');
const Lembrete = require('../models/Lembrete');
const PontoColeta = require('../models/PontoColeta');
const { wrap } = require('../utils/helpers');
const { maisDias } = require('../utils/datas');

router.get(
  '/',
  wrap(async (req, res) => {
    const hoje = res.locals.hoje;
    const limite = maisDias(hoje, 30);

    const [totalMed, vencidos, aVencer, lembretesAtivos, pontosAtivos, proximos] = await Promise.all([
      Medicamento.countDocuments({ descartado: false }),
      Medicamento.countDocuments({ descartado: false, validade: { $lt: hoje } }),
      Medicamento.countDocuments({ descartado: false, validade: { $gte: hoje, $lte: limite } }),
      Lembrete.countDocuments({ ativo: true }),
      PontoColeta.countDocuments({ ativo: true }),
      Medicamento.find({ descartado: false, validade: { $lte: limite } }).sort({ validade: 1 }).limit(5),
    ]);

    res.render('dashboard', {
      titulo: 'Painel',
      totalMed, vencidos, aVencer, lembretesAtivos, pontosAtivos, proximos,
    });
  })
);

module.exports = router;
