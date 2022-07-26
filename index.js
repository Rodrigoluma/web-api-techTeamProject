const e = require('express');
const express = require('express');
const app = express();
const port = normalizaPort(process.env.PORT || '3000');
const mysql = require('mysql2');

app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.get('/fornecedores', (req, res) => {
    execSQLQuery('SELECT * FROM fornecedores', res);
});
//filtra os fornecedores pela cidade
app.get('/fornecedores/:cidade?', (req, res) => {
    let filter = '';
    if (req.params.cidade) filter = ` WHERE cidade = '${req.params.cidade}'`;
    execSQLQuery('SELECT * FROM fornecedores' + filter, res);
});
app.post('/fornecedores', (req, res) => {
    const nome = req.body.nome;
    const cidade = req.body.cidade;
    execSQLQuery(`INSERT INTO fornecedores(nome, cidade) VALUES('${nome}', '${cidade}')`, res);
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



function execSQLQuery(sqlQry, res){
    const connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'Hpdj692c$',
        database : 'form'
    });
   
    connection.query(sqlQry, (error, results, fields) => {
        if(error) 
          res.json(error);
        else
          res.json(results);
        connection.end();
        console.log('executou!');
    });
  }