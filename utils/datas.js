// Data de hoje (fuso de Brasília) como Date em UTC à meia-noite.
function hojeBR() {
  const s = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }); // AAAA-MM-DD
  return new Date(s);
}

function maisDias(data, n) {
  const d = new Date(data);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

// 30/06/2027
function fmtData(d) {
  return d ? new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-';
}

// 2027-06-30 (para <input type="date">)
function inputData(d) {
  return d ? new Date(d).toISOString().slice(0, 10) : '';
}

// Classifica a validade de um medicamento
function statusValidade(med, hoje) {
  if (med.descartado) return { texto: 'Descartado', classe: 'secondary' };
  const v = new Date(med.validade);
  if (v < hoje) return { texto: 'Vencido', classe: 'danger' };
  if (v <= maisDias(hoje, 30)) return { texto: 'Vence em até 30 dias', classe: 'warning' };
  return { texto: 'Dentro da validade', classe: 'success' };
}

module.exports = { hojeBR, maisDias, fmtData, inputData, statusValidade };
