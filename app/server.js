const express = require('express');
const app = express();
const PORT = 8080;
const {Client} = require('pg');
const bodyParser = require('body-parser');
const request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const connectionString = 'postgres://postgres@postgres:5432/postgres';

const client = new Client(connectionString);
client.connect();

setInterval(
    () => {
        request.post(`http://${process.env.PROXY_SERVER_NAME}:5000/health`,
            {
                form:
                    {host: process.env.SERVICE_NAME,isAlive:"alive"}
            });
    }, 6000
)


app.get('/', (req, res) => res.send(
    `<form action="/number" method="post">
          number : <input type="text" name="number"><br>
      <input type="submit" value="Submit"><br>
    </form>`
));


app.get('/number', (req, response) => {
    client.query('SELECT * from numbers', (err, query_res) => {
        if (query_res)
            response.send(
                str = query_res.rows.map((num) => `${num.numer}`).join('<li>')
            );
        if (err) {
            response.send(err);
        }
    });

});


app.post('/number', function (request, response) {
    let number = request.body.number;
    client.query(
        `INSERT into numbers VALUES (${number})`,
        null,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result.rows);
            }
        });
    response.send(number);
});


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));