const router = require('express').Router();
const Medicamento = require('../models/Medicamento');
const Lembrete = require('../models/Lembrete');
const { wrap, escapeRegex, listaErros } = require('../utils/helpers');
const { maisDias } = require('../utils/datas');

// Converte o que veio do formulário para o formato do model
function lerForm(b) {
  return {
    nome: b.nome,
    dosagem: b.dosagem,
    validade: b.validade || undefined,
    quantidade: b.quantidade === '' || b.quantidade === undefined ? undefined : b.quantidade,
    descartado: b.descartado === 'on',
  };
}

// LISTAR + PESQUISAR/FILTRAR
router.get(
  '/',
  wrap(async (req, res) => {
    const { q = '', validade = '', descartado = '' } = req.query;
    const hoje = res.locals.hoje;
    const filtro = {};

    if (q.trim()) filtro.nome = new RegExp(escapeRegex(q.trim()), 'i');
    if (validade === 'vencidos') filtro.validade = { $lt: hoje };
    if (validade === 'avencer') filtro.validade = { $gte: hoje, $lte: maisDias(hoje, 30) };
    if (descartado === 'sim') filtro.descartado = true;
    if (descartado === 'nao') filtro.descartado = false;

    const itens = await Medicamento.find(filtro).sort({ validade: 1 });
    res.render('medicamentos/index', { titulo: 'Medicamentos', itens, q, validade, descartado });
  })
);

// FORMULÁRIO NOVO
router.get('/novo', (req, res) => {
  res.render('medicamentos/form', { titulo: 'Novo medicamento', item: { descartado: false }, erros: null, editando: false });
});

// CRIAR
router.post(
  '/',
  wrap(async (req, res) => {
    try {
      await Medicamento.create(lerForm(req.body));
      res.redirect('/medicamentos?msg=Medicamento cadastrado com sucesso.');
    } catch (err) {
      const erros = listaErros(err);
      if (!erros) throw err;
      res.status(400).render('medicamentos/form', { titulo: 'Novo medicamento', item: lerForm(req.body), erros, editando: false });
    }
  })
);

// VISUALIZAR
router.get(
  '/:id',
  wrap(async (req, res) => {
    const item = await Medicamento.findById(req.params.id);
    if (!item) return res.status(404).render('erro', { titulo: 'Não encontrado', erro: 'Medicamento não encontrado.' });
    const lembretes = await Lembrete.find({ medicamento: item._id }).sort({ horario: 1 });
    res.render('medicamentos/show', { titulo: item.nome, item, lembretes });
  })
);

// FORMULÁRIO EDITAR
router.get(
  '/:id/editar',
  wrap(async (req, res) => {
    const item = await Medicamento.findById(req.params.id);
    if (!item) return res.status(404).render('erro', { titulo: 'Não encontrado', erro: 'Medicamento não encontrado.' });
    res.render('medicamentos/form', { titulo: 'Editar medicamento', item, erros: null, editando: true });
  })
);

// ATUALIZAR
router.put(
  '/:id',
  wrap(async (req, res) => {
    const item = await Medicamento.findById(req.params.id);
    if (!item) return res.status(404).render('erro', { titulo: 'Não encontrado', erro: 'Medicamento não encontrado.' });
    try {
      item.set(lerForm(req.body));
      await item.save();
      res.redirect('/medicamentos?msg=Medicamento atualizado com sucesso.');
    } catch (err) {
      const erros = listaErros(err);
      if (!erros) throw err;
      res.status(400).render('medicamentos/form', {
        titulo: 'Editar medicamento', item: { _id: item._id, ...lerForm(req.body) }, erros, editando: true,
      });
    }
  })
);

// EXCLUIR (e os lembretes ligados a ele)
router.delete(
  '/:id',
  wrap(async (req, res) => {
    await Lembrete.deleteMany({ medicamento: req.params.id });
    await Medicamento.findByIdAndDelete(req.params.id);
    res.redirect('/medicamentos?msg=Medicamento excluído.');
  })
);

module.exports = router;
