const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

// CONFIGURAÇÃO DO BANCO DE DADOS
const dbConfig = {
    host: 'localhost', // Corrigido o nome do host
    user: 'root',
    password: '1234567',
    database: 'db_pj_chaves',
    port: '3306'
};

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use (bodyParser.urlencoded({extended: true}));

// CONFIGURAR O BODY-PARSER PARA LIDAR COM AS REQUISIÇÕES URL-ENCODED
app.use(bodyParser.urlencoded({ extended: true }));

// CRIAR CONEXÃO COM O BANCO DE DADOS
const db = mysql.createConnection(dbConfig);

// CONECTAR AO BANCO DE DADOS
db.connect((error) => {
    if (error) {
        console.error('Erro ao conectar com o banco de dados');
        return;
    }
    console.log('Conectado ao banco de dados com sucesso!!!');
});

  //API PAGINA DE LOGIN
  // API de Login
app.post('/pag_login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Por favor, forneça um nome de usuário e uma senha.' });
    }

    const query = 'SELECT * FROM login WHERE username = ?';

    db.query(query, [username], async (error, results) => {
        if (error) {
            console.error('Erro ao buscar usuário:', error);
            return res.status(500).json({ message: 'Erro ao realizar login' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos' });
        }

        const user = results[0];

        try {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                return res.json({ message: 'Login realizado com sucesso!' });
            } else {
                return res.status(401).json({ message: 'Usuário ou senha inválidos' });
            }
        } catch (compareError) {
            console.error('Erro ao comparar as senhas:', compareError);
            return res.status(500).json({ message: 'Erro no servidor ao verificar senha' });
        }
    });
});


//pesquisar sobre: se esssa é a api correta para a pagina principal
//API PARA PAGINA PRINCIPAL
    app.post('/pag_principal', (req, res) => {
        const newRecord = req.body;
        const query = 'INSERT INTO registros (date, setor, operacao, responsavel, time) VALUES (?, ?, ?, ?, ?)';
        const values = [newRecord.date, newRecord.sector, newRecord.operation, newRecord.responsible, newRecord.time];
      
        db.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Registro criado com sucesso', id: result.insertId });
        });
      });
   
    
    //API PAGINA DE REGISTROS
// Endpoint para obter todos os registros
app.get('/pag_registros', (req, res) => {
  const query = 'SELECT * FROM registros';

  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
  });
});



  // INICIAR O SERVIDOR
const port = 5500;
  app.listen(port, () => {
    console.log(`Servidor iniciado na porta http://localhost:${port}/`);
  });

  