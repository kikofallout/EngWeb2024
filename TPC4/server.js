var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates')          // Necessario criar e colocar na mesma pasta
var static = require('./static.js')  

function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}


// index html page, that links to the composers and periods pages
var indexPage = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
        <title>Compositores e Periodos</title>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-purple">
                <h2>Compositores e Periodos</h2>
            </header>
            <div class="w3-container">
                <p><a href="http://localhost:3006/compositores" class="w3-button w3-indigo">Compositores</a></p>
                <p><a href="http://localhost:3006/periodos" class="w3-button w3-indigo">Periodos</a></p>
            </div>
        </div>
    </body>
</html>
`


var compositoresServer = http.createServer((req, res) => {
    var d = new Date().toISOString().substring(0, 16);
    console.log(req.method + " " + req.url + " " + d);
    if(static.staticResource(req)){
        static.serveStaticResource(req, res);
    }
    else{
        switch(req.method){
            case "GET": 
                if (req.url == "/"){
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(indexPage)
                    res.end()
                }
                if (req.url == "/compositores"){
                    axios.get('http://localhost:3000/compositores?_sort=anoNascimento')
                        .then(resp => {
                            let compositores = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.composerListPage(compositores, d))
                            res.end()
                        })
                        .catch(error => {
                            console.log('Erro: ' + error);
                            res.end()
                        })
                }
                else if (req.url.match(/\/compositores\?periodo=\w+/)){
                    var periodo = req.url.split("=")[1]
                    console.log('Periodo: ' + periodo)
                    axios.get('http://localhost:3000/compositores?periodo=' + periodo)
                        .then(resp => {
                            let compositores = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.composerListPage(compositores, d))
                            res.end()
                        })
                        .catch(error => {
                            console.log('Erro: ' + error);
                            res.end()
                        })
                }
                else if (req.url.match(/\/compositores\/C[0-9]+/)){
                    var id = req.url.split("/")[2]
                    axios.get('http://localhost:3000/compositores/' + id)
                        .then(resp => {
                            let compositor = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.composerPage(compositor, d))
                            res.end()
                        })
                        .catch(error => {
                            console.log('Erro: ' + error);
                            res.end()
                        })
                }
                else if (req.url == "/compositores/registo"){
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(templates.composerFormPage({}))
                    res.end()
                }
                else if (req.url.match(/\/compositores\/edit\/C[0-9]+/)){
                    var id = req.url.split("/")[3]
                    axios.get('http://localhost:3000/compositores/' + id)
                        .then(resp => {
                            let compositor = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.composerFormEditPage(compositor,d))
                            res.end()
                        })
                        .catch(error => {
                            console.log('Erro: ' + error);
                            res.end()
                        })
                }
                else if (req.url.match(/\/compositores\/delete\/C[0-9]+/)){
                    var id = req.url.split("/")[3]
                    axios.delete('http://localhost:3000/compositores/' + id)
                        .then(resp => {
                            res.writeHead(302, {'Location': 'http://localhost:3006/compositores'})
                            res.end()
                        })
                        .catch(error => {
                            console.log('Erro: ' + error);
                            res.end()
                        })
                }
                else if (req.url == "/periodos"){
                    axios.get('http://localhost:3000/periodos')
                        .then(resp => {
                            let periodos = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.periodListPage(periodos, d))
                            res.end()
                        })
                        .catch(error => {
                            console.log('Erro: ' + error);
                            res.end()
                        })
                    
                }
                
                else if (req.url == "/periodos/registo"){
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(templates.periodFormPage(d))
                    res.end()
                }
                else if (req.url.match(/\/periodos\/edit\/P\d+/)){
                    var id = req.url.split("/")[3]
                    axios.get('http://localhost:3000/periodos/' + id)
                        .then(resp => {
                            let periodo = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.periodFormEditPage(periodo, d))
                            res.end()
                        })
                        .catch(error => {
                            console.log('Erro: ' + error);
                            res.end()
                        })
                }
                else if (req.url.match(/\/periodos\/P\d+/)){
                    var id = req.url.split("/")[2]
                    axios.get('http://localhost:3000/periodos/' + id)
                        .then(resp => {
                            let periodo = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.periodPage(periodo, d))
                            res.end()
                        })
                        .catch(error => {
                            console.log('Erro: ' + error);
                            res.end()
                        })
                }
                else if (req.url.match(/\/periodos\/delete\/P\d+/)){
                    var id = req.url.split("/")[3]
                    axios.delete('http://localhost:3000/periodos/' + id)
                        .then(resp => {
                            res.writeHead(302, {'Location': 'http://localhost:3006/periodos'})
                            res.end()
                        })
                        .catch(error => {
                            console.log('Erro: ' + error);
                            res.end()
                        })
                }
                else if (req.url == "/w3.css"){
                    res.writeHead(200, {'Content-Type': 'text/css;charset=utf-8'})
                    res.write(open('w3.css', 'r'))
                    res.end()
                }
                else{
                    res.end()
                }
                break;
            case "POST":
                if(req.url == '/compositores/registo'){
                    collectRequestBodyData(req, result => {
                        console.log('POST de compositores: ' + JSON.stringify(result))
                        axios.post('http://localhost:3000/compositores', result)
                            .then(resp => {
                                res.writeHead(302, {'Location': 'http://localhost:3006/compositores'})
                                res.end()
                            })
                            .catch(error => {
                                console.log('Erro: ' + error);
                                res.end()
                            })
                    })
                }
                else if(req.url.match(/\/compositores\/edit\/C[0-9]+/)){
                    collectRequestBodyData(req, result => {
                        var id = req.url.split("/")[3]
                        axios.put('http://localhost:3000/compositores/' + id, result)
                            .then(resp => {
                                res.writeHead(302, {'Location': 'http://localhost:3006/compositores'})
                                res.end()
                            })
                            .catch(error => {
                                console.log('Erro: ' + error);
                                res.end()
                            })
                    })
                }
                else if (req.url == '/periodos/registo'){
                    collectRequestBodyData(req, result => {
                        console.log('POST de periodos: ' + JSON.stringify(result))
                        axios.post('http://localhost:3000/periodos', result)
                            .then(resp => {
                                res.writeHead(302, {'Location': 'http://localhost:3006/periodos'})
                                res.end()
                            })
                            .catch(error => {
                                console.log('Erro: ' + error);
                                res.end()
                            })
                    })
                }
                else if(req.url.match(/\/periodos\/edit\/P\d+/)){
                    collectRequestBodyData(req, result => {
                        var id = req.url.split("/")[3]
                        axios.put('http://localhost:3000/periodos/' + id, result)
                            .then(resp => {
                                res.writeHead(302, {'Location': 'http://localhost:3006/periodos'})
                                res.end()
                            })
                            .catch(error => {
                                console.log('Erro: ' + error);
                                res.end()
                            })
                    })
                }
                else{
                    res.writeHead(405, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<h2>Erro: " + req.method + " não suportado.</h2>")
                    res.end()
                }
                break;
            
            default:
                res.writeHead(405, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<h2>Erro: " + req.method + " não suportado.</h2>")
                res.end()
        }
    }
}
).listen(3006)
            