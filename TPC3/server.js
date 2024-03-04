const axios = require('axios');
const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer(function (req, res) {
    var regex1 = /^\/films$/;
    var regex2 = /^\/films\/\w+$/;
    var regex3 = /^\/cast$/;
    var regex4 = /^\/cast\/\d+$/;
    var regex5 = /^\/genres$/;
    var regex6 = /^\/genres\/\d+$/;

    var q = url.parse(req.url, true);

    if (q.pathname == "/") {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        res.write('<head><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></head>');
        res.write('<body class="w3-container w3-sand">');
        res.write('<h1 class="w3-center w3-text-blue">Home</h1>');
        res.write('<p class="w3-padding w3-light-blue">Bem-vindo ao servidor de filmes!</p>');
        res.write('<p class="w3-padding w3-blue">Para ver a lista de filmes, vá para <a href="http://localhost:3002/films">Films</a></p>');
        res.write('<p class="w3-padding w3-indigo">Para ver a lista de atores, vá para <a href="http://localhost:3002/cast">Cast</a></p>');
        res.write('<p class="w3-padding w3-light-blue">Para ver a lista de géneros, vá para <a href="http://localhost:3002/genres">Genres</a></p>');
        res.write('</body>');
        res.end();
    }

    if (regex1.test(q.pathname)) {
        axios.get('http://localhost:3000/films')
            .then(resp => {
                let films = resp.data;
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.write('<head><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></head>');
                res.write('<body class="w3-container w3-sand">');
                res.write('<h1 class="w3-center w3-text-blue">Filmes</h1>');
                res.write('<ul class="w3-ul w3-hoverable">');
                films.forEach(film => {
                    res.write('<li class="w3-padding-16"><a href="http://localhost:3002/films/' + film.id + '" class="w3-text-indigo">' + film.title + '</a></li>');
                });
                res.write('</ul>');
                res.write('</body>');
                res.end();
            })
            .catch(error => {
                console.log('Erro: ' + error);
                res.end()
            });
    }
    if (regex2.test(q.pathname)) {
        var id = q.pathname.substring(7);
        axios.get('http://localhost:3000/films/' + id)
            .then(resp => {
                let film = resp.data;
                // Make requests to get each cast member and genre
                return Promise.all(film.cast.map(castId => axios.get('http://localhost:3000/cast/' + castId)))
                    .then(castResponses => {
                        // Replace the cast IDs with the cast names and links
                        film.cast = castResponses.map(castResp => {
                            return `<a href="/cast/${castResp.data.id}">${castResp.data.name}</a>`;
                        });
                        return film;
                    })
                    .then(film => {
                        return Promise.all(film.genres.map(genreId => axios.get('http://localhost:3000/genres/' + genreId)))
                            .then(genreResponses => {
                                // Replace the genre IDs with the genre names and links
                                film.genres = genreResponses.map(genreResp => {
                                    return `<a href="/genres/${genreResp.data.id}">${genreResp.data.name}</a>`;
                                });
                                return film;
                            });
                    });
            })
            .then(film => {
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.write('<head><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></head>');
                res.write('<body class="w3-container w3-sand">');
                res.write('<h1 class="w3-center w3-text-blue">Filme</h1>');
                res.write('<div class="w3-card-4 w3-margin">');
                res.write('<p class="w3-padding w3-light-blue">Título: ' + film.title + '</p>');
                res.write('<p class="w3-padding w3-blue">Ano: ' + film.year + '</p>');
                res.write('<p class="w3-padding w3-indigo">Elenco: ' + film.cast.join(', ') + '</p>');
                res.write('<p class="w3-padding w3-light-blue">Género: ' + film.genres.join(', ') + '</p>');
                res.write('</div>');
                res.write('</body>');
                res.end();
            })
            .catch(error => {
                console.log('Erro: ' + error);
                res.end()
            });
    }
    
    if (regex3.test(q.pathname)) {
        axios.get('http://localhost:3000/cast')
            .then(resp => {
                let cast = resp.data;
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.write('<head><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></head>');
                res.write('<body class="w3-container w3-sand">');
                res.write('<h1 class="w3-center w3-text-blue">Elenco</h1>');
                res.write('<ul class="w3-ul w3-hoverable">');
                cast.forEach(actor => {
                    res.write('<li class="w3-padding-16"><a href="http://localhost:3002/cast/' + actor.id + '" class="w3-text-indigo">' + actor.name + '</a></li>');
                });
                res.write('</ul>');
                res.write('</body>');
                res.end();
            })
            .catch(error => {
                console.log('Erro: ' + error);
                res.end()
            });
    }

    if (regex4.test(q.pathname)) {
        var id = q.pathname.substring(6);
        axios.get('http://localhost:3000/cast/' + id)
            .then(resp => {
                let actor = resp.data;
                // Make requests to get each film
                return Promise.all(actor.films.map(filmId => axios.get('http://localhost:3000/films/' + filmId)))
                    .then(filmResponses => {
                        // Replace the film IDs with the film names and links
                        actor.films = filmResponses.map(filmResp => {
                            return `<a href="/films/${filmResp.data.id}">${filmResp.data.title}</a>`;
                        });
                        return actor;
                    });
            })
            .then(actor => {
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.write('<head><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></head>');
                res.write('<body class="w3-container w3-sand">');
                res.write('<h1 class="w3-center w3-text-blue">Ator</h1>');
                res.write('<div class="w3-card-4 w3-margin">');
                res.write('<p class="w3-padding w3-light-blue">Nome: ' + actor.name + '</p>');
                res.write('<p class="w3-padding w3-indigo w3-text-white w3-center">Filmes: ' + actor.films.join(', ') + '</p>');
                res.write('</div>');
                res.write('</body>');
                res.end();
            })
            .catch(error => {
                console.log('Erro: ' + error);
                res.end()
            });
    }

    if (regex5.test(q.pathname)) {
        axios.get('http://localhost:3000/genres')
            .then(resp => {
                let genres = resp.data;
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.write('<head><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></head>');
                res.write('<body class="w3-container w3-sand">');
                res.write('<h1 class="w3-center w3-text-blue">Géneros</h1>');
                res.write('<ul class="w3-ul w3-hoverable">');
                genres.forEach(genre => {
                    res.write('<li class="w3-padding-16"><a href="http://localhost:3002/genres/' + genre.id + '" class="w3-text-indigo">' + genre.name + '</a></li>');
                });
                res.write('</ul>');
                res.write('</body>');
                res.end();
            })
            .catch(error => {
                console.log('Erro: ' + error);
                res.end()
            });
    }

    if (regex6.test(q.pathname)) {
        var id = q.pathname.substring(8);
        axios.get('http://localhost:3000/genres/' + id)
            .then(resp => {
                let genre = resp.data;
                // Make requests to get each film
                return Promise.all(genre.films.map(filmId => axios.get('http://localhost:3000/films/' + filmId)))
                    .then(filmResponses => {
                        // Replace the film IDs with the film names and links
                        genre.films = filmResponses.map(filmResp => {
                            return `<a href="/films/${filmResp.data.id}">${filmResp.data.title}</a>`;
                        });
                        return genre;
                    });
            })
            .then(genre => {
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.write('<head><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></head>');
                res.write('<body class="w3-container w3-sand">');
                res.write('<h1 class="w3-center w3-text-blue">Género</h1>');
                res.write('<div class="w3-card-4 w3-margin">');
                res.write('<p class="w3-padding w3-light-blue">Nome: ' + genre.name + '</p>');
                res.write('<p class="w3-padding w3-indigo w3-text-white w3-center">Filmes: ' + genre.films.join(', ') + '</p>');
                res.write('</div>');
                res.write('</body>');
                res.end();
            })
            .catch(error => {
                console.log('Erro: ' + error);
                res.end()
            });
    }
    

}).listen(3002);