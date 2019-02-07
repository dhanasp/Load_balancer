const express = require('express');
const app = express();
const PORT = 5000;
const  bodyParser = require('body-parser');
const request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let availableServers = {};

app.post('/health',(req,res)=>{
    if (req.body.host){
        console.log(availableServers);
        availableServers[req.body.host]= req.body.isAlive;
    }
    res.end()
});

app.get('*', (proxyReq, proxyResponse) => {
    let url= `http://${Object.keys(availableServers)[0]}:${process.env.port}`;
    let reqUrl = `${url}${proxyReq.url}`;
    request.get({url: reqUrl}, function (err, res, body) {
        proxyResponse.send(body);
    });
});

app.post('*', (proxyReq, proxyRespnse) => {
    let url= `http://${Object.keys(availableServers)[0]}:${process.env.port}`;
    let reqUrl = `${url}${proxyReq.url}`;
    request.post({
        url: reqUrl,
        form : proxyReq.body
    }, function(error, response, body){
        proxyRespnse.send(body);
    });
});

app.listen(PORT, () => console.log(`Proxy listening on port ${PORT}`));