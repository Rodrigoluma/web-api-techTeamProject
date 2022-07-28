require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = normalizaPort(process.env.PORT || '3000');
const mysql = require('mysql2/promise');

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

// metodos para o projeto
// deixei editar/deletar de fora:

// (get) conferência dos dados armazenados em cookie através de filtro na tabela user (login/senha)  ---- Não entendi
// (post) cadastro de usuários (só dados do html) ------ Quais são os dados
// (get) filtro se já existe o cpf cadastrado pra não gerar dois cadastros --- FEITO Retorna todos os dados user com o cpf cadastrado, no JS da pra filtrar o que mostrar
// (post) cadastro de endereço(dados do html e ID de quem estiver cadastrado) --- Somente de pontos de coleta né?
// (get) pág parceiros (abre todos os endereços já cadastrados) ---- FEITO Retorna todas as informações, no JS da pra filtrar o que mostrar
// (get) filtra esses endereços e retorna a cidade escolhida ---- FEITO Retorna todas as informações dos pontos que tem a cidade escolhida, no JS da pra filtrar o que mostrar
// (post) cadastra id do coletor na tabela pontodecoleta que ele escolher ---- Esse id não é auto incrementado. Como vamos gerar ele? Tentei pegar os dois id e trocar um pelo outro.
// (get) retorna no cadastro do doador/coletor dados dele e lista de endereços ligados ao seu ID ---- Retorna todas as informações do user, no JS da pra filtrar o que mostrar. Não sei como pegar os dados do endereço ligados ao id dele. Já que o endereço está no ponto de coleta.

app.get('/user/:cpfCnpj', (req, res) => {    
    const {cpfCnpj} = req.params;
    execSQLQuery(`SELECT * FROM user WHERE cpfCnpj = '${cpfCnpj}'`, res);
});

app.get('/pontocoleta', async (req, res) => {
    const result = await execSQLQuery('SELECT * FROM pontocoleta');
    return res.json(result);
});

app.get('/pontocoleta/:cidade', async (req, res) => {    
    const {cidade} = req.params;

    const result = await execSQLQuery('SELECT * FROM `pontocoleta` WHERE `cidade` = ?', [cidade]);

    return res.json(result);
});

app.post('/user', async (req, res) => {
    const { nome, cpfCnpj, telefone, areaAtuacao, email, senha, coletor_doador } = req.body;  

    const result = await execSQLQuery(`INSERT INTO user(nome, cpfCnpj, telefone, areaAtuacao, email, senha, coletor_doador) VALUES('${nome}', '${cpfCnpj}', '${telefone}','${areaAtuacao}', '${email}', '${senha}', '${coletor_doador}')`, res);

    return res.json(result);
});

app.post('/pontocoleta', async (req, res) => {
    const { nome, logradouro, numero, bairro, cep, cidade, estado, data_coleta, quantidade } = req.body;    

    const result = await execSQLQuery(`INSERT INTO pontocoleta(nome, logradouro, numero, bairro, cep, cidade, estado, data_coleta, quantidade) VALUES('${nome}','${logradouro}', '${numero}', '${bairro}', '${cep}', '${cidade}', '${estado}', '${data_coleta}', '${quantidade}')`, res);

    return res.json(result);
});

app.post('/pontocoleta/:id', async (req, res) => {
    const {id_coletor} = req.params;
    const {id_coletor_coleta} = req.body; 

    const result = await execSQLQuery(`UPDATE pontocoleta SET id_coletorcoleta = ${id_coletor} WHERE id_coletorcoleta = ${id_coletor_coleta};`, res);

    return res.json(result);
});

app.get('/user', async (req, res) => {  
    const result = await execSQLQuery(`SELECT * FROM user`, res);

    return res.json(result);
});

function normalizaPort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

app.listen(port, function () {
    console.log(`app listening on port ${port}`)
})

async function execSQLQuery(querySql, values){ 
    if(querySql === undefined){
        return
    }  
    const connection = await mysql.createConnection({
        host     : process.env.HOST,
        user     : process.env.USER,
        password : process.env.PASSWORD,
        database : process.env.DATABASE
    });
    
    const result = await connection.query(querySql, values, function(err, results, fields) {
        console.log("results", results); 
        console.log(fields); 
      });  
    
    return result[0];
}