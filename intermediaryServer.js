const express = require('express');
const bodyParser = require('body-parser');
const { Telnet } = require('telnet-client');

const app = express();
const port = 3001;

app.use(bodyParser.json());

const telnetConfig = {
  host: '127.0.0.1',
  port: 23,
  shellPrompt: /[\$%#>] $/,
  timeout: 1500,
  loginPrompt: 'login:',
  passwordPrompt: 'Password:',
  username: '',
  password: '',
  debug: true,
};

app.post('/send-to-telnet', async (req, res) => {
  const customMessage = req.body.message;

  // Verificar se a mensagem do usuário é uma string
  if (typeof customMessage !== 'string') {
    return res.status(400).send('A mensagem deve ser uma string.');
  }

  // Conectar e enviar a mensagem para o servidor Telnet
  const telnetClient = new Telnet();

  try {
    await telnetClient.connect(telnetConfig);

    telnetClient.on('data', (data) => {
      console.log('Dados recebidos no servidor Telnet:', data.toString());
    });

    await telnetClient.send(`echo '${customMessage}'`);


    res.send('Dados enviados com sucesso para o servidor Telnet!');
  } catch (error) {
    console.error('Erro ao conectar ou enviar dados para o servidor Telnet:', error);

    if (error.code === 'ECONNREFUSED') {
      console.error('Verifique se o servidor Telnet está em execução e acessível.');
    }

    res.status(500).send('Erro ao enviar dados para o servidor Telnet');
  } finally {
    telnetClient.end();
  }
});

app.listen(port, () => {
  console.log(`Servidor intermediário está ouvindo na porta ${port}`);
});
