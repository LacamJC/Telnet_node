const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Rota para exibir o formulário HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/form.html');
});

// Rota para lidar com o formulário
app.post('/submit-form', async (req, res) => {
  const customMessage = req.body.customMessage;
  console.log('Frase do formulário recebida:', customMessage);

  try {
    // Enviar dados para o servidor intermediário
    const intermediaryServerUrl = 'http://localhost:3001/send-to-telnet';
    await axios.post(intermediaryServerUrl, { message: customMessage });

    // Redirecionar o usuário para a página HTML após o envio bem-sucedido
    res.sendFile(__dirname + '/form.html');
  } catch (error) {
    console.error('Erro ao enviar dados para o servidor intermediário:', error);
    res.status(500).send('Erro ao enviar dados para o servidor intermediário');
  }
});

app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
