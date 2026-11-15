// Encaminha erros de funções async para o tratador de erros do Express
exports.wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Evita que caracteres especiais digitados na busca quebrem a expressão regular
exports.escapeRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Converte as mensagens de validação do Mongoose em uma lista simples
exports.listaErros = (err) =>
  err.name === 'ValidationError' ? Object.values(err.errors).map((e) => e.message) : null;
