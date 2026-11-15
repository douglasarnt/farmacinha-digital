# Farmacinha Digital

Sistema administrativo para o uso seguro e o descarte correto de medicamentos em Sobradinho (RS).
Projeto final de Desenvolvimento Web — Node.js + Express + MongoDB (Mongoose) + EJS + Bootstrap 5.

## Entidades
- **Medicamento** – nome, dosagem, validade, quantidade, descartado
- **Lembrete** – medicamento, horário, frequência, observação, ativo
- **PontoColeta** – nome, tipo, endereço, funcionamento, telefone, orientações, ativo

## Como rodar
1. `npm install`
2. Copie `.env.example` para `.env` e preencha `MONGODB_URI`
3. `npm start` (ou `npm run dev`) e abra http://localhost:3000
4. Opcional: `npm run seed` para inserir dados de exemplo

## Integrantes
Anderson Metzer · Angélica Lopes Dias · Douglas Arnt · João Vitor Colombelli
