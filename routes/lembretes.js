const router = require('express').Router();
const Lembrete = require('../models/Lembrete');
const Medicamento = require('../models/Medicamento');
const { wrap, escapeRegex, listaErros } = require('../utils/helpers');

const FREQUENCIAS = ['Diária', 'Dias alternados', 'Semanal', 'Quando necessário'];

function lerForm(b) {
  return {
    medicamento: b.medicamento || undefined,
    horario: b.horario,
    frequencia: b.frequencia,
    observacao: b.observacao,
    ativo: b.ativo === 'on',
  };
}

const listarMedicamentos = () => Medicamento.find({ descartado: false }).sort({ nome: 1 });

// LISTAR + PESQUISAR/FILTRAR
router.get(
  '/',
  wrap(async (req, res) => {
    const { q = '', faixa = '', ativo = '' } = req.query;
    const filtro = {};

    // pesquisa pelo NOME do medicamento
    if (q.trim()) {
      const ids = await Medicamento.find({ nome: new RegExp(escapeRegex(q.trim()), 'i') }).distinct('_id');
      filtro.medicamento = { $in: ids };
    }
    // filtro por faixa de horário (HH:MM compara bem como texto)
    if (faixa === 'manha') filtro.horario = { $gte: '05:00', $lt: '12:00' };
    if (faixa === 'tarde') filtro.horario = { $gte: '12:00', $lt: '18:00' };
    if (faixa === 'noite') filtro.$or = [{ horario: { $gte: '18:00' } }, { horario: { $lt: '05:00' } }];
    if (ativo === 'sim') filtro.ativo = true;
    if (ativo === 'nao') filtro.ativo = false;

    const itens = await Lembrete.find(filtro).populate('medicamento', 'nome dosagem').sort({ horario: 1 });
    res.render('lembretes/index', { titulo: 'Lembretes', itens, q, faixa, ativo });
  })
);

// FORMULÁRIO NOVO
router.get(
  '/novo',
  wrap(async (req, res) => {
    const medicamentos = await listarMedicamentos();
    res.render('lembretes/form', {
      titulo: 'Novo lembrete', item: { ativo: true, medicamento: req.query.medicamento }, erros: null, editando: false, medicamentos, FREQUENCIAS,
    });
  })
);

// CRIAR
router.post(
  '/',
  wrap(async (req, res) => {
    try {
      await Lembrete.create(lerForm(req.body));
      res.redirect('/lembretes?msg=Lembrete cadastrado com sucesso.');
    } catch (err) {
      const erros = listaErros(err);
      if (!erros) throw err;
      const medicamentos = await listarMedicamentos();
      res.status(400).render('lembretes/form', {
        titulo: 'Novo lembrete', item: lerForm(req.body), erros, editando: false, medicamentos, FREQUENCIAS,
      });
    }
  })
);

// VISUALIZAR
router.get(
  '/:id',
  wrap(async (req, res) => {
    const item = await Lembrete.findById(req.params.id).populate('medicamento');
    if (!item) return res.status(404).render('erro', { titulo: 'Não encontrado', erro: 'Lembrete não encontrado.' });
    res.render('lembretes/show', { titulo: 'Lembrete', item });
  })
);

// FORMULÁRIO EDITAR
router.get(
  '/:id/editar',
  wrap(async (req, res) => {
    const item = await Lembrete.findById(req.params.id);
    if (!item) return res.status(404).render('erro', { titulo: 'Não encontrado', erro: 'Lembrete não encontrado.' });
    const medicamentos = await Medicamento.find().sort({ nome: 1 });
    res.render('lembretes/form', { titulo: 'Editar lembrete', item, erros: null, editando: true, medicamentos, FREQUENCIAS });
  })
);

// ATUALIZAR
router.put(
  '/:id',
  wrap(async (req, res) => {
    const item = await Lembrete.findById(req.params.id);
    if (!item) return res.status(404).render('erro', { titulo: 'Não encontrado', erro: 'Lembrete não encontrado.' });
    try {
      item.set(lerForm(req.body));
      await item.save();
      res.redirect('/lembretes?msg=Lembrete atualizado com sucesso.');
    } catch (err) {
      const erros = listaErros(err);
      if (!erros) throw err;
      const medicamentos = await Medicamento.find().sort({ nome: 1 });
      res.status(400).render('lembretes/form', {
        titulo: 'Editar lembrete', item: { _id: item._id, ...lerForm(req.body) }, erros, editando: true, medicamentos, FREQUENCIAS,
      });
    }
  })
);

// EXCLUIR
router.delete(
  '/:id',
  wrap(async (req, res) => {
    await Lembrete.findByIdAndDelete(req.params.id);
    res.redirect('/lembretes?msg=Lembrete excluído.');
  })
);

module.exports = router;
