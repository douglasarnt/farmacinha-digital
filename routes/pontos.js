const router = require('express').Router();
const PontoColeta = require('../models/PontoColeta');
const { wrap, escapeRegex, listaErros } = require('../utils/helpers');

const TIPOS = ['Farmácia', 'Órgão público', 'Posto de saúde', 'Outro'];

function lerForm(b) {
  return {
    nome: b.nome,
    tipo: b.tipo,
    endereco: b.endereco,
    funcionamento: b.funcionamento,
    telefone: b.telefone,
    orientacoes: b.orientacoes,
    ativo: b.ativo === 'on',
  };
}

// LISTAR + PESQUISAR/FILTRAR
router.get(
  '/',
  wrap(async (req, res) => {
    const { q = '', tipo = '', ativo = '' } = req.query;
    const filtro = {};
    if (q.trim()) filtro.nome = new RegExp(escapeRegex(q.trim()), 'i');
    if (tipo) filtro.tipo = tipo;
    if (ativo === 'sim') filtro.ativo = true;
    if (ativo === 'nao') filtro.ativo = false;

    const itens = await PontoColeta.find(filtro).sort({ nome: 1 });
    res.render('pontos/index', { titulo: 'Pontos de coleta', itens, q, tipo, ativo, TIPOS });
  })
);

router.get('/novo', (req, res) => {
  res.render('pontos/form', { titulo: 'Novo ponto de coleta', item: { ativo: true }, erros: null, editando: false, TIPOS });
});

router.post(
  '/',
  wrap(async (req, res) => {
    try {
      await PontoColeta.create(lerForm(req.body));
      res.redirect('/pontos?msg=Ponto de coleta cadastrado com sucesso.');
    } catch (err) {
      const erros = listaErros(err);
      if (!erros) throw err;
      res.status(400).render('pontos/form', { titulo: 'Novo ponto de coleta', item: lerForm(req.body), erros, editando: false, TIPOS });
    }
  })
);

router.get(
  '/:id',
  wrap(async (req, res) => {
    const item = await PontoColeta.findById(req.params.id);
    if (!item) return res.status(404).render('erro', { titulo: 'Não encontrado', erro: 'Ponto de coleta não encontrado.' });
    res.render('pontos/show', { titulo: item.nome, item });
  })
);

router.get(
  '/:id/editar',
  wrap(async (req, res) => {
    const item = await PontoColeta.findById(req.params.id);
    if (!item) return res.status(404).render('erro', { titulo: 'Não encontrado', erro: 'Ponto de coleta não encontrado.' });
    res.render('pontos/form', { titulo: 'Editar ponto de coleta', item, erros: null, editando: true, TIPOS });
  })
);

router.put(
  '/:id',
  wrap(async (req, res) => {
    const item = await PontoColeta.findById(req.params.id);
    if (!item) return res.status(404).render('erro', { titulo: 'Não encontrado', erro: 'Ponto de coleta não encontrado.' });
    try {
      item.set(lerForm(req.body));
      await item.save();
      res.redirect('/pontos?msg=Ponto de coleta atualizado com sucesso.');
    } catch (err) {
      const erros = listaErros(err);
      if (!erros) throw err;
      res.status(400).render('pontos/form', {
        titulo: 'Editar ponto de coleta', item: { _id: item._id, ...lerForm(req.body) }, erros, editando: true, TIPOS,
      });
    }
  })
);

router.delete(
  '/:id',
  wrap(async (req, res) => {
    await PontoColeta.findByIdAndDelete(req.params.id);
    res.redirect('/pontos?msg=Ponto de coleta excluído.');
  })
);

module.exports = router;
