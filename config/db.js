const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('ERRO: defina a variável MONGODB_URI (arquivo .env ou painel do Render).');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB conectado.');
  } catch (e) {
    console.error('Falha ao conectar no MongoDB:', e.message);
    process.exit(1);
  }
};
