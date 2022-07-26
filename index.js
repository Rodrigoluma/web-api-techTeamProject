const express = require('express');
const app = express();
const port = normalizaPort(process.env.PORT || '3000');
const mysql = require('mysql2');

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

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
    const cep = req.body.cep;
    execSQLQuery(`INSERT INTO fornecedores(nome, cidade, cep) VALUES('${nome}', '${cidade}', '${cep}')`, res);
});

app.patch('/fornecedores/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nome = req.body.nome;
    const cidade = req.body.cidade;
    const cep = req.body.cep;
    execSQLQuery(`UPDATE fornecedores SET nome='${nome}', cidade='${cidade}', cep='${cep}' WHERE id=${id}`, res);
})

app.delete('/fornecedores/:id', (req, res) => {
    execSQLQuery('DELETE FROM fornecedores WHERE id=' + parseInt(req.params.id), res);
})

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
        host     : 'us-cdbr-east-06.cleardb.net',
        user     : 'b15e8849916ff3',
        password : '21b571b8',
        database : 'heroku_60eb452e3f44a0e'
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