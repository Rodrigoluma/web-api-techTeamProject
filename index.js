require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = normalizaPort(process.env.PORT || '3000');

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

app.get('/user/:cpfCnpj', (req, res) => {    
    const {cpfCnpj} = req.params;
    execSQLQuery(`SELECT * FROM user WHERE cpfCnpj = ?`, [cpfCnpj]);
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

    const result = await execSQLQuery(`INSERT INTO user(nome, cpfCnpj, telefone, areaAtuacao, email, senha, coletor_doador) VALUES(?, ?, ?, ?, ?, ?, ?)`, [ nome, cpfCnpj, telefone, areaAtuacao, email, senha, coletor_doador ]);

    return res.json(result);
});

app.post('/pontocoleta', async (req, res) => {
    const { nome, telefone, logradouro, numero, bairro, cep, cidade, estado, data_coleta, quantidade } = req.body;    

    const result = await execSQLQuery(`INSERT INTO pontocoleta(nome, logradouro, numero, bairro, cep, cidade, estado, data_coleta, quantidade) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [ nome, telefone, logradouro, numero, bairro, cep, cidade, estado, data_coleta, quantidade ]);

    return res.json(result);
});

app.post('/pontocoleta/:id', async (req, res) => {
    const {id_coletor} = req.params;
    const {id_coletor_coleta} = req.body; 

    const result = await execSQLQuery(`UPDATE pontocoleta SET id_coletorcoleta = ? WHERE id_coletorcoleta = ?;`, [id_coletor, id_coletor_coleta]);

    return res.json(result);
});

app.get('/user', async (req, res) => {  
    const result = await execSQLQuery(`SELECT * FROM user`);

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
    const mysql = require('mysql2/promise');

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