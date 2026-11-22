require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/db');
const datas = require('./utils/datas');

const app = express();

// Motor de views (EJS) + layout padrão
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Leitura de formulários e suporte a PUT/DELETE via ?_method=
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Funções de data disponíveis em todas as views
app.locals.fmtData = datas.fmtData;
app.locals.inputData = datas.inputData;
app.locals.statusValidade = datas.statusValidade;

// Variáveis disponíveis em todas as views
app.use((req, res, next) => {
  res.locals.msg = req.query.msg || null;
  res.locals.tipoMsg = req.query.tipo || 'success';
  res.locals.pagina = req.path.split('/')[1] || 'dashboard';
  res.locals.hoje = datas.hojeBR();
  next();
});

// Rotas
app.use('/', require('./routes/dashboard'));
app.use('/medicamentos', require('./routes/medicamentos'));
app.use('/lembretes', require('./routes/lembretes'));
app.use('/pontos', require('./routes/pontos'));

// 404
app.use((req, res) => {
  res.status(404).render('erro', { titulo: 'Página não existe', erro: 'O endereço acessado não foi encontrado.' });
});

// Erros gerais
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'CastError') {
    return res.status(404).render('erro', { titulo: 'Registro não encontrado', erro: 'O registro solicitado não existe.' });
  }
  res.status(500).render('erro', { titulo: 'Erro no servidor', erro: err.message });
});

module.exports = app;

// Só sobe o servidor quando executado diretamente (node server.js)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Farmacinha Digital rodando na porta ${PORT}`));
  });
}
